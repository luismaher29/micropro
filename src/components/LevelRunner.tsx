import { useMemo, useState } from "react";
import { ArrowRight, BadgeX, CheckCircle2, X } from "lucide-react";
import type { Level } from "../game/types";

interface LevelRunnerProps {
  level: Level;
  onClose: () => void;
  onComplete: (payload: { levelId: string; correctAnswers: number }) => void;
}

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
  const progressValue = ((stepIndex + (showFeedback ? 1 : 0)) / level.steps.length) * 100;

  const handleCheck = () => {
    if (!selectedOptionId) {
      return;
    }

    setCheckedSteps((current) => ({ ...current, [step.id]: selectedOptionId }));
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (stepIndex === level.steps.length - 1) {
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
    <div className="modal-shell">
      <div className="modal-panel">
        <div className="runner-header">
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar nivel">
            <X size={18} />
          </button>
          <div className="runner-progress">
            <div style={{ width: `${progressValue}%` }} />
          </div>
        </div>

        <div className="runner-body">
          <div className="runner-intro">
            <span className="eyebrow">{level.difficulty}</span>
            <h2>{level.title}</h2>
            <p>{level.description}</p>
          </div>

          {step.theory ? <div className="theory-card">{step.theory}</div> : null}

          <div className="question-card">
            <h3>{step.prompt}</h3>
            <div className="option-list">
              {step.options.map((option) => {
                const active = selectedOptionId === option.id;
                const correct = showFeedback && option.id === step.correctOptionId;
                const incorrect = showFeedback && active && option.id !== step.correctOptionId;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`option-button ${active ? "is-active" : ""} ${
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

        <div className={`runner-footer ${showFeedback ? (isCorrect ? "is-correct" : "is-incorrect") : ""}`}>
          {!showFeedback ? (
            <button
              type="button"
              className="primary-button"
              onClick={handleCheck}
              disabled={!selectedOptionId}
            >
              Revisar respuesta
            </button>
          ) : (
            <div className="feedback-stack">
              <div className="feedback-copy">
                {isCorrect ? <CheckCircle2 size={22} /> : <BadgeX size={22} />}
                <div>
                  <strong>{isCorrect ? "Muy bien" : "Vamos de nuevo"}</strong>
                  <p>{step.explanation}</p>
                </div>
              </div>
              <button type="button" className="primary-button" onClick={handleContinue}>
                {stepIndex === level.steps.length - 1 ? "Cerrar nivel" : "Siguiente pregunta"}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
