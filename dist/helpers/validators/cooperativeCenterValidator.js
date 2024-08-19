"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCooperativeCenterSchema = exports.createCooperativeCenterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation Input Create CooperativeCenter
const createCooperativeCenterSchema = joi_1.default.object({
    name: joi_1.default.string().max(50).required(),
});
exports.createCooperativeCenterSchema = createCooperativeCenterSchema;
// Validation Input Update CooperativeCenter
const updateCooperativeCenterSchema = joi_1.default.object({
    name: joi_1.default.string().max(50),
});
exports.updateCooperativeCenterSchema = updateCooperativeCenterSchema;
