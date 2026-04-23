import type { CSSProperties } from "react";
import { Check, Lock, Play, Star } from "lucide-react";
import type { PlayerProgress, World } from "../game/types";
import { isLevelUnlocked } from "../game/utils";

interface WorldMapProps {
  worlds: World[];
  progress: PlayerProgress;
  onSelectLevel: (levelId: string) => void;
}

const levelOffsets = [0, 36, -14, 44, -8];

export function WorldMap({ worlds, progress, onSelectLevel }: WorldMapProps) {
  return (
    <div className="world-map">
      {worlds.map((world) => {
        const isWorldUnlocked = progress.unlockedWorldIds.includes(world.id);

        return (
          <section
            key={world.id}
            className={`world-stage ${isWorldUnlocked ? "" : "is-locked"}`}
            style={
              {
                "--world-accent": world.theme.accent,
                "--world-shadow": world.theme.shadow,
                "--world-surface": world.theme.surface,
              } as CSSProperties
            }
          >
            <div className="world-banner">
              <span className="world-kicker">Mundo {world.order}</span>
              <h2>{world.name}</h2>
            </div>

            <div className="world-path">
              {world.levels.map((level, levelIndex) => {
                const unlocked = isLevelUnlocked(progress, world, levelIndex);
                const result = progress.levelResults[level.id];
                const completed = Boolean(result?.completed);
                const offset = levelOffsets[levelIndex % levelOffsets.length];

                return (
                  <div
                    key={level.id}
                    className={`path-stop ${unlocked ? "" : "is-locked"} ${
                      completed ? "is-complete" : ""
                    }`}
                    style={{ "--offset-x": `${offset}px` } as CSSProperties}
                  >
                    <div className="level-title-card">
                      <span>Nivel {levelIndex + 1}</span>
                      <strong>{level.title}</strong>
                    </div>

                    <button
                      type="button"
                      className={`level-medal ${completed ? "is-complete" : ""} ${
                        unlocked ? "is-unlocked" : "is-locked"
                      }`}
                      onClick={() => unlocked && onSelectLevel(level.id)}
                      disabled={!unlocked}
                    >
                      <span className="level-medal-core">
                        {completed ? (
                          <Star size={34} fill="currentColor" />
                        ) : unlocked ? (
                          <Play size={26} fill="currentColor" />
                        ) : (
                          <Lock size={26} />
                        )}
                      </span>
                      {completed ? (
                        <span className="level-check">
                          <Check size={16} />
                        </span>
                      ) : null}
                    </button>

                    {levelIndex < world.levels.length - 1 ? (
                      <div className="path-connector" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
