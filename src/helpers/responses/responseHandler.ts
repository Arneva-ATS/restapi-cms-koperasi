import { Response } from 'express';

// Success Handler Response
export const handleSuccess = (data: any, res: Response, statusCode: number, message: string) => {
    // Set Response Data
    const response = {
      code: statusCode,
      success: true,
      message: message,
      data: data
    };

    res.status(statusCode).json(response);
};

// Error Handler Response
export const handleServerError = (res: Response, statusCode: number, message: any) => {
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