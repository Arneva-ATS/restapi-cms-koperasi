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
exports.deleteCooperativeCenter = exports.updateCooperativeCenter = exports.findCooperativeCenter = exports.findCooperativeCenters = exports.createCooperativeCenter = void 0;
const luxon_1 = require("luxon");
const client_1 = require("@prisma/client");
const responseHandler_1 = require("../helpers/responses/responseHandler");
const cooperativeCenterValidator_1 = require("../helpers/validators/cooperativeCenterValidator");
const prisma = new client_1.PrismaClient();
const findCooperativeCenters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cooperativeCenters = yield prisma.cooperativeCenter.findMany();
        // check data length
        if (cooperativeCenters.length === 0) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative center not found!');
        }
        // Response Success
        (0, responseHandler_1.handleSuccess)(cooperativeCenters, res, 200, 'Cooperative Center found successfully');
    }
    catch (error) {
        console.error('Error finding cooperative center:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.findCooperativeCenters = findCooperativeCenters;
const findCooperativeCenter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cooperativeCenterId = parseInt(req.params.id);
        const getCooperativeCenter = yield prisma.cooperativeCenter.findUnique({
            where: {
                id: cooperativeCenterId
            }
        });
        if (!getCooperativeCenter) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative center not found!');
        }
        // Response Success
        (0, responseHandler_1.handleSuccess)(getCooperativeCenter, res, 200, 'Cooperative center found successfully');
    }
    catch (error) {
        console.error('Error finding cooperative center:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.findCooperativeCenter = findCooperativeCenter;
const createCooperativeCenter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cooperativeCenterValidator_1.createCooperativeCenterSchema.validateAsync(req.body);
        // Validation Handler
        const { error, value } = cooperativeCenterValidator_1.createCooperativeCenterSchema.validate(req.body);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
            return (0, responseHandler_1.handleServerError)(res, 400, formattedMessage);
        }
        const code = generateUniqueCode();
        const newCooperativeCenter = yield prisma.cooperativeCenter.create({
            data: {
                code: code,
                name: req.body.name,
                status: "inactive",
                valid_until_date: null,
                billing_id: null
            }
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)(newCooperativeCenter, res, 200, 'Cooperative center created successfully');
    }
    catch (error) {
        console.error('Error creating Cooperative center:', error);
        // Response Error
        const formattedMessage = error.details.map((detail) => detail.message.replace(/"/g, '')).join(', ');
        (0, responseHandler_1.handleServerError)(res, 500, formattedMessage);
    }
});
exports.createCooperativeCenter = createCooperativeCenter;
const updateCooperativeCenter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cooperativeCenterId = parseInt(req.params.id);
        const cooperativeCenterDataToUpdate = req.body;
        // Validation Handler
        const { error } = cooperativeCenterValidator_1.updateCooperativeCenterSchema.validate(cooperativeCenterDataToUpdate);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
            return (0, responseHandler_1.handleServerError)(res, 400, formattedMessage);
        }
        // Check if cooperative center exists
        const existingCooperativeCenter = yield prisma.cooperativeCenter.findUnique({
            where: {
                id: cooperativeCenterId
            }
        });
        if (!existingCooperativeCenter) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative center not found!');
        }
        // Set updated_at to current date
        const currentDateTime = getCurrentDatetime();
        cooperativeCenterDataToUpdate.updated_at = currentDateTime.toISO();
        // Update Cooperative Center
        const updatedCooperativeCenter = yield prisma.cooperativeCenter.update({
            where: {
                id: cooperativeCenterId
            },
            data: cooperativeCenterDataToUpdate
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)(updatedCooperativeCenter, res, 200, 'Cooperative center updated successfully');
    }
    catch (error) {
        console.error('Error updating cooperative center:', error);
        // Response Error
        const formattedMessage = error.details.map((detail) => detail.message.replace(/"/g, '')).join(', ');
        (0, responseHandler_1.handleServerError)(res, 500, formattedMessage);
    }
});
exports.updateCooperativeCenter = updateCooperativeCenter;
const deleteCooperativeCenter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cooperativeCenterId = parseInt(req.params.id);
        // Check if Cooperative Center exists
        const existingCooperativeCenter = yield prisma.cooperativeCenter.findUnique({
            where: {
                id: cooperativeCenterId
            }
        });
        if (!existingCooperativeCenter) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative center not found!');
        }
        // Delete Cooperative Center
        yield prisma.cooperativeCenter.delete({
            where: {
                id: cooperativeCenterId
            }
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)({}, res, 200, 'Cooperative center deleted successfully');
    }
    catch (error) {
        console.error('Error deleting cooperative center:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.deleteCooperativeCenter = deleteCooperativeCenter;
// Private Function handler
const getCurrentDatetime = () => {
    const currentDateTime = luxon_1.DateTime.now().setZone('Asia/Jakarta');
    return currentDateTime;
};
const generateUniqueCode = () => {
    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '').split('.')[0];
    // Generate UUID
    const uuid = generateUUID();
    // Combine timestamp, UUID, and "AGT-" prefix
    const code = `COOP-${timestamp}${uuid}`;
    return code;
};
// Function to generate UUID
const generateUUID = () => {
    let dt = new Date().getTime();
    const uuid = 'xxxxxyxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
};
