# SOMA+ Smart Learning Platform 🧠🎓

[![Status](https://img.shields.io/badge/Status-Working-blue?style=flat&logo=vercel)](http://localhost:3000)

An interactive **audio-first learning platform** with full backend support for user authentication, role-based dashboards, progress tracking, content management, and voice accessibility. Students learn via TTS lessons/quizzes; teachers manage content & monitor students.

## 🚀 Quick Start

```bash
git clone <repo> && cd SOMA
npm install
npm start
# Open http://localhost:3000
```

**Auto-setup**: SQLite DB (`soma.db`) created on first run with sample lessons/quizzes.

## 📋 Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Development mode** (auto-restart):
   ```bash
   npm run dev
   ```

3. **Production**:
   ```bash
   npm start
   ```

4. **Open browser**: `http://localhost:3000` (serves index.html login).

5. **Test** (if implemented):
   ```bash
   npm test
   ```

No `.env` required (fallback keys; override `PORT`/`SECRET_KEY` for prod).

## 🏗️ Project Structure

```
SOMA/
├── index.html          # Login/Register (Student/Teacher)
├── dashboard.html      # Main app (lessons, quizzes, progress, teacher dashboard)
├── server.js           # Express API + static file server
├── package.json        # Node deps/scripts
├── soma.db             # SQLite DB (auto-created)
└── README.md
```

Flow: `index.html` (auth) → `dashboard.html` (dashboard based on role).

## ✨ Features

- 🔐 JWT Authentication (Student/Teacher roles)
- 📚 Audio Lessons (TTS text-to-speech)
- 🧠 Interactive Quizzes (text + voice answers)
- 📊 Real-time Progress Tracking
- 👥 Role-based Dashboards
- 🎤 Voice Commands & Speech Recognition
- ⌨️ Keyboard Shortcuts (1-4, Esc)
- 👆 Gesture Support (swipe back)
- ♿ Full Accessibility
- 📱 Responsive Dark Theme (animations)

## 👥 User Roles

### Student 🧑‍🎓
- Access lessons (audio playback)
- Take quizzes (buttons + voice answers like "two")
- View personal progress (% complete, TTS summary)
- Voice navigation/commands

**Dashboard Cards**: Lessons, Quiz, Progress, Voice, Help, Logout.

### Teacher 🧑‍🏫
- **All student features** +:
  - 👥 **View Students**: List all students + individual progress.
  - +📖 **Add Lessons**: Title, content, TTS audio text.
  - +🧠 **Add Quizzes**: Question, options (comma-separated), correct index (0-based).
  
**Dashboard Cards**: Lessons, Students, Add Lesson, Add Quiz, Voice, Help, Logout.

## 🎛️ Client-Side Features

- **Navigation**: Click cards or voice/hotkeys (1=Lessons, 2=Quiz, 3=Progress, 4=Teacher Dashboard, Esc=Home).
- **Voice**: TTS for lessons/progress, speech-to-answer quizzes, command nav ("lesson"/"quiz").
- **UI**: Dynamic cards, toasts, animations, mouse-follow bg.

## ♿ Accessibility Features

- **Text-to-Speech**: All lessons, progress summaries, feedback.
- **Voice Input**: Quiz answers (numbers/words), full navigation.
- **Keyboard**: 1/Lessons, 2/Quiz, 3/Progress, 4/Teacher, Esc=Home.
- **Gestures**: Swipe left→right to go home.
- **Visual**: High-contrast dark theme, progress bars, ARIA-ready buttons.
- **Responsive**: Mobile-first, touch-friendly.

## 🗄️ Database (SQLite)

Auto-created tables:
- `users`: id, username, email, full_name, phone, password, role.
- `lessons`: id, title, content, audio_text.
- `quizzes`: id, question, options (JSON), correct_answer (index).
- `progress`: user_id, lesson_id, completed.

**Sample Data**: 4 lessons (Math/Science/History/Geography), 3 quizzes inserted on startup.

## 📡 API Endpoints

**Auth** (no token):
- `POST /api/register` Body: `{username, password, confirmPassword, full_name, email?, phone?, role, termsAccepted}`
- `POST /api/login` → `{token, role}`

**Student** (`Authorization: Bearer <token>`):
- `GET /api/lessons`
- `GET /api/quiz`
- `POST /api/progress` `{lessonId, completed}`

**All Authenticated**:
- `GET /api/progress`

**Teacher Only**:
- `POST /api/lessons` `{title, content, audio_text}`
- `POST /api/quizzes` `{question, options[], correct_answer}`
- `GET /api/students` → list
- `GET /api/students/:id/progress`

## 🛠️ Technologies

- **Backend**: Node.js, Express, SQLite3, JWT, bcrypt
- **Frontend**: Vanilla HTML/CSS/JS, SpeechSynthesis API, Web Speech API
- **Tools**: Nodemon (dev), Jest (tests)
- **UI**: Responsive CSS Grid, CSS Animations, Backdrop Filters

## 🔧 Development

- **No extra setup**: Runs in browser + Node.
- **Prod**: Set `NODE_ENV=production`, strong `SECRET_KEY`, migrate to PostgreSQL.
- **Extend**: Add tests (`test.js`), CSS to `public/`, more APIs.
- **Demo**: `npm start && open http://localhost:3000`

## 📱 Live Demo

Serve locally or deploy to Vercel/Netlify (static) + Render (API).

## 📄 License

ISC

