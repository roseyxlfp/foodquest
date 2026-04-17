import type { Food, GameState, Mascot, Question } from "./types";
import mascots from "@/data/mascots.json";
import foods from "@/data/foods.json";

export const ALL_MASCOTS: Mascot[] = mascots as Mascot[];
export const ALL_FOODS: Food[] = foods as Food[];

export const GAME_DURATION = 300;
export const QUESTION_DURATION = 30;
export const BASE_REWARD = 10;
export const QUICK_BONUS_THRESHOLD = 20;
export const QUICK_BONUS = 5;

export function getOwnedMascots(state: GameState): Mascot[] {
  return ALL_MASCOTS.filter((m) => state.ownedMascots.includes(m.id));
}

export function calcRewardForCorrect(
  state: GameState,
  quick: boolean
): { total: number; breakdown: string[] } {
  let base = state.baseQuestionReward;
  const breakdown: string[] = [`$${base} base`];
  const owned = getOwnedMascots(state);

  for (const m of owned) {
    if (m.effect.type === "flat") {
      base += m.effect.value;
      breakdown.push(`+$${m.effect.value} ${m.emoji}`);
    }
  }

  let percentMult = 1;
  for (const m of owned) {
    if (m.effect.type === "percent") {
      percentMult += m.effect.value / 100;
      breakdown.push(`+${m.effect.value}% ${m.emoji}`);
    }
  }
  base = base * percentMult;

  let bigMult = 1;
  for (const m of owned) {
    if (m.effect.type === "multiplier") {
      bigMult *= m.effect.value;
      breakdown.push(`×${m.effect.value} ${m.emoji}`);
    }
  }
  base = base * bigMult;

  if (quick) {
    base += QUICK_BONUS;
    breakdown.push(`+$${QUICK_BONUS} quick!`);
  }

  return { total: Math.round(base), breakdown };
}

export function calcPassiveIncomePerSec(state: GameState): number {
  let total = 0;
  for (const food of ALL_FOODS) {
    const count = state.plantings[food.id] ?? 0;
    total += count * food.passive;
  }
  const owned = getOwnedMascots(state);
  let percentBoost = 1;
  for (const m of owned) {
    if (m.effect.type === "passive_percent") {
      percentBoost += m.effect.value / 100;
    }
  }
  return total * percentBoost;
}

export function calcTimeBonus(state: GameState): number {
  let t = 0;
  for (const m of getOwnedMascots(state)) {
    if (m.effect.type === "time") t += m.effect.value;
  }
  return t;
}

export function pickRandomQuestion(
  pool: Question[],
  excludeId?: string | null
): Question {
  const filtered =
    excludeId && pool.length > 1
      ? pool.filter((q) => q.id !== excludeId)
      : pool;
  return filtered[Math.floor(Math.random() * filtered.length)];
}
