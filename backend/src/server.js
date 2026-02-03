const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');

// 1. Load Environment Variables
// Points to the .env file located one level up in the backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

// 2. Middleware Configuration
app.use(cors({
    origin: 'http://localhost:8080', // Matches your Vite frontend port 
    credentials: true
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 3. Database Connection Test
db.getConnection()
    .then(connection => {
        console.log('✅ MySQL Database Connected Successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database Connection Failed:', err.message);
        console.log('Tip: Ensure your MySQL service is running and credentials in .env are correct.');
        process.exit(1); 
    });

// 4. API Routes
// Root route to prevent "Cannot GET /" error
app.get('/', (req, res) => {
    res.status(200).send('🚀 Green Valley Society API is live and healthy.');
});

// Authentication routes (Login/Register)
app.use('/api/auth', authRoutes);

// 5. Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong on the server!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`📡 Accepting requests from Frontend at http://localhost:8080`);
});