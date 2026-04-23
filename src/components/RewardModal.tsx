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
          <Trophy size={28} />
        </div>
        <span className="eyebrow">Nivel completado</span>
        <h2>{summary.firstClear ? "Nuevo progreso guardado" : "Intento mejorado"}</h2>
        <p>
          Ganaste recompensas locales por tu sesion de estudio. Todo se guarda en el navegador.
        </p>

        <div className="reward-grid">
          <div className="reward-box">
            <Sparkles size={18} />
            <strong>+{summary.xpAwarded} XP</strong>
          </div>
          <div className="reward-box">
            <Coins size={18} />
            <strong>+{summary.coinsAwarded} monedas</strong>
          </div>
          <div className="reward-box">
            <Star size={18} />
            <strong>{summary.starsEarned}/3 estrellas</strong>
          </div>
        </div>

        {summary.unlockedWorldName ? (
          <div className="unlock-banner">
            <strong>Nuevo mundo desbloqueado</strong>
            <span>{summary.unlockedWorldName}</span>
          </div>
        ) : null}

        <button type="button" className="primary-button" onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
}
