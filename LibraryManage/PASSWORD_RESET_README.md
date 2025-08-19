# Password Reset System

A complete password reset system for the Library Management application that matches the existing UI style.

## Features

- **Forgot Password Page**
  - Toggle between PRN and Email input methods
  - Matches the existing application's design language
  - Shows loading states and error handling
  - Email-based workflow (token never shown to user)

- **Reset Password Page**
  - Token verification on load
  - Password strength requirements
  - Password matching validation
  - Show/hide password toggle
  - User information display

- **Security Features**
  - Secure token generation (32 bytes)
  - Token hashing with SHA-256
  - Token expiration (1 hour)
  - Password hashing with bcrypt (12 salt rounds)
  - Single-hash password storage (fixed double-hash issue)
  - Email-based reset link delivery

## How It Works

### Backend Flow

1. **Request Password Reset**
   - User provides PRN or Email
   - System generates a secure token
   - Token is hashed and stored in database
   - Token is prepared for email delivery (currently in development mode)

2. **Verify Token**
   - System validates the token hash
   - Checks if token is expired
   - Returns user information if valid

3. **Reset Password**
   - System validates the token again
   - Updates password with proper bcrypt hashing
   - Clears the reset token from database

### Frontend Flow

1. **Forgot Password Page**
   - User enters PRN or Email
   - System sends request to backend
   - Shows success message instructing user to check email
   - In development mode, token is logged to console (not visible to user)

2. **Reset Password Page**
   - Extracts token from URL (received via email)
   - Verifies token with backend
   - Shows user information
   - User enters and confirms new password
   - System updates password

## Email Integration

The system is designed for email delivery of reset links:

- Backend prepares a complete reset URL
- Frontend never displays tokens to users
- Currently in development mode (tokens logged to console)
- Ready for integration with nodemailer or other email service

## Implementation Notes

- Uses the same UI components and styling as the main application
- Responsive design works on all device sizes
- Proper error handling and user feedback
- Secure token handling (never exposed to users in production)

## Fixed Issues

- Fixed double-hashing problem by using `updateOne()` instead of `save()`
- Ensured consistent salt rounds (12) across all password hashing
- Proper token validation and error handling
- Improved security by removing token display from UI

## Routes

- `/forgot-password` - Request password reset
- `/reset-password?token=TOKEN` - Reset password with token (accessed via email link)