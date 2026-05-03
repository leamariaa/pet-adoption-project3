const express = require('express');
const router = express.Router();

const medicalRecordController = require('../controllers/medicalRecordController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/create', auth, admin, medicalRecordController.showCreateForm);
router.post('/create', auth, admin, medicalRecordController.createMedicalRecord);

router.get('/:id/edit', auth, admin, medicalRecordController.showEditForm);
router.post('/:id/edit', auth, admin, medicalRecordController.updateMedicalRecord);

router.post('/:id/delete', auth, admin, medicalRecordController.deleteMedicalRecord);

module.exports = router;
