import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { PrismaClient } from '@prisma/client';
import { handleSuccess, handleServerError } from '../helpers/responses/responseHandler';
import { createCooperativeCenterSchema, updateCooperativeCenterSchema } from '../helpers/validators/cooperativeCenterValidator';
const prisma = new PrismaClient();

const findCooperativeCenters = async (req: Request, res: Response) => {
    try {
        const cooperativeCenters = await prisma.cooperativeCenter.findMany();

        // check data length
        if (cooperativeCenters.length === 0) {
            return handleServerError(res, 404, 'Cooperative center not found!');
        }

        // Response Success
        handleSuccess(cooperativeCenters, res, 200, 'Cooperative Center found successfully');
    } catch (error:any) {
        console.error('Error finding cooperative center:', error);
        handleServerError(res, 500, error.message);
    }
};

const findCooperativeCenter = async (req: Request, res: Response) => {
    try {
        const cooperativeCenterId = parseInt(req.params.id);
        const getCooperativeCenter = await prisma.cooperativeCenter.findUnique({
            where: {
                id: cooperativeCenterId
            }
        });

        if (!getCooperativeCenter) {
            return handleServerError(res, 404, 'Cooperative center not found!');
        }

        // Response Success
        handleSuccess(getCooperativeCenter, res, 200, 'Cooperative center found successfully');
    } catch (error:any) {
        console.error('Error finding cooperative center:', error);
        handleServerError(res, 500, error.message);
    }
};

const createCooperativeCenter = async (req: Request, res: Response) => {
    try {
        await createCooperativeCenterSchema.validateAsync(req.body);
        // Validation Handler
        const { error, value } = createCooperativeCenterSchema.validate(req.body);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');  
            return handleServerError(res, 400, formattedMessage);
        }

        const code  = generateUniqueCode();
        const newCooperativeCenter = await prisma.cooperativeCenter.create({
            data: {
                code: code,
                name: req.body.name,
                status: "inactive",
                valid_until_date: null,
                billing_id: null
            }
        });

        // Response Success
        handleSuccess(newCooperativeCenter, res, 200, 'Cooperative center created successfully');
    } catch (error: any) {
        console.error('Error creating Cooperative center:', error);
        // Response Error
        const formattedMessage = error.details.map((detail: any) => detail.message.replace(/"/g, '')).join(', ');  
        handleServerError(res, 500, formattedMessage);
    }
};

const updateCooperativeCenter = async (req: Request, res: Response) => {
    try {
        const cooperativeCenterId = parseInt(req.params.id);
        const cooperativeCenterDataToUpdate = req.body;
  
        // Validation Handler
        const { error } = updateCooperativeCenterSchema.validate(cooperativeCenterDataToUpdate);
        if (error) {
            const formattedMessage:any = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');  
            return handleServerError(res, 400, formattedMessage);
        }

        // Check if cooperative center exists
        const existingCooperativeCenter = await prisma.cooperativeCenter.findUnique({
            where: {
                id: cooperativeCenterId
            }
        });
  
        if (!existingCooperativeCenter) {
            return handleServerError(res, 404, 'Cooperative center not found!');
        }
  
        // Set updated_at to current date
        const currentDateTime = getCurrentDatetime();
        cooperativeCenterDataToUpdate.updated_at = currentDateTime.toISO();
        
        // Update Cooperative Center
        const updatedCooperativeCenter = await prisma.cooperativeCenter.update({
            where: {
                id: cooperativeCenterId
            },
            data: cooperativeCenterDataToUpdate
        });
        
        // Response Success
        handleSuccess(updatedCooperativeCenter, res, 200, 'Cooperative center updated successfully');
    } catch (error:any) {
        console.error('Error updating cooperative center:', error);
        // Response Error
        const formattedMessage = error.details.map((detail: any) => detail.message.replace(/"/g, '')).join(', ');  
        handleServerError(res, 500, formattedMessage);
    }
};
  

const deleteCooperativeCenter = async (req: Request, res: Response) => {
    try {
        const cooperativeCenterId = parseInt(req.params.id);

        // Check if Cooperative Center exists
        const existingCooperativeCenter = await prisma.cooperativeCenter.findUnique({
            where: {
                id: cooperativeCenterId
            }
        });

        if (!existingCooperativeCenter) {
            return handleServerError(res, 404, 'Cooperative center not found!');
        }

        // Delete Cooperative Center
        await prisma.cooperativeCenter.delete({
            where: {
                id: cooperativeCenterId
            }
        });

        // Response Success
        handleSuccess({}, res, 200, 'Cooperative center deleted successfully');
    } catch (error:any) {
        console.error('Error deleting cooperative center:', error);
        handleServerError(res, 500, error.message);
    }
};


export { createCooperativeCenter, findCooperativeCenters, findCooperativeCenter, updateCooperativeCenter, deleteCooperativeCenter };



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
  const code = `COOP-${timestamp}${uuid}`;

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