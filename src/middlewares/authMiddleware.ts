import { Request, Response, NextFunction } from 'express';
import { handleServerError } from '../helpers/responses/responseHandler';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return handleServerError(res, 401, 'Access denied. No token provided.');
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return handleServerError(res, 401, 'Access denied. Invalid token format.');
    }

    try {
        const secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret);

        req.user = decoded;
        next();
    } catch (err) {
        return handleServerError(res, 401, 'Access denied. Invalid token.');
    }
};
