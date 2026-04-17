"use client";

import { useGame } from "@/lib/GameContext";
import { calcPassiveIncomePerSec, getOwnedMascots } from "@/lib/gameLogic";

function fmtMoney(n: number) {
  return `$${n.toFixed(n < 10 ? 1 : 0)}`;
}

function fmtTime(s: number) {
  const sec = Math.max(0, Math.ceil(s));
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function HUD() {
  const { state } = useGame();
  const passive = calcPassiveIncomePerSec(state);
  const owned = getOwnedMascots(state);
  const timePct = Math.max(0, Math.min(1, state.timeLeft / state.maxTime));
  const timeColor =
    timePct > 0.5
      ? "bg-emerald-500"
      : timePct > 0.2
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b-2 border-emerald-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🌱</div>
            <div className="font-bold text-emerald-900">
              {state.playerName}
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Stat
              label="Money"
              icon="💰"
              value={fmtMoney(state.money)}
              sub={`+$${passive.toFixed(1)}/s`}
              tone="yellow"
            />
            <Stat
              label="Score"
              icon="🎯"
              value={`${state.score.correct}/${state.score.total}`}
              sub={
                state.score.total
                  ? `${Math.round(
                      (state.score.correct / state.score.total) * 100
                    )}% correct`
                  : "answer one!"
              }
              tone="blue"
            />
            <Stat
              label="Mascots"
              icon="🐝"
              value={`${owned.length}`}
              sub={owned.map((m) => m.emoji).join("") || "none yet"}
              tone="pink"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="text-xs font-bold text-emerald-900">
            ⏱️ {fmtTime(state.timeLeft)}
          </div>
          <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full ${timeColor}`}
              style={{ width: `${timePct * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  tone: "yellow" | "blue" | "pink";
}) {
  const tones: Record<string, string> = {
    yellow: "bg-emerald-500 border-emerald-700 hover:bg-emerald-600",
    blue: "bg-emerald-500 border-emerald-700 hover:bg-emerald-600",
    pink: "bg-emerald-500 border-emerald-700 hover:bg-emerald-600",
  };
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border-b-4 px-3 py-1.5 text-white shadow-lg ${tones[tone]}`}
    >
      <div className="text-xl leading-none">{icon}</div>
      <div className="leading-tight">
        <div className="text-[10px] uppercase opacity-80 font-bold">{label}</div>
        <div className="font-extrabold">{value}</div>
        {sub && <div className="text-[10px] opacity-90">{sub}</div>}
      </div>
    </div>
  );
}
