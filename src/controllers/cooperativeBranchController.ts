import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { PrismaClient } from '@prisma/client';
import { handleSuccess, handleServerError } from '../helpers/responses/responseHandler';
import { createCooperativeBranchSchema, updateCooperativeBranchSchema } from '../helpers/validators/cooperativeBranchValidator';
const prisma = new PrismaClient();

const findCooperativeBranchs = async (req: Request, res: Response) => {
    try {
        const cooperativeBranchs = await prisma.cooperativeBranch.findMany();

        // check data length
        if (cooperativeBranchs.length === 0) {
            return handleServerError(res, 404, 'Cooperative branch not found!');
        }

        // Response Success
        handleSuccess(cooperativeBranchs, res, 200, 'Cooperative branch found successfully');
    } catch (error:any) {
        console.error('Error finding cooperative branch:', error);
        handleServerError(res, 500, error.message);
    }
};

const findCooperativeBranch = async (req: Request, res: Response) => {
    try {
        const cooperativeBranchId = parseInt(req.params.id);
        const getCooperativeBranch = await prisma.cooperativeBranch.findUnique({
            where: {
                id: cooperativeBranchId
            }
        });

        if (!getCooperativeBranch) {
            return handleServerError(res, 404, 'Cooperative branch not found!');
        }

        // Response Success
        handleSuccess(getCooperativeBranch, res, 200, 'Cooperative branch found successfully');
    } catch (error:any) {
        console.error('Error finding cooperative branch:', error);
        handleServerError(res, 500, error.message);
    }
};

const createCooperativeBranch = async (req: Request, res: Response) => {
    try {
        await createCooperativeBranchSchema.validateAsync(req.body);
        // Validation Handler
        const { error, value } = createCooperativeBranchSchema.validate(req.body);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');  
            return handleServerError(res, 400, formattedMessage);
        }

        // Check if Cooperative Center exists
        const existingCooperativeCenter = await prisma.cooperativeCenter.findUnique({
            where: {
                code: req.body.cooperative_center_code
            }
        });
  
        if (!existingCooperativeCenter) {
            return handleServerError(res, 404, 'Cooperative Center not found!');
        }

        const code  = generateUniqueCode();
        const newCooperativeBranch = await prisma.cooperativeBranch.create({
            data: {
                code: code,
                name: req.body.name,
                status: "inactive",
                valid_until_date: null,
                cooperative_center_code: req.body.cooperative_center_code,
                billing_id: null
            }
        });

        // Response Success
        handleSuccess(newCooperativeBranch, res, 200, 'Cooperative branch created successfully');
    } catch (error: any) {
        console.error('Error creating Cooperative branch:', error);
        // Response Error
        const formattedMessage = error.details.map((detail: any) => detail.message.replace(/"/g, '')).join(', ');  
        handleServerError(res, 500, formattedMessage);
    }
};

const updateCooperativeBranch = async (req: Request, res: Response) => {
    try {
        const cooperativeBranchId = parseInt(req.params.id);
        const cooperativeBranchDataToUpdate = req.body;
        const getCooperativeCenterCode = req.body.cooperative_center_code;
  
        // Validation Handler
        const { error } = updateCooperativeBranchSchema.validate(cooperativeBranchDataToUpdate);
        if (error) {
            const formattedMessage:any = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');  
            return handleServerError(res, 400, formattedMessage);
        }

        // Check if cooperative branch exists
        const existingCooperativeBranch = await prisma.cooperativeBranch.findUnique({
            where: {
                id: cooperativeBranchId
            }
        });
  
        if (!existingCooperativeBranch) {
            return handleServerError(res, 404, 'Cooperative center not found!');
        }

        if (getCooperativeCenterCode) {
            // Check if Cooperative Center exists
            const existingCooperativeCenter = await prisma.cooperativeCenter.findUnique({
                where: {
                    code: req.body.cooperative_center_code
                }
            });
    
            if (!existingCooperativeCenter) {
                return handleServerError(res, 404, 'Cooperative Center not found!');
            }
        }
  
        // Set updated_at to current date
        const currentDateTime = getCurrentDatetime();
        cooperativeBranchDataToUpdate.updated_at = currentDateTime.toISO();
        
        // Update Cooperative Branch
        const updatedCooperativeBranch = await prisma.cooperativeBranch.update({
            where: {
                id: cooperativeBranchId
            },
            data: cooperativeBranchDataToUpdate
        });
        
        // Response Success
        handleSuccess(updatedCooperativeBranch, res, 200, 'Cooperative branch updated successfully');
    } catch (error:any) {
        console.error('Error updating cooperative branch:', error);
        // Response Error
        const formattedMessage = error.details.map((detail: any) => detail.message.replace(/"/g, '')).join(', ');  
        handleServerError(res, 500, formattedMessage);
    }
};
  

const deleteCooperativeBranch = async (req: Request, res: Response) => {
    try {
        const cooperativeBranchId = parseInt(req.params.id);

        // Check if Cooperative Branch exists
        const existingCooperativeBranch = await prisma.cooperativeBranch.findUnique({
            where: {
                id: cooperativeBranchId
            }
        });

        if (!existingCooperativeBranch) {
            return handleServerError(res, 404, 'Cooperative center not found!');
        }

        // Delete Cooperative Branch
        await prisma.cooperativeBranch.delete({
            where: {
                id: cooperativeBranchId
            }
        });

        // Response Success
        handleSuccess({}, res, 200, 'Cooperative branch deleted successfully');
    } catch (error:any) {
        console.error('Error deleting cooperative branch:', error);
        handleServerError(res, 500, error.message);
    }
};

export { createCooperativeBranch, findCooperativeBranchs, findCooperativeBranch, updateCooperativeBranch, deleteCooperativeBranch };

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
  const code = `COOP-BR-${timestamp}${uuid}`;
  return code;
};

// Function to generate UUID
const generateUUID = (): string => {
  let dt = new Date().getTime();
  const uuid = 'xxyx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};