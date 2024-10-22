// src/types/express.d.ts

import { Request } from "express";
import { File } from "multer";

declare global {
	namespace Express {
		interface Request {
			files?: File[]; // For multiple file uploads
			file?: File; // For single file upload
		}
	}
}
