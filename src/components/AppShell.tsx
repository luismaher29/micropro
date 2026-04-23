import type { ReactNode } from "react";
import {
  Coins,
  Flame,
  Map,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";
import { getRankFromXp, getTotalStars } from "../game/utils";
import type { AppTab, PlayerProgress } from "../game/types";

interface AppShellProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  progress: PlayerProgress;
  children: ReactNode;
}

export function AppShell({
  activeTab,
  onTabChange,
  progress,
  children,
}: AppShellProps) {
  const rank = getRankFromXp(progress.xp);
  const stars = getTotalStars(progress);

  return (
    <div className="app-shell">
      <div className="app-backdrop" />
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-badge">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="eyebrow">MicroMaster Academy</p>
            <h1>{rank}</h1>
          </div>
        </div>

        <div className="topbar-stats">
          <StatPill icon={<Flame size={16} />} label={`${progress.streak} dia${progress.streak === 1 ? "" : "s"}`} />
          <StatPill icon={<Coins size={16} />} label={`${progress.coins}`} />
          <StatPill icon={<Trophy size={16} />} label={`${stars} estrellas`} />
        </div>
      </header>

      <main className="app-main">{children}</main>

      <nav className="bottom-nav" aria-label="Secciones de la app">
        <NavButton
          active={activeTab === "map"}
          icon={<Map size={18} />}
          label="Mundos"
          onClick={() => onTabChange("map")}
        />
        <NavButton
          active={activeTab === "shop"}
          icon={<ShoppingBag size={18} />}
          label="Tienda"
          onClick={() => onTabChange("shop")}
        />
        <NavButton
          active={activeTab === "profile"}
          icon={<UserRound size={18} />}
          label="Perfil"
          onClick={() => onTabChange("profile")}
        />
      </nav>
    </div>
  );
}

function StatPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="stat-pill">
      <span>{icon}</span>
      <strong>{label}</strong>
    </div>
  );
}

function NavButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`nav-button ${active ? "is-active" : ""}`}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
      {active ? <ShieldCheck size={14} /> : null}
    </button>
  );
}
