"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServerError = exports.handleSuccess = void 0;
// Success Handler Response
const handleSuccess = (data, res, statusCode, message) => {
    // Set Response Data
    const response = {
        code: statusCode,
        success: true,
        message: message,
        data: data
    };
    res.status(statusCode).json(response);
};
exports.handleSuccess = handleSuccess;
// Error Handler Response
const handleServerError = (res, statusCode, message) => {
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'Internal server error';
    }
    // Set Response Data
    const response = {
        code: statusCode,
        success: false,
        message: message,
        data: {}
    };
    res.status(statusCode).json(response);
};
exports.handleServerError = handleServerError;
