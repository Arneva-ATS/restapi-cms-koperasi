"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adsContentController_1 = require("../controllers/adsContentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Get data all ads content
router.get('/ads-contents', authMiddleware_1.isAuthenticated, adsContentController_1.findAllAdsContents);
// Get data ads content by id
router.get('/ads-contents/:id', authMiddleware_1.isAuthenticated, adsContentController_1.findAdsContent);
// Create data ads content
router.post('/ads-contents', authMiddleware_1.isAuthenticated, adsContentController_1.createAdsContent);
// Update data ads content
router.patch('/ads-contents/:id', authMiddleware_1.isAuthenticated, adsContentController_1.updateAdsContent);
// Delete data ads content
router.delete('/ads-contents/:id', authMiddleware_1.isAuthenticated, adsContentController_1.deleteAdsContent);
exports.default = router;
