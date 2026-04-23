import { useMemo, useState } from "react";
import {
  Award,
  BookMarked,
  BookOpen,
  Flame,
  GraduationCap,
  NotebookPen,
  Palette,
  Shield,
  Sparkles,
} from "lucide-react";
import { REWARDS } from "../data/rewards";
import type { PlayerProgress, RewardItem } from "../game/types";

interface ShopPageProps {
  progress: PlayerProgress;
  onPurchase: (rewardId: string) => void;
  feedback: string | null;
}

const iconMap = {
  Award,
  Flame,
  BookMarked,
  BookOpen,
  GraduationCap,
  NotebookPen,
  Palette,
  Shield,
  Sparkles,
};

type ShopFilter = "todos" | RewardItem["tipo"];

const shuffleRewards = (items: RewardItem[]): RewardItem[] => {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
  }
  return clone;
};

export function ShopPage({ progress, onPurchase, feedback }: ShopPageProps) {
  const [activeFilter, setActiveFilter] = useState<ShopFilter>("todos");
  const visibleRewards = useMemo(() => {
    const filtered =
      activeFilter === "todos"
        ? REWARDS
        : REWARDS.filter((reward) => reward.tipo === activeFilter);

    return shuffleRewards(filtered).slice(0, 6);
  }, [activeFilter]);

  return (
    <div className="page-stack">
      <section className="hero-card shop-hero">
        <div>
          <span className="eyebrow">Tienda provisional</span>
          <h2>Canjea monedas por descuentos temporales.</h2>
          <p>
            Los productos se cargan desde una lista local y por ahora usan placeholders sin pago real.
          </p>
        </div>
        <div className="hero-badge">
          <strong>{progress.coins}</strong>
          <span>monedas disponibles</span>
        </div>
      </section>

      {feedback ? <div className="inline-message">{feedback}</div> : null}

      <section className="shop-filter-row">
        <button
          type="button"
          className={`section-chip ${activeFilter === "todos" ? "is-active-chip" : ""}`}
          onClick={() => setActiveFilter("todos")}
        >
          Todos
        </button>
        <button
          type="button"
          className={`section-chip ${activeFilter === "curso" ? "is-active-chip" : ""}`}
          onClick={() => setActiveFilter("curso")}
        >
          Cursos
        </button>
        <button
          type="button"
          className={`section-chip ${activeFilter === "masterclass" ? "is-active-chip" : ""}`}
          onClick={() => setActiveFilter("masterclass")}
        >
          Masterclass
        </button>
        <button
          type="button"
          className={`section-chip ${activeFilter === "ebook" ? "is-active-chip" : ""}`}
          onClick={() => setActiveFilter("ebook")}
        >
          Ebooks
        </button>
      </section>

      <section className="reward-list">
        {visibleRewards.map((reward) => {
          const unlocked = progress.unlockedRewardIds.includes(reward.id);
          const Icon = iconMap[reward.icon as keyof typeof iconMap] ?? Sparkles;

          return (
            <article key={reward.id} className={`reward-card ${unlocked ? "is-unlocked" : ""}`}>
              <div className="reward-icon">
                <Icon size={20} />
              </div>
              <div className="reward-copy">
                <div className="reward-title-row">
                  <h3>{reward.titulo}</h3>
                  <span className="section-chip">{reward.costoMonedas} monedas</span>
                </div>
                <p>{reward.description}</p>
                <small>
                  {reward.tipo.toUpperCase()} · {reward.descuento} · Codigo: {reward.codigoPlaceholder}
                </small>
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
