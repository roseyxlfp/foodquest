"use client";

import { useGame } from "@/lib/GameContext";

export default function LogPanel() {
  const { state } = useGame();
  return (
    <div className="rounded-2xl bg-white border-2 border-gray-300 shadow overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
          Activity
        </div>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-3 text-sm">
        {state.log.length === 0 ? (
          <div className="text-xs text-gray-500 italic">No actions yet.</div>
        ) : (
          <ul className="space-y-1">
            {state.log.map((l) => (
              <li
                key={l.id}
                className={`text-xs leading-snug rounded-md px-2 py-1 ${
                  l.kind === "good"
                    ? "bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500"
                    : l.kind === "bad"
                    ? "bg-red-50 text-red-800 border-l-2 border-red-500"
                    : "bg-gray-50 text-gray-700 border-l-2 border-gray-300"
                }`}
              >
                {l.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
