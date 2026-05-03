const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const auth = require('./middleware/auth');

const connectDB = require('./config/db');

const app = express();
connectDB();

// EJS setup - Chapter 4 SSR
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make logged user available in all EJS pages
app.use((req, res, next) => {
  res.locals.user = null;

  const token = req.cookies.token;
  if (!token) return next();

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = decoded;
  } catch (err) {
    res.clearCookie('token');
  }

  next();
});

app.use('/dashboard', auth, require('./routes/dashboardRoutes'));
app.use('/pets', auth, require('./routes/petRoutes'));
app.use('/categories', auth, require('./routes/categoryRoutes'));
app.use('/medical-records', auth, require('./routes/medicalRecordRoutes'));


app.get('/', (req, res) => {

  const token = req.cookies.token;

  if (token) {
    return res.redirect('/dashboard');
  }

  res.render('welcome', {
    title: 'Welcome'
  });

});

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
