# TRUTHSEEKER - Authentication System

This application now includes a complete authentication system with login and signup functionality, and **user-specific verification logs**.

## Features Added

### Backend Authentication

- **User Model**: MongoDB schema with email, password (hashed), name, and timestamps
- **JWT Authentication**: Secure token-based authentication with 7-day expiration
- **Password Hashing**: Bcrypt for secure password storage
- **API Endpoints**:
  - `POST /api/auth/signup` - Create new account
  - `POST /api/auth/login` - Sign in to existing account
  - `GET /api/auth/profile` - Get user profile (protected route)

### Frontend Authentication

- **Login Page**: Modern UI with email/password form
- **Signup Page**: Registration form with name, email, password, and confirmation
- **Authentication Context**: React context for managing user state
- **Protected Navigation**: Dynamic navigation based on authentication status
- **User Welcome**: Displays user name when logged in

### User-Specific Verification Logs

- **Personal Logs**: Each user can only see their own verification history
- **Protected API**: All verification endpoints require authentication
- **User Association**: Verification events are automatically associated with the logged-in user's email
- **Secure Access**: Users must be logged in to submit claims or view logs

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Sign Up**: Visit `/signup` to create a new account
2. **Login**: Visit `/login` to sign in to your account
3. **Submit Claims**: Only logged-in users can submit claims for verification
4. **View Logs**: Each user sees only their own verification history
5. **Navigation**: The navigation bar will show Login/Signup when not authenticated, and Logout with user name when authenticated
6. **Logout**: Click the Logout button to sign out

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup

Create a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/login

Sign in to an existing account.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### GET /api/auth/profile

Get user profile (requires authentication).

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "user": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Verification Endpoints (Protected)

#### POST /api/verify-event

Submit a claim for verification (requires authentication).

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "claim": "There was an earthquake in California yesterday"
}
```

**Response:**

```json
{
  "claim": "There was an earthquake in California yesterday",
  "extraction": { "event": "earthquake", "location": "California", "time": "yesterday" },
  "evidence": [...],
  "verification": { "result": "true", "reasoning": "..." },
  "id": "verification_event_id"
}
```

#### GET /api/verify-event/logs

Get user's verification history (requires authentication).

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
[
  {
    "_id": "event_id",
    "claim": "There was an earthquake in California yesterday",
    "extraction": { "event": "earthquake", "location": "California", "time": "yesterday" },
    "evidence": [...],
    "verification": { "result": "true", "reasoning": "..." },
    "userEmail": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling and user feedback
- **Rate Limiting**: API rate limiting to prevent abuse
- **User Isolation**: Each user can only access their own data
- **Protected Routes**: All verification endpoints require authentication

## User Experience Features

- **Login Prompts**: Clear prompts when users try to access protected features without authentication
- **Seamless Navigation**: Dynamic navigation that adapts to authentication status
- **Personal Dashboard**: Each user sees only their verification history
- **Error Handling**: User-friendly error messages and guidance

## Dependencies Added

### Backend

- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token generation and verification

### Frontend

- React Context for state management
- Custom UI components for forms and alerts

## File Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── VerificationEvent.js (updated with userEmail field)
│   ├── routes/
│   │   ├── auth.js
│   │   └── verifyEvent.js (updated with authentication)
│   ├── utils/
│   │   └── auth.js
│   └── app.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── LandingPage.jsx (updated with auth)
    │   │   ├── LogsPage.jsx (updated with auth)
    │   │   └── ui/
    │   │       ├── input.jsx
    │   │       └── label.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   └── App.jsx
    └── package.json
```

## Database Changes

The `VerificationEvent` model has been updated to include a `userEmail` field, ensuring that each verification event is associated with the user who submitted it. This allows for:

- **User-specific logs**: Each user only sees their own verification history
- **Data isolation**: Complete separation of user data
- **Audit trail**: Track which user submitted each verification request
