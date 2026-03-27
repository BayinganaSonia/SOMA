require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'fallback-secret-key'; 

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); 

// Database setup
const db = new sqlite3.Database('./soma.db');

// Initialize database tables
db.serialize(() => {
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    full_name TEXT,
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

  // Insert sample data only if tables are empty
  db.get("SELECT COUNT(*) as count FROM lessons", (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO lessons (title, content, audio_text) VALUES
        ('Mathematics', 'Learn basic addition and subtraction.', 'Welcome to mathematics. Two plus two equals four.'),
        ('Science', 'Introduction to plants and nature.', 'Plants need sunlight water and soil to grow.'),
        ('History', 'Ancient civilizations and their contributions.', 'History teaches us about our past and shapes our future.'),
        ('Geography', 'Exploring continents and cultures.', 'Geography helps us understand the world around us.')`);
    }
  });

  db.get("SELECT COUNT(*) as count FROM quizzes", (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO quizzes (question, options, correct_answer) VALUES
        ('What is 2 + 2?', '["3","4","5"]', 1),
        ('What do plants need to grow?', '["Water only","Sunlight only","Sunlight, water and soil"]', 2),
        ('What is the capital of France?', '["London","Paris","Berlin"]', 1)`);
    }
  });
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(403).send('Token required');

  const token = authHeader.split(' ')[1] || authHeader;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}

// Middleware to verify teacher role
function verifyTeacher(req, res, next) {
  const authHeader = req.headers['authorization'];

  console.log("AUTH HEADER:", authHeader); // 👈 ADD THIS

  if (!authHeader) return res.status(403).send('Token required');

  const token = authHeader.split(' ')[1] || authHeader;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("JWT ERROR:", err.message); // 👈 ADD THIS
      return res.status(401).send('Invalid token');
    }

    console.log("DECODED TOKEN:", decoded); // 👈 ADD THIS

    if (decoded.role !== 'teacher') {
      return res.status(403).send('Teacher access required');
    }

    req.userId = decoded.id;
    next();
  });
}

// Routes

// User registration
app.post('/api/register', (req, res) => {
  console.log('Registration attempt:', req.body); // Debug log

  const { full_name, email, username, password, confirmPassword, role = 'student', termsAccepted } = req.body;
  // Removed unused 'phone'

  // Validation (same as frontend)
  if (!username || !password || !full_name) {
    console.log('Validation failed: missing required fields');
    return res.status(400).json({ error: 'Username, password, and full name are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters with letters and numbers' });
  }
  if (!termsAccepted) {
    return res.status(400).json({ error: 'You must accept the terms and conditions' });
  }
  if (role === 'teacher' && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return res.status(400).json({ error: 'Valid email is required for teacher registration' });
  }

  // Helper function to check uniqueness
  function checkUnique(query, params, callback) {
    db.get(query, params, (err, row) => {
      if (err) {
        console.error('DB query error:', err);
        return callback(new Error('Database error'));
      }
      callback(null, row);
    });
  }

  // Check username
  checkUnique('SELECT id FROM users WHERE username = ?', [username], (err, existingUser) => {
    if (err || existingUser) {
      if (existingUser) return res.status(400).json({ error: 'Username already exists' });
      return res.status(500).json({ error: 'Registration failed' });
    }

    // Check email if provided
    if (email) {
      checkUnique('SELECT id FROM users WHERE email = ?', [email], (err, existingEmail) => {
        if (err || existingEmail) {
          if (existingEmail) return res.status(400).json({ error: 'Email already exists' });
          return res.status(500).json({ error: 'Registration failed' });
        }
        insertUser();
      });
    } else {
      insertUser();
    }

    function insertUser() {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error('Bcrypt hash error:', err);
          return res.status(500).json({ error: 'Password hashing failed' });
        }

        db.run(
          'INSERT INTO users (username, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
          [username, full_name, email || null, hash, role],
          function(err) {
            if (err) {
              console.error('Insert error:', err);
              if (err.message.includes('UNIQUE constraint')) {
                return res.status(400).json({ error: 'Username or email already exists' });
              }
              return res.status(500).json({ error: 'Registration failed: Database error' });
            }
            console.log(`✅ User registered: ${username} (${role})`);
            res.status(201).json({ message: 'Registration successful! Please login.' });
          }
        );
      });
    }
  });
});


// User login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err || !user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
      }

      // ✅ FIX: include role inside token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET_KEY
      );

      res.json({ token, role: user.role });
    }
  );
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

// Teacher endpoints
app.post('/api/lessons', verifyTeacher, (req, res) => {
  const { title, content, audio_text } = req.body;
  if (!title || !content || !audio_text) return res.status(400).send('All fields required');

  db.run('INSERT INTO lessons (title, content, audio_text) VALUES (?, ?, ?)', [title, content, audio_text], function(err) {
    if (err) return res.status(500).send('Error adding lesson');
    res.status(201).send('Lesson added');
  });
});

app.post('/api/quizzes', verifyTeacher, (req, res) => {
  const { question, options, correct_answer } = req.body;
  if (!question || !options || correct_answer === undefined) return res.status(400).send('All fields required');

  const optionsStr = JSON.stringify(options);
  db.run('INSERT INTO quizzes (question, options, correct_answer) VALUES (?, ?, ?)', [question, optionsStr, correct_answer], function(err) {
    if (err) return res.status(500).send('Error adding quiz');
    res.status(201).send('Quiz added');
  });
});

app.get('/api/students', verifyTeacher, (req, res) => {
  db.all('SELECT id, username, full_name FROM users WHERE role = "student"', (err, students) => {
    if (err) return res.status(500).send('Error fetching students');
    res.json(students);
  });
});

app.get('/api/students/:id/progress', verifyTeacher, (req, res) => {
  const studentId = req.params.id;
  db.all('SELECT l.title, p.completed FROM progress p JOIN lessons l ON p.lesson_id = l.id WHERE p.user_id = ?',
    [studentId], (err, progress) => {
      if (err) return res.status(500).send('Error fetching student progress');
      res.json(progress);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export for testing