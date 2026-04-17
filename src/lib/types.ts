export type Question = {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Food = {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  passive: number;
  description: string;
};

export type MascotEffectType =
  | "flat"
  | "percent"
  | "multiplier"
  | "passive_percent"
  | "time";

export type Mascot = {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  effect: { type: MascotEffectType; value: number };
};

export type GameStatus = "start" | "playing" | "ended";

export type LogEntry = {
  id: string;
  text: string;
  kind: "info" | "good" | "bad";
  timestamp: number;
};

export type GameState = {
  status: GameStatus;
  playerName: string;
  money: number;
  score: { correct: number; total: number };
  timeLeft: number;
  maxTime: number;
  currentQuestion: Question | null;
  questionTimeLeft: number;
  lastAnswer: {
    chosenIndex: number;
    correctIndex: number;
    explanation: string;
    reward: number;
  } | null;
  plantings: Record<string, number>;
  ownedMascots: string[];
  log: LogEntry[];
  baseQuestionReward: number;
  activeTab: "shop" | "mascots" | "garden";
};
