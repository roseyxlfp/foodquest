"use client";

import EndScreen from "@/components/EndScreen";
import GameScreen from "@/components/GameScreen";
import StartScreen from "@/components/StartScreen";
import { GameProvider, useGame } from "@/lib/GameContext";

function Router() {
  const { state } = useGame();
  if (state.status === "start") return <StartScreen />;
  if (state.status === "ended") return <EndScreen />;
  return <GameScreen />;
}

export default function Home() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}
