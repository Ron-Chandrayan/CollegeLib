const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Users = require('../models/Users');
const FeStudent = require('../models/FeStudent');
const { sendPasswordResetEmail, sendPasswordResetConfirmation } = require('../services/emailService');

const router = express.Router();

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, PRN } = req.body;

    if (!email && !PRN) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either email or PRN'
      });
    }

    let user;
    let studentEmail;
    let studentName;

    if (PRN) {
      // Find user in Users collection by PRN
      user = await Users.findOne({ PRN: PRN.toUpperCase() });
      
      if (!user) {
        return res.status(200).json({
          success: true,
          message: 'If an account with that information exists, we have sent a password reset email.'
        });
      }

      // Get email from fe_students collection
      const feStudent = await FeStudent.findOne({ PRN: PRN.toUpperCase() });
      
      if (!feStudent || !feStudent.email) {
        return res.status(400).json({
          success: false,
          message: 'No email address found for this PRN. Please contact library administration.'
        });
      }

      studentEmail = feStudent.email;
      studentName = feStudent.name || user.name;

    } else if (email) {
      // Find student by email in fe_students collection
      const feStudent = await FeStudent.findOne({ email: email.toLowerCase() });
      
      if (!feStudent) {
        return res.status(200).json({
          success: true,
          message: 'If an account with that information exists, we have sent a password reset email.'
        });
      }

      // Find corresponding user account
      user = await Users.findOne({ PRN: feStudent.PRN });
      
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'No user account found for this email. Please contact library administration.'
        });
      }

      studentEmail = feStudent.email;
      studentName = feStudent.name;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token and expiry to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send email
    try {
      await sendPasswordResetEmail(studentEmail, studentName, resetToken);
      
      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully!'
      });
    } catch (emailError) {
      // Clear reset token if email fails
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again later.'
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Verify reset token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await Users.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Get student info from fe_students for display
    const feStudent = await FeStudent.findOne({ PRN: user.PRN });
    
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: {
        name: feStudent?.name || user.name,
        PRN: user.PRN,
        email: feStudent?.email || 'Email not found'
      }
    });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await Users.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Send confirmation email
    try {
      const feStudent = await FeStudent.findOne({ PRN: user.PRN });
      if (feStudent && feStudent.email) {
        await sendPasswordResetConfirmation(feStudent.email, feStudent.name);
      }
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError);
      // Don't fail the request if confirmation email fails
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

module.exports = router;
