import type { ReactNode } from "react";
import { Flame, Gem, Map, ShoppingBag, UserRound } from "lucide-react";
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
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-lockup">
            <div className="brand-badge">M</div>
            <div className="brand-copy">
              <span className="brand-name">MICROPRO</span>
              <span className="brand-subtitle">Academia de micropigmentacion · by AprendePMU.com</span>
            </div>
          </div>

          <div className="topbar-stats">
            <StatPill
              tone="fire"
              icon={<Flame size={18} />}
              label={`${progress.streak}`}
            />
            <StatPill
              tone="gem"
              icon={<Gem size={18} />}
              label={`${progress.coins}`}
            />
          </div>
        </div>
      </header>

      <main className="app-main">{children}</main>

      <nav className="bottom-nav" aria-label="Secciones principales">
        <NavButton
          active={activeTab === "map"}
          icon={<Map size={20} />}
          label="Mundos"
          onClick={() => onTabChange("map")}
        />
        <NavButton
          active={activeTab === "shop"}
          icon={<ShoppingBag size={20} />}
          label="Tienda"
          onClick={() => onTabChange("shop")}
        />
        <NavButton
          active={activeTab === "profile"}
          icon={<UserRound size={20} />}
          label="Perfil"
          onClick={() => onTabChange("profile")}
        />
      </nav>
    </div>
  );
}

function StatPill({
  icon,
  label,
  tone,
}: {
  icon: ReactNode;
  label: string;
  tone: "fire" | "gem";
}) {
  return (
    <div className={`stat-pill ${tone}`}>
      <span className="stat-icon">{icon}</span>
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
      <span className="nav-icon-wrap">{icon}</span>
      <span className="nav-label">{label}</span>
    </button>
  );
}
