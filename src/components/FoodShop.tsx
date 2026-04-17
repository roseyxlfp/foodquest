"use client";

import { useGame } from "@/lib/GameContext";
import { ALL_FOODS } from "@/lib/gameLogic";

export default function FoodShop() {
  const { state, dispatch } = useGame();
  return (
    <div className="space-y-2">
      <div className="text-xs text-emerald-900/70 px-1">
        Plant foods to earn passive income per second. Each also teaches you something!
      </div>
      {ALL_FOODS.map((f) => {
        const owned = state.plantings[f.id] ?? 0;
        const canBuy = state.money >= f.cost;
        return (
          <div
            key={f.id}
            className="rounded-2xl bg-white border-2 border-emerald-200 p-3 flex gap-3 items-start shadow-sm"
          >
            <div className="text-4xl w-12 text-center">{f.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-emerald-900">{f.name}</div>
                <div className="text-xs font-semibold text-emerald-700">
                  +${f.passive.toFixed(1)}/s
                </div>
              </div>
              <p className="text-xs text-gray-700 mt-0.5 leading-snug">
                {f.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => dispatch({ type: "BUY_FOOD", id: f.id })}
                  disabled={!canBuy}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition active:scale-95"
                >
                  Plant · ${f.cost}
                </button>
                {owned > 0 && (
                  <span className="text-xs bg-lime-100 text-lime-900 rounded-full px-2 py-0.5 font-bold">
                    ×{owned} planted
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
