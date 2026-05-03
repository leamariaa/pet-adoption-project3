const express = require('express');
const router = express.Router();

const petController = require('../controllers/petController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', petController.getPets);
router.get('/create', auth, admin, petController.showCreateForm);
router.post('/create', auth, admin, petController.createPet);

router.get('/:id', petController.getPet);

router.get('/:id/edit', auth, admin, petController.showEditForm);
router.post('/:id/edit', auth, admin, petController.updatePet);

router.post('/:id/delete', auth, admin, petController.deletePet);
router.post('/:id/adopt', auth, petController.adoptPet);

module.exports = router;
