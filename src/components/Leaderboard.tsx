"use client";

import { useEffect, useState } from "react";

type Entry = {
  id: number;
  playerName: string;
  money: number;
  correct: number;
  total: number;
  plants: number;
  mascots: number;
  createdAt: string;
};

export default function Leaderboard({
  highlightId,
  refreshKey,
  limit = 10,
  compact = false,
}: {
  highlightId?: number | null;
  refreshKey?: number;
  limit?: number;
  compact?: boolean;
}) {
  const [scores, setScores] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setScores(null);
    setError(null);
    fetch("/api/leaderboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setScores(data.scores ?? []);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(String(e));
        setScores([]);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const rows = (scores ?? []).slice(0, limit);

  return (
    <div className="rounded-2xl bg-white border-2 border-gray-300 shadow overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="font-extrabold text-gray-900 flex items-center gap-2">
          <span>🏆</span>
          <span>Leaderboard</span>
        </div>
        <div className="text-[10px] uppercase tracking-wide text-gray-500">
          Top {limit}
        </div>
      </div>

      {scores === null && (
        <div className="p-4 text-sm text-gray-500 text-center">Loading…</div>
      )}

      {scores !== null && rows.length === 0 && (
        <div className="p-4 text-sm text-gray-500 text-center italic">
          {error ? "Couldn't load scores." : "No scores yet — be the first!"}
        </div>
      )}

      {rows.length > 0 && (
        <ol className="divide-y divide-gray-100">
          {rows.map((s, i) => {
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
            const accuracy = s.total
              ? Math.round((s.correct / s.total) * 100)
              : 0;
            const isMe = highlightId === s.id;
            return (
              <li
                key={s.id}
                className={`flex items-center gap-3 px-4 py-2 ${
                  isMe ? "bg-emerald-50" : ""
                }`}
              >
                <div className="w-6 text-center font-extrabold text-gray-700">
                  {medal ?? i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <div
                      className={`font-bold truncate ${
                        isMe ? "text-emerald-800" : "text-gray-900"
                      }`}
                    >
                      {s.playerName}
                      {isMe && (
                        <span className="ml-1 text-[10px] font-bold uppercase text-emerald-700">
                          you
                        </span>
                      )}
                    </div>
                  </div>
                  {!compact && (
                    <div className="text-[11px] text-gray-500">
                      {s.correct}/{s.total} correct · {accuracy}% · 🌱 {s.plants}{" "}
                      · 🐝 {s.mascots}
                    </div>
                  )}
                </div>
                <div className="font-extrabold text-emerald-700 tabular-nums">
                  ${s.money}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
