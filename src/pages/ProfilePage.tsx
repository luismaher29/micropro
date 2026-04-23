import { Award, Coins, Flame, RefreshCcw, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { REWARDS } from "../data/rewards";
import type { PlayerProgress } from "../game/types";
import {
  getCompletedLevelsCount,
  getRankFromXp,
  getTotalLevelsCount,
  getTotalStars,
} from "../game/utils";

interface ProfilePageProps {
  progress: PlayerProgress;
  onReset: () => void;
}

export function ProfilePage({ progress, onReset }: ProfilePageProps) {
  const completedLevels = getCompletedLevelsCount(progress);
  const totalLevels = getTotalLevelsCount();
  const stars = getTotalStars(progress);
  const unlockedRewards = REWARDS.filter((reward) =>
    progress.unlockedRewardIds.includes(reward.id),
  );

  return (
    <div className="page-stack">
      <section className="hero-card profile-hero">
        <div>
          <span className="eyebrow">Perfil de artista</span>
          <h2>{getRankFromXp(progress.xp)}</h2>
          <p>
            Tu progreso se guarda en localStorage. La app esta lista para crecer con mas mundos y recompensas.
          </p>
        </div>
        <button type="button" className="ghost-button" onClick={onReset}>
          <RefreshCcw size={16} />
          Reiniciar progreso
        </button>
      </section>

      <section className="stats-grid">
        <article className="mini-stat">
          <Sparkles size={18} />
          <strong>{progress.xp}</strong>
          <span>XP total</span>
        </article>
        <article className="mini-stat">
          <Coins size={18} />
          <strong>{progress.coins}</strong>
          <span>Monedas</span>
        </article>
        <article className="mini-stat">
          <Flame size={18} />
          <strong>{progress.streak}</strong>
          <span>Racha</span>
        </article>
        <article className="mini-stat">
          <Trophy size={18} />
          <strong>{stars}</strong>
          <span>Estrellas</span>
        </article>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <span className="eyebrow">Progreso academico</span>
            <h3>Tu recorrido</h3>
          </div>
          <span className="section-chip">
            {completedLevels}/{totalLevels} niveles
          </span>
        </div>

        <div className="progress-strip">
          <div style={{ width: `${(completedLevels / totalLevels) * 100}%` }} />
        </div>

        <div className="profile-highlights">
          <div className="profile-highlight">
            <Award size={18} />
            <div>
              <strong>{progress.unlockedWorldIds.length} mundos abiertos</strong>
              <p>Listos para seguir expandiendo contenido.</p>
            </div>
          </div>
          <div className="profile-highlight">
            <ShieldCheck size={18} />
            <div>
              <strong>{unlockedRewards.length} recompensas activas</strong>
              <p>Desbloqueos cosmeticos y de coleccion dentro de la tienda.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <span className="eyebrow">Vitrina</span>
            <h3>Recompensas desbloqueadas</h3>
          </div>
          <span className="section-chip">{unlockedRewards.length} items</span>
        </div>

        {unlockedRewards.length === 0 ? (
          <div className="empty-state">
            <p>Completa niveles y visita la tienda para comenzar tu coleccion.</p>
          </div>
        ) : (
          <div className="reward-showcase">
            {unlockedRewards.map((reward) => (
              <article key={reward.id} className="showcase-card">
                <strong>{reward.name}</strong>
                <p>{reward.perk}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
