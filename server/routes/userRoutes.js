const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create a new user
router.post('/', userController.createUser);
router.get('/', userController.getUsers);


module.exports = router;
