import { Coins, Sparkles, Star, Trophy } from "lucide-react";
import type { CompletionSummary } from "../game/types";

interface RewardModalProps {
  summary: CompletionSummary;
  onClose: () => void;
}

export function RewardModal({ summary, onClose }: RewardModalProps) {
  return (
    <div className="modal-shell">
      <div className="reward-modal">
        <div className="reward-badge">
          <Trophy size={32} />
        </div>
        <span className="eyebrow">Recompensa obtenida</span>
        <h2>{summary.unlockedWorldName ? "Mundo desbloqueado" : "Nivel superado"}</h2>
        <p>
          Tu progreso queda guardado en local y puedes seguir avanzando cuando quieras.
        </p>

        <div className="reward-grid">
          <div className="reward-box">
            <Sparkles size={18} />
            <strong>+{summary.xpAwarded} XP</strong>
          </div>
          <div className="reward-box">
            <Coins size={18} />
            <strong>+{summary.coinsAwarded}</strong>
          </div>
          <div className="reward-box">
            <Star size={18} />
            <strong>{summary.starsEarned}/3</strong>
          </div>
        </div>

        <p>
          {summary.mistakes === 0
            ? "Completaste el nivel sin errores. Excelente dominio."
            : `Tuviste ${summary.mistakes} intento${summary.mistakes === 1 ? "" : "s"} extra antes de dominarlo.`}
        </p>

        {summary.unlockedWorldName ? (
          <div className="unlock-banner">
            <strong>Nuevo mundo</strong>
            <span>{summary.unlockedWorldName}</span>
          </div>
        ) : null}

        <button type="button" className="footer-action is-correct" onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
}
