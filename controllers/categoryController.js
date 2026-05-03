const Category = require('../models/Category');
const Pet = require('../models/Pet');

exports.getCategories = async (req, res) => {
  const categories = await Category.find().populate('pets');
  res.render('categories/index', { title: 'Categories', categories });
};

exports.showCreateForm = (req, res) => {
  res.render('categories/create', { title: 'Add Category', error: null });
};

exports.createCategory = async (req, res) => {
  try {
    await Category.create({ name: req.body.name });
    res.redirect('/categories');
  } catch (err) {
    res.render('categories/create', {
      title: 'Add Category',
      error: err.message
    });
  }
};

exports.showEditForm = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) return res.status(404).render('404', { title: 'Category Not Found' });

  res.render('categories/edit', { title: 'Edit Category', category, error: null });
};

exports.updateCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { runValidators: true }
    );

    res.redirect('/categories');
  } catch (err) {
    const category = await Category.findById(req.params.id);

    res.render('categories/edit', {
      title: 'Edit Category',
      category,
      error: err.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (category) {
    await Pet.updateMany({}, { $pull: { categories: category._id } });
  }

  res.redirect('/categories');
};
