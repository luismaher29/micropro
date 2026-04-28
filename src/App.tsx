import { useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { AppShell } from "./components/AppShell";
import { LevelRunner } from "./components/LevelRunner";
import { RewardModal } from "./components/RewardModal";
import { useGameStore } from "./game/useGameStore";
import { flattenLevels } from "./game/utils";
import type { AppTab, CompletionSummary } from "./game/types";
import { MapPage } from "./pages/MapPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ShopPage } from "./pages/ShopPage";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("map");
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [completionSummary, setCompletionSummary] = useState<CompletionSummary | null>(null);

  const progress = useGameStore((state) => state.progress);
  const completeLevel = useGameStore((state) => state.completeLevel);
  const updateStreak = useGameStore((state) => state.updateStreak);
  const resetProgress = useGameStore((state) => state.resetProgress);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const currentLevel = useMemo(
    () => flattenLevels().find((level) => level.id === activeLevelId) ?? null,
    [activeLevelId],
  );

  const handleLevelComplete = (payload: { levelId: string; mistakes: number }) => {
    const summary = completeLevel(payload);
    setActiveLevelId(null);
    if (summary) {
      setCompletionSummary(summary);
      setActiveTab("map");
    }
  };

  return (
    <>
      <AppShell activeTab={activeTab} onTabChange={setActiveTab} progress={progress}>
        {activeTab === "map" ? (
          <MapPage progress={progress} onSelectLevel={setActiveLevelId} />
        ) : null}

        {activeTab === "shop" ? <ShopPage progress={progress} /> : null}

        {activeTab === "profile" ? (
          <ProfilePage progress={progress} onReset={resetProgress} />
        ) : null}

        {currentLevel ? (
          <LevelRunner
            level={currentLevel}
            onClose={() => setActiveLevelId(null)}
            onComplete={handleLevelComplete}
          />
        ) : null}

        {completionSummary ? (
          <RewardModal
            summary={completionSummary}
            onClose={() => setCompletionSummary(null)}
          />
        ) : null}
      </AppShell>
      <Analytics />
    </>
  );
}
