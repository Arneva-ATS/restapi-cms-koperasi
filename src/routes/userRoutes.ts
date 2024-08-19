import { Router } from 'express';
import { createUser, findAllUsers, findUser, updateUser, deleteUser } from '../controllers/userController';
import {isAuthenticated} from '../middlewares/authMiddleware';

const router = Router();

// Get data all user
router.get('/users', isAuthenticated, findAllUsers);
// Get data user by id
router.get('/users/:id', isAuthenticated, findUser);
// Create data user
router.post('/users', isAuthenticated, createUser);
// Update data user
router.patch('/users/:id', isAuthenticated, updateUser);
// Delete data user
router.delete('/users/:id', isAuthenticated, deleteUser);

export default router;