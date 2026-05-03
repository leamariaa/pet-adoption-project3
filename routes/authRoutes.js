const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

router.get('/register', authController.showRegister);

router.post('/register', authController.register);

router.get('/login', authController.showLogin);

router.post('/login', authController.login);

router.get('/verify-email/:token', authController.verifyEmail);

router.get('/resend-verification', authController.showResendVerification);

router.post('/resend-verification', authController.resendVerification);

router.post('/logout', authController.logout);

module.exports = router;