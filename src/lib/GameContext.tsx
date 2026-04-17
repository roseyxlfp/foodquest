"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import questionsData from "@/data/questions.json";
import type {
  GameState,
  LogEntry,
  Question,
} from "./types";
import {
  ALL_FOODS,
  ALL_MASCOTS,
  BASE_REWARD,
  GAME_DURATION,
  QUESTION_DURATION,
  QUICK_BONUS_THRESHOLD,
  calcPassiveIncomePerSec,
  calcRewardForCorrect,
  calcTimeBonus,
  pickRandomQuestion,
} from "./gameLogic";

const QUESTIONS: Question[] = questionsData as Question[];

type Action =
  | { type: "START"; name: string }
  | { type: "TICK"; dt: number }
  | { type: "QUESTION_TICK"; dt: number }
  | { type: "ANSWER"; chosenIndex: number }
  | { type: "NEXT_QUESTION" }
  | { type: "BUY_FOOD"; id: string }
  | { type: "BUY_MASCOT"; id: string }
  | { type: "SET_TAB"; tab: GameState["activeTab"] }
  | { type: "END" }
  | { type: "RESET" };

const initialState: GameState = {
  status: "start",
  playerName: "",
  money: 0,
  score: { correct: 0, total: 0 },
  timeLeft: GAME_DURATION,
  maxTime: GAME_DURATION,
  currentQuestion: null,
  questionTimeLeft: QUESTION_DURATION,
  lastAnswer: null,
  plantings: {},
  ownedMascots: [],
  log: [],
  baseQuestionReward: BASE_REWARD,
  activeTab: "garden",
};

function pushLog(
  log: LogEntry[],
  text: string,
  kind: LogEntry["kind"] = "info"
): LogEntry[] {
  const entry: LogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    kind,
    timestamp: Date.now(),
  };
  return [entry, ...log].slice(0, 40);
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "START": {
      const first = pickRandomQuestion(QUESTIONS);
      return {
        ...initialState,
        status: "playing",
        playerName: action.name || "Player",
        currentQuestion: first,
        questionTimeLeft: QUESTION_DURATION,
        money: 20,
        log: pushLog(
          [],
          `Welcome, ${action.name || "Player"}! You have $20 to start.`,
          "info"
        ),
      };
    }

    case "TICK": {
      if (state.status !== "playing") return state;
      const newTime = state.timeLeft - action.dt;
      const passive = calcPassiveIncomePerSec(state) * action.dt;
      const money = state.money + passive;
      if (newTime <= 0) {
        return {
          ...state,
          status: "ended",
          timeLeft: 0,
          money,
          log: pushLog(state.log, "Time's up! Game over.", "info"),
        };
      }
      return { ...state, timeLeft: newTime, money };
    }

    case "QUESTION_TICK": {
      if (state.status !== "playing" || !state.currentQuestion) return state;
      if (state.lastAnswer) return state;
      const remaining = state.questionTimeLeft - action.dt;
      if (remaining <= 0) {
        return {
          ...state,
          questionTimeLeft: 0,
          score: { ...state.score, total: state.score.total + 1 },
          lastAnswer: {
            chosenIndex: -1,
            correctIndex: state.currentQuestion.correctIndex,
            explanation: state.currentQuestion.explanation,
            reward: 0,
          },
          log: pushLog(
            state.log,
            `Ran out of time on: ${state.currentQuestion.question.slice(0, 40)}...`,
            "bad"
          ),
        };
      }
      return { ...state, questionTimeLeft: remaining };
    }

    case "ANSWER": {
      if (!state.currentQuestion || state.lastAnswer) return state;
      const q = state.currentQuestion;
      const correct = action.chosenIndex === q.correctIndex;
      const quick =
        correct && state.questionTimeLeft > QUESTION_DURATION - QUICK_BONUS_THRESHOLD;
      if (correct) {
        const { total, breakdown } = calcRewardForCorrect(state, quick);
        const timeBonus = calcTimeBonus(state);
        const newMoney = state.money + total;
        const newTimeLeft = Math.min(state.maxTime + timeBonus, state.timeLeft + timeBonus);
        return {
          ...state,
          money: newMoney,
          timeLeft: newTimeLeft,
          score: {
            correct: state.score.correct + 1,
            total: state.score.total + 1,
          },
          lastAnswer: {
            chosenIndex: action.chosenIndex,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            reward: total,
          },
          log: pushLog(
            state.log,
            `✓ +$${total} (${breakdown.join(", ")})${
              timeBonus > 0 ? ` +${timeBonus}s` : ""
            }`,
            "good"
          ),
        };
      } else {
        return {
          ...state,
          score: { ...state.score, total: state.score.total + 1 },
          lastAnswer: {
            chosenIndex: action.chosenIndex,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            reward: 0,
          },
          log: pushLog(state.log, `✗ Wrong — no reward`, "bad"),
        };
      }
    }

    case "NEXT_QUESTION": {
      const next = pickRandomQuestion(
        QUESTIONS,
        state.currentQuestion?.id ?? null
      );
      return {
        ...state,
        currentQuestion: next,
        questionTimeLeft: QUESTION_DURATION,
        lastAnswer: null,
      };
    }

    case "BUY_FOOD": {
      const food = ALL_FOODS.find((f) => f.id === action.id);
      if (!food) return state;
      if (state.money < food.cost) {
        return {
          ...state,
          log: pushLog(state.log, `Not enough $ for ${food.name}`, "bad"),
        };
      }
      const current = state.plantings[food.id] ?? 0;
      return {
        ...state,
        money: state.money - food.cost,
        plantings: { ...state.plantings, [food.id]: current + 1 },
        log: pushLog(
          state.log,
          `Planted ${food.emoji} ${food.name} (+$${food.passive.toFixed(1)}/s)`,
          "good"
        ),
      };
    }

    case "BUY_MASCOT": {
      const m = ALL_MASCOTS.find((x) => x.id === action.id);
      if (!m) return state;
      if (state.ownedMascots.includes(m.id)) return state;
      if (state.money < m.cost) {
        return {
          ...state,
          log: pushLog(state.log, `Not enough $ for ${m.name}`, "bad"),
        };
      }
      return {
        ...state,
        money: state.money - m.cost,
        ownedMascots: [...state.ownedMascots, m.id],
        log: pushLog(
          state.log,
          `Hired ${m.emoji} ${m.name} — ${m.description}`,
          "good"
        ),
      };
    }

    case "SET_TAB":
      return { ...state, activeTab: action.tab };

    case "END":
      return { ...state, status: "ended" };

    case "RESET":
      return initialState;
  }
}

type Ctx = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

const GameContext = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.status !== "playing") {
      lastTickRef.current = null;
      return;
    }
    let raf = 0;
    const loop = (ts: number) => {
      if (lastTickRef.current == null) lastTickRef.current = ts;
      const dt = (ts - lastTickRef.current) / 1000;
      lastTickRef.current = ts;
      if (dt > 0) {
        dispatch({ type: "TICK", dt });
        dispatch({ type: "QUESTION_TICK", dt });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state.status]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
