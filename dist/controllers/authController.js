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
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseHandler_1 = require("../helpers/responses/responseHandler");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'User not found!');
        }
        if (!user.password) {
            return (0, responseHandler_1.handleServerError)(res, 404, 'Password not set!');
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (isPasswordValid) {
            const payload = {
                id: user.id,
                code: user.code,
                name: user.name,
                role: user.role,
                cooperative_center_code: user.cooperative_center_code,
                cooperative_branch_code: user.cooperative_branch_code
            };
            const secret = process.env.JWT_SECRET;
            const expiresIn = 60 * 60 * 1;
            const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
            const dataCallback = {
                user: {
                    id: user.id,
                    code: user.code,
                    name: user.name,
                    role: user.role,
                    cooperative_center_code: user.cooperative_center_code,
                    cooperative_branch_code: user.cooperative_branch_code
                },
                token,
            };
            return (0, responseHandler_1.handleSuccess)(dataCallback, res, 200, 'Users found successfully');
        }
        else {
            return (0, responseHandler_1.handleServerError)(res, 403, 'Email or Password is Wrong');
        }
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
// export const logout = async (req: Request, res: Response) => {
//   req.logout();
//   res.status(200).json({ message: 'Logout successful' });
// };
