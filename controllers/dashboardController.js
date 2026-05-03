const Pet = require('../models/Pet');
const User = require('../models/User');
const Category = require('../models/Category');

exports.dashboard = async (req, res) => {
  if (req.user.role === 'admin') {
    const petsCount = await Pet.countDocuments();
    const usersCount = await User.countDocuments();
    const categoriesCount = await Category.countDocuments();

    return res.render('dashboard/admin', {
      title: 'Admin Dashboard',
      petsCount,
      usersCount,
      categoriesCount
    });
  }

  const user = await User.findById(req.user.id).populate('adoptedPets');

  res.render('dashboard/user', {
    title: 'User Dashboard',
    currentUser: user
  });
};
