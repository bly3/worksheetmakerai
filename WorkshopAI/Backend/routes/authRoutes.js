const express = require('express');
const { register, verifyEmail, login } = require('../controllers/authController');

exports.register = async (req, res) => {
    return res.json({ message: "Register endpoint is working!" });
};

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);

module.exports = router;
