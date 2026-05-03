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

  const currentUser = await User.findById(req.user.id)
    .populate({
      path: 'adoptedPets',
      populate: [
        { path: 'categories' },
        { path: 'medicalRecord' }
      ]
    });

  res.render('dashboard/user', {
    title: 'User Dashboard',
    currentUser
  });
};