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
exports.deleteUser = exports.updateUser = exports.findUser = exports.findAllUsers = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const luxon_1 = require("luxon");
const client_1 = require("@prisma/client");
const responseHandler_1 = require("../helpers/responses/responseHandler");
const userValidator_1 = require("../helpers/validators/userValidator");
const prisma = new client_1.PrismaClient();
const findAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield prisma.users.findMany();
        // check data length
        if (allUsers.length === 0) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'User not found!');
        }
        // Response Success
        (0, responseHandler_1.handleSuccess)(allUsers, res, 200, 'Users found successfully');
    }
    catch (error) {
        console.error('Error finding users:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.findAllUsers = findAllUsers;
const findUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        const getUser = yield prisma.users.findUnique({
            where: {
                id: userId
            }
        });
        if (!getUser) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'User not found!');
        }
        // Response Success
        (0, responseHandler_1.handleSuccess)(getUser, res, 200, 'Users found successfully');
    }
    catch (error) {
        console.error('Error finding user:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.findUser = findUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        yield userValidator_1.createUserSchema.validateAsync(req.body);
        // Validation Handler
        const { error, value } = userValidator_1.createUserSchema.validate(req.body);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
            return (0, responseHandler_1.handleServerError)(res, 400, formattedMessage);
        }
        // Check User Email exists
        const existingEmail = yield prisma.users.findUnique({ where: { email: req.body.email } });
        if (existingEmail) {
            return (0, responseHandler_1.handleServerError)(res, 500, 'Email already exists');
        }
        // Check Cooperative Center and Cooperative Branch existence
        if (req.body.cooperative_center_code != null || req.body.cooperative_branch_code != null) {
            const [existingCooperativeCenter, existingCooperativeBranch] = yield Promise.all([
                req.body.cooperative_center_code ? prisma.cooperativeCenter.findUnique({ where: { code: req.body.cooperative_center_code } }) : null,
                req.body.cooperative_branch_code ? prisma.cooperativeBranch.findUnique({ where: { code: req.body.cooperative_branch_code } }) : null
            ]);
            if (req.body.cooperative_center_code && !existingCooperativeCenter) {
                return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative Center not found!');
            }
            if (req.body.cooperative_branch_code && !existingCooperativeBranch) {
                return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative Branch not found!');
            }
        }
        const code = generateUniqueCode();
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        const newUser = yield prisma.users.create({
            data: {
                code: code,
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role,
                token: token,
                cooperative_center_code: (_a = req.body.cooperative_center_code) !== null && _a !== void 0 ? _a : null,
                cooperative_branch_code: (_b = req.body.cooperative_branch_code) !== null && _b !== void 0 ? _b : null
            }
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)(newUser, res, 200, 'Users created successfully');
    }
    catch (error) {
        console.error('Error creating user:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        const userDataToUpdate = req.body;
        // Validation Handler
        const { error } = userValidator_1.updateUserSchema.validate(userDataToUpdate);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');
            return (0, responseHandler_1.handleServerError)(res, 400, formattedMessage);
        }
        // Check if user exists
        const existingUser = yield prisma.users.findUnique({
            where: {
                id: userId
            }
        });
        // Check User Email exists
        if (!existingUser) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'User not found!');
        }
        const existingEmail = yield prisma.users.findFirst({
            where: {
                email: req.body.email,
                NOT: {
                    id: userId,
                },
            },
        });
        if (existingEmail) {
            return (0, responseHandler_1.handleServerError)(res, 500, 'Email already exists');
        }
        // Check Cooperative Center and Cooperative Branch existence
        if (req.body.cooperative_center_code != null || req.body.cooperative_branch_code != null) {
            const [existingCooperativeCenter, existingCooperativeBranch] = yield Promise.all([
                req.body.cooperative_center_code ? prisma.cooperativeCenter.findUnique({ where: { code: req.body.cooperative_center_code } }) : null,
                req.body.cooperative_branch_code ? prisma.cooperativeBranch.findUnique({ where: { code: req.body.cooperative_branch_code } }) : null
            ]);
            if (req.body.cooperative_center_code && !existingCooperativeCenter) {
                return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative Center not found!');
            }
            if (req.body.cooperative_branch_code && !existingCooperativeBranch) {
                return (0, responseHandler_1.handleServerError)(res, 404, 'Cooperative Branch not found!');
            }
        }
        // Set updated_at to current date
        const currentDateTime = getCurrentDatetime();
        userDataToUpdate.updated_at = currentDateTime.toISO();
        // Update User
        const updatedUser = yield prisma.users.update({
            where: {
                id: userId
            },
            data: userDataToUpdate
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)(updatedUser, res, 200, 'Users updated successfully');
    }
    catch (error) {
        console.error('Error updating user:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.id);
        // Check if user exists
        const existingUser = yield prisma.users.findUnique({
            where: {
                id: userId
            }
        });
        if (!existingUser) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'User not found!');
        }
        // Delete user
        yield prisma.users.delete({
            where: {
                id: userId
            }
        });
        // Response Success
        (0, responseHandler_1.handleSuccess)({}, res, 200, 'Users deleted successfully');
    }
    catch (error) {
        console.error('Error deleting user:', error);
        (0, responseHandler_1.handleServerError)(res, 500, error.message);
    }
});
exports.deleteUser = deleteUser;
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
    const code = `AGT-${timestamp}${uuid}`;
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
