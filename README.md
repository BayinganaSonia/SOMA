# SOMA+ Smart Learning Platform

An interactive audio learning platform with backend support for user authentication, progress tracking, and data persistence.

## Features

- User registration and login
- Audio-based lessons
- Quiz functionality
- Progress tracking
- Voice commands
- Teacher dashboard
- Responsive design

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and go to `http://localhost:3000`

## Technologies

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express, SQLite
- Authentication: JWT
- Database: SQLite3

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/lessons` - Get all lessons
- `GET /api/quiz` - Get quiz questions
- `POST /api/progress` - Update user progress
- `GET /api/progress` - Get user progress