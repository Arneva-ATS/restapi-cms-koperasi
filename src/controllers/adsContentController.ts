import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { PrismaClient } from '@prisma/client';
import uploadSingle from '../helpers/utils/multer';
import { handleSuccess, handleServerError } from '../helpers/responses/responseHandler';
import { createAdsContentSchema, updateAdsContentSchema } from '../helpers/validators/adsContentValidator';
import multer from 'multer';
const prisma = new PrismaClient();

const findAllAdsContents = async (req: Request, res: Response) => {
    try {
        const allAdsContents = await prisma.adsContent.findMany();

        // check data length
        if (allAdsContents.length === 0) {
            return handleServerError(res, 404, 'Ads Content not found!');
        }

        // Response Success
        handleSuccess(allAdsContents, res, 200, 'Ads Contents found successfully');
    } catch (error:any) {
        console.error('Error finding ads contents:', error);
        handleServerError(res, 500, error.message);
    }
};

const findAdsContent = async (req: Request, res: Response) => {
    try {
        const adsContentId = parseInt(req.params.id);
        const getAdsContent = await prisma.adsContent.findUnique({
            where: {
                id: adsContentId
            }
        });

        if (!getAdsContent) {
            return handleServerError(res, 404, 'Ads Content not found!');
        }

        // Response Success
        handleSuccess(getAdsContent, res, 200, 'Ads Content found successfully');
    } catch (error:any) {
        console.error('Error finding ads content:', error);
        handleServerError(res, 500, error.message);
    }
};

const createAdsContent = async (req: Request, res: Response) => {
    // uploadSingle()
    return handleSuccess(req, res, 200, 'Ads Content created successfully');
};

const updateAdsContent = async (req: Request, res: Response) => {
    try {
        const adsContentId = parseInt(req.params.id);
        const adsContentDataToUpdate = req.body;
  
        // Validation Handler
        const { error } = updateAdsContentSchema.validate(adsContentDataToUpdate);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');  
            return handleServerError(res, 400, formattedMessage);
        }

        // Check if ads contents exists
        const existingAdsContent = await prisma.adsContent.findUnique({
            where: {
                id: adsContentId
            }
        });
  
        if (!existingAdsContent) {
            return handleServerError(res, 404, 'Ads Content not found!');
        }
  
        // Set updated_at to current date
        const currentDateTime = getCurrentDatetime();
        adsContentDataToUpdate.updated_at = currentDateTime.toISO();
        
        // Update ads content
        const updatedAdsContent = await prisma.adsContent.update({
            where: {
                id: adsContentId
            },
            data: adsContentDataToUpdate
        });
        
        // Response Success
        handleSuccess(updatedAdsContent, res, 200, 'Ads Content updated successfully');
    } catch (error:any) {
        console.error('Error updating ads content:', error);
        // Response Error
        const formattedMessage = error.details.map((detail: any) => detail.message.replace(/"/g, '')).join(', ');  
        handleServerError(res, 500, formattedMessage);
    }
};
  

const deleteAdsContent = async (req: Request, res: Response) => {
    try {
        const adsContentId = parseInt(req.params.id);

        // Check if ads content exists
        const existingAdsContent = await prisma.adsContent.findUnique({
            where: {
                id: adsContentId
            }
        });

        if (!existingAdsContent) {
            return handleServerError(res, 404, 'AdsContent not found!');
        }

        // Delete ads content
        await prisma.adsContent.delete({
            where: {
                id: adsContentId
            }
        });

        // Response Success
        handleSuccess({}, res, 200, 'Ads Content deleted successfully');
    } catch (error:any) {
        console.error('Error deleting ads content:', error);
        handleServerError(res, 500, error.message);
    }
};

export { createAdsContent, findAllAdsContents, findAdsContent, updateAdsContent, deleteAdsContent };


// Private Function handler

const getCurrentDatetime = (): DateTime => {
    const currentDateTime = DateTime.now().setZone('Asia/Jakarta');
    return currentDateTime;
};
