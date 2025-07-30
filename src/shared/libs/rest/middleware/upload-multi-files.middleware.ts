
import { Middleware } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import * as crypto from 'node:crypto';

export class UploadMultiFilesMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private maxCount?: number,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const fileName = crypto.randomUUID();

        callback(null, `${fileName}.${fileExtension}`);
      }
    });

    const uploadMultipleFilesMiddleware = multer({ storage }).array(this.fieldName, this.maxCount);

    uploadMultipleFilesMiddleware(req, res, next);
  }
}
