"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cooperativeBranchController_1 = require("../controllers/cooperativeBranchController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Get data all cooperative branch
router.get('/cooperative-branch', authMiddleware_1.isAuthenticated, cooperativeBranchController_1.findCooperativeBranchs);
// Get data cooperative branch by id
router.get('/cooperative-branch/:id', authMiddleware_1.isAuthenticated, cooperativeBranchController_1.findCooperativeBranch);
// Create data cooperative branch
router.post('/cooperative-branch', authMiddleware_1.isAuthenticated, cooperativeBranchController_1.createCooperativeBranch);
// Update data cooperative branch
router.patch('/cooperative-branch/:id', authMiddleware_1.isAuthenticated, cooperativeBranchController_1.updateCooperativeBranch);
// Delete data cooperative branch
router.delete('/cooperative-branch/:id', authMiddleware_1.isAuthenticated, cooperativeBranchController_1.deleteCooperativeBranch);
exports.default = router;
