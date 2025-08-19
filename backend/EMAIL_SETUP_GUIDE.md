# Email Setup Guide for Password Reset

This guide will help you set up email sending for the password reset functionality using Gmail SMTP.

## 1. Required Environment Variables

Add these to your `.env` file:

```
# Email Configuration
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL (for email links)
FRONTEND_URL=https://library-sies-92fbc1e81669.herokuapp.com
```

## 2. Creating a Gmail App Password

For security reasons, Gmail requires an "App Password" instead of your regular password:

1. **Enable 2-Step Verification**:
   - Go to your Google Account: https://myaccount.google.com/
   - Select "Security"
   - Under "Signing in to Google," select "2-Step Verification" and turn it on

2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "App" dropdown and choose "Mail"
   - Select "Device" dropdown and choose "Other (Custom name)"
   - Enter "Library App" or another descriptive name
   - Click "Generate"
   - Google will display a 16-character app password
   - Copy this password and use it as your `EMAIL_PASS` in the `.env` file

## 3. Testing Email Configuration

Use the built-in test endpoint to verify your email setup:

```
GET /test-email?email=your_test_email@example.com
```

This will send a test email and return the result.

## 4. Troubleshooting

If emails are not sending:

1. **Check Environment Variables**:
   - Verify `EMAIL_USER` and `EMAIL_PASS` are correctly set in `.env`
   - Make sure there are no spaces or quotes around the values

2. **App Password Issues**:
   - Ensure you've generated an App Password, not using your regular password
   - App Password should be 16 characters with no spaces

3. **Gmail Security**:
   - Check if you received a "Critical security alert" from Google
   - You might need to confirm the login attempt in your Google account

4. **Gmail Sending Limits**:
   - Free Gmail accounts have sending limits (around 500 emails per day)
   - Consider upgrading to Google Workspace for production use

## 5. Email Templates

The system includes two email templates:

1. **Password Reset Request**:
   - Sent when a user requests a password reset
   - Contains a link with the reset token

2. **Password Reset Confirmation**:
   - Sent after a user successfully resets their password
   - Confirms the action was completed

You can customize these templates in `services/emailService.js`.

## 6. Production Considerations

For production use:

1. **Set NODE_ENV**:
   - Add `NODE_ENV=production` to your `.env` file
   - This will prevent tokens from being included in API responses

2. **Consider a Transactional Email Service**:
   - For high volume, consider services like SendGrid, Mailgun, or AWS SES
   - Update the email service code accordingly

3. **Monitor Email Deliverability**:
   - Check spam rates and delivery issues
   - Implement email logging for debugging
