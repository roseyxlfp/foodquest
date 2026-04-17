"use client";

import { useState } from "react";
import { useGame } from "@/lib/GameContext";
import Leaderboard from "./Leaderboard";

export default function StartScreen() {
  const { dispatch } = useGame();
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-100 via-lime-50 to-amber-50">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: start */}
        <div className="rounded-2xl bg-white border-2 border-gray-300 shadow-xl overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              Food Quest
            </div>
            <div className="text-2xl font-extrabold text-gray-900 leading-tight">
              🌱 Grow your knowledge
            </div>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-700 leading-snug">
              Answer multiple-choice food &amp; sustainability questions → earn
              money → plant foods &amp; hire mascots. You have{" "}
              <span className="font-bold">5 minutes</span>. How far can you grow?
            </p>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Your name
              </span>
              <input
                type="text"
                value={name}
                maxLength={20}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="mt-1 w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-lg font-medium focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    dispatch({ type: "START", name: name.trim() });
                }}
              />
            </label>

            <button
              onClick={() => dispatch({ type: "START", name: name.trim() })}
              className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-extrabold text-white border-b-4 border-emerald-800 shadow-lg transition active:translate-y-0.5 active:border-b-2 hover:bg-emerald-700"
            >
              Start Quest →
            </button>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <Pill icon="⏱️" label="5 min" sub="Beat the clock" />
              <Pill icon="❓" label="MCQ" sub="Earn $ per answer" />
              <Pill icon="🐝" label="Mascots" sub="Stack bonuses" />
            </div>
          </div>
        </div>

        {/* Card: leaderboard */}
        <div>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

function Pill({
  icon,
  label,
  sub,
}: {
  icon: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-200 p-2">
      <div className="text-xl">{icon}</div>
      <div className="font-bold text-gray-900">{label}</div>
      <div className="text-[10px] text-gray-500">{sub}</div>
    </div>
  );
}
