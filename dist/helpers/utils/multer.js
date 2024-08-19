"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// export const handleUpload = (req: Request, res: Response, next: NextFunction) => {
//   const folderName = extractFolderName(req.baseUrl);
//   uploadSingle('image', folderName)(req, res, next);
// };
// const extractFolderName = (baseUrl: string): string => {
//   return baseUrl.split('/')[1];
// };
// const uploadSingle = (fieldName: string, folderName?: string) => {
//   const storage = multer.diskStorage({
//     destination: (req: Request, file, cb) => {
//       let uploadPath = 'public/images/';
//       if (folderName) {
//         uploadPath = `public/images/${folderName}/`;
//       }
//       cb(null, path.join(__dirname, uploadPath));
//     },
//     filename: (req: Request, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
//     },
//   });
//   return multer({ storage }).single(fieldName);
// };
const uploadSingle = (0, multer_1.default)({ dest: 'uploads/' });
exports.default = uploadSingle;
