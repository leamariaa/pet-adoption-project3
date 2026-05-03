module.exports = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  if (req.user.role !== 'admin') {
    return res.status(403).render('403', { title: 'Access Denied' });
  }

  next();
};
