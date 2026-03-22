const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'digital_agency_secret_2026'; // In production, use env variable

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for local development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// In-memory user storage (replace with a real DB like MongoDB/PostgreSQL in production)
const users = [];

// ─── Helper: Generate JWT ───────────────────────────────────────────────────
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// ─── Middleware: Verify JWT ─────────────────────────────────────────────────
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
}

// ─── Routes ─────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Digital Agency API is running', timestamp: new Date().toISOString() });
});

// Register (Sign Up after subscription)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, company, plan } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'An account with this email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            company: company ? company.trim() : '',
            plan: plan || 'Revenue Framework',
            subscribedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        // Generate token
        const token = generateToken(newUser);

        console.log(`✅ New user registered: ${newUser.email} | Plan: ${newUser.plan}`);

        res.status(201).json({
            success: true,
            message: 'Account created successfully! Welcome to Digital Agency.',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                company: newUser.company,
                plan: newUser.plan,
                subscribedAt: newUser.subscribedAt
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate fields
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Find user
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user);

        console.log(`✅ User logged in: ${user.email}`);

        res.json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                company: user.company,
                plan: user.plan,
                subscribedAt: user.subscribedAt
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

// Protected: Get current user profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            company: user.company,
            plan: user.plan,
            subscribedAt: user.subscribedAt
        }
    });
});

// Protected: Logout (client-side token removal is sufficient, but we acknowledge it)
app.post('/api/auth/logout', authenticateToken, (req, res) => {
    console.log(`👋 User logged out: ${req.user.email}`);
    res.json({ success: true, message: 'Logged out successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Digital Agency Backend running at http://localhost:${PORT}`);
    console.log(`📡 API Endpoints:`);
    console.log(`   GET  /api/health`);
    console.log(`   POST /api/auth/register`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/auth/me       (protected)`);
    console.log(`   POST /api/auth/logout   (protected)\n`);
});
