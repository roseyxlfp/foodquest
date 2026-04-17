"use client";

import { useGame } from "@/lib/GameContext";
import HUD from "./HUD";
import GardenScene from "./GardenScene";
import QuestionOverlay from "./QuestionOverlay";
import SideDrawer from "./SideDrawer";

export default function GameScreen() {
  const { dispatch } = useGame();
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <HUD />
      <div className="relative flex-1">
        <GardenScene />
        <SideDrawer />
        <QuestionOverlay />
        <button
          onClick={() => dispatch({ type: "END" })}
          className="absolute bottom-2 left-3 z-10 text-[11px] text-white/80 bg-black/20 backdrop-blur px-2 py-0.5 rounded hover:text-white hover:bg-black/40 transition"
        >
          End game early
        </button>
      </div>
    </div>
  );
}
