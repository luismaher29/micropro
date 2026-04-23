import { Trophy } from "lucide-react";
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
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Academia local</span>
          <h2>Entrena como si cada modulo fuera una mision.</h2>
          <p>
            Mundos, niveles, estrellas y recompensas funcionan sin backend y sin claves API.
          </p>
        </div>
        <div className="hero-badges">
          <div className="hero-badge">
            <Trophy size={18} />
            <strong>{rank}</strong>
          </div>
          <div className="hero-badge">
            <strong>
              {completedLevels}/{totalLevels}
            </strong>
            <span>niveles</span>
          </div>
          <div className="hero-badge">
            <strong>{stars}</strong>
            <span>estrellas</span>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <span className="eyebrow">Campana completa</span>
            <h3>5 mundos listos para ampliar</h3>
          </div>
          <span className="section-chip">{WORLDS.length} mundos</span>
        </div>
        <WorldMap worlds={WORLDS} progress={progress} onSelectLevel={onSelectLevel} />
      </section>
    </div>
  );
}
