"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cooperativeCenterController_1 = require("../controllers/cooperativeCenterController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Get data all cooperative center
router.get('/cooperative-center', authMiddleware_1.isAuthenticated, cooperativeCenterController_1.findCooperativeCenters);
// Get data cooperative center by id
router.get('/cooperative-center/:id', authMiddleware_1.isAuthenticated, cooperativeCenterController_1.findCooperativeCenter);
// Create data cooperative center
router.post('/cooperative-center', authMiddleware_1.isAuthenticated, cooperativeCenterController_1.createCooperativeCenter);
// Update data cooperative center
router.patch('/cooperative-center/:id', authMiddleware_1.isAuthenticated, cooperativeCenterController_1.updateCooperativeCenter);
// Delete data cooperative center
router.delete('/cooperative-center/:id', authMiddleware_1.isAuthenticated, cooperativeCenterController_1.deleteCooperativeCenter);
exports.default = router;
