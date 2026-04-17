"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/lib/GameContext";
import { ALL_FOODS, ALL_MASCOTS } from "@/lib/gameLogic";
import Leaderboard from "./Leaderboard";

export default function EndScreen() {
  const { state, dispatch } = useGame();
  const totalPlants = Object.values(state.plantings).reduce(
    (a, b) => a + b,
    0
  );
  const accuracy = state.score.total
    ? Math.round((state.score.correct / state.score.total) * 100)
    : 0;

  const grade =
    accuracy >= 90
      ? { letter: "A+", msg: "Sustainable Superstar!" }
      : accuracy >= 75
      ? { letter: "A", msg: "Eco Expert!" }
      : accuracy >= 60
      ? { letter: "B", msg: "Green Grower" }
      : accuracy >= 40
      ? { letter: "C", msg: "Keep learning!" }
      : { letter: "D", msg: "Plant more knowledge!" };

  const [savedId, setSavedId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSaving(true);
    fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: state.playerName || "Anon",
        money: Math.floor(state.money),
        correct: state.score.correct,
        total: state.score.total,
        plants: totalPlants,
        mascots: state.ownedMascots.length,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.score?.id) setSavedId(data.score.id);
      })
      .catch((e) => setSaveError(String(e)))
      .finally(() => setSaving(false));
  }, [state, totalPlants]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-lime-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stats */}
        <div className="rounded-2xl bg-white border-2 border-gray-300 shadow-xl overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              Round complete
            </div>
            <div className="text-2xl font-extrabold text-gray-900 leading-tight">
              🏆 Nice work, {state.playerName}!
            </div>
            <div className="text-sm text-gray-600">{grade.msg}</div>
          </div>

          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Tile label="Grade" value={grade.letter} />
              <Tile
                label="Accuracy"
                value={`${accuracy}%`}
                sub={`${state.score.correct}/${state.score.total}`}
              />
              <Tile label="Money" value={`$${Math.floor(state.money)}`} />
              <Tile
                label="Plants"
                value={`${totalPlants}`}
                sub={`${state.ownedMascots.length} mascots`}
              />
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
              <div className="text-[10px] uppercase tracking-wide text-gray-500 font-bold mb-1">
                Your garden
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_FOODS.filter((f) => (state.plantings[f.id] ?? 0) > 0).map(
                  (f) => (
                    <span
                      key={f.id}
                      className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-800"
                    >
                      {f.emoji} {f.name} ×{state.plantings[f.id]}
                    </span>
                  )
                )}
                {totalPlants === 0 && (
                  <span className="text-xs italic text-gray-500">
                    You didn&apos;t plant anything.
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
              <div className="text-[10px] uppercase tracking-wide text-gray-500 font-bold mb-1">
                Mascots hired
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_MASCOTS.filter((m) =>
                  state.ownedMascots.includes(m.id)
                ).map((m) => (
                  <span
                    key={m.id}
                    className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-800"
                  >
                    {m.emoji} {m.name}
                  </span>
                ))}
                {state.ownedMascots.length === 0 && (
                  <span className="text-xs italic text-gray-500">
                    No mascots hired.
                  </span>
                )}
              </div>
            </div>

            <div className="text-[11px] text-gray-500 text-center">
              {saving
                ? "Saving score…"
                : saveError
                ? "Score couldn't be saved."
                : savedId
                ? "✓ Score saved to leaderboard."
                : ""}
            </div>

            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="w-full rounded-xl bg-emerald-600 py-3 text-lg font-extrabold text-white border-b-4 border-emerald-800 shadow-lg transition active:translate-y-0.5 active:border-b-2 hover:bg-emerald-700"
            >
              Play Again →
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <Leaderboard highlightId={savedId} refreshKey={savedId ?? 0} />
      </div>
    </div>
  );
}

function Tile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white p-3 text-center">
      <div className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">
        {label}
      </div>
      <div className="text-2xl font-extrabold text-gray-900">{value}</div>
      {sub && <div className="text-[11px] text-gray-500">{sub}</div>}
    </div>
  );
}
