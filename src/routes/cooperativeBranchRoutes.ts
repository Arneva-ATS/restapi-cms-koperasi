import { Router } from 'express';
import { createCooperativeBranch, findCooperativeBranchs, findCooperativeBranch, updateCooperativeBranch, deleteCooperativeBranch } from '../controllers/cooperativeBranchController';
import {isAuthenticated} from '../middlewares/authMiddleware';

const router = Router();

// Get data all cooperative branch
router.get('/cooperative-branch', isAuthenticated, findCooperativeBranchs);
// Get data cooperative branch by id
router.get('/cooperative-branch/:id', isAuthenticated, findCooperativeBranch);
// Create data cooperative branch
router.post('/cooperative-branch', isAuthenticated, createCooperativeBranch);
// Update data cooperative branch
router.patch('/cooperative-branch/:id', isAuthenticated, updateCooperativeBranch);
// Delete data cooperative branch
router.delete('/cooperative-branch/:id', isAuthenticated, deleteCooperativeBranch);

export default router;