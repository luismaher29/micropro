import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowRight, PartyPopper, X } from "lucide-react";
import type { Level } from "../game/types";

interface LevelRunnerProps {
  level: Level;
  onClose: () => void;
  onComplete: (payload: { levelId: string; correctAnswers: number }) => void;
}

const confettiPieces = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  left: 5 + ((index * 9) % 90),
  delay: (index % 6) * 0.12,
  duration: 2.2 + (index % 4) * 0.35,
  rotation: index % 2 === 0 ? 18 : -18,
}));

export function LevelRunner({ level, onClose, onComplete }: LevelRunnerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const step = level.steps[stepIndex];
  const correctAnswers = useMemo(
    () =>
      Object.entries(checkedSteps).filter(([stepId, optionId]) => {
        const currentStep = level.steps.find((item) => item.id === stepId);
        return currentStep?.correctOptionId === optionId;
      }).length,
    [checkedSteps, level.steps],
  );

  const isCorrect = selectedOptionId === step.correctOptionId;
  const isFinalStep = stepIndex === level.steps.length - 1;
  const progressValue = ((stepIndex + (showFeedback ? 1 : 0)) / level.steps.length) * 100;

  const handleCheck = () => {
    if (!selectedOptionId) {
      return;
    }

    setCheckedSteps((current) => ({ ...current, [step.id]: selectedOptionId }));
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (isFinalStep) {
      onComplete({
        levelId: level.id,
        correctAnswers:
          correctAnswers + (checkedSteps[step.id] ? 0 : isCorrect ? 1 : 0),
      });
      return;
    }

    setShowFeedback(false);
    setSelectedOptionId(null);
    setStepIndex((current) => current + 1);
  };

  return (
    <div className="runner-shell">
      <div className="runner-screen">
        <div className="runner-topbar">
          <button
            type="button"
            className="runner-close"
            onClick={onClose}
            aria-label="Cerrar nivel"
          >
            <X size={20} />
          </button>

          <div className="runner-progress">
            <div style={{ width: `${progressValue}%` }} />
          </div>
        </div>

        <div className="runner-stage">
          {showFeedback && isCorrect ? (
            <div className="confetti-layer" aria-hidden="true">
              {confettiPieces.map((piece) => (
                <span
                  key={piece.id}
                  className="confetti-piece"
                  style={
                    {
                      "--left": `${piece.left}%`,
                      "--delay": `${piece.delay}s`,
                      "--duration": `${piece.duration}s`,
                      "--rotation": `${piece.rotation}deg`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          ) : null}

          {step.theory ? <div className="theory-bubble">💡 {step.theory}</div> : null}

          <div className="runner-question-card">
            <h2>{step.prompt}</h2>

            <div className="runner-options">
              {step.options.map((option) => {
                const active = selectedOptionId === option.id;
                const correct = showFeedback && option.id === step.correctOptionId;
                const incorrect = showFeedback && active && option.id !== step.correctOptionId;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`runner-option ${active ? "is-active" : ""} ${
                      correct ? "is-correct" : ""
                    } ${incorrect ? "is-incorrect" : ""}`}
                    onClick={() => !showFeedback && setSelectedOptionId(option.id)}
                    disabled={showFeedback}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`feedback-footer ${showFeedback ? (isCorrect ? "is-correct" : "is-incorrect") : ""}`}>
          {!showFeedback ? (
            <button
              type="button"
              className="footer-action is-idle"
              onClick={handleCheck}
              disabled={!selectedOptionId}
            >
              Comprobar
            </button>
          ) : (
            <>
              <div className="feedback-banner">
                <div className="feedback-icon-box">
                  {isCorrect ? <PartyPopper size={24} /> : <span>🤔</span>}
                </div>
                <div className="feedback-copy">
                  <strong>{isCorrect ? "¡Increible!" : "Casi lo logras"}</strong>
                  <p>{step.explanation}</p>
                </div>
              </div>

              <button
                type="button"
                className={`footer-action ${isCorrect ? "is-correct" : "is-incorrect"}`}
                onClick={handleContinue}
              >
                {isFinalStep ? "Finalizar nivel" : "Continuar"}
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
