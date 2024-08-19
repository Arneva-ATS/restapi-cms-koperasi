"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBilling = exports.updateBilling = exports.findBilling = exports.findAllBillings = exports.createBilling = void 0;
const luxon_1 = require("luxon");
const client_1 = require("@prisma/client");
const responseHandler_1 = require("../helpers/responses/responseHandler");
const billingValidator_1 = require("../helpers/validators/billingValidator");
const prisma = new client_1.PrismaClient();
const findAllBillings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBillings = yield prisma.billings.findMany();
        // check data length
        if (allBillings.length === 0) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Billing not found!');
        }
        // Response Success
        (0, responseHandler_1.handleSuccess)(allBillings, res, 200, 'Billings found successfully');
    }
    catch (error) {
        console.error('Error finding billings:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.findAllBillings = findAllBillings;
const findBilling = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const billingId = parseInt(req.params.id);
        const getBilling = yield prisma.billings.findUnique({
            where: {
                id: billingId
            }
        });
        if (!getBilling) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Billing not found!');
        }
        // Response Success
        (0, responseHandler_1.handleSuccess)(getBilling, res, 200, 'Billing found successfully');
    }
    catch (error) {
        console.error('Error finding billing:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.findBilling = findBilling;
const createBilling = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield billingValidator_1.createBillingSchema.validateAsync(req.body);
        // Validation Handler
        const { error, value } = billingValidator_1.createBillingSchema.validate(req.body);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
            return (0, responseHandler_1.handleServerError)(res, 400, formattedMessage);
        }
        const newBilling = yield prisma.billings.create({
            data: {
                title: req.body.title,
                price: req.body.price,
                payment_period: req.body.payment_period,
                description: req.body.description,
                status: req.body.status
            }
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)(newBilling, res, 200, 'Billing created successfully');
    }
    catch (error) {
        console.error('Error creating user:', error);
        // Response Error
        const formattedMessage = error.details.map((detail) => detail.message.replace(/"/g, '')).join(', ');
        (0, responseHandler_1.handleServerError)(res, 500, formattedMessage);
    }
});
exports.createBilling = createBilling;
const updateBilling = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const billingId = parseInt(req.params.id);
        const billingDataToUpdate = req.body;
        // Validation Handler
        const { error } = billingValidator_1.updateBillingSchema.validate(billingDataToUpdate);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
            return (0, responseHandler_1.handleServerError)(res, 400, formattedMessage);
        }
        // Check if billing exists
        const existingBilling = yield prisma.billings.findUnique({
            where: {
                id: billingId
            }
        });
        if (!existingBilling) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Billing not found!');
        }
        // Set updated_at to current date
        const currentDateTime = getCurrentDatetime();
        billingDataToUpdate.updated_at = currentDateTime.toISO();
        // Update billing
        const updatedBilling = yield prisma.billings.update({
            where: {
                id: billingId
            },
            data: billingDataToUpdate
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)(updatedBilling, res, 200, 'Billing updated successfully');
    }
    catch (error) {
        console.error('Error updating billing:', error);
        // Response Error
        const formattedMessage = error.details.map((detail) => detail.message.replace(/"/g, '')).join(', ');
        (0, responseHandler_1.handleServerError)(res, 500, formattedMessage);
    }
});
exports.updateBilling = updateBilling;
const deleteBilling = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const billingId = parseInt(req.params.id);
        // Check if billing exists
        const existingBilling = yield prisma.billings.findUnique({
            where: {
                id: billingId
            }
        });
        if (!existingBilling) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Billing not found!');
        }
        // Delete billing
        yield prisma.billings.delete({
            where: {
                id: billingId
            }
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)({}, res, 200, 'Billings deleted successfully');
    }
    catch (error) {
        console.error('Error deleting billing:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.deleteBilling = deleteBilling;
// Private Function handler
const getCurrentDatetime = () => {
    const currentDateTime = luxon_1.DateTime.now().setZone('Asia/Jakarta');
    return currentDateTime;
};
