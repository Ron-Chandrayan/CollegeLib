# Password Reset Functionality

This document describes the password reset functionality implemented in the SIES Library Management System.

## Overview

The password reset system allows users to reset their passwords securely through email verification. The system consists of:

1. **Forgot Password Page** - Where users can request a password reset
2. **Reset Password Page** - Where users can set a new password using a token from email
3. **Backend API** - Handles the password reset logic and email sending

## Frontend Components

### 1. ForgotPassword Component (`/forgot-password`)
- **Location**: `src/components/PasswordReset/ForgotPassword.jsx`
- **Features**:
  - Toggle between email and PRN input methods
  - Form validation
  - Loading states
  - Success/error notifications
  - Responsive design with Tailwind CSS

### 2. ResetPassword Component (`/reset-password`)
- **Location**: `src/components/PasswordReset/ResetPassword.jsx`
- **Features**:
  - Token validation from URL parameters
  - Password strength validation
  - Password confirmation matching
  - Show/hide password toggles
  - User information display
  - Real-time password match indicator

## Backend API Endpoints

### 1. Request Password Reset
- **Endpoint**: `POST /api/auth/forgot-password`
- **Body**: `{ email?: string, PRN?: string }`
- **Response**: Success/error message

### 2. Verify Reset Token
- **Endpoint**: `GET /api/auth/verify-reset-token/:token`
- **Response**: User information if token is valid

### 3. Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Body**: `{ token: string, newPassword: string, confirmPassword: string }`
- **Response**: Success/error message

## Email Templates

The system sends two types of emails:

1. **Password Reset Email** - Contains the reset link with token
2. **Password Reset Confirmation** - Sent after successful password reset

Both emails are styled with HTML and include:
- SIES Library branding
- Clear instructions
- Security warnings
- Expiration information

## Security Features

- **Token Expiration**: Reset tokens expire after 1 hour
- **Secure Token Generation**: Uses crypto.randomBytes for token generation
- **Token Hashing**: Tokens are hashed before storage
- **Password Validation**: Minimum 6 characters required
- **Email Verification**: Confirmation emails sent for security

## Usage Flow

1. User clicks "Forgot Password?" on login page
2. User enters email or PRN on forgot password page
3. System sends reset email with secure token
4. User clicks link in email (goes to `/reset-password?token=...`)
5. User enters new password and confirmation
6. System validates token and updates password
7. User receives confirmation email
8. User can now login with new password

## Development Setup

### Frontend
```bash
cd LibraryManage
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
# Add start script to package.json
npm start
```

### Environment Variables Required

**Backend (.env)**:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
MONGO_URI=your-mongodb-connection-string
```

**Frontend (.env)**:
```
VITE_API_URL=your-backend-url
VITE_SECRET_KEY=your-api-key
```

## Styling

The components use Tailwind CSS for styling and include:
- Gradient backgrounds
- Responsive design
- Loading animations
- Hover effects
- Form validation styling
- Success/error state indicators

## Integration

The password reset functionality is integrated into the existing login form by adding a "Forgot Password?" link that appears only when the user is in login mode (not signup mode).

## Error Handling

- Invalid/expired tokens redirect to forgot password page
- Network errors show user-friendly messages
- Form validation prevents invalid submissions
- Loading states prevent multiple submissions
