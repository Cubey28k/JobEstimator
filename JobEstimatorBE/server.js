require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./config/database');
const User = require('./models/User');
const Material = require('./models/Material');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());

// Password validation function, uses Regex for PW standardization
const passwordValidation = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumber = /[0-9]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
        return 'Password must be at least 8 characters long.';
    }
    if (!hasUpperCase.test(password)) {
        return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase.test(password)) {
        return 'Password must contain at least one lowercase letter.';
    }
    if (!hasNumber.test(password)) {
        return 'Password must contain at least one number.';
    }
    if (!hasSpecialChar.test(password)) {
        return 'Password must contain at least one special character.';
    }
    return null;
};

// User registration route
app.post('/register', async (req, res) => {
    const { username, email, password, security_question, security_answer } = req.body;

    const passwordError = passwordValidation(password);
    if (passwordError) {
        return res.status(400).json({ error: passwordError });
    }

    if (!username || !email || !security_question || !security_answer) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const hashedSecurityAnswer = bcrypt.hashSync(security_answer, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        security_question,
        security_answer: hashedSecurityAnswer,
    });

    return res.status(201).json({ message: 'User registered successfully' });
});

// User login route
app.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', {
            body: req.body,
            headers: req.headers['content-type']
        });

        const { username, email, password } = req.body;

        // Check if either username or email is provided
        if (!username && !email) {
            return res.status(400).json({ error: 'Username or email is required' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        // Find user by either username or email
        const user = await User.findOne({ 
            where: username ? { username } : { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        console.log('Login successful for user:', username || email);
        return res.json({ token });

    } catch (error) {
        console.error('Login error:', {
            message: error.message,
            stack: error.stack
        });
        return res.status(500).json({ 
            error: 'Login failed',
            details: error.message
        });
    }
});

// Create a new material route
app.post('/materials', auth, async (req, res) => {
    const { name, price } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const newMaterial = await Material.create({ name, price, userId: req.user.id });
    return res.status(201).json(newMaterial);
});

// Get all materials route
app.get('/materials', auth, async (req, res) => {
    try {
        const materials = await Material.findAll({ where: { userId: req.user.id } });
        if (materials.length === 0) {
            return res.status(404).json({ message: 'No materials found.' });
        }
        res.json(materials);
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a material route
app.put('/materials/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;

    try {
        const material = await Material.findOne({ where: { id, userId: req.user.id } });
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }
        
        material.name = name;
        material.price = price;
        await material.save();

        return res.json(material);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a material route
app.delete('/materials/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const material = await Material.destroy({ where: { id, userId: req.user.id } });
        if (material) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the material' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export the app
module.exports = app;

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
    // Database sync and server start
    const syncDatabase = async () => {
        try {
            await sequelize.sync({});
            console.log('Database synced successfully!');
            
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        } catch (error) {
            console.error('Error syncing database:', error);
        }
    };

    // Test database connection and start server
    sequelize.authenticate()
        .then(() => {
            console.log('Database connection has been established successfully.');
            syncDatabase();
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}