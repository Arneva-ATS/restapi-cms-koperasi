"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdsContentSchema = exports.createAdsContentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation Input Create AdsContent
const createAdsContentSchema = joi_1.default.object({
    title: joi_1.default.string().max(50).required(),
    content: joi_1.default.string(),
    publisher: joi_1.default.string().max(255).required(),
    image: joi_1.default.object({
        mimetype: joi_1.default.string().valid('image/jpeg', 'image/png', 'image/webp').required(),
        size: joi_1.default.number().max(2 * 1024 * 1024).required(), // Ukuran maksimal 2 MB
    }).required(),
    url: joi_1.default.string().max(255).required(),
    status: joi_1.default.string().valid('post', 'draft').required(),
    cooperative_center_code: joi_1.default.string().max(30).allow(null).optional(),
    cooperative_branch_code: joi_1.default.string().max(30).allow(null).optional(),
});
exports.createAdsContentSchema = createAdsContentSchema;
// Validation Input Update AdsContent
const updateAdsContentSchema = joi_1.default.object({
    title: joi_1.default.string().max(50),
    content: joi_1.default.string(),
    publisher: joi_1.default.string().max(255),
    image: joi_1.default.object({
        mimetype: joi_1.default.string().valid('image/jpeg', 'image/png', 'image/webp'),
        size: joi_1.default.number().max(2 * 1024 * 1024), // Ukuran maksimal 2 MB
    }),
    url: joi_1.default.string().max(255),
    status: joi_1.default.string().valid('post', 'draft'),
    cooperative_center_code: joi_1.default.string().max(30).allow(null).optional(),
    cooperative_branch_code: joi_1.default.string().max(30).allow(null).optional(),
});
exports.updateAdsContentSchema = updateAdsContentSchema;
