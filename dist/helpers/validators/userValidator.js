"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation Input Create User
const createUserSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.string().required(),
    cooperative_center_code: joi_1.default.string().allow(null).optional(),
    cooperative_branch_code: joi_1.default.string().allow(null).optional()
});
exports.createUserSchema = createUserSchema;
// Validation Input Update User
const updateUserSchema = joi_1.default.object({
    name: joi_1.default.string(),
    email: joi_1.default.string().email(),
    role: joi_1.default.string(),
    cooperative_center_code: joi_1.default.string().allow(null).optional(),
    cooperative_branch_code: joi_1.default.string().allow(null).optional()
});
exports.updateUserSchema = updateUserSchema;
