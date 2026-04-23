export type AppTab = "map" | "shop" | "profile";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface QuestionStep {
  id: string;
  prompt: string;
  theory?: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
}

export interface LevelReward {
  xp: number;
  coins: number;
}

export interface Level {
  id: string;
  title: string;
  description: string;
  difficulty: "Inicio" | "Practica" | "Jefe";
  reward: LevelReward;
  steps: QuestionStep[];
}

export interface WorldTheme {
  accent: string;
  surface: string;
  shadow: string;
  glow: string;
}

export interface World {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  summary: string;
  theme: WorldTheme;
  levels: Level[];
}

export interface RewardItem {
  id: string;
  tipo: "curso" | "masterclass" | "ebook";
  titulo: string;
  description: string;
  descuento: string;
  costoMonedas: number;
  icon: string;
  codigoPlaceholder: string;
}

export interface LevelResult {
  completed: boolean;
  stars: number;
  score: number;
  attempts: number;
  perfect: boolean;
  lastPlayedAt: string;
}

export interface PlayerProgress {
  xp: number;
  coins: number;
  streak: number;
  lastActiveDate: string | null;
  unlockedWorldIds: string[];
  levelResults: Record<string, LevelResult>;
  unlockedRewardIds: string[];
}

export interface CompletionSummary {
  xpAwarded: number;
  coinsAwarded: number;
  starsEarned: number;
  mistakes: number;
  unlockedWorldName?: string;
  firstClear: boolean;
}

export interface PurchaseResult {
  success: boolean;
  message: string;
}
