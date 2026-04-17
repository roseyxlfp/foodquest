"use client";

import { useState } from "react";
import FoodShop from "./FoodShop";
import MascotShop from "./MascotShop";
import LogPanel from "./LogPanel";
import { useGame } from "@/lib/GameContext";

type Panel = "shop" | "mascots" | "log" | null;

export default function SideDrawer() {
  const [open, setOpen] = useState<Panel>(null);
  const { state } = useGame();

  const toggle = (p: Panel) => setOpen((cur) => (cur === p ? null : p));

  return (
    <>
      {/* Floating action buttons */}
      <div className="absolute top-20 right-3 z-30 flex flex-col gap-2">
        <FabButton
          open={open === "shop"}
          onClick={() => toggle("shop")}
          emoji="🛒"
          label="Shop"
          tone="emerald"
        />
        <FabButton
          open={open === "mascots"}
          onClick={() => toggle("mascots")}
          emoji="🐝"
          label="Mascots"
          tone="pink"
          badge={state.ownedMascots.length || undefined}
        />
        <FabButton
          open={open === "log"}
          onClick={() => toggle("log")}
          emoji="📜"
          label="Log"
          tone="amber"
        />
      </div>

      {/* Dim background when open */}
      {open && (
        <div
          onClick={() => setOpen(null)}
          className="absolute inset-0 bg-black/20 z-20 transition-opacity"
        />
      )}

      {/* Slide-out drawer */}
      <div
        className={`absolute top-0 right-0 h-full w-[min(420px,92vw)] bg-white/95 backdrop-blur shadow-2xl border-l-4 border-emerald-300 z-30 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 border-b-2 border-emerald-200 bg-emerald-50">
            <div className="font-extrabold text-emerald-900 text-lg">
              {open === "shop" && "🛒 Plant Shop"}
              {open === "mascots" && "🐝 Mascots"}
              {open === "log" && "📜 Activity Log"}
            </div>
            <button
              onClick={() => setOpen(null)}
              className="rounded-full bg-white border-2 border-emerald-200 w-8 h-8 font-bold text-emerald-900 hover:bg-emerald-100"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {open === "shop" && <FoodShop />}
            {open === "mascots" && <MascotShop />}
            {open === "log" && <LogPanel />}
          </div>
        </div>
      </div>
    </>
  );
}

function FabButton({
  open,
  onClick,
  emoji,
  label,
  tone,
  badge,
}: {
  open: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
  tone: "emerald" | "pink" | "amber";
  badge?: number;
}) {
  const tones: Record<string, string> = {
    emerald: "bg-emerald-500 hover:bg-emerald-600 border-emerald-700",
    pink: "bg-pink-500 hover:bg-pink-600 border-pink-700",
    amber: "bg-amber-500 hover:bg-amber-600 border-amber-700",
  };
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl text-white shadow-lg border-b-4 transition active:translate-y-0.5 active:border-b-2 ${
        tones[tone]
      } ${open ? "ring-4 ring-white scale-105" : ""}`}
    >
      <span className="text-2xl leading-none">{emoji}</span>
      <span className="text-[10px] font-bold mt-0.5">{label}</span>
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 bg-white text-emerald-900 text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center border-2 border-current">
          {badge}
        </span>
      )}
    </button>
  );
}
