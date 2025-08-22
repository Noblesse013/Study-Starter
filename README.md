
# 📚 Study Starter

> **Your personal study companion to overcome procrastination and build consistent study habits.**
##  Get Started

Struggling with what to study or how to stay consistent? Study Starter makes it easy to build better study habits, one session at a time.

🔗 **Live App:** [study-starter.vercel.app](https://study-starter.vercel.app)

---



## 💡 Features

* 🗂️ **Course Organization** – Add and organize courses; track per-course time
* ⏱️ **Pomodoro Timer** – Focus/break cycles, desktop notifications, XP on completion
* 📝 **Rich Notes** – Per-course markdown-like notes with live preview and Save
* 🧠 **Flashcards** – Decks per course, flip animation, practice mode, AI generation
* ❓ **Quizzes** – Build MCQs per course and practice with scoring
* 🔔 **Reminders** – Local deadline reminders with desktop notifications
* 🌗 **Dark Mode** – Toggle in the app header (persists)
* 🏅 **Gamification** – XP, levels, and badges; dashboard/profile summary

* 🔀 **Random Course Selector**
  Can't decide what to study first? Let our **shuffle** feature choose a course for you.

* ⏱️ **Study Tracking**
  Track your sessions and see how much time you've dedicated to each course.

* 💬 **Motivation Boost**
  Stay inspired with rotating motivational quotes while you study.

* 📊 **Progress History**
  Review your past sessions and celebrate your study streaks.

* 💥 **Beat Procrastination**
  Designed to help you overcome mental blocks and *just start*.

---

## 🛠️ How It Works

1. **Add Your Courses**
   Input your course names, codes, and topics to organize your workload.

2. **Choose or Shuffle**
   Select a course manually or hit *shuffle* to let the app decide.

3. **Start Studying**
   Click to begin a session — the app tracks your time automatically.

4. **Track Your Progress**
   End your session, and your time is saved. View your session history anytime.

---



## 📦 Getting Started Locally

### 1. Clone the repo

```bash
git clone https://github.com/your-username/study-starter.git
cd study-starter
```

### 2. Install dependencies

```bash
npm install
```


### 3. Run the development server

```bash
npm run dev

### 4. Environment variables

Create a `.env` file in the project root:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

This key is used for AI flashcard generation only and is read at build/start time. There is no UI field to set it.

If you change the key, restart the dev server.

### Using the App

- Add one or more courses in the Dashboard.
- Notes: pick the course (or it shows the only one), write, and click Save. A timestamp appears after saving.
- Flashcards: create cards manually or upload a file to generate cards with AI. Requires `VITE_GEMINI_API_KEY`.
- Quizzes: add questions with four options and select the correct one; practice and get a score.
- Reminders: create date/time reminders; the app will notify you around the due time.
- Pomodoro: start a focus interval; on completion you get a desktop notification and XP.

### Notifications

The app uses the Web Notifications API. Grant permission when prompted. If you denied it, re-enable notifications in your browser settings for the site.

### Troubleshooting

- After removing native/Capacitor setup, ensure your dev server is restarted so Vite drops any cached imports.
- If flashcard AI generation says the API key is missing, confirm `.env` is present and you restarted `npm run dev`.
```

---

## 🌟 Future Features

* Pomodoro Timer
* Custom Quote Uploads
* Daily Streak Tracker
* Study Group Matching

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests to improve the app.




