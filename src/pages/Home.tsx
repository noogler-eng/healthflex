import { useEffect, useState } from "react";
import { useTimers } from "../context/TimerContext";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Play,
  Pause,
  RotateCw,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

const formatTime = (seconds: number): string => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export default function Home() {
  const { state, dispatch } = useTimers();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      state.timers.forEach((timer) => {
        if (timer.status === "running" && timer.remaining > 0) {
          if (timer.remaining === Math.floor(timer.duration / 2)) {
            toast.success(`${timer.name} is halfway done!`);
          }
          if (timer.remaining === 1) {
            toast.success(`${timer.name} is completed!`);
          }
          dispatch({ type: "TICK_TIMER", payload: timer.id });
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.timers, dispatch]);

  const grouped = state.timers.reduce((acc, t) => {
    const cat = t.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {} as Record<string, typeof state.timers>);

  const toggle = (cat: string) => {
    setExpanded((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleStartAll = () =>
    state.timers.forEach((t) =>
      dispatch({ type: "START_TIMER", payload: t.id })
    );
  const handlePauseAll = () =>
    state.timers.forEach((t) =>
      dispatch({ type: "PAUSE_TIMER", payload: t.id })
    );
  const handleDeleteAll = () =>
    state.timers.forEach((t) =>
      dispatch({ type: "DELETE_TIMER", payload: t.id })
    );

  const isEmpty = state.timers.length === 0;

  return (
    <div className="px-4 py-8 md:px-10 bg-gray-50 dark:bg-zinc-900 min-h-screen transition-colors">
      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Time Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md">
          Stay focused. Track your time. Balance work and breaks like a pro.
        </p>
      </div>

      {/* Controls */}
      {!isEmpty && (
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={handleStartAll}
            className="flex items-center gap-1 px-4 py-2 rounded border bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-black dark:text-white shadow"
          >
            <Play size={16} />{" "}
            <span className="hidden sm:inline">Start All</span>
          </button>
          <button
            onClick={handlePauseAll}
            className="flex items-center gap-1 px-4 py-2 rounded border bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-black dark:text-white shadow"
          >
            <Pause size={16} />{" "}
            <span className="hidden sm:inline">Pause All</span>
          </button>
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-1 px-4 py-2 rounded border bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-black dark:text-white shadow"
          >
            <Trash2 size={16} />{" "}
            <span className="hidden sm:inline">Delete All</span>
          </button>
        </div>
      )}

      {/* Add Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/add")}
          className="flex items-center gap-2 text-white bg-black dark:bg-white dark:text-black hover:opacity-90 px-4 py-2 rounded shadow"
        >
          <Plus size={18} /> New Timer
        </button>
      </div>

      {/* Timers */}
      {isEmpty ? (
        <div className="text-center py-20">
          <h2 className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-2">
            No timers yet.
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Create your first timer to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(grouped).map((cat) => {
            const timers = grouped[cat];
            const expandedCat = expanded.includes(cat);

            return (
              <div
                key={cat}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-md px-4 py-3"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggle(cat)}
                >
                  <div className="flex items-center gap-2">
                    {expandedCat ? (
                      <ChevronDown className="text-gray-800 dark:text-white" />
                    ) : (
                      <ChevronRight className="text-gray-800 dark:text-white" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {cat}{" "}
                      <span className="text-sm text-gray-500">
                        ({timers.length})
                      </span>
                    </h3>
                  </div>
                </div>

                {expandedCat && (
                  <div className="mt-4 space-y-3">
                    {timers.map((t) => (
                      <div
                        key={t.id}
                        className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                      >
                        <div className="mb-2 md:mb-0">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {t.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-zinc-400">
                            {formatTime(t.remaining)}{" "}
                            <span className="ml-2 text-xs bg-gray-200 dark:bg-zinc-700 px-2 py-0.5 rounded">
                              {t.status}
                            </span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {t.status === "running" ? (
                            <button
                              onClick={() =>
                                dispatch({ type: "PAUSE_TIMER", payload: t.id })
                              }
                              className="flex items-center gap-1 px-3 py-1 rounded border bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 text-black dark:text-white"
                            >
                              <Pause size={16} />
                              <span className="hidden sm:inline">Pause</span>
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                dispatch({ type: "START_TIMER", payload: t.id })
                              }
                              className="flex items-center gap-1 px-3 py-1 rounded border bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 text-black dark:text-white"
                            >
                              <Play size={16} />
                              <span className="hidden sm:inline">Start</span>
                            </button>
                          )}
                          <button
                            onClick={() =>
                              dispatch({ type: "RESET_TIMER", payload: t.id })
                            }
                            className="flex items-center gap-1 px-3 py-1 rounded border bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 text-black dark:text-white"
                          >
                            <RotateCw size={16} />
                            <span className="hidden sm:inline">Reset</span>
                          </button>
                          <button
                            onClick={() =>
                              dispatch({ type: "DELETE_TIMER", payload: t.id })
                            }
                            className="flex items-center gap-1 px-3 py-1 rounded border bg-white dark:bg-zinc-700 hover:bg-red-100 dark:hover:bg-zinc-600 text-red-600 dark:text-red-400"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
