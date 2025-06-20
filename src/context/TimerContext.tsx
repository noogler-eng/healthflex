import React, { createContext, useReducer, useContext, useEffect } from "react";

// Timer type
export type Timer = {
  id: string;
  name: string;
  category: string;
  duration: number;
  remaining: number;
  status: "running" | "paused" | "finished";
  halfwayAlertTriggered: boolean;
  createdAt: string;
};

// State type
type TimerState = {
  timers: Timer[];
  history: Timer[];
};

// Action types
type Action =
  | { type: "ADD_TIMER"; payload: Timer }
  | { type: "START_TIMER"; payload: string }
  | { type: "PAUSE_TIMER"; payload: string }
  | { type: "DELETE_TIMER"; payload: string }
  | { type: "TICK_TIMER"; payload: string }
  | { type: "RESET_TIMER"; payload: string }
  | { type: "SET_STATE"; payload: TimerState }
  | { type: "CLEAR_HISTORY" };

// Initial state
const initialState: TimerState = {
  timers: [],
  history: [],
};

// Reducer
function timerReducer(state: TimerState, action: Action): TimerState {
  switch (action.type) {
    case "SET_STATE":
      return action.payload;

    case "ADD_TIMER":
      return { ...state, timers: [...state.timers, action.payload] };

    case "START_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload ? { ...timer, status: "running" } : timer
        ),
      };

    case "PAUSE_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload ? { ...timer, status: "paused" } : timer
        ),
      };

    case "RESET_TIMER":
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? {
                ...timer,
                remaining: timer.duration,
                status: "paused",
                halfwayAlertTriggered: false,
              }
            : timer
        ),
      };

    case "DELETE_TIMER":
      return {
        ...state,
        timers: state.timers.filter((timer) => timer.id !== action.payload),
      };

    case "TICK_TIMER": {
      const updatedTimers: Timer[] = [];
      const finishedTimers: Timer[] = [];

      for (const timer of state.timers) {
        if (timer.id === action.payload && timer.status === "running") {
          const newRemaining = Math.max(timer.remaining - 1, 0);

          const updatedTimer: Timer = {
            ...timer,
            remaining: newRemaining,
            status: newRemaining === 0 ? "finished" : "running",
            halfwayAlertTriggered:
              timer.halfwayAlertTriggered ||
              newRemaining === Math.floor(timer.duration / 2),
          };

          if (newRemaining === 0) {
            finishedTimers.push(updatedTimer);
          } else {
            updatedTimers.push(updatedTimer);
          }
        } else {
          updatedTimers.push(timer);
        }
      }

      return {
        ...state,
        timers: updatedTimers,
        history: [...state.history, ...finishedTimers],
      };
    }

    case "CLEAR_HISTORY":
      return {
        ...state,
        history: [],
      };

    default:
      return state;
  }
}

// Create context
const TimerContext = createContext<{
  state: TimerState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider
export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("timers_state");
    if (saved) {
      try {
        const parsed: TimerState = JSON.parse(saved);
        dispatch({ type: "SET_STATE", payload: parsed });
      } catch (error) {
        console.error("Failed to parse timers_state from localStorage", error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("timers_state", JSON.stringify(state));
  }, [state]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};

// Hook
export const useTimers = () => useContext(TimerContext);
