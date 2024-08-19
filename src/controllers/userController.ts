import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { DateTime } from 'luxon';
import { PrismaClient } from '@prisma/client';
import { handleSuccess, handleServerError } from '../helpers/responses/responseHandler';
import { createUserSchema, updateUserSchema } from '../helpers/validators/userValidator';
const prisma = new PrismaClient();

const findAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await prisma.users.findMany();

        // check data length
        if (allUsers.length === 0) {
            return handleServerError(res, 404, 'User not found!');
        }

        // Response Success
        handleSuccess(allUsers, res, 200, 'Users found successfully');
    } catch (error:any) {
        console.error('Error finding users:', error);
        handleServerError(res, 500, error.message);
    }
};

const findUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const getUser = await prisma.users.findUnique({
            where: {
                id: userId
            }
        });

        if (!getUser) {
            return handleServerError(res, 404, 'User not found!');
        }

        // Response Success
        handleSuccess(getUser, res, 200, 'Users found successfully');
    } catch (error:any) {
        console.error('Error finding user:', error);
        handleServerError(res, 500, error.message);
    }
};

const createUser = async (req: Request, res: Response) => {
    try {

        await createUserSchema.validateAsync(req.body);
        // Validation Handler
        const { error, value } = createUserSchema.validate(req.body);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');  
            return handleServerError(res, 400, formattedMessage);
        }

        // Check User Email exists
        const existingEmail = await prisma.users.findUnique({ where: { email: req.body.email } });
        if (existingEmail) {
            return handleServerError(res, 500, 'Email already exists');
        }
        
        // Check Cooperative Center and Cooperative Branch existence
        if (req.body.cooperative_center_code != null || req.body.cooperative_branch_code != null) {
            const [existingCooperativeCenter, existingCooperativeBranch] = await Promise.all([
                req.body.cooperative_center_code ? prisma.cooperativeCenter.findUnique({ where: { code: req.body.cooperative_center_code } }) : null,
                req.body.cooperative_branch_code ? prisma.cooperativeBranch.findUnique({ where: { code: req.body.cooperative_branch_code } }) : null
            ]);

            if (req.body.cooperative_center_code && !existingCooperativeCenter) {
                return handleServerError(res, 404, 'Cooperative Center not found!');
            }
        
            if (req.body.cooperative_branch_code && !existingCooperativeBranch) {
                return handleServerError(res, 404, 'Cooperative Branch not found!');
            }
        }

        const code  = generateUniqueCode();
        const token = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await prisma.users.create({
            data: {
                code: code,
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role,
                token: token,
                cooperative_center_code: req.body.cooperative_center_code ?? null,
                cooperative_branch_code: req.body.cooperative_branch_code ?? null
            }
        });

        // Response Success
        handleSuccess(newUser, res, 200, 'Users created successfully');
    } catch (error:any) {
        console.error('Error creating user:', error);
        handleServerError(res, 500, error.message);
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const userDataToUpdate = req.body;
  
        // Validation Handler
        const { error } = updateUserSchema.validate(userDataToUpdate);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');  
            return handleServerError(res, 400, formattedMessage);
        }
  
        // Check if user exists
        const existingUser = await prisma.users.findUnique({
            where: {
                id: userId
            }
        });
  
        // Check User Email exists
        if (!existingUser) {
            return handleServerError(res, 404, 'User not found!');
        }

        const existingEmail = await prisma.users.findFirst({
            where: {
                email: req.body.email,
                NOT: {
                    id: userId,
                },
            },
        });

        if (existingEmail) {
            return handleServerError(res, 500, 'Email already exists');
        }

        // Check Cooperative Center and Cooperative Branch existence
        if (req.body.cooperative_center_code != null || req.body.cooperative_branch_code != null) {
            const [existingCooperativeCenter, existingCooperativeBranch] = await Promise.all([
                req.body.cooperative_center_code ? prisma.cooperativeCenter.findUnique({ where: { code: req.body.cooperative_center_code } }) : null,
                req.body.cooperative_branch_code ? prisma.cooperativeBranch.findUnique({ where: { code: req.body.cooperative_branch_code } }) : null
            ]);

            if (req.body.cooperative_center_code && !existingCooperativeCenter) {
                return handleServerError(res, 404, 'Cooperative Center not found!');
            }
        
            if (req.body.cooperative_branch_code && !existingCooperativeBranch) {
                return handleServerError(res, 404, 'Cooperative Branch not found!');
            }
        }
  
        // Set updated_at to current date
        const currentDateTime = getCurrentDatetime();
        userDataToUpdate.updated_at = currentDateTime.toISO();
        
        // Update User
        const updatedUser = await prisma.users.update({
            where: {
                id: userId
            },
            data: userDataToUpdate
        });
        
        // Response Success
        handleSuccess(updatedUser, res, 200, 'Users updated successfully');
    } catch (error:any) {
        console.error('Error updating user:', error);
        handleServerError(res, 500, error.message);
    }
};
  

const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);

        // Check if user exists
        const existingUser = await prisma.users.findUnique({
            where: {
                id: userId
            }
        });

        if (!existingUser) {
            return handleServerError(res, 404, 'User not found!');
        }

        // Delete user
        await prisma.users.delete({
            where: {
                id: userId
            }
        });

        // Response Success
        handleSuccess({}, res, 200, 'Users deleted successfully');
    } catch (error:any) {
        console.error('Error deleting user:', error);
        handleServerError(res, 500, error.message);
    }
};


export { createUser, findAllUsers, findUser, updateUser, deleteUser };



// Private Function handler

const getCurrentDatetime = (): DateTime => {
    const currentDateTime = DateTime.now().setZone('Asia/Jakarta');
    return currentDateTime;
};

const generateUniqueCode = (): string => {
  // Generate timestamp
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '').split('.')[0];

  // Generate UUID
  const uuid = generateUUID();

  // Combine timestamp, UUID, and "AGT-" prefix
  const code = `AGT-${timestamp}${uuid}`;

  return code;
};

// Function to generate UUID
const generateUUID = (): string => {
  let dt = new Date().getTime();
  const uuid = 'xxxxxyxxx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};