import { WORLDS } from "../data/worlds";
import type { Level, PlayerProgress, World } from "./types";

export const STORAGE_KEY = "micromaster-academy-local";

export const flattenLevels = (): Level[] =>
  WORLDS.flatMap((world) => world.levels);

export const findWorldAndLevel = (
  levelId: string,
): { world: World; level: Level; levelIndex: number; worldIndex: number } | null => {
  for (const [worldIndex, world] of WORLDS.entries()) {
    const levelIndex = world.levels.findIndex((level) => level.id === levelId);
    if (levelIndex >= 0) {
      return {
        world,
        level: world.levels[levelIndex],
        levelIndex,
        worldIndex,
      };
    }
  }

  return null;
};

export const calculateStars = (correctAnswers: number, totalQuestions: number): number => {
  const ratio = correctAnswers / totalQuestions;
  if (ratio === 1) {
    return 3;
  }
  if (ratio >= 0.67) {
    return 2;
  }
  return 1;
};

export const isLevelUnlocked = (
  progress: PlayerProgress,
  world: World,
  levelIndex: number,
): boolean => {
  if (!progress.unlockedWorldIds.includes(world.id)) {
    return false;
  }

  if (levelIndex === 0) {
    return true;
  }

  const previousLevelId = world.levels[levelIndex - 1]?.id;
  if (!previousLevelId) {
    return false;
  }

  return Boolean(progress.levelResults[previousLevelId]?.completed);
};

export const getTotalStars = (progress: PlayerProgress): number =>
  Object.values(progress.levelResults).reduce((sum, result) => sum + result.stars, 0);

export const getCompletedLevelsCount = (progress: PlayerProgress): number =>
  Object.values(progress.levelResults).filter((result) => result.completed).length;

export const getTotalLevelsCount = (): number => flattenLevels().length;

export const getRankFromXp = (xp: number): string => {
  if (xp >= 2200) {
    return "Elite Mentor";
  }
  if (xp >= 1600) {
    return "Studio Master";
  }
  if (xp >= 1000) {
    return "Advanced Artist";
  }
  if (xp >= 500) {
    return "Rising Specialist";
  }
  return "Skin Explorer";
};

export const getDateKey = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const getDayDifference = (fromDateKey: string, toDateKey: string): number => {
  const from = parseDateKey(fromDateKey);
  const to = parseDateKey(toDateKey);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.round((to.getTime() - from.getTime()) / millisecondsPerDay);
};

export const getWorldCompletionRatio = (
  progress: PlayerProgress,
  world: World,
): number => {
  const completed = world.levels.filter(
    (level) => progress.levelResults[level.id]?.completed,
  ).length;
  return completed / world.levels.length;
};

export const getNextWorldName = (worldId: string): string | undefined => {
  const worldIndex = WORLDS.findIndex((world) => world.id === worldId);
  if (worldIndex < 0) {
    return undefined;
  }

  return WORLDS[worldIndex + 1]?.name;
};

export const getInitialProgress = (): PlayerProgress => ({
  xp: 0,
  coins: 90,
  streak: 1,
  lastActiveDate: getDateKey(),
  unlockedWorldIds: [WORLDS[0].id],
  levelResults: {},
  unlockedRewardIds: [],
});
