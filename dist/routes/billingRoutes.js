"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const billingController_1 = require("../controllers/billingController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Get data all billing
router.get('/billings', authMiddleware_1.isAuthenticated, billingController_1.findAllBillings);
// Get data billing by id
router.get('/billings/:id', authMiddleware_1.isAuthenticated, billingController_1.findBilling);
// Create data billing
router.post('/billings', authMiddleware_1.isAuthenticated, billingController_1.createBilling);
// Update data billing
router.patch('/billings/:id', authMiddleware_1.isAuthenticated, billingController_1.updateBilling);
// Delete data billing
router.delete('/billings/:id', authMiddleware_1.isAuthenticated, billingController_1.deleteBilling);
exports.default = router;
