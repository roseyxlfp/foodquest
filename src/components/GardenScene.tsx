"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/lib/GameContext";
import {
  ALL_FOODS,
  ALL_MASCOTS,
  calcPassiveIncomePerSec,
} from "@/lib/gameLogic";
import type { Food } from "@/lib/types";

function sizeClass(cost: number) {
  if (cost < 50) return "text-3xl";
  if (cost < 300) return "text-4xl";
  if (cost < 1500) return "text-5xl";
  if (cost < 5000) return "text-6xl";
  return "text-7xl";
}

type Coin = { id: number; left: number; bottom: number; amount: number };

export default function GardenScene() {
  const { state } = useGame();
  const totalPlants = Object.values(state.plantings).reduce((a, b) => a + b, 0);
  const passive = calcPassiveIncomePerSec(state);

  const plantedFoods: Food[] = ALL_FOODS.filter(
    (f) => (state.plantings[f.id] ?? 0) > 0
  );
  const ownedMascots = ALL_MASCOTS.filter((m) =>
    state.ownedMascots.includes(m.id)
  );
  const hasSun = ownedMascots.some((m) => m.id === "sun");

  const [coins, setCoins] = useState<Coin[]>([]);
  const coinIdRef = useRef(0);

  useEffect(() => {
    if (passive <= 0) return;
    const interval = Math.max(400, 2500 / Math.max(1, Math.log2(passive + 2)));
    const t = setInterval(() => {
      const id = ++coinIdRef.current;
      const c: Coin = {
        id,
        left: 5 + Math.random() * 90,
        bottom: 15 + Math.random() * 30,
        amount: Math.max(1, Math.round(passive * (interval / 1000))),
      };
      setCoins((prev) => [...prev.slice(-20), c]);
      setTimeout(() => {
        setCoins((prev) => prev.filter((x) => x.id !== id));
      }, 1600);
    }, interval);
    return () => clearInterval(t);
  }, [passive]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-slate-100">
      {/* Sun */}
      <div
        className={`absolute top-6 right-8 text-7xl ${
          hasSun
            ? "animate-spin-slow drop-shadow-[0_0_24px_rgba(255,200,0,0.9)]"
            : ""
        }`}
        title={hasSun ? "Sunny the Sun" : "Sun"}
      >
        {hasSun ? "☀️" : "🌤️"}
      </div>

      {/* Clouds */}
      <div
        className="absolute top-8 left-0 text-5xl opacity-80 animate-drift"
        style={{ animationDelay: "-8s" }}
      >
        ☁️
      </div>
      <div
        className="absolute top-24 left-0 text-4xl opacity-60 animate-drift-slow"
        style={{ animationDelay: "-22s" }}
      >
        ☁️
      </div>
      <div
        className="absolute top-14 left-0 text-6xl opacity-70 animate-drift"
        style={{ animationDelay: "-18s" }}
      >
        ☁️
      </div>
      <div
        className="absolute top-40 left-0 text-3xl opacity-50 animate-drift-slow"
        style={{ animationDelay: "-38s" }}
      >
        ☁️
      </div>

      {/* Mascots floating along flight paths */}
      {ownedMascots
        .filter((m) => m.id !== "sun")
        .map((m, i) => {
          const paths = [
            "animate-fly-a",
            "animate-fly-b",
            "animate-fly-c",
            "animate-fly-d",
            "animate-fly-e",
          ];
          const path = paths[i % paths.length];
          return (
            <div
              key={m.id}
              className={`absolute z-10 ${path}`}
              style={{
                left: `${5 + ((i * 13) % 20)}%`,
                bottom: `${24 + ((i * 11) % 22)}%`,
                animationDelay: `${-(i * 3) % 20}s`,
              }}
              title={`${m.name} — ${m.description}`}
            >
              <div
                className="text-5xl animate-bob drop-shadow-md"
                style={{ animationDelay: `${(i * 0.25) % 2}s` }}
              >
                {m.emoji}
              </div>
            </div>
          );
        })}

      {/* Ground layer with distant hills */}
      <div className="absolute bottom-0 inset-x-0 h-[55%] bg-gradient-to-b from-lime-300 via-green-600 to-green-900">
        {/* Hill silhouettes */}
        <div className="absolute -top-10 left-0 right-0 flex justify-around opacity-40 pointer-events-none">
          <span className="text-7xl">🏔️</span>
          <span className="text-6xl">⛰️</span>
          <span className="text-7xl">🏔️</span>
          <span className="text-6xl">⛰️</span>
        </div>

        {/* Soil strip */}
        <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-b from-amber-700 to-amber-900 opacity-80" />

        {/* Planted rows — one row per plant type, big plants in back */}
        <div className="absolute bottom-6 inset-x-0 px-4 pb-2 flex flex-col items-center justify-end gap-1">
          {totalPlants === 0 && (
            <div className="w-full text-center text-white/90 italic text-lg py-24 drop-shadow">
              🪴 Your field is empty — open the 🛒 Shop to plant your first crop!
            </div>
          )}
          {[...plantedFoods]
            .sort((a, b) => b.cost - a.cost)
            .map((f) => {
              const count = state.plantings[f.id] ?? 0;
              const shown = Math.min(count, 24);
              return (
                <div
                  key={f.id}
                  className="w-full flex items-end justify-center gap-1"
                  title={`${f.name} ×${count}`}
                >
                  {Array.from({ length: shown }).map((_, i) => (
                    <span
                      key={`${f.id}-${i}`}
                      className={`${sizeClass(
                        f.cost
                      )} animate-sway leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]`}
                      style={{
                        animationDelay: `${(
                          (i * 0.13 + f.cost * 0.0003) %
                          2
                        ).toFixed(2)}s`,
                      }}
                    >
                      {f.emoji}
                    </span>
                  ))}
                  {count > shown && (
                    <span className="self-center text-xs font-bold text-white bg-black/40 rounded-full px-2 py-0.5">
                      +{count - shown}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Floating coin particles */}
      {coins.map((c) => (
        <div
          key={c.id}
          className="pointer-events-none absolute animate-rise z-[18]"
          style={{ left: `${c.left}%`, bottom: `${c.bottom}%` }}
        >
          <div className="flex items-center gap-1 bg-yellow-300 text-yellow-900 border-2 border-yellow-500 rounded-full px-2 py-0.5 text-sm font-extrabold shadow-lg">
            <span>💰</span>
            <span>+${c.amount}</span>
          </div>
        </div>
      ))}

      {/* Garden stat badge */}
      <div className="absolute top-4 left-4 z-20 rounded-full bg-white/80 backdrop-blur px-4 py-1.5 text-sm font-bold text-emerald-900 shadow">
        🌻 {totalPlants} plant{totalPlants !== 1 ? "s" : ""} · +$
        {passive.toFixed(1)}/s
      </div>

      {/* Vignette to improve overlay contrast */}
      <div
        className="pointer-events-none absolute inset-0 z-[15]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.08), transparent 18%, transparent 65%, rgba(0,0,0,0.25))",
        }}
      />
    </div>
  );
}
