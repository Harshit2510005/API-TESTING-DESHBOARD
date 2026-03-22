const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration Logic
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Registration attempt for:", email);

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({ email, password });
        
        // पासवर्ड हैशिंग
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log("✅ User registered successfully");
        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Login Logic (इसे जोड़ना अनिवार्य है)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || 'secret123', 
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
    // यह आपके बैकएंड टर्मिनल में एरर का असली कारण छापेगा
    console.log("FULL ERROR DETAILS:", err); 
    res.status(500).json({ error: err.message });
}
};