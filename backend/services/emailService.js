const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
  const transporter = createTransporter();
  
  const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { 
                display: inline-block; 
                padding: 12px 30px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                text-decoration: none; 
                border-radius: 5px; 
                margin: 20px 0;
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏛️ SIES Library</h1>
                <h2>Password Reset Request</h2>
            </div>
            
            <div class="content">
                <h3>Hello ${userName},</h3>
                
                <p>We received a request to reset your password for your SIES Library account.</p>
                
                <p>Click the button below to reset your password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetURL}" class="button">Reset Password</a>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong>
                    <ul>
                        <li>This link will expire in <strong>1 hour</strong></li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>For security, never share this link with anyone</li>
                    </ul>
                </div>
                
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #667eea;">${resetURL}</p>
                
                <p>Best regards,<br>SIES Library Team</p>
            </div>
            
            <div class="footer">
                <p>This is an automated email from SIES Library System</p>
                <p>If you have any questions, please contact the library administration</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"SIES Library" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🔐 Password Reset - SIES Library',
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send reset email');
  }
};

// Send password reset confirmation email
const sendPasswordResetConfirmation = async (userEmail, userName) => {
  const transporter = createTransporter();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; color: #155724; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏛️ SIES Library</h1>
                <h2>Password Reset Successful</h2>
            </div>
            
            <div class="content">
                <h3>Hello ${userName},</h3>
                
                <div class="success">
                    <strong>✅ Success!</strong> Your password has been successfully reset.
                </div>
                
                <p>Your SIES Library account password has been changed successfully.</p>
                
                <p><strong>What's next?</strong></p>
                <ul>
                    <li>You can now log in with your new password</li>
                    <li>Make sure to keep your password secure</li>
                    <li>Consider using a strong, unique password</li>
                </ul>
                
                <p><strong>⚠️ If you didn't make this change:</strong></p>
                <p>Please contact the library administration immediately if you didn't request this password reset.</p>
                
                <p>Best regards,<br>SIES Library Team</p>
            </div>
            
            <div class="footer">
                <p>This is an automated email from SIES Library System</p>
                <p>Login at: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">SIES Library Portal</a></p>
            </div>
        </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"SIES Library" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '✅ Password Reset Successful - SIES Library',
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset confirmation sent to: ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Confirmation email failed:', error);
    // Don't throw error for confirmation email - it's not critical
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetConfirmation
};
