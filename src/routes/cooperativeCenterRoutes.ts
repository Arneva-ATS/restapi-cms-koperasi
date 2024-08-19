import { Router } from 'express';
import { createCooperativeCenter, findCooperativeCenters, findCooperativeCenter, updateCooperativeCenter, deleteCooperativeCenter } from '../controllers/cooperativeCenterController';
import {isAuthenticated} from '../middlewares/authMiddleware';

const router = Router();

// Get data all cooperative center
router.get('/cooperative-center', isAuthenticated, findCooperativeCenters);
// Get data cooperative center by id
router.get('/cooperative-center/:id', isAuthenticated, findCooperativeCenter);
// Create data cooperative center
router.post('/cooperative-center', isAuthenticated, createCooperativeCenter);
// Update data cooperative center
router.patch('/cooperative-center/:id', isAuthenticated, updateCooperativeCenter);
// Delete data cooperative center
router.delete('/cooperative-center/:id', isAuthenticated, deleteCooperativeCenter);

export default router;