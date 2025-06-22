# ⏱️ Timer App – HealthFlex

A beautifully designed and mobile-responsive **Timer Management App** built with **React**, **TypeScript**, **Tailwind CSS**, and **React Context API**. Organize, track, and complete tasks with style — perfect for productivity, Pomodoro, workouts, and more.

---

## 🚀 Features

- ✅ Add, Start, Pause, Reset, Delete individual timers
- 📂 Group timers by category (Work, Study, Break, etc.)
- 🌙 Dark mode toggle with persistent theme
- 📊 History page with total time spent and export as JSON
- 🧠 Halfway and completion toast alerts
- 💾 Timers and history saved in local storage
- 📱 Fully mobile responsive and modern UX

---

## 🛠️ Tech Stack

| Tool           | Purpose                  |
|----------------|--------------------------|
| React          | UI framework             |
| TypeScript     | Type safety              |
| Tailwind CSS   | Utility-first styling    |
| React Router   | Page navigation          |
| React Hot Toast| Toast notifications      |
| Lucide Icons   | Clean, minimalist icons  |
| Context API    | Global timer state       |

---

## 📂 Project Structure

/src
- /components # Reusable UI components
- /context # TimerContext (global timer state)
- /pages # Home, Add Timer, History
- /utils # Format helpers (e.g., formatTime.ts)
- App.tsx # Main app router
- index.tsx # Entry point


---

## 🔧 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/noogler-eng/healthflex.git
cd healthflex
```

### 2. Install dependencies
```bash
npm install
```

### 2. Build for production
```bash
npm run build
```

### deployed link 
- deployed link -> https://healthflex-pink.vercel.app
- sourcecode -> https://github.com/noogler-eng/healthflex
