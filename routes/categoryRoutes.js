const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', categoryController.getCategories);

router.get('/create', auth, admin, categoryController.showCreateForm);
router.post('/create', auth, admin, categoryController.createCategory);

router.get('/:id/edit', auth, admin, categoryController.showEditForm);
router.post('/:id/edit', auth, admin, categoryController.updateCategory);

router.post('/:id/delete', auth, admin, categoryController.deleteCategory);

module.exports = router;
