import { Router } from 'express';
import { createAdsContent, findAllAdsContents, findAdsContent, updateAdsContent, deleteAdsContent } from '../controllers/adsContentController';
import {isAuthenticated} from '../middlewares/authMiddleware';
import uploadSingle from '../helpers/utils/multer';
const router = Router();

// Get data all ads content
router.get('/ads-contents', isAuthenticated, findAllAdsContents);
// Get data ads content by id
router.get('/ads-contents/:id', isAuthenticated, findAdsContent);
// Create data ads content
router.post('/ads-contents', isAuthenticated, uploadSingle('file' ,'ads-contents'), createAdsContent);
// Update data ads content
router.patch('/ads-contents/:id', isAuthenticated, updateAdsContent);
// Delete data ads content
router.delete('/ads-contents/:id', isAuthenticated, deleteAdsContent);

export default router;