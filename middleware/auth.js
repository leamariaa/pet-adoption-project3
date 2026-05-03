const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
      username: decoded.username
    };

    res.locals.user = req.user;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};
