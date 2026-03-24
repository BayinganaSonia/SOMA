# SOMA+ Smart Learning Platform

An interactive audio learning platform with backend support for user authentication, progress tracking, and data persistence.

## Features

- User registration and login (Student/Teacher roles)
- Audio-based lessons with text-to-speech
- Interactive quizzes
- Progress tracking
- Voice commands
- Teacher dashboard for content management
- Responsive design with accessibility features
- Keyboard navigation
- Gesture support

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. For development:
   ```bash
   npm run dev
   ```

5. Run tests:
   ```bash
   npm test
   ```

6. Open your browser and go to `http://localhost:3000`

## Environment Variables

- `PORT`: Server port (default: 3000)
- `SECRET_KEY`: JWT secret key (change in production)
- `NODE_ENV`: Environment mode

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### Lessons
- `GET /api/lessons` - Get all lessons (authenticated)
- `POST /api/lessons` - Add new lesson (teacher only)

### Quizzes
- `GET /api/quiz` - Get quiz questions (authenticated)
- `POST /api/quizzes` - Add new quiz (teacher only)

### Progress
- `POST /api/progress` - Update user progress
- `GET /api/progress` - Get user progress

### Teacher Only
- `GET /api/students` - Get all students
- `GET /api/students/:id/progress` - Get student progress

## Technologies

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Authentication**: JWT, bcryptjs
- **Testing**: Jest, Supertest

## User Roles

- **Student**: Access lessons, quizzes, track progress
- **Teacher**: All student features + content management, student monitoring

## Accessibility Features

- Text-to-speech for audio lessons
- Voice commands
- Keyboard navigation
- High contrast design
- Responsive layout

## Development

The app uses SQLite for simplicity. In production, consider using PostgreSQL or MySQL.

## License

ISC