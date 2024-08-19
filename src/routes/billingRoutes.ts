import { Router } from 'express';
import { createBilling, findAllBillings, findBilling, updateBilling, deleteBilling } from '../controllers/billingController';
import {isAuthenticated} from '../middlewares/authMiddleware';

const router = Router();

// Get data all billing
router.get('/billings', isAuthenticated, findAllBillings);
// Get data billing by id
router.get('/billings/:id', isAuthenticated, findBilling);
// Create data billing
router.post('/billings', isAuthenticated, createBilling);
// Update data billing
router.patch('/billings/:id', isAuthenticated, updateBilling);
// Delete data billing
router.delete('/billings/:id', isAuthenticated, deleteBilling);

export default router;