// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/updateUserDetails', authController.updateUserDetails);
router.post('/validateEmail', authController.validateEmail);

module.exports = router;
