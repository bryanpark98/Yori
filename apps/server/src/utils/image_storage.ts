import { Storage } from '@google-cloud/storage';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';
import config from './config';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const storage = new Storage({
  credentials: config.firebaseKey,
});

const bucket = storage.bucket('yori-images');

export class ImageStorageManager {
  static async upload(file: Express.Multer.File) {
    const fileBuffer = file.buffer;
    const downscaledBuffer = await sharp(fileBuffer).resize(800).toBuffer();

    const uniqueId = uuidv4();
    const fileObject = bucket.file(uniqueId);

    await fileObject.save(downscaledBuffer, {
      contentType: file.mimetype,
    });

    return `https://storage.cloud.google.com/${bucket.name}/${fileObject.name}`;
  }
}
