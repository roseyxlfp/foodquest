"use client";

import { useGame } from "@/lib/GameContext";
import { ALL_MASCOTS } from "@/lib/gameLogic";
import type { Mascot } from "@/lib/types";

function effectBadge(m: Mascot) {
  const v = m.effect.value;
  switch (m.effect.type) {
    case "flat":
      return `+$${v} / correct`;
    case "percent":
      return `+${v}% rewards`;
    case "multiplier":
      return `×${v} rewards`;
    case "passive_percent":
      return `+${v}% passive $`;
    case "time":
      return `+${v}s on correct`;
  }
}

export default function MascotShop() {
  const { state, dispatch } = useGame();
  return (
    <div className="space-y-2">
      <div className="text-xs text-emerald-900/70 px-1">
        Hire mascots — their effects stack as you buy more!
      </div>
      {ALL_MASCOTS.map((m) => {
        const owned = state.ownedMascots.includes(m.id);
        const canBuy = state.money >= m.cost && !owned;
        return (
          <div
            key={m.id}
            className={`rounded-2xl bg-white border-2 p-3 flex gap-3 items-start shadow-sm transition ${
              owned ? "border-pink-300 bg-pink-50" : "border-emerald-200"
            }`}
          >
            <div className="text-4xl w-12 text-center">{m.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-emerald-900">{m.name}</div>
                <span className="text-[10px] font-bold uppercase tracking-wide rounded-full bg-pink-100 text-pink-800 px-2 py-0.5">
                  {effectBadge(m)}
                </span>
              </div>
              <p className="text-xs text-gray-700 mt-0.5 leading-snug">
                {m.description}
              </p>
              <div className="mt-2">
                {owned ? (
                  <span className="text-xs font-bold text-pink-700">
                    ✓ Hired
                  </span>
                ) : (
                  <button
                    onClick={() => dispatch({ type: "BUY_MASCOT", id: m.id })}
                    disabled={!canBuy}
                    className="rounded-lg bg-pink-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition active:scale-95"
                  >
                    Hire · ${m.cost}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
