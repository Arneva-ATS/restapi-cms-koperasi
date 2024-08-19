import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { PrismaClient } from '@prisma/client';
import { handleSuccess, handleServerError } from '../helpers/responses/responseHandler';
import { createBillingSchema, updateBillingSchema } from '../helpers/validators/billingValidator';
const prisma = new PrismaClient();

const findAllBillings = async (req: Request, res: Response) => {
    try {
        const allBillings = await prisma.billings.findMany();

        // check data length
        if (allBillings.length === 0) {
            return handleServerError(res, 404, 'Billing not found!');
        }

        // Response Success
        handleSuccess(allBillings, res, 200, 'Billings found successfully');
    } catch (error:any) {
        console.error('Error finding billings:', error);
        handleServerError(res, 500, error.message);
    }
};

const findBilling = async (req: Request, res: Response) => {
    try {
        const billingId = parseInt(req.params.id);
        const getBilling = await prisma.billings.findUnique({
            where: {
                id: billingId
            }
        });

        if (!getBilling) {
            return handleServerError(res, 404, 'Billing not found!');
        }

        // Response Success
        handleSuccess(getBilling, res, 200, 'Billing found successfully');
    } catch (error:any) {
        console.error('Error finding billing:', error);
        handleServerError(res, 500, error.message);
    }
};

const createBilling = async (req: Request, res: Response) => {
    try {

        await createBillingSchema.validateAsync(req.body);
        // Validation Handler
        const { error, value } = createBillingSchema.validate(req.body);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');  
            return handleServerError(res, 400, formattedMessage);
        }

        const newBilling = await prisma.billings.create({
            data: {
                title: req.body.title,
                price: req.body.price,
                payment_period: req.body.payment_period,
                description: req.body.description,
                status: req.body.status
            }
        });

        // Response Success
        handleSuccess(newBilling, res, 200, 'Billing created successfully');
    } catch (error:any) {
        console.error('Error creating user:', error);
        // Response Error
        const formattedMessage = error.details.map((detail: any) => detail.message.replace(/"/g, '')).join(', ');  
        handleServerError(res, 500, formattedMessage);
    }
};

const updateBilling = async (req: Request, res: Response) => {
    try {
        const billingId = parseInt(req.params.id);
        const billingDataToUpdate = req.body;
  
        // Validation Handler
        const { error } = updateBillingSchema.validate(billingDataToUpdate);
        if (error) {
            const formattedMessage = error.details.map(detail => detail.message.replace(/"/g, '')).join(', ');  
            return handleServerError(res, 400, formattedMessage);
        }

        // Check if billing exists
        const existingBilling = await prisma.billings.findUnique({
            where: {
                id: billingId
            }
        });
  
        if (!existingBilling) {
            return handleServerError(res, 404, 'Billing not found!');
        }
  
        // Set updated_at to current date
        const currentDateTime = getCurrentDatetime();
        billingDataToUpdate.updated_at = currentDateTime.toISO();
        
        // Update billing
        const updatedBilling = await prisma.billings.update({
            where: {
                id: billingId
            },
            data: billingDataToUpdate
        });
        
        // Response Success
        handleSuccess(updatedBilling, res, 200, 'Billing updated successfully');
    } catch (error:any) {
        console.error('Error updating billing:', error);
        // Response Error
        const formattedMessage = error.details.map((detail: any) => detail.message.replace(/"/g, '')).join(', ');  
        handleServerError(res, 500, formattedMessage);
    }
};
  

const deleteBilling = async (req: Request, res: Response) => {
    try {
        const billingId = parseInt(req.params.id);

        // Check if billing exists
        const existingBilling = await prisma.billings.findUnique({
            where: {
                id: billingId
            }
        });

        if (!existingBilling) {
            return handleServerError(res, 404, 'Billing not found!');
        }

        // Delete billing
        await prisma.billings.delete({
            where: {
                id: billingId
            }
        });

        // Response Success
        handleSuccess({}, res, 200, 'Billings deleted successfully');
    } catch (error:any) {
        console.error('Error deleting billing:', error);
        handleServerError(res, 500, error.message);
    }
};

export { createBilling, findAllBillings, findBilling, updateBilling, deleteBilling };


// Private Function handler

const getCurrentDatetime = (): DateTime => {
    const currentDateTime = DateTime.now().setZone('Asia/Jakarta');
    return currentDateTime;
};
