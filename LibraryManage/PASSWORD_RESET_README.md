# Password Reset System

A complete password reset system for the Library Management application that matches the existing UI style.

## Features

- **Forgot Password Page**
  - Toggle between PRN and Email input methods
  - Matches the existing application's design language
  - Shows loading states and error handling

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

## How It Works

### Backend Flow

1. **Request Password Reset**
   - User provides PRN or Email
   - System generates a secure token
   - Token is hashed and stored in database
   - Token is returned in response (for testing)

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
   - Shows success message with reset link
   - Redirects to reset password page

2. **Reset Password Page**
   - Extracts token from URL
   - Verifies token with backend
   - Shows user information
   - User enters and confirms new password
   - System updates password

## Testing

Visit `/forgot-password` to start the password reset process. For testing purposes, the reset token is shown directly in the UI and in console logs.

## Implementation Notes

- Uses the same UI components and styling as the main application
- Responsive design works on all device sizes
- Proper error handling and user feedback
- No external APIs or email sending required

## Fixed Issues

- Fixed double-hashing problem by using `updateOne()` instead of `save()`
- Ensured consistent salt rounds (12) across all password hashing
- Proper token validation and error handling

## Routes

- `/forgot-password` - Request password reset
- `/reset-password?token=TOKEN` - Reset password with token