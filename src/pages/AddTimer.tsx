import { useState } from "react";
import { useTimers } from "../context/TimerContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const commonCategories = [
  "Work",
  "Exercise",
  "Study",
  "Cooking",
  "Break",
  "Meditation",
  "Reading",
];

const commonDurations = [
  { label: "1 min", hours: 0, minutes: 1, seconds: 0 },
  { label: "5 min", hours: 0, minutes: 5, seconds: 0 },
  { label: "10 min", hours: 0, minutes: 10, seconds: 0 },
  { label: "15 min", hours: 0, minutes: 15, seconds: 0 },
  { label: "25 min", hours: 0, minutes: 25, seconds: 0 },
  { label: "30 min", hours: 0, minutes: 30, seconds: 0 },
  { label: "1 hour", hours: 1, minutes: 0, seconds: 0 },
];

const formatTime = (v: string, max: number) => {
  const n = parseInt(v) || 0;
  return Math.min(Math.max(n, 0), max).toString();
};

export default function AddTimer() {
  const { dispatch } = useTimers();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");

  const validate = () => {
    if (!name.trim()) return toast.error("Please enter a timer name");
    if (!category.trim()) return toast.error("Please enter a category");
    const total =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    if (total <= 0) return toast.error("Duration must be greater than 0");
    if (total > 86400) return toast.error("Duration cannot exceed 24 hours");
    return true;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const duration =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

    dispatch({
      type: "ADD_TIMER",
      payload: {
        id: Date.now().toString(),
        name: name.trim(),
        category: category.trim(),
        duration,
        remaining: duration,
        status: "paused",
        halfwayAlertTriggered: false,
        createdAt: new Date().toISOString(),
      },
    });

    toast.success("Timer created!");
    navigate("/");
  };

  const setQuickDuration = (d: (typeof commonDurations)[0]) => {
    setHours(d.hours.toString());
    setMinutes(d.minutes.toString());
    setSeconds(d.seconds.toString());
  };

  return (
    <div className="bg-white dark:bg-zinc-900 w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 bg-white dark:bg-zinc-900 min-h-screen rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-zinc-900 dark:text-white mb-8">
          Create a New Timer
        </h1>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Timer Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g. Pomodoro"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Category Input */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="E.g. Study"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {commonCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                type="button"
                className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                  category === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Inputs */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Duration
          </label>
          <div className="flex gap-4 mb-4">
            {[
              { label: "Hours", val: hours, set: setHours, max: 23 },
              { label: "Minutes", val: minutes, set: setMinutes, max: 59 },
              { label: "Seconds", val: seconds, set: setSeconds, max: 59 },
            ].map((time) => (
              <div key={time.label}>
                <input
                  type="number"
                  value={time.val}
                  onChange={(e) =>
                    time.set(formatTime(e.target.value, time.max))
                  }
                  className="w-20 text-center py-2 px-2 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs mt-1 text-center text-gray-500 dark:text-gray-400">
                  {time.label}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Durations */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {commonDurations.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => setQuickDuration(d)}
                className="text-sm px-3 py-1 rounded-full border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-600 transition"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Preview */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Preview
          </p>
          <div className="p-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {name || "Timer Name"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {category || "Category"}
            </p>
            <p className="text-xl font-mono text-blue-600 dark:text-blue-400 mt-2">
              {`${hours.padStart(2, "0")}:${minutes.padStart(
                2,
                "0"
              )}:${seconds.padStart(2, "0")}`}
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleCreate}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-md"
        >
          Create Timer
        </button>
      </div>
    </div>
  );
}
