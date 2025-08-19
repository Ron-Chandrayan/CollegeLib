const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const createTransporter = () => {
  // Get email credentials from environment variables
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  // Check if credentials are available
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('❌ Missing email credentials in .env (EMAIL_USER, EMAIL_PASS)');
    return null;
  }

  // Create and return the transporter
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS // This should be an app password for Gmail
    }
  });
};

/**
 * Send a password reset email
 * 
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} resetUrl - Password reset URL with token
 * @returns {Promise<boolean>} - Success status
 */
const sendPasswordResetEmail = async (email, name, resetUrl) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('❌ Failed to create email transporter');
      return false;
    }

    // HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #3b82f6;">Password Reset Request</h2>
        </div>
        
        <div style="margin-bottom: 30px; color: #4b5563;">
          <p>Hello ${name},</p>
          <p>We received a request to reset your password for the Library Management System. To reset your password, click the button below:</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        
        <div style="margin-top: 30px; color: #4b5563; font-size: 14px;">
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>This link will expire in 60 minutes.</p>
          <p>If the button above doesn't work, copy and paste the following URL into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;"><a href="${resetUrl}" style="color: #3b82f6;">${resetUrl}</a></p>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 12px;">
          <p>This is an automated email. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Library Management System</p>
        </div>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `"Library System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: htmlContent
    });

    console.log('✅ Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return false;
  }
};

/**
 * Send a password reset confirmation email
 * 
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<boolean>} - Success status
 */
const sendPasswordResetConfirmation = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('❌ Failed to create email transporter');
      return false;
    }

    // HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #10b981;">Password Reset Successful</h2>
        </div>
        
        <div style="margin-bottom: 30px; color: #4b5563;">
          <p>Hello ${name},</p>
          <p>Your password for the Library Management System has been successfully reset.</p>
          <p>You can now log in with your new password.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://library-sies-92fbc1e81669.herokuapp.com'}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Login</a>
        </div>
        
        <div style="margin-top: 30px; color: #4b5563; font-size: 14px;">
          <p>If you didn't reset your password, please contact us immediately.</p>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 12px;">
          <p>This is an automated email. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Library Management System</p>
        </div>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `"Library System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Successful',
      html: htmlContent
    });

    console.log('✅ Password reset confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset confirmation email:', error);
    return false;
  }
};

// Test function to verify email configuration
const testEmailService = async (testEmail) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      return { success: false, message: 'Failed to create email transporter. Check EMAIL_USER and EMAIL_PASS in .env' };
    }

    // HTML test email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #3b82f6;">Email Service Test</h2>
        <p>This is a test email to verify that the email service is working correctly.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      </div>
    `;

    // Send the test email
    const info = await transporter.sendMail({
      from: `"Library System" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: 'Email Service Test',
      html: htmlContent
    });

    return { 
      success: true, 
      message: 'Test email sent successfully!', 
      messageId: info.messageId 
    };
  } catch (error) {
    console.error('❌ Email test failed:', error);
    return { 
      success: false, 
      message: 'Failed to send test email', 
      error: error.message 
    };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
  testEmailService
};