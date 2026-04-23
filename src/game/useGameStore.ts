import { create } from "zustand";
import { persist } from "zustand/middleware";
import { REWARDS } from "../data/rewards";
import { WORLDS } from "../data/worlds";
import {
  calculateStars,
  findWorldAndLevel,
  getDateKey,
  getDayDifference,
  getInitialProgress,
  STORAGE_KEY,
} from "./utils";
import type {
  CompletionSummary,
  PlayerProgress,
  PurchaseResult,
} from "./types";

interface CompleteLevelInput {
  levelId: string;
  correctAnswers: number;
}

interface GameState {
  progress: PlayerProgress;
  completeLevel: (input: CompleteLevelInput) => CompletionSummary | null;
  purchaseReward: (rewardId: string) => PurchaseResult;
  updateStreak: () => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      progress: getInitialProgress(),
      completeLevel: ({ levelId, correctAnswers }) => {
        const details = findWorldAndLevel(levelId);
        if (!details) {
          return null;
        }

        const { world, level, worldIndex } = details;
        const totalQuestions = level.steps.length;
        const nextWorld = WORLDS[worldIndex + 1];
        let summary: CompletionSummary | null = null;

        set((state) => {
          const previousResult = state.progress.levelResults[levelId];
          const starsEarned = calculateStars(correctAnswers, totalQuestions);
          const score = Math.round((correctAnswers / totalQuestions) * 100);
          const firstClear = !previousResult?.completed;
          const previousStars = previousResult?.stars ?? 0;
          const starBonus = Math.max(starsEarned - previousStars, 0) * 12;
          const perfectBonus = correctAnswers === totalQuestions ? 18 : 0;
          const replayMultiplier = firstClear ? 1 : 0.35;
          const xpAwarded = Math.round(level.reward.xp * replayMultiplier) + starBonus;
          const coinsAwarded =
            Math.round(level.reward.coins * replayMultiplier) + starBonus + perfectBonus;

          const levelResults = {
            ...state.progress.levelResults,
            [levelId]: {
              completed: true,
              stars: Math.max(starsEarned, previousStars),
              score: Math.max(score, previousResult?.score ?? 0),
              attempts: (previousResult?.attempts ?? 0) + 1,
              perfect: (previousResult?.perfect ?? false) || correctAnswers === totalQuestions,
              lastPlayedAt: new Date().toISOString(),
            },
          };

          const worldCompleted = world.levels.every(
            (currentLevel) =>
              currentLevel.id === levelId || levelResults[currentLevel.id]?.completed,
          );

          const unlockedWorldIds = worldCompleted && nextWorld
            ? Array.from(new Set([...state.progress.unlockedWorldIds, nextWorld.id]))
            : state.progress.unlockedWorldIds;

          summary = {
            xpAwarded,
            coinsAwarded,
            starsEarned,
            firstClear,
            unlockedWorldName:
              worldCompleted && nextWorld && !state.progress.unlockedWorldIds.includes(nextWorld.id)
                ? nextWorld.name
                : undefined,
          };

          return {
            progress: {
              ...state.progress,
              xp: state.progress.xp + xpAwarded,
              coins: state.progress.coins + coinsAwarded,
              unlockedWorldIds,
              levelResults,
            },
          };
        });

        return summary;
      },
      purchaseReward: (rewardId) => {
        const reward = REWARDS.find((item) => item.id === rewardId);
        if (!reward) {
          return { success: false, message: "La recompensa no existe." };
        }

        const state = get();
        if (state.progress.unlockedRewardIds.includes(rewardId)) {
          return { success: false, message: "Ya la desbloqueaste." };
        }

        if (state.progress.coins < reward.cost) {
          return { success: false, message: "No tienes monedas suficientes." };
        }

        set((currentState) => ({
          progress: {
            ...currentState.progress,
            coins: currentState.progress.coins - reward.cost,
            unlockedRewardIds: [...currentState.progress.unlockedRewardIds, rewardId],
          },
        }));

        return {
          success: true,
          message: `${reward.name} ya forma parte de tu vitrina.`,
        };
      },
      updateStreak: () => {
        const today = getDateKey();
        set((state) => {
          if (state.progress.lastActiveDate === today) {
            return state;
          }

          const previousDate = state.progress.lastActiveDate;
          const difference = previousDate ? getDayDifference(previousDate, today) : 0;
          const streak = difference === 1 ? state.progress.streak + 1 : 1;

          return {
            progress: {
              ...state.progress,
              streak,
              lastActiveDate: today,
            },
          };
        });
      },
      resetProgress: () => ({
        progress: getInitialProgress(),
      }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
    },
  ),
);
