import React from "react";
import { useTimers } from "../context/TimerContext";
import { formatDuration } from "../utils/formatTime";
import { Trash2, Download } from "lucide-react";

const HistoryPage: React.FC = () => {
  const { state, dispatch } = useTimers();
  const { history } = state;

  const totalTimers = history.length;
  const totalSeconds = history.reduce((acc, timer) => acc + timer.duration, 0);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalTimeFormatted = formatDuration(totalSeconds);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      dispatch({ type: "CLEAR_HISTORY" });
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "timer_history.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          📜 Timer History
        </h1>
        {history.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow transition"
            >
              <Download size={16} />
              Download JSON
            </button>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow transition"
            >
              <Trash2 size={16} />
              Clear History
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total Timers Completed
          </p>
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalTimers}
          </h2>
        </div>
        <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total Time Spent (Minutes)
          </p>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalMinutes} min
          </h2>
        </div>
        <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total Time (HH:MM:SS)
          </p>
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {totalTimeFormatted}
          </h2>
        </div>
      </div>

      {/* History Items */}
      {history.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No timers have been completed yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {history
            .slice()
            .reverse()
            .map((timer) => (
              <div
                key={timer.id}
                className="p-5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {timer.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {timer.category}
                </p>
                <div className="mt-2 text-blue-600 dark:text-blue-400 font-mono text-xl">
                  {formatDuration(timer.duration)}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Completed at {new Date(timer.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
