# HappyGamse

Game community platform built with Spring Boot and React.

## Tech Stack

### Backend
- **Framework**: Spring Boot 2.7.5
- **Language**: Java 17
- **Database**: MariaDB with MyBatis 2.2.2
- **Security**: Spring Security (session-based authentication)
- **WebSocket**: Spring WebSocket for real-time communication

### Frontend
- **Framework**: React 18.2.0
- **UI Library**: React Bootstrap 2.6.0
- **Routing**: React Router 6.16.0
- **State Management**: Zustand 4.5.0 + Context API
- **HTTP Client**: Axios 1.2.2

## Project Structure

```
HappyGamse/
├── src/
│   ├── main/
│   │   ├── java/com/example/happyusf/    # Spring Boot backend
│   │   ├── resources/
│   │   │   ├── mapper/                    # MyBatis XML mappers
│   │   │   └── static/                    # React build output
│   │   └── happyus_front/                 # React frontend source
│   │       ├── src/
│   │       │   ├── Pages/                 # React pages
│   │       │   ├── contexts/              # Context providers
│   │       │   ├── hooks/                 # Custom hooks
│   │       │   └── utils/                 # Utility functions
│   │       └── public/                    # Public assets
│   └── test/                              # Backend tests
├── build.gradle                           # Gradle build configuration
└── README.md
```

## Features

### Authentication
- User registration with phone verification
- Login/Logout
- Password reset
- Account recovery (find ID by phone number)
- Session management (30-minute timeout)
- Maximum 1 concurrent session per user

### Community Features
- Game news
- Community boards
- Voice/text channels
- Friend system
- Real-time chat via WebSocket

## Development Setup

### Prerequisites
- Java 17 or higher
- Node.js 14+ and npm
- MariaDB 10.6+

### Backend Setup

1. Configure database connection in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:log4jdbc:mariadb://127.0.0.1:3306/happyus
spring.datasource.username=your_username
spring.datasource.password=your_password
```

2. Build and run the Spring Boot application:
```bash
./gradlew bootRun
```

The backend will start on `http://localhost:8080`

### Frontend Setup

The React frontend is automatically built and deployed as part of the Gradle build process.

For development with hot reload:

```bash
cd src/main/happyus_front
npm install
npm start
```

This starts the development server on `http://localhost:3000` with proxy to backend.

### Full Build

To build the entire project (backend + frontend):

```bash
./gradlew build
```

This will:
1. Install npm dependencies (if package.json changed)
2. Build React app (`npm run build`)
3. Copy React build to `src/main/resources/static/`
4. Compile Java code
5. Run tests
6. Package as executable JAR

## Testing

### Backend Tests
```bash
./gradlew test
```

### Frontend Tests
```bash
cd src/main/happyus_front
npm test
```

## Architecture Notes

### React SPA Migration (Completed)

This project was migrated from Thymeleaf server-side rendering to React SPA for authentication pages:

- **Migrated Pages**:
  - Login (`/login`)
  - Signup (`/signup`)
  - Agreement (`/agreement`)
  - Find Account (`/find-account`)

- **Legacy URL Support**: Old Thymeleaf URLs redirect to new React routes via `AccountViewController`

- **Authentication Flow**:
  1. React frontend handles all UI rendering
  2. Form validation on client-side using `utils/validation.js`
  3. API calls to Spring Boot backend for authentication
  4. Session managed by Spring Security
  5. Protected routes wrapped with `ProtectedRoute` component

### API Endpoints

#### Public Endpoints
- `POST /loginAction` - User login
- `POST /request/join` - User registration
- `POST /request/findIdByMobile` - Find user ID
- `POST /request/resetPasswordByMobile` - Reset password
- `POST /request/account/verificationCode` - Request phone verification code
- `POST /request/verification` - Verify phone code
- `GET /api/terms/service` - Get service terms
- `GET /api/terms/privacy` - Get privacy policy
- `GET /api/is-authenticated` - Check authentication status

#### Protected Endpoints (require authentication)
- `GET /api/**` - General API endpoints
- `GET /user/**` - User-specific pages
- `GET /friend/channel/**` - Friend channel features

## Deployment

Build the executable JAR:

```bash
./gradlew bootJar
```

Run the JAR:

```bash
java -jar build/libs/HappyGamse-0.0.1-SNAPSHOT.jar
```

## Migration Documentation

For detailed migration information, see:
- `MIGRATION_PLAN.md` - Technical migration guide
- `PRD_REACT_MIGRATION.md` - Product requirements
- `SHRIMP_TASK_PLAN.md` - Task breakdown

## License

Proprietary
