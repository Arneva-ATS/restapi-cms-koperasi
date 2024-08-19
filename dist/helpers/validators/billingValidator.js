"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBillingSchema = exports.createBillingSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation Input Create Billing
const createBillingSchema = joi_1.default.object({
    title: joi_1.default.string().max(50).required(),
    price: joi_1.default.number().integer().positive().required(),
    payment_period: joi_1.default.string().valid('one_month', 'three_months', 'six_months', 'one_year').required(),
    description: joi_1.default.string().max(255).allow(null).optional(),
    status: joi_1.default.string().valid('active', 'inactive').required(),
});
exports.createBillingSchema = createBillingSchema;
// Validation Input Update Billing
const updateBillingSchema = joi_1.default.object({
    title: joi_1.default.string().max(50),
    price: joi_1.default.number().integer().positive(),
    payment_period: joi_1.default.string().valid('one_month', 'three_months', 'six_months', 'one_year'),
    description: joi_1.default.string().max(255).allow(null).optional(),
    status: joi_1.default.string().valid('active', 'inactive'),
});
exports.updateBillingSchema = updateBillingSchema;
