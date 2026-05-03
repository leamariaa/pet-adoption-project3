const Pet = require('../models/Pet');
const User = require('../models/User');
const Category = require('../models/Category');
const MedicalRecord = require('../models/MedicalRecord');

exports.getPets = async (req, res) => {
  const { status } = req.query;

  let filter = {};
  if (status === 'adopted') filter.adopted = true;
  if (status === 'available') filter.adopted = false;

  const pets = await Pet.find(filter)
    .populate('adoptedBy', 'username email')
    .populate('categories')
    .populate('medicalRecord');

  res.render('pets/index', { title: 'Pets', pets, status });
};

exports.getPet = async (req, res) => {
  const pet = await Pet.findById(req.params.id)
    .populate('adoptedBy', 'username email')
    .populate('categories')
    .populate('medicalRecord');

  if (!pet) return res.status(404).render('404', { title: 'Pet Not Found' });

  res.render('pets/show', { title: pet.name, pet });
};

exports.showCreateForm = async (req, res) => {
  const categories = await Category.find();
  res.render('pets/create', { title: 'Add Pet', categories, error: null });
};

exports.createPet = async (req, res) => {
  try {
    const { name, age, type, categories } = req.body;

    const pet = await Pet.create({
      name,
      age,
      type,
      categories: categories || []
    });

    if (categories) {
      const categoryIds = Array.isArray(categories) ? categories : [categories];
      await Category.updateMany(
        { _id: { $in: categoryIds } },
        { $addToSet: { pets: pet._id } }
      );
    }

    res.redirect('/pets');
  } catch (err) {
    const categories = await Category.find();
    res.render('pets/create', {
      title: 'Add Pet',
      categories,
      error: err.message
    });
  }
};

exports.showEditForm = async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  const categories = await Category.find();

  if (!pet) return res.status(404).render('404', { title: 'Pet Not Found' });

  res.render('pets/edit', { title: 'Edit Pet', pet, categories, error: null });
};

exports.updatePet = async (req, res) => {
  try {
    const { name, age, type, adopted, categories } = req.body;

    const categoryIds = categories
      ? (Array.isArray(categories) ? categories : [categories])
      : [];

    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      {
        name,
        age,
        type,
        adopted: adopted === 'on',
        categories: categoryIds
      },
      { new: true, runValidators: true }
    );

    await Category.updateMany({}, { $pull: { pets: pet._id } });

    if (categoryIds.length > 0) {
      await Category.updateMany(
        { _id: { $in: categoryIds } },
        { $addToSet: { pets: pet._id } }
      );
    }

    res.redirect('/pets');
  } catch (err) {
    const pet = await Pet.findById(req.params.id);
    const categories = await Category.find();

    res.render('pets/edit', {
      title: 'Edit Pet',
      pet,
      categories,
      error: err.message
    });
  }
};

exports.deletePet = async (req, res) => {
  const pet = await Pet.findByIdAndDelete(req.params.id);

  if (pet) {
    await Category.updateMany({}, { $pull: { pets: pet._id } });
    await MedicalRecord.findOneAndDelete({ pet: pet._id });
  }

  res.redirect('/pets');
};

exports.adoptPet = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  const pet = await Pet.findById(req.params.id);

  if (!pet) return res.status(404).render('404', { title: 'Pet Not Found' });

  if (pet.adopted) {
    return res.redirect(`/pets/${pet._id}`);
  }

  if (user.adoptedPets.length > 0) {
    return res.redirect('/dashboard');
  }

  pet.adopted = true;
  pet.adoptedBy = userId;
  await pet.save();

  user.adoptedPets.push(pet._id);
  await user.save();

  res.redirect('/dashboard');
};
