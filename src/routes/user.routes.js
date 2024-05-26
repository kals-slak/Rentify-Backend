const express = require('express');
const { register, login } = require('../controllers/user.controller');
const { validateUserRegistration } = require('../middlewares/validation');

const router = express.Router();

router.post('/register', validateUserRegistration, register);
router.post('/login', login);

module.exports = router;
