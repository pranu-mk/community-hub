const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registration Logic
exports.register = async (req, res) => {
    try {
        const { name, email, password, flat_number } = req.body;

        // 1. Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email, and password" });
        }

        // 2. Check if user already exists
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        // 3. Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // 4. Insert into Database
        // IMPROVEMENT: Added console.log to debug the values being sent to MySQL
        console.log(`Registering user: ${email} with flat: ${flat_number}`);

        await db.query(
            'INSERT INTO users (name, email, password, flat_number, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, flat_number || null, 'USER', 'active']
        );

        res.status(201).json({ 
            message: "Registration successful! Please login to continue." 
        });

    } catch (error) {
        // IMPROVEMENT: More detailed error logging for debugging MySQL issues
        console.error("Registration Database Error:", error.message);
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

// Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // 2. Fetch user
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = users[0];

        // DEBUG: Ensure the role from DB is visible in terminal
        console.log(`Login Attempt: ${email} | Role in DB: ${user.role}`);

        // 3. Check account status
        if (user.status !== 'active') {
            return res.status(403).json({ message: "Your account is inactive. Contact management." });
        }

        // 4. Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 5. Generate JWT with Role
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role,
                name: user.name 
            }, 
            process.env.JWT_SECRET || 'your_fallback_secret', // Ensure this is in .env
            { expiresIn: '1d' }
        );

        // 6. Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role, 
                flat_number: user.flat_number
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error during login" });
    }
};