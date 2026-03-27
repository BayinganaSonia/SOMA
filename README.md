🧠 SOMA+ Smart Learning Platform 🎓


🌍 Overview

SOMA+ is an accessible, audio-first smart learning platform designed to empower blind and visually impaired learners through inclusive digital education.

It combines text-to-speech lessons, interactive assessments, and voice-based navigation to create an engaging, independent learning experience — while enabling teachers to manage content and track student progress in real time.

💡 Built with a mission to promote inclusive education in Rwanda and across Africa.

🚀 Live Demo

👉 https://soma-xrtt.onrender.com

📄 Documentation (SRS)

👉 (https://docs.google.com/document/d/1ebIqLaanNMra0ePfCZMApCf3PG5rULRwB6ccAQ5uYTg/edit?usp=sharing)

🎯 Problem Statement

Many visually impaired learners face barriers in accessing modern education:

Heavy reliance on braille-only learning systems
Limited exposure to digital learning tools
Lack of interactive and adaptive learning experiences
Minimal support for independent learning

This results in reduced digital literacy and limited engagement with modern educational systems.

💡 Solution

SOMA+ provides an inclusive, assistive learning platform that:

🎧 Delivers audio-based lessons (Text-to-Speech)
🧠 Offers interactive quizzes (voice + button input)
📊 Tracks student progress and performance
🎤 Enables voice commands & speech interaction
♿ Supports full accessibility (gestures, keyboard, screen readers)
📴 Works offline-first for low-connectivity environments
🎯 Mission

To empower blind and visually impaired learners with accessible, adaptive, and culturally relevant digital tools that promote independent and inclusive learning.

👥 User Roles

🧑‍🎓 Student

Access audio lessons
Take quizzes (voice or button input)
Receive instant audio feedback
Track progress and completion
Navigate using gestures, keyboard, or voice

👨‍🏫 Teacher

Create and manage lessons & quizzes
Assign learning content
Monitor student performance
Track progress reports

✨ Key Features

🔐 JWT Authentication (Role-based access)
🎧 Audio Lessons (Text-to-Speech)
🧠 Interactive Quizzes (Voice + Manual input)
📊 Real-time Progress Tracking
🎤 Speech Recognition & Voice Commands
⌨️ Keyboard Shortcuts (1–4, Esc)
👆 Gesture Navigation (Swipe support)
📴 Offline-first functionality
♿ Accessibility-first design (TalkBack compatible)
🌙 Responsive dark-themed UI

🧱 Project Structure


SOMA/
├── index.html        # Authentication (Login/Register)
├── dashboard.html    # Role-based dashboard
├── server.js         # Backend (Node.js + Express)
├── package.json      # Dependencies & scripts
├── soma.db           # SQLite database (auto-generated)
└── README.md         # Project documentation

🔄 System Flow


User opens the platform
Registers or logs in
System assigns role (Student / Teacher)
Redirect to dashboard

Student Flow:

Lessons → Quizzes → Audio Feedback → Progress Tracking

Teacher Flow:

Create Content → Assign Lessons → Monitor Students → Analyze Progress

⚙️ Setup Guide (Beginner Friendly)

1️⃣ Install Requirements
Node.js → https://nodejs.org
Git → https://git-scm.com
2️⃣ Clone Repository
git clone <YOUR-GITHUB-REPO-LINK>
cd SOMA
3️⃣ Install Dependencies
npm install
4️⃣ Run the App
npm start
5️⃣ Open in Browser
http://localhost:3000

✅ Database auto-creates (soma.db)
✅ Sample lessons & quizzes included

🔐 Test Access

You can register as:

Student
Teacher
📡 API Endpoints
🔓 Authentication
POST /api/register
POST /api/login
🎓 Student
GET /api/lessons
GET /api/quiz
POST /api/progress
👨‍🏫 Teacher
POST /api/lessons
POST /api/quizzes
GET /api/students
GET /api/students/:id/progress
🗄️ Database (SQLite)

Tables:

users
lessons
quizzes
progress
🛠️ Tech Stack

Backend:

Node.js
Express.js
SQLite3
JWT Authentication
bcrypt

Frontend:

HTML, CSS, JavaScript
Web Speech API
SpeechSynthesis API

Tools:

Nodemon
Jest
♿ Accessibility Features
🔊 Text-to-Speech lessons & feedback
🎤 Voice input for interaction
👆 Gesture-based navigation
⌨️ Keyboard shortcuts
📱 Mobile-first responsive design
🗣️ Screen reader support (TalkBack)
🚀 Deployment
Frontend: Render (Static Hosting)
Backend: Render Web Service
Database: SQLite

🌐 Live App: https://soma-xrtt.onrender.com

🔮 Future Improvements
🤖 AI-powered personalized learning
🌍 Multi-language support (Kinyarwanda, etc.)
📱 Mobile app (Android/iOS)
☁️ Cloud sync & backup
📊 Advanced analytics dashboard
📄 License

ISC License
