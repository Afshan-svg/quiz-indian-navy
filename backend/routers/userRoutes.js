const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route for creating a new user
router.post('/create-user', userController.createUser);
router.get('/get-users', userController.getAllUsers);
router.put('/users/:id', userController.editUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;