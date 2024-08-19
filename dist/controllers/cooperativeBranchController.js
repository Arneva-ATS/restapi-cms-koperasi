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
exports.deleteCooperativeBranch = exports.updateCooperativeBranch = exports.findCooperativeBranch = exports.findCooperativeBranchs = exports.createCooperativeBranch = void 0;
const luxon_1 = require("luxon");
const client_1 = require("@prisma/client");
const responseHandler_1 = require("../helpers/responses/responseHandler");
const cooperativeBranchValidator_1 = require("../helpers/validators/cooperativeBranchValidator");
const prisma = new client_1.PrismaClient();
const findCooperativeBranchs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cooperativeBranchs = yield prisma.cooperativeBranch.findMany();
        // check data length
        if (cooperativeBranchs.length === 0) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative branch not found!');
        }
        // Response Success
        (0, responseHandler_1.handleSuccess)(cooperativeBranchs, res, 200, 'Cooperative branch found successfully');
    }
    catch (error) {
        console.error('Error finding cooperative branch:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.findCooperativeBranchs = findCooperativeBranchs;
const findCooperativeBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cooperativeBranchId = parseInt(req.params.id);
        const getCooperativeBranch = yield prisma.cooperativeBranch.findUnique({
            where: {
                id: cooperativeBranchId
            }
        });
        if (!getCooperativeBranch) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative branch not found!');
        }
        // Response Success
        (0, responseHandler_1.handleSuccess)(getCooperativeBranch, res, 200, 'Cooperative branch found successfully');
    }
    catch (error) {
        console.error('Error finding cooperative branch:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.findCooperativeBranch = findCooperativeBranch;
const createCooperativeBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cooperativeBranchValidator_1.createCooperativeBranchSchema.validateAsync(req.body);
        // Validation Handler
        const { error, value } = cooperativeBranchValidator_1.createCooperativeBranchSchema.validate(req.body);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
            return (0, responseHandler_1.handleServerError)(res, 400, formattedMessage);
        }
        // Check if Cooperative Center exists
        const existingCooperativeCenter = yield prisma.cooperativeCenter.findUnique({
            where: {
                code: req.body.cooperative_center_code
            }
        });
        if (!existingCooperativeCenter) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative Center not found!');
        }
        const code = generateUniqueCode();
        const newCooperativeBranch = yield prisma.cooperativeBranch.create({
            data: {
                code: code,
                name: req.body.name,
                status: "inactive",
                valid_until_date: null,
                cooperative_center_code: req.body.cooperative_center_code,
                billing_id: null
            }
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)(newCooperativeBranch, res, 200, 'Cooperative branch created successfully');
    }
    catch (error) {
        console.error('Error creating Cooperative branch:', error);
        // Response Error
        const formattedMessage = error.details.map((detail) => detail.message.replace(/"/g, '')).join(', ');
        (0, responseHandler_1.handleServerError)(res, 500, formattedMessage);
    }
});
exports.createCooperativeBranch = createCooperativeBranch;
const updateCooperativeBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cooperativeBranchId = parseInt(req.params.id);
        const cooperativeBranchDataToUpdate = req.body;
        const getCooperativeCenterCode = req.body.cooperative_center_code;
        // Validation Handler
        const { error } = cooperativeBranchValidator_1.updateCooperativeBranchSchema.validate(cooperativeBranchDataToUpdate);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
            return (0, responseHandler_1.handleServerError)(res, 400, formattedMessage);
        }
        // Check if cooperative branch exists
        const existingCooperativeBranch = yield prisma.cooperativeBranch.findUnique({
            where: {
                id: cooperativeBranchId
            }
        });
        if (!existingCooperativeBranch) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative center not found!');
        }
        if (getCooperativeCenterCode) {
            // Check if Cooperative Center exists
            const existingCooperativeCenter = yield prisma.cooperativeCenter.findUnique({
                where: {
                    code: req.body.cooperative_center_code
                }
            });
            if (!existingCooperativeCenter) {
                return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative Center not found!');
            }
        }
        // Set updated_at to current date
        const currentDateTime = getCurrentDatetime();
        cooperativeBranchDataToUpdate.updated_at = currentDateTime.toISO();
        // Update Cooperative Branch
        const updatedCooperativeBranch = yield prisma.cooperativeBranch.update({
            where: {
                id: cooperativeBranchId
            },
            data: cooperativeBranchDataToUpdate
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)(updatedCooperativeBranch, res, 200, 'Cooperative branch updated successfully');
    }
    catch (error) {
        console.error('Error updating cooperative branch:', error);
        // Response Error
        const formattedMessage = error.details.map((detail) => detail.message.replace(/"/g, '')).join(', ');
        (0, responseHandler_1.handleServerError)(res, 500, formattedMessage);
    }
});
exports.updateCooperativeBranch = updateCooperativeBranch;
const deleteCooperativeBranch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cooperativeBranchId = parseInt(req.params.id);
        // Check if Cooperative Branch exists
        const existingCooperativeBranch = yield prisma.cooperativeBranch.findUnique({
            where: {
                id: cooperativeBranchId
            }
        });
        if (!existingCooperativeBranch) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative center not found!');
        }
        // Delete Cooperative Branch
        yield prisma.cooperativeBranch.delete({
            where: {
                id: cooperativeBranchId
            }
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)({}, res, 200, 'Cooperative branch deleted successfully');
    }
    catch (error) {
        console.error('Error deleting cooperative branch:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.deleteCooperativeBranch = deleteCooperativeBranch;
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
    const code = `COOP-BR-${timestamp}${uuid}`;
    return code;
};
// Function to generate UUID
const generateUUID = () => {
    let dt = new Date().getTime();
    const uuid = 'xxyx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
};
