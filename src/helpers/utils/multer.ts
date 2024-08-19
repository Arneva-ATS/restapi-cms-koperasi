import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

export const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  const folderName = extractFolderName(req.baseUrl);
  uploadSingle('image', folderName)(req, res, next);
};

const extractFolderName = (baseUrl: string): string => {
  return baseUrl.split('/')[1];
};

const uploadSingle = (fieldName: string, folderName?: string) => {
  const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
      let uploadPath = 'public/images/';

      if (folderName) {
        uploadPath = `public/images/${folderName}/`;
      }

      cb(null, path.join(__dirname, uploadPath));
    },
    filename: (req: Request, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
  });

  return multer({ storage }).single(fieldName);
};

export default uploadSingle;