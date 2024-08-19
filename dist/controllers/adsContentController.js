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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdsContent = exports.updateAdsContent = exports.findAdsContent = exports.findAllAdsContents = exports.createAdsContent = void 0;
const luxon_1 = require("luxon");
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("../helpers/utils/multer"));
const responseHandler_1 = require("../helpers/responses/responseHandler");
const adsContentValidator_1 = require("../helpers/validators/adsContentValidator");
const prisma = new client_1.PrismaClient();
const findAllAdsContents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allAdsContents = yield prisma.adsContent.findMany();
        // check data length
        if (allAdsContents.length === 0) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Ads Content not found!');
        }
        // Response Success
        (0, responseHandler_1.handleSuccess)(allAdsContents, res, 200, 'Ads Contents found successfully');
    }
    catch (error) {
        console.error('Error finding ads contents:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.findAllAdsContents = findAllAdsContents;
const findAdsContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adsContentId = parseInt(req.params.id);
        const getAdsContent = yield prisma.adsContent.findUnique({
            where: {
                id: adsContentId
            }
        });
        if (!getAdsContent) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Ads Content not found!');
        }
        // Response Success
        (0, responseHandler_1.handleSuccess)(getAdsContent, res, 200, 'Ads Content found successfully');
    }
    catch (error) {
        console.error('Error finding ads content:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.findAdsContent = findAdsContent;
const createAdsContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    multer_1.default.single('image');
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    return (0, responseHandler_1.handleSuccess)(req, res, 200, 'Ads Content created successfully');
});
exports.createAdsContent = createAdsContent;
const updateAdsContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adsContentId = parseInt(req.params.id);
        const adsContentDataToUpdate = req.body;
        // Validation Handler
        const { error } = adsContentValidator_1.updateAdsContentSchema.validate(adsContentDataToUpdate);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
            return (0, responseHandler_1.handleServerError)(res, 400, formattedMessage);
        }
        // Check if ads contents exists
        const existingAdsContent = yield prisma.adsContent.findUnique({
            where: {
                id: adsContentId
            }
        });
        if (!existingAdsContent) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Ads Content not found!');
        }
        // Set updated_at to current date
        const currentDateTime = getCurrentDatetime();
        adsContentDataToUpdate.updated_at = currentDateTime.toISO();
        // Update ads content
        const updatedAdsContent = yield prisma.adsContent.update({
            where: {
                id: adsContentId
            },
            data: adsContentDataToUpdate
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)(updatedAdsContent, res, 200, 'Ads Content updated successfully');
    }
    catch (error) {
        console.error('Error updating ads content:', error);
        // Response Error
        const formattedMessage = error.details.map((detail) => detail.message.replace(/"/g, '')).join(', ');
        (0, responseHandler_1.handleServerError)(res, 500, formattedMessage);
    }
});
exports.updateAdsContent = updateAdsContent;
const deleteAdsContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adsContentId = parseInt(req.params.id);
        // Check if ads content exists
        const existingAdsContent = yield prisma.adsContent.findUnique({
            where: {
                id: adsContentId
            }
        });
        if (!existingAdsContent) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'AdsContent not found!');
        }
        // Delete ads content
        yield prisma.adsContent.delete({
            where: {
                id: adsContentId
            }
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)({}, res, 200, 'Ads Content deleted successfully');
    }
    catch (error) {
        console.error('Error deleting ads content:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.deleteAdsContent = deleteAdsContent;
// Private Function handler
const getCurrentDatetime = () => {
    const currentDateTime = luxon_1.DateTime.now().setZone('Asia/Jakarta');
    return currentDateTime;
};
