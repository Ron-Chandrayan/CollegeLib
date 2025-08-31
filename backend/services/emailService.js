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
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #f9fafb;">
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
          <h1 style="color: #1e40af; margin: 0; font-size: 28px; font-weight: 600;">LibMan</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 16px;">SIES Graduate School of Technology</p>
        </div>
        
        <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #3b82f6; font-weight: 600; margin: 0;">Password Reset Request</h2>
          </div>
          
          <div style="margin-bottom: 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
            <p>Hi ${name},</p>
            <p>We noticed you're having trouble accessing your LibMan account at SIES Graduate School of Technology. No worries - it happens to the best of us!</p>
            <p>To reset your password, simply click the button below:</p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px; transition: all 0.3s ease;">Reset My Password</a>
          </div>
          
          <div style="margin-top: 30px; color: #4b5563; font-size: 15px; line-height: 1.5; background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
            <p>For your security, this link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <p>Having trouble with the button? Copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280;"><a href="${resetUrl}" style="color: #3b82f6;">${resetUrl}</a></p>
          </div>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Need help? Contact the library staff at SIES Graduate School of Technology.</p>
          <p>This is an automated email. Please don't reply to this message.</p>
          <p style="margin-top: 15px; font-weight: 600;">&copy; LibMan 2025 | SIES Graduate School of Technology</p>
        </div>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `"LibMan" <${process.env.EMAIL_USER}>`,
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
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #f9fafb;">
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
          <h1 style="color: #1e40af; margin: 0; font-size: 28px; font-weight: 600;">LibMan</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 16px;">SIES Graduate School of Technology</p>
        </div>
        
        <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #10b981; font-weight: 600; margin: 0;">Password Reset Successful!</h2>
          </div>
          
          <div style="margin-bottom: 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
            <p>Hi ${name},</p>
            <p>Great news! Your password for the LibMan account at SIES Graduate School of Technology has been successfully reset.</p>
            <p>You can now log in with your new password and continue enjoying all the library resources.</p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://library-sies-92fbc1e81669.herokuapp.com'}" style="background-color: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px; transition: all 0.3s ease;">Go to Login</a>
          </div>
          
          <div style="margin-top: 30px; color: #4b5563; font-size: 15px; line-height: 1.5; background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
            <p>If you didn't reset your password, please contact the library staff immediately.</p>
          </div>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Need help? Contact the library staff at SIES Graduate School of Technology.</p>
          <p>This is an automated email. Please don't reply to this message.</p>
          <p style="margin-top: 15px; font-weight: 600;">&copy; LibMan 2025 | SIES Graduate School of Technology</p>
        </div>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `"LibMan" <${process.env.EMAIL_USER}>`,
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
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #f9fafb;">
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
          <h1 style="color: #1e40af; margin: 0; font-size: 28px; font-weight: 600;">LibMan</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 16px;">SIES Graduate School of Technology</p>
        </div>
        
        <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #3b82f6; font-weight: 600; margin: 0;">Email Service Test</h2>
          </div>
          
          <div style="margin-bottom: 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
            <p>Hello there!</p>
            <p>This is a test email to verify that the LibMan email service at SIES Graduate School of Technology is working correctly.</p>
            <p>If you're seeing this, it means our email system is up and running perfectly!</p>
            <p>Time of test: ${new Date().toLocaleString()}</p>
          </div>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 14px;">
          <p>This is an automated test email from SIES Graduate School of Technology.</p>
          <p style="margin-top: 15px; font-weight: 600;">&copy; LibMan 2025 | SIES Graduate School of Technology</p>
        </div>
      </div>
    `;

    // Send the test email
    const info = await transporter.sendMail({
      from: `"LibMan" <${process.env.EMAIL_USER}>`,
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

// Send OTP for signup verification
const sendSignupOTP = async (to, name, otp) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error('❌ Failed to create email transporter');
      throw new Error('Email transporter not configured');
    }
    const mailOptions = {
      from: `"LibMan" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Your LibMan Verification Code - SIES GST',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #f9fafb;">
          <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
            <h1 style="color: #1e40af; margin: 0; font-size: 28px; font-weight: 600;">LibMan</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 16px;">SIES Graduate School of Technology</p>
          </div>
          
          <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #3b82f6; font-weight: 600; margin: 0;">Verify Your Email</h2>
            </div>
            
            <div style="margin-bottom: 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
              <p>Hi ${name},</p>
              <p>Welcome to LibMan at SIES Graduate School of Technology! We're excited to have you join our library community.</p>
              <p>To complete your registration and access all our resources, please use this verification code:</p>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
              <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                ${otp}
              </div>
            </div>
            
            <p style="color: #374151; line-height: 1.6; margin: 25px 0; text-align: center; font-size: 16px;">
              Simply enter this code on the verification page to activate your account.
            </p>
            
            <div style="margin-top: 30px; color: #4b5563; font-size: 15px; line-height: 1.5; background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
              <p><strong>Important:</strong> This code will expire in 10 minutes for security reasons.</p>
              <p>If you didn't request this verification, you can safely ignore this email.</p>
              <p>If you're having trouble, please check your spam folder or contact our library staff for assistance.</p>
            </div>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 14px;">
            <p>Need help? Contact the library staff at SIES Graduate School of Technology.</p>
            <p>This is an automated email. Please don't reply to this message.</p>
            <p style="margin-top: 15px; font-weight: 600;">&copy; LibMan 2025 | SIES Graduate School of Technology</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Signup OTP email sent successfully to:', to);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending signup OTP email:', error);
    throw error;
  }
};

// Send welcome email after successful signup
const sendWelcomeEmail = async (to, name) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error('❌ Failed to create email transporter');
      throw new Error('Email transporter not configured');
    }
    const mailOptions = {
      from: `"LibMan" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Welcome to LibMan at SIES GST! 🎉',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #f9fafb;">
          <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
            <h1 style="color: #1e40af; margin: 0; font-size: 28px; font-weight: 600;">LibMan</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 16px;">SIES Graduate School of Technology</p>
          </div>
          
          <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #1f2937; font-weight: 600; margin: 0;">Welcome to LibMan! 🎉</h2>
            </div>
            
            <div style="margin-bottom: 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
              <p>Hi ${name},</p>
              <p>Awesome news! Your LibMan account at SIES Graduate School of Technology has been successfully created. We're thrilled to have you join our community of readers and learners.</p>
              <p>You now have full access to all the amazing features and resources our library has to offer.</p>
            </div>
            
            <div style="background-color: #f0f9ff; border-left: 4px solid #1e40af; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-weight: 600;">Here's what you can do with your new account:</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li><strong>Access your personalized dashboard</strong> - Track your library activity</li>
                <li><strong>Monitor your library visits</strong> - See your attendance patterns</li>
                <li><strong>View detailed statistics</strong> - Understand library usage trends</li>
                <li><strong>Browse study resources</strong> - Access question papers and more</li>
                <li><strong>Stay connected</strong> - Get updates about library events</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 35px 0; background-color: #fef9c3; padding: 15px; border-radius: 8px;">
              <p style="color: #854d0e; font-size: 16px; font-weight: 500; margin: 0;">
                📚 Ready to explore? Log in now and start your library journey! 📚
              </p>
            </div>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px; text-align: center;">
              If you have any questions or need assistance, our friendly library staff at SIES Graduate School of Technology is always here to help.
            </p>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 14px;">
            <p>Need help? Contact the library staff at SIES Graduate School of Technology.</p>
            <p>This is an automated email. Please don't reply to this message.</p>
            <p style="margin-top: 15px; font-weight: 600;">&copy; LibMan 2025 | SIES Graduate School of Technology</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', to);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send an invitation email to non-members who enter the library
 * 
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} prn - Recipient PRN
 * @returns {Promise<boolean>} - Success status
 */
const sendLibraryInvitationEmail = async (email, name, prn) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.error('❌ Failed to create email transporter');
      return false;
    }

    // HTML email content with mobile-friendly design
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="text-align: center; margin-bottom: 30px; padding: 25px; background-color: #1e40af; border-radius: 12px;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">LibMan</h1>
          <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 16px;">SIES Graduate School of Technology</p>
        </div>
        
        <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #1e40af; font-weight: 600; margin: 0; font-size: 24px;">Welcome to the Library! 📚</h2>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Hi ${name}, we noticed you're here!</p>
          </div>
          
          <div style="margin-bottom: 25px; color: #4b5563; font-size: 16px; line-height: 1.6;">
            <p><strong>See what you're missing out on, but your friends aren't!</strong> 🚀</p>
            <p>While you're here at the library, thousands of your classmates are already using <strong>LibMan</strong> to ace their studies! Don't be the only one missing out on these game-changing features!</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1e40af;">
            <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; text-align: center; color: #1e40af;">🚀 Amazing Features Await You!</h3>
            <div style="display: block;">
              <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background-color: white; border-radius: 6px;">
                <div style="font-size: 20px; margin-right: 12px;">⏱️</div>
                <div style="font-weight: 600; font-size: 14px; color: #374151;">Track Library Hours</div>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background-color: white; border-radius: 6px;">
                <div style="font-size: 20px; margin-right: 12px;">📖</div>
                <div style="font-weight: 600; font-size: 14px; color: #374151;">Search Books</div>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background-color: white; border-radius: 6px;">
                <div style="font-size: 20px; margin-right: 12px;">📝</div>
                <div style="font-weight: 600; font-size: 14px; color: #374151;">Get PYQs</div>
              </div>
              <div style="display: flex; align-items: center; padding: 12px; background-color: white; border-radius: 6px;">
                <div style="font-size: 20px; margin-right: 12px;">🏆</div>
                <div style="font-weight: 600; font-size: 14px; color: #374151;">Leaderboard</div>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://library-sies-92fbc1e81669.herokuapp.com'}" style="background-color: #1e40af; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">Join LibMan Now! 🎉</a>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 18px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1e40af;">
            <h4 style="color: #1e40af; margin: 0 0 15px 0; font-weight: 600;">Why Join LibMan?</h4>
            <ul style="color: #4b5563; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li><strong>Personalized Dashboard:</strong> See what your friends are studying!</li>
              <li><strong>Smart Book Search:</strong> Find books in seconds while others struggle!</li>
              <li><strong>Previous Year Papers:</strong> Get exam papers your classmates don't have!</li>
              <li><strong>Leaderboard:</strong> Beat your friends and become the study champion!</li>
              <li><strong>Real-time Updates:</strong> Know about library events before everyone else!</li>
            </ul>
          </div>
          
          <div style="text-align: center; background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #92400e; font-size: 15px; font-weight: 500; margin: 0;">
              💡 <strong>Pro Tip:</strong> Students who use LibMan study 40% more effectively! Your friends are already ahead - catch up now! 🏃‍♂️💨
            </p>
          </div>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 14px; padding: 20px 0;">
          <p>Questions? Contact the library staff at SIES Graduate School of Technology.</p>
          <p>This is an automated invitation. Please don't reply to this message.</p>
          <p style="margin-top: 15px; font-weight: 600;">&copy; LibMan 2025 | SIES Graduate School of Technology</p>
        </div>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `"LibMan - SIES GST Library" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to SIES GST Library! Join LibMan for Amazing Features!',
      html: htmlContent
    });

    console.log('✅ Library invitation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send library invitation email:', error);
    return false;
  }
};

/**
 * Check if user should receive invitation email and send it
 * This function can be called from anywhere (frontend, index.js, etc.)
 * 
 * @param {string} prn - Student PRN
 * @returns {Promise<{success: boolean, message: string}>} - Result object
 */
const checkAndSendLibraryInvitation = async (prn) => {
  try {
    // Check if MAILINVI is enabled
    if (process.env.MAILINVI !== 'true') {
      return { 
        success: false, 
        message: 'MAILINVI is disabled' 
      };
    }

    // Import models dynamically to avoid circular dependencies
    const users = require('../models/Users');
    const festudents = require('../models/FeStudent');

    // Check if user is already a member
    const isMember = await users.findOne({ PRN: prn });
    if (isMember) {
      return { 
        success: false, 
        message: 'User is already a member' 
      };
    }

    // Get student details
    const student = await festudents.findOne({ PRN: prn });
    if (!student) {
      return { 
        success: false, 
        message: 'Student not found in database' 
      };
    }

    // Check if email is valid
    if (!student.email || student.email === 'NA' || student.email.trim() === '') {
      return { 
        success: false, 
        message: 'No valid email found for student' 
      };
    }

    // Send invitation email
    const emailSent = await sendLibraryInvitationEmail(student.email, student.name, prn);
    
    if (emailSent) {
      return { 
        success: true, 
        message: `Invitation email sent successfully to ${student.email}` 
      };
    } else {
      return { 
        success: false, 
        message: 'Failed to send invitation email' 
      };
    }

  } catch (error) {
    console.error('❌ Error in checkAndSendLibraryInvitation:', error);
    return { 
      success: false, 
      message: `Error: ${error.message}` 
    };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
  testEmailService,
  sendSignupOTP,
  sendWelcomeEmail,
  sendLibraryInvitationEmail,
  checkAndSendLibraryInvitation
};
 