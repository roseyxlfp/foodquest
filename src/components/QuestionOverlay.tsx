"use client";

import { useGame } from "@/lib/GameContext";
import { QUESTION_DURATION } from "@/lib/gameLogic";

const choiceColors = [
  "bg-red-500 hover:bg-red-600",
  "bg-blue-500 hover:bg-blue-600",
  "bg-yellow-500 hover:bg-yellow-600",
  "bg-green-600 hover:bg-green-700",
];

const choiceShapes = ["▲", "◆", "●", "■"];

export default function QuestionOverlay() {
  const { state, dispatch } = useGame();
  const q = state.currentQuestion;
  if (!q) return null;

  const answered = !!state.lastAnswer;
  const pct = Math.max(
    0,
    Math.min(1, state.questionTimeLeft / QUESTION_DURATION)
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4 z-20">
      <div className="pointer-events-auto w-full max-w-2xl rounded-2xl bg-white/95 backdrop-blur shadow-2xl border-2 border-gray-300 overflow-hidden">
        <div className="bg-white px-4 py-2 text-gray-900 border-b border-gray-200">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <span>{q.category}</span>
            <span>⏱ {Math.ceil(state.questionTimeLeft)}s</span>
          </div>
          <h2 className="text-base md:text-lg font-extrabold leading-snug mt-0.5">
            {q.question}
          </h2>
          <div className="mt-1.5 h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full ${
                pct > 0.5
                  ? "bg-emerald-500"
                  : pct > 0.2
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${pct * 100}%` }}
            />
          </div>
        </div>

        <div className="p-2 grid grid-cols-2 gap-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isChosen = state.lastAnswer?.chosenIndex === i;
            const showResult = answered;
            let extra = "";
            if (showResult) {
              if (isCorrect)
                extra =
                  "ring-4 ring-white outline outline-4 outline-emerald-600 scale-[1.02]";
              else if (isChosen)
                extra = "opacity-60 outline outline-4 outline-red-700";
              else extra = "opacity-40";
            }
            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => dispatch({ type: "ANSWER", chosenIndex: i })}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-white font-bold text-sm md:text-base shadow transition-transform active:scale-95 disabled:cursor-not-allowed ${choiceColors[i]} ${extra}`}
              >
                <span className="text-lg">{choiceShapes[i]}</span>
                <span className="flex-1 leading-tight">{opt}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="px-2 pb-2">
            <div
              className={`rounded-xl p-3 border-2 ${
                state.lastAnswer!.chosenIndex === q.correctIndex
                  ? "bg-emerald-50 border-emerald-400"
                  : "bg-red-50 border-red-400"
              }`}
            >
              <div className="font-bold text-sm mb-0.5 text-emerald-900">
                {state.lastAnswer!.chosenIndex === q.correctIndex
                  ? `🎉 Correct! +$${state.lastAnswer!.reward}`
                  : state.lastAnswer!.chosenIndex === -1
                  ? "⏰ Time's up!"
                  : "❌ Not quite"}
              </div>
              <div className="text-xs text-gray-800 leading-snug">
                {q.explanation}
              </div>
              <button
                onClick={() => dispatch({ type: "NEXT_QUESTION" })}
                className="mt-2 w-full rounded-lg bg-emerald-600 py-2 text-sm font-bold text-white hover:bg-emerald-700 active:scale-[0.98] transition"
              >
                Next question →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
