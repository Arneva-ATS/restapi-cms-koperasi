"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const responseHandler_1 = require("../helpers/responses/responseHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return (0, responseHandler_1.handleServerError)(res, 401, 'Access denied. No token provided.');
    }
    const token = authorization.split(' ')[1];
    if (!token) {
        return (0, responseHandler_1.handleServerError)(res, 401, 'Access denied. Invalid token format.');
    }
    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        return (0, responseHandler_1.handleServerError)(res, 401, 'Access denied. Invalid token.');
    }
};
exports.isAuthenticated = isAuthenticated;
