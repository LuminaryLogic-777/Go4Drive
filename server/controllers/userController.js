const User = require('../models/userModel');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { name } = req.body;
        const newUser = new User({ name });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
