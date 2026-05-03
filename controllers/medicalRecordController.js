const MedicalRecord = require('../models/MedicalRecord');
const Pet = require('../models/Pet');

exports.showCreateForm = async (req, res) => {
  const pets = await Pet.find({ medicalRecord: null });

  res.render('medical/create', {
    title: 'Add Medical Record',
    pets,
    error: null
  });
};

exports.createMedicalRecord = async (req, res) => {
  try {
    const { pet, vaccinated, healthStatus, notes, lastCheckupDate } = req.body;

    const record = await MedicalRecord.create({
      pet,
      vaccinated: vaccinated === 'on',
      healthStatus,
      notes,
      lastCheckupDate
    });

    await Pet.findByIdAndUpdate(pet, { medicalRecord: record._id });

    res.redirect('/pets');
  } catch (err) {
    const pets = await Pet.find({ medicalRecord: null });

    res.render('medical/create', {
      title: 'Add Medical Record',
      pets,
      error: err.message
    });
  }
};

exports.showEditForm = async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id).populate('pet');

  if (!record) return res.status(404).render('404', { title: 'Record Not Found' });

  res.render('medical/edit', {
    title: 'Edit Medical Record',
    record,
    error: null
  });
};

exports.updateMedicalRecord = async (req, res) => {
  try {
    const { vaccinated, healthStatus, notes, lastCheckupDate } = req.body;

    await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      {
        vaccinated: vaccinated === 'on',
        healthStatus,
        notes,
        lastCheckupDate
      },
      { runValidators: true }
    );

    res.redirect('/pets');
  } catch (err) {
    const record = await MedicalRecord.findById(req.params.id).populate('pet');

    res.render('medical/edit', {
      title: 'Edit Medical Record',
      record,
      error: err.message
    });
  }
};

exports.deleteMedicalRecord = async (req, res) => {
  const record = await MedicalRecord.findByIdAndDelete(req.params.id);

  if (record) {
    await Pet.findByIdAndUpdate(record.pet, { medicalRecord: null });
  }

  res.redirect('/pets');
};
