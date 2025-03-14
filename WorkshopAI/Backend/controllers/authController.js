const db = require('../config/db'); // Database connection
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Email Transporter (Nodemailer)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate 6-digit Code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register User
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "All fields are required." });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [user] = await db.query("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [username, email, hashedPassword]);

        // Generate Verification Code
        const verificationCode = generateCode();
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

        await db.query("INSERT INTO email_verifications (user_id, verification_code, expires_at) VALUES (?, ?, ?)", [user.insertId, verificationCode, expiry]);

        // Send Verification Email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email",
            text: `Your verification code is ${verificationCode}`
        });

        res.json({ message: "User registered. Check email for verification code." });

    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "Email and code are required." });

    try {
        const [[user]] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (!user) return res.status(404).json({ message: "User not found." });

        const [[verification]] = await db.query(
            "SELECT * FROM email_verifications WHERE user_id = ? AND verification_code = ? AND expires_at > NOW()",
            [user.id, code]
        );

        if (!verification) return res.status(400).json({ message: "Invalid or expired verification code." });

        await db.query("UPDATE users SET is_verified = TRUE WHERE id = ?", [user.id]);
        await db.query("DELETE FROM email_verifications WHERE user_id = ?", [user.id]);

        res.json({ message: "Email verified successfully. You can now log in." });

    } catch (err) {
        res.status(500).json({ message: "Verification failed", error: err.message });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    try {
        const [[user]] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (!user || !await bcrypt.compare(password, user.password_hash)) return res.status(401).json({ message: "Invalid credentials." });

        if (!user.is_verified) return res.status(403).json({ message: "Please verify your email before logging in." });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });

    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};
