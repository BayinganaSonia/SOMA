const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key'; // In production, use environment variable

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from root directory

// Database setup
const db = new sqlite3.Database('./soma.db');

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'student'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    audio_text TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    options TEXT,
    correct_answer INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    lesson_id INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(lesson_id) REFERENCES lessons(id)
  )`);

  // Insert sample data
  db.run(`INSERT OR IGNORE INTO lessons (title, content, audio_text) VALUES
    ('Mathematics', 'Learn basic addition and subtraction.', 'Welcome to mathematics. Two plus two equals four.'),
    ('Science', 'Introduction to plants and nature.', 'Plants need sunlight water and soil to grow.')`);

  db.run(`INSERT OR IGNORE INTO quizzes (question, options, correct_answer) VALUES
    ('What is 2 + 2?', '["3","4","5"]', 1)`);
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token required');

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    req.userId = decoded.id;
    next();
  });
}

// Routes

// User registration
app.post('/api/register', async (req, res) => {
  const { username, password, role = 'student' } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], function(err) {
    if (err) return res.status(400).send('User already exists');
    res.status(201).send('User registered');
  });
});

// User login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY);
    res.json({ token, role: user.role });
  });
});

// Get lessons
app.get('/api/lessons', verifyToken, (req, res) => {
  db.all('SELECT * FROM lessons', (err, lessons) => {
    if (err) return res.status(500).send('Error fetching lessons');
    res.json(lessons);
  });
});

// Get quiz
app.get('/api/quiz', verifyToken, (req, res) => {
  db.all('SELECT * FROM quizzes', (err, quizzes) => {
    if (err) return res.status(500).send('Error fetching quizzes');
    res.json(quizzes);
  });
});

// Update progress
app.post('/api/progress', verifyToken, (req, res) => {
  const { lessonId, completed } = req.body;

  db.run('INSERT OR REPLACE INTO progress (user_id, lesson_id, completed) VALUES (?, ?, ?)',
    [req.userId, lessonId, completed], function(err) {
      if (err) return res.status(500).send('Error updating progress');
      res.send('Progress updated');
    });
});

// Get progress
app.get('/api/progress', verifyToken, (req, res) => {
  db.all('SELECT l.title, p.completed FROM progress p JOIN lessons l ON p.lesson_id = l.id WHERE p.user_id = ?',
    [req.userId], (err, progress) => {
      if (err) return res.status(500).send('Error fetching progress');
      res.json(progress);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});