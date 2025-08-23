# Library Invitation Email Feature

## Overview
This feature automatically sends invitation emails to students who enter the library but don't have a LibMan account. It's designed to encourage more students to join the LibMan platform and use its features.

## How It Works

1. **Function Call**: Call `checkAndSendLibraryInvitation(PRN)` from anywhere in your code
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

## Usage Methods

### 1. Direct Function Call (Recommended)
```javascript
const { checkAndSendLibraryInvitation } = require('./services/emailService');

// Call the function directly
const result = await checkAndSendLibraryInvitation('2020BTEIT00001');
console.log(result);
// Returns: { success: true/false, message: "..." }
```

### 2. API Route Call
```javascript
// Frontend or any HTTP client
const response = await fetch('/api/send-library-invitation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ PRN: '2020BTEIT00001' })
});

const result = await response.json();
console.log(result);
```

### 3. Integration in Existing Code
```javascript
// In your existing library attendance logic
const { checkAndSendLibraryInvitation } = require('./services/emailService');

// After processing library entry
const invitationResult = await checkAndSendLibraryInvitation(PRN);
if (invitationResult.success) {
  console.log('✅ Invitation email sent');
} else {
  console.log('ℹ️ No invitation sent:', invitationResult.message);
}
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

## Return Values

The function returns an object with:
```javascript
{
  success: boolean,    // true if email was sent, false otherwise
  message: string      // Description of what happened
}
```

### Possible Messages:
- `"Invitation email sent successfully to user@example.com"`
- `"MAILINVI is disabled"`
- `"User is already a member"`
- `"Student not found in database"`
- `"No valid email found for student"`
- `"Failed to send invitation email"`

## Logging

The system provides detailed logging:
- ✅ Successful email sends
- ❌ Failed email sends
- ⏭️ Skipped emails (no valid email)
- 📧 MAILINVI status

## Error Handling

- Email failures don't affect other functionality
- Invalid emails are gracefully skipped
- Database errors are logged but don't break the flow
- Function always returns a result object

## Testing

### Using the Test File
```bash
node test-library-invitation.js
```

### Manual Testing
1. Set `MAILINVI=true` in your .env
2. Ensure email credentials are configured
3. Call the function with a valid PRN
4. Check logs for email sending status

## Security

- Only sends emails to students with valid email addresses
- Respects the MAILINVI environment variable
- Doesn't expose sensitive information in logs
- Uses existing email service infrastructure

## Integration Examples

### Frontend Integration
```javascript
// In your React component
const sendInvitation = async (prn) => {
  try {
    const response = await fetch('/api/send-library-invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ PRN: prn })
    });
    const result = await response.json();
    
    if (result.success) {
      alert('Invitation email sent!');
    } else {
      alert('No invitation sent: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Backend Integration
```javascript
// In your existing routes or services
const { checkAndSendLibraryInvitation } = require('./services/emailService');

// After any library-related action
app.post('/some-library-action', async (req, res) => {
  // ... existing logic ...
  
  // Send invitation if needed
  const invitationResult = await checkAndSendLibraryInvitation(req.body.PRN);
  console.log('Invitation result:', invitationResult);
  
  // ... continue with response ...
});
```
