# Library Invitation Email Feature

## Overview
This feature automatically sends invitation emails to students who enter the library but don't have a LibMan account. It's designed to encourage more students to join the LibMan platform and use its features.

## How It Works

1. **Trigger**: When a student enters the library through the attendance system
2. **Check**: The system checks if the student is already a member (has a LibMan account)
3. **Email**: If they're not a member and have a valid email, an invitation email is sent
4. **Skip**: If email is "NA" or invalid, the invitation is skipped

## Environment Variables

### Required
- `MAILINVI`: Set to `true` to enable invitation emails, `false` or unset to disable
- `EMAIL_USER`: Gmail address for sending emails
- `EMAIL_PASS`: Gmail app password
- `FRONTEND_URL`: (Optional) Frontend URL for the invitation link

### Example .env Configuration
```env
MAILINVI=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://your-app-url.com
```

## Email Features

The invitation email includes:
- 🎨 Beautiful gradient design
- 📚 Welcome message
- 🚀 Feature highlights (Track hours, Search books, Get PYQs, Leaderboard)
- 💡 Pro tip about study effectiveness
- 🎉 Call-to-action button to join LibMan

## Database Requirements

The feature requires:
- `members` collection: To check if user already has a LibMan account
- `festudents` collection: To get student details (name, email) by PRN

## Logging

The system provides detailed logging:
- ✅ Successful email sends
- ❌ Failed email sends
- ⏭️ Skipped emails (no valid email)
- 📧 MAILINVI status

## Error Handling

- Email failures don't affect the main library attendance functionality
- Invalid emails are gracefully skipped
- Database errors are logged but don't break the flow

## Testing

To test the feature:
1. Set `MAILINVI=true` in your .env
2. Ensure email credentials are configured
3. Have a student enter the library who isn't in the members collection
4. Check logs for email sending status

## Security

- Only sends emails to students with valid email addresses
- Respects the MAILINVI environment variable
- Doesn't expose sensitive information in logs
- Uses existing email service infrastructure
