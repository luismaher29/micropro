import {
  Award,
  Brush,
  Crown,
  Flame,
  Palette,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { REWARDS } from "../data/rewards";
import type { PlayerProgress } from "../game/types";

interface ShopPageProps {
  progress: PlayerProgress;
  onPurchase: (rewardId: string) => void;
  feedback: string | null;
}

const iconMap = {
  Award,
  Brush,
  Crown,
  Flame,
  Palette,
  Shield,
  Sparkles,
  Zap,
};

export function ShopPage({ progress, onPurchase, feedback }: ShopPageProps) {
  return (
    <div className="page-stack">
      <section className="hero-card shop-hero">
        <div>
          <span className="eyebrow">Tienda de recompensas</span>
          <h2>Convierte monedas en elementos desbloqueables.</h2>
          <p>
            Las recompensas son locales y preparan el sistema para futuras cosmeticas o boosters.
          </p>
        </div>
        <div className="hero-badge">
          <strong>{progress.coins}</strong>
          <span>monedas disponibles</span>
        </div>
      </section>

      {feedback ? <div className="inline-message">{feedback}</div> : null}

      <section className="reward-list">
        {REWARDS.map((reward) => {
          const unlocked = progress.unlockedRewardIds.includes(reward.id);
          const Icon = iconMap[reward.icon as keyof typeof iconMap] ?? Sparkles;

          return (
            <article key={reward.id} className={`reward-card ${unlocked ? "is-unlocked" : ""}`}>
              <div className="reward-icon">
                <Icon size={20} />
              </div>
              <div className="reward-copy">
                <div className="reward-title-row">
                  <h3>{reward.name}</h3>
                  <span className="section-chip">{reward.cost} monedas</span>
                </div>
                <p>{reward.description}</p>
                <small>{reward.perk}</small>
              </div>
              <button
                type="button"
                className={`secondary-button ${unlocked ? "is-complete" : ""}`}
                onClick={() => onPurchase(reward.id)}
                disabled={unlocked}
              >
                {unlocked ? "Desbloqueado" : "Canjear"}
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
