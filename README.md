# 🎓 StudyHub - Modern Student Dashboard

**StudyHub** is a modern, responsive, glassmorphic student dashboard web application designed for organizing course subjects, tracking daily study tasks, and running focused Pomodoro study sessions.

![StudyHub Interface](https://img.shields.shields.io/badge/Status-Active-brightgreen) ![HTML5](https://img.shields.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## ✨ Features

- 🏠 **Dashboard & Greeting**: Personal greeting ("Welcome back!") with current date and overall student progress score pill.
- 📚 **Enrolled Subjects Tracking**: Live progress bars and sliders for 6 core subjects:
  - English
  - Economics
  - History
  - Political Science
  - Sociology
  - Arabic
- 📋 **Full Tasks Management (CRUD)**:
  - Add tasks via inline bar on the Dashboard or full modal dialog.
  - Choose subject, set priority (High/Medium/Low), and specify due date.
  - Mark completed with animated strike-through.
  - Delete tasks with 1 click.
  - Dynamic overall progress recalculation.
- ⏱️ **25-Minute Pomodoro Study Timer**:
  - SVG progress ring countdown clock (`25:00`).
  - Modes for 25-min Study, 5-min Short Break, and 15-min Long Break.
  - Web Audio API chime notifications on completion.
  - Completed focus sessions & time tracker.
- 🌙☀️ **Theme Switcher**: Smooth toggle between Light and Dark mode with `localStorage` persistence.
- 📱 **Responsive Layout**: Mobile drawer navigation menu & desktop sidebar.

---

## 🚀 Quick Start

1. Open `index.html` in any browser or run a local HTTP server:
   ```bash
   # Using Python
   python -m http.server 8085
   
   # Or using Node http-server
   npx http-server -p 8085
   ```
2. Open `http://localhost:8085` in your browser.

---

## 🛠️ Project Structure

```
studyhub/
├── index.html         # Main dashboard HTML structure
├── styles.css         # Glassmorphism design system & themes
├── app.js             # State management, tasks CRUD, timer logic
├── server.ps1         # Optional PowerShell HTTP server script
└── .gitignore         # Ignored files
```

---

## 📄 License

MIT License © 2026 StudyHub
