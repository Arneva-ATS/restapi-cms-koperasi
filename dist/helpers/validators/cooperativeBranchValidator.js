"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCooperativeBranchSchema = exports.createCooperativeBranchSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation Input Create Cooperative Branch
const createCooperativeBranchSchema = joi_1.default.object({
    cooperative_center_code: joi_1.default.string().max(30).required(),
    name: joi_1.default.string().max(50).required(),
});
exports.createCooperativeBranchSchema = createCooperativeBranchSchema;
// Validation Input Update Cooperative Branch
const updateCooperativeBranchSchema = joi_1.default.object({
    cooperative_center_code: joi_1.default.string().max(30),
    name: joi_1.default.string().max(50),
});
exports.updateCooperativeBranchSchema = updateCooperativeBranchSchema;
