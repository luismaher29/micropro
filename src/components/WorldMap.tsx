import type { CSSProperties } from "react";
import { Check, Lock, Play, Star } from "lucide-react";
import type { PlayerProgress, World } from "../game/types";
import { getWorldCompletionRatio, isLevelUnlocked } from "../game/utils";

interface WorldMapProps {
  worlds: World[];
  progress: PlayerProgress;
  onSelectLevel: (levelId: string) => void;
}

export function WorldMap({ worlds, progress, onSelectLevel }: WorldMapProps) {
  return (
    <div className="world-map">
      {worlds.map((world) => {
        const ratio = Math.round(getWorldCompletionRatio(progress, world) * 100);
        const isWorldUnlocked = progress.unlockedWorldIds.includes(world.id);

        return (
          <section
            key={world.id}
            className="world-card"
            style={
              {
                "--world-accent": world.theme.accent,
                "--world-surface": world.theme.surface,
                "--world-shadow": world.theme.shadow,
                "--world-glow": world.theme.glow,
              } as CSSProperties
            }
          >
            <div className="world-header">
              <div>
                <p className="eyebrow">Mundo {world.order}</p>
                <h3>{world.name}</h3>
                <p className="world-subtitle">{world.subtitle}</p>
              </div>
              <div className={`world-progress ${isWorldUnlocked ? "" : "is-locked"}`}>
                <span>{ratio}%</span>
              </div>
            </div>

            <p className="world-summary">{world.summary}</p>

            <div className="level-grid">
              {world.levels.map((level, levelIndex) => {
                const unlocked = isLevelUnlocked(progress, world, levelIndex);
                const result = progress.levelResults[level.id];
                const completed = Boolean(result?.completed);

                return (
                  <button
                    key={level.id}
                    type="button"
                    className={`level-node ${completed ? "is-complete" : ""} ${
                      unlocked ? "" : "is-locked"
                    }`}
                    onClick={() => unlocked && onSelectLevel(level.id)}
                    disabled={!unlocked}
                  >
                    <div className="level-node-top">
                      <span className="eyebrow">{level.difficulty}</span>
                      <span className="level-reward">+{level.reward.coins}</span>
                    </div>
                    <strong>{level.title}</strong>
                    <p>{level.description}</p>

                    <div className="level-node-bottom">
                      <span className="level-action">
                        {completed ? <Check size={16} /> : unlocked ? <Play size={16} /> : <Lock size={16} />}
                        {completed ? "Repetir" : unlocked ? "Jugar" : "Bloqueado"}
                      </span>
                      <span className="level-stars">
                        <Star size={14} />
                        {result?.stars ?? 0}/3
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
