const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.showRegister = (req, res) => {
  res.render('auth/register', { title: 'Register', error: null });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.render('auth/register', {
        title: 'Register',
        error: 'Username or email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    res.redirect('/login');
  } catch (err) {
    res.render('auth/register', {
      title: 'Register',
      error: err.message
    });
  }
};

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Login', error: null });
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

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // JWT stored in HTTP-only cookie
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
