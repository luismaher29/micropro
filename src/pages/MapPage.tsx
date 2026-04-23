import { WORLDS } from "../data/worlds";
import type { PlayerProgress } from "../game/types";
import {
  getCompletedLevelsCount,
  getRankFromXp,
  getTotalLevelsCount,
  getTotalStars,
} from "../game/utils";
import { WorldMap } from "../components/WorldMap";

interface MapPageProps {
  progress: PlayerProgress;
  onSelectLevel: (levelId: string) => void;
}

export function MapPage({ progress, onSelectLevel }: MapPageProps) {
  const completedLevels = getCompletedLevelsCount(progress);
  const totalLevels = getTotalLevelsCount();
  const stars = getTotalStars(progress);
  const rank = getRankFromXp(progress.xp);

  return (
    <div className="map-page">
      <section className="map-status-strip">
        <div className="status-mini-card">
          <span>Rango</span>
          <strong>{rank}</strong>
        </div>
        <div className="status-mini-card">
          <span>Niveles</span>
          <strong>
            {completedLevels}/{totalLevels}
          </strong>
        </div>
        <div className="status-mini-card">
          <span>Estrellas</span>
          <strong>{stars}</strong>
        </div>
        <div className="status-mini-card">
          <span>Mundos</span>
          <strong>{WORLDS.length}</strong>
        </div>
      </section>

      <WorldMap worlds={WORLDS} progress={progress} onSelectLevel={onSelectLevel} />
    </div>
  );
}
