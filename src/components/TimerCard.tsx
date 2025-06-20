import React from "react";
import { useTimers } from "../context/TimerContext";
import { formatDuration } from "../utils/formatTime";
import { Play, Pause, RotateCcw, Trash2 } from "lucide-react";

interface TimerCardProps {
  timer: any;
}

const TimerCard: React.FC<TimerCardProps> = ({ timer }) => {
  const { dispatch } = useTimers();

  const handleStartPause = () => {
    dispatch({
      type: timer.status === "running" ? "PAUSE_TIMER" : "START_TIMER",
      // @ts-ignore
      payload: { id: timer.id },
    });
  };

  const handleReset = () => {
    // @ts-ignore
    dispatch({ type: "RESET_TIMER", payload: { id: timer.id } });
  };

  const handleDelete = () => {
    // @ts-ignore
    dispatch({ type: "DELETE_TIMER", payload: { id: timer.id } });
  };

  return (
    <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-5 shadow-sm space-y-3 transition hover:shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {timer.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {timer.category}
          </p>
        </div>
        <span
          className={`text-xs font-medium rounded px-2 py-1 ${
            timer.status === "running"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-zinc-300"
          }`}
        >
          {timer.status.toUpperCase()}
        </span>
      </div>

      <div className="text-center font-mono text-3xl text-blue-600 dark:text-blue-400">
        {formatDuration(timer.remaining)}
      </div>

      <div className="flex justify-center gap-4 mt-2">
        <button
          onClick={handleStartPause}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          title={timer.status === "running" ? "Pause" : "Start"}
        >
          {timer.status === "running" ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white"
          title="Reset"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          onClick={handleDelete}
          className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
          title="Delete"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default TimerCard;
