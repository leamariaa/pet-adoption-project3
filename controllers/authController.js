const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

require('dotenv').config();

exports.showRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Register',
    error: null
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.render('auth/register', {
        title: 'Register',
        error: 'Username or email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 1000 * 60 * 60;

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
      isVerified: false,
      verificationToken,
      verificationTokenExpires
    });

    const verifyLink = `${process.env.BASE_URL}/verify-email/${verificationToken}`;

    await sendEmail(
      email,
      'Verify your Pet Adoption account',
      `
      <h2>Verify Your Email</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${verifyLink}">Verify Email</a>
      `
    );

    res.render('auth/login', {
      title: 'Login',
      error: 'Account created. Please verify your email before login.'
    });

  } catch (err) {
    res.render('auth/register', {
      title: 'Register',
      error: err.message
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpires: {
        $gt: Date.now()
      }
    });

    if (!user) {
      return res.render('auth/resendVerification', {
        title: 'Resend Verification',
        error: 'Invalid or expired verification link. Enter your email to receive a new link.',
        success: null
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.render('auth/login', {
      title: 'Login',
      error: 'Email verified successfully. You can now login.'
    });

  } catch (err) {
    res.render('auth/resendVerification', {
      title: 'Resend Verification',
      error: err.message,
      success: null
    });
  }
};

exports.showResendVerification = (req, res) => {
  res.render('auth/resendVerification', {
    title: 'Resend Verification',
    error: null,
    success: null
  });
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.render('auth/resendVerification', {
        title: 'Resend Verification',
        error: 'No account found with this email.',
        success: null
      });
    }

    if (user.isVerified) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Your email is already verified. You can login.'
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 1000 * 60 * 60;

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;

    await user.save();

    const verifyLink = `${process.env.BASE_URL}/verify-email/${verificationToken}`;

    await sendEmail(
      user.email,
      'Resend Email Verification',
      `
      <h2>Verify Your Email</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${verifyLink}">Verify Email</a>
      `
    );

    res.render('auth/resendVerification', {
      title: 'Resend Verification',
      error: null,
      success: 'A new verification email has been sent.'
    });

  } catch (err) {
    res.render('auth/resendVerification', {
      title: 'Resend Verification',
      error: err.message,
      success: null
    });
  }
};

exports.showLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    error: null
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Invalid email or password'
      });
    }

    if (!user.isVerified) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Please verify your email before logging in.'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });

    res.redirect('/dashboard');

  } catch (err) {
    res.render('auth/login', {
      title: 'Login',
      error: err.message
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};