require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // ✅ Import authentication routes

const app = express();
app.use(express.json());
app.use(cors()); // Allow cross-origin requests

// ✅ Register the routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("Welcome to Workshop.AI API!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
