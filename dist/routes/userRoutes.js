"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Get data all user
router.get('/users', authMiddleware_1.isAuthenticated, userController_1.findAllUsers);
// Get data user by id
router.get('/users/:id', authMiddleware_1.isAuthenticated, userController_1.findUser);
// Create data user
router.post('/users', authMiddleware_1.isAuthenticated, userController_1.createUser);
// Update data user
router.patch('/users/:id', authMiddleware_1.isAuthenticated, userController_1.updateUser);
// Delete data user
router.delete('/users/:id', authMiddleware_1.isAuthenticated, userController_1.deleteUser);
exports.default = router;
