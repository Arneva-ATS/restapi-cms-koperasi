import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import cooperativeCenterRoutes from './cooperativeCenterRoutes';
import cooperativeBranchRoutes from './cooperativeBranchRoutes';
import billingRoutes from './billingRoutes';
import adsContentRoutes from './adsContentRoutes';

const router = Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(cooperativeCenterRoutes);
router.use(cooperativeBranchRoutes);
router.use(billingRoutes);
router.use(adsContentRoutes);

export default router;