import { useMemo, useState } from "react";
import {
  Award,
  BookMarked,
  BookOpen,
  Flame,
  GraduationCap,
  Lock,
  NotebookPen,
  Palette,
  Shield,
  Sparkles,
} from "lucide-react";
import { REWARDS } from "../data/rewards";
import { useGameStore } from "../game/useGameStore";
import type { PlayerProgress, RewardItem } from "../game/types";

interface ShopPageProps {
  progress: PlayerProgress;
}

type ShopFilter = "todos" | RewardItem["tipo"];

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

const shuffleRewards = (items: RewardItem[]): RewardItem[] => {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
  }
  return clone;
};

const getPreferredTopic = (progress: PlayerProgress): string | undefined => {
  const entries = Object.entries(progress.topicStats ?? {});
  if (entries.length === 0) {
    return undefined;
  }

  return [...entries]
    .sort(([, a], [, b]) => b.mistakes - a.mistakes || a.clears - b.clears)[0]?.[0];
};

export function ShopPage({ progress }: ShopPageProps) {
  const purchaseReward = useGameStore((state) => state.purchaseReward);
  const [activeFilter, setActiveFilter] = useState<ShopFilter>("todos");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [revealedReward, setRevealedReward] = useState<RewardItem | null>(null);

  const completedLevels = Object.values(progress.levelResults).filter(
    (result) => result.completed,
  ).length;
  const preferredTopic = getPreferredTopic(progress);

  const filteredRewards = useMemo(() => {
    const source =
      activeFilter === "todos"
        ? REWARDS
        : REWARDS.filter((reward) => reward.tipo === activeFilter);
    return shuffleRewards(source);
  }, [activeFilter]);

  const unlockedRewards = filteredRewards.filter((reward) =>
    progress.unlockedRewardIds.includes(reward.id),
  );

  const recommendedRewards = filteredRewards
    .filter((reward) => !progress.unlockedRewardIds.includes(reward.id))
    .filter((reward) => (reward.nivelRequerido ?? 0) <= completedLevels)
    .sort((left, right) => {
      const leftScore =
        (left.recomendadoPor === preferredTopic ? 3 : 0) +
        (progress.coins >= left.costoMonedas ? 2 : 0) +
        (left.etiqueta === "limitado" ? 1 : 0);
      const rightScore =
        (right.recomendadoPor === preferredTopic ? 3 : 0) +
        (progress.coins >= right.costoMonedas ? 2 : 0) +
        (right.etiqueta === "limitado" ? 1 : 0);
      return rightScore - leftScore;
    })
    .slice(0, 4);

  const upcomingRewards = filteredRewards.filter(
    (reward) =>
      !progress.unlockedRewardIds.includes(reward.id) &&
      !recommendedRewards.some((recommended) => recommended.id === reward.id),
  );

  const handleRedeem = (rewardId: string) => {
    const result = purchaseReward(rewardId);
    setFeedback(result.message);
    if (result.success && result.reward) {
      setRevealedReward(result.reward);
    }
  };

  return (
    <div className="page-stack">
      <section className="hero-card shop-hero">
        <div>
          <span className="eyebrow">Zona de recompensas</span>
          <h2>🎁 Desbloquea recompensas segun tu progreso</h2>
          <p>
            La tienda ahora prioriza premios utiles para ti y separa lo que ya canjeaste de lo que viene despues.
          </p>
        </div>
        <div className="hero-badge">
          <strong>{progress.coins}</strong>
          <span>monedas disponibles</span>
        </div>
      </section>

      {feedback ? <div className="inline-message">{feedback}</div> : null}

      <section className="shop-filter-row">
        {(["todos", "curso", "masterclass", "ebook"] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            className={`section-chip ${activeFilter === filter ? "is-active-chip" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === "todos"
              ? "Todos"
              : filter === "curso"
                ? "Cursos"
                : filter === "masterclass"
                  ? "Masterclass"
                  : "Ebooks"}
          </button>
        ))}
      </section>

      <ShopSection
        title="Para ti"
        subtitle={
          preferredTopic
            ? `Priorizadas segun el tema donde mas estas fallando: ${preferredTopic}.`
            : "Recompensas sugeridas segun tu progreso actual."
        }
        rewards={recommendedRewards}
        progress={progress}
        completedLevels={completedLevels}
        onRedeem={handleRedeem}
        emptyText="Aun no hay recomendaciones activas para este filtro."
        recommended
      />

      <ShopSection
        title="Recompensas desbloqueadas"
        subtitle="Todo lo que ya canjeaste dentro de la academia."
        rewards={unlockedRewards}
        progress={progress}
        completedLevels={completedLevels}
        onRedeem={handleRedeem}
        emptyText="Todavia no has canjeado recompensas."
        unlocked
      />

      <ShopSection
        title="Proximas recompensas"
        subtitle="Premios bloqueados o pendientes de monedas/nivel."
        rewards={upcomingRewards}
        progress={progress}
        completedLevels={completedLevels}
        onRedeem={handleRedeem}
        emptyText="No hay mas recompensas pendientes en este filtro."
      />

      {revealedReward ? (
        <div className="modal-shell">
          <div className="reward-modal reward-unlock-modal">
            <div className="reward-badge">
              <Sparkles size={30} />
            </div>
            <span className="eyebrow">Recompensa desbloqueada</span>
            <h2>🎉 Has desbloqueado una recompensa</h2>
            <p>
              {revealedReward.titulo} ya esta marcada como canjeada en tu progreso local.
            </p>

            <div className="unlock-banner">
              <strong>{revealedReward.tipo.toUpperCase()}</strong>
              <span>{revealedReward.descuento}</span>
            </div>

            <div className="reward-grid">
              <div className="reward-box">
                <strong>{revealedReward.titulo}</strong>
              </div>
              <div className="reward-box">
                <strong>Codigo</strong>
                <span>{revealedReward.codigoPlaceholder}</span>
              </div>
              <div className="reward-box">
                <strong>Descuento</strong>
                <span>{revealedReward.descuento}</span>
              </div>
            </div>

            <button
              type="button"
              className="footer-action is-correct"
              onClick={() => setRevealedReward(null)}
            >
              Continuar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ShopSection({
  title,
  subtitle,
  rewards,
  progress,
  completedLevels,
  onRedeem,
  emptyText,
  recommended = false,
  unlocked = false,
}: {
  title: string;
  subtitle: string;
  rewards: RewardItem[];
  progress: PlayerProgress;
  completedLevels: number;
  onRedeem: (rewardId: string) => void;
  emptyText: string;
  recommended?: boolean;
  unlocked?: boolean;
}) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <span className="eyebrow">{title}</span>
          <h3>{title}</h3>
        </div>
      </div>
      <p className="section-copy">{subtitle}</p>

      {rewards.length === 0 ? (
        <div className="empty-state">
          <p>{emptyText}</p>
        </div>
      ) : (
        <div className="reward-list">
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              progress={progress}
              completedLevels={completedLevels}
              onRedeem={onRedeem}
              recommended={recommended}
              unlocked={unlocked}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function RewardCard({
  reward,
  progress,
  completedLevels,
  onRedeem,
  recommended,
  unlocked,
}: {
  reward: RewardItem;
  progress: PlayerProgress;
  completedLevels: number;
  onRedeem: (rewardId: string) => void;
  recommended: boolean;
  unlocked: boolean;
}) {
  const Icon = iconMap[reward.icon as keyof typeof iconMap] ?? Sparkles;
  const rewardUnlocked = progress.unlockedRewardIds.includes(reward.id);
  const levelRequired = reward.nivelRequerido ?? 0;
  const enoughLevel = completedLevels >= levelRequired;
  const missingCoins = Math.max(reward.costoMonedas - progress.coins, 0);

  return (
    <article className={`reward-card ${rewardUnlocked ? "is-unlocked" : ""}`}>
      <div className="reward-icon">
        <Icon size={20} />
      </div>

      <div className="reward-copy">
        <div className="reward-title-row">
          <h3>{reward.titulo}</h3>
          <span className="section-chip">{reward.costoMonedas} monedas</span>
        </div>

        <div className="reward-tag-row">
          {recommended ? <span className="reward-tag is-recommended">Recomendado para ti</span> : null}
          {rewardUnlocked ? <span className="reward-tag is-unlocked">Desbloqueado</span> : null}
          {reward.vigencia ? <span className="reward-tag is-limited">{reward.vigencia}</span> : null}
          {levelRequired > 0 ? (
            <span className="reward-tag is-level">Nivel requerido {levelRequired}</span>
          ) : null}
        </div>

        <p>{reward.descripcion}</p>
        <small>
          {reward.tipo.toUpperCase()} · {reward.descuento} · Codigo {reward.codigoPlaceholder}
        </small>

        {!rewardUnlocked && !enoughLevel ? (
          <small>Debes completar {levelRequired} niveles para desbloquear esta recompensa.</small>
        ) : null}

        {!rewardUnlocked && enoughLevel && missingCoins > 0 ? (
          <small>Te faltan {missingCoins} monedas para desbloquear.</small>
        ) : null}
      </div>

      {rewardUnlocked ? (
        <button type="button" className="secondary-button is-complete" disabled>
          Desbloqueado
        </button>
      ) : enoughLevel && missingCoins === 0 ? (
        <button type="button" className="secondary-button" onClick={() => onRedeem(reward.id)}>
          Canjear recompensa
        </button>
      ) : (
        <button type="button" className="ghost-button" disabled>
          <Lock size={16} />
          {enoughLevel ? "Aun no alcanzas el costo" : "Sigue avanzando"}
        </button>
      )}
    </article>
  );
}
