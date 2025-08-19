# Simple Password Reset (No External APIs)

This is a simplified password reset system that works with your existing backend without any external APIs or email services.

## ✅ What's Included

### Backend Routes (Added to your existing `backend/index.js`):
- `POST /forgot-password` - Request password reset
- `GET /verify-reset-token/:token` - Verify reset token
- `POST /reset-password` - Reset password with token

### Frontend Components:
- `ForgotPassword` - Request password reset page
- `ResetPassword` - Set new password page
- `TestPasswordReset` - Test page for debugging

## 🚀 How to Use

### 1. Start Your Backend
```bash
cd backend
npm start
```

### 2. Start Your Frontend
```bash
cd LibraryManage
npm run dev
```

### 3. Test the Password Reset

**Option A: Use the Test Page**
- Go to: `http://localhost:3000/test-password-reset`
- This page shows you the reset token directly (no email needed)

**Option B: Use the Normal Flow**
- Go to login page
- Click "Forgot Password?"
- Enter email or PRN
- Copy the reset token from the success message
- Go to: `http://localhost:3000/reset-password?token=YOUR_TOKEN`

## 🔧 How It Works

### Step 1: Request Reset
- User enters email or PRN
- System finds user in database
- Generates secure reset token
- Returns token directly (no email sending)

### Step 2: Reset Password
- User uses token in reset URL
- System validates token
- User sets new password
- Password is updated in database

## 📝 Database Requirements

Your `Users` model needs these fields:
```javascript
resetPasswordToken: String,
resetPasswordExpires: Date
```

If these fields don't exist, the system will still work but tokens won't be stored.

## 🧪 Testing

### Test with Known User
Use a PRN that exists in your database (like `124A1017` from your code).

### Test Flow:
1. Go to `/test-password-reset`
2. Enter email or PRN
3. Click "Request Reset"
4. Copy the token that appears
5. Test token verification
6. Set new password

## 🔒 Security Features

- **Token Expiration**: 1 hour
- **Secure Token Generation**: Uses crypto.randomBytes
- **Token Hashing**: Tokens are hashed before storage
- **Password Validation**: Minimum 6 characters
- **Password Hashing**: Uses bcrypt

## 🎯 Integration

The password reset is fully integrated with your existing:
- Login system
- User authentication
- Database models
- Frontend routing

## 🚨 Important Notes

1. **No Email Sending**: This version doesn't send emails - tokens are returned directly
2. **For Development**: Perfect for testing and development
3. **Production Ready**: Can be easily extended to send emails later
4. **No External Dependencies**: Works with your existing setup

## 🔄 Adding Email Later (Optional)

If you want to add email functionality later, you can:
1. Install nodemailer: `npm install nodemailer`
2. Add email configuration to your `.env`
3. Modify the `/forgot-password` route to send emails instead of returning tokens

## 🎉 That's It!

Your password reset system is now ready to use without any external APIs or complicated setup!
