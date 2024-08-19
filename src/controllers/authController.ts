import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { handleSuccess, handleServerError } from '../helpers/responses/responseHandler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return handleServerError(res, 404, 'User not found!');
        }

        if (!user.password) {
            return handleServerError(res, 404, 'Password not set!');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const payload = {
                id: user.id,
                code: user.code,
                name: user.name,
                role: user.role,
				cooperative_center_code: user.cooperative_center_code,
				cooperative_branch_code: user.cooperative_branch_code
            };
			
            const secret = process.env.JWT_SECRET!;
            const expiresIn = 60 * 60 * 1;
            const token = jwt.sign(payload, secret, { expiresIn });

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
			}

			return handleSuccess(dataCallback, res, 200, 'Users found successfully');
        } else {
            return handleServerError(res, 403, 'Email or Password is Wrong');
        }
    } catch (error) {
        next(error);
    }
};

// export const logout = async (req: Request, res: Response) => {
//   req.logout();
//   res.status(200).json({ message: 'Logout successful' });
// };
