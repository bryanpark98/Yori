// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';
import config from './config';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { cert, initializeApp } from 'firebase-admin/app';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';

initializeApp({
  credential: cert(config.firebaseKey as object),
  storageBucket: 'yori-d3f4e.appspot.com',
});

const bucket = getStorage().bucket();

export class ImageStorageManager {
  static async upload(file: Express.Multer.File, directory: string) {
    const fileBuffer = file.buffer;
    const downscaledBuffer = await sharp(fileBuffer).resize(800).toBuffer();

    const uniqueId = uuidv4();
    const fileObject = bucket.file(`${directory}/${uniqueId}`);

    await fileObject.save(downscaledBuffer, {
      contentType: file.mimetype,
    });

    return await getDownloadURL(fileObject);
  }

  static async getRandomProfilePicture() {
    const directory = 'profile_pictures/default';
    const [files] = await bucket.getFiles({
      prefix: directory,
    });

    if (!files || files.length === 0) {
      throw new Error('No profile pictures found');
    }

    const filesOnly = files.filter((file) => !file.name.endsWith('/'));

    if (filesOnly.length === 0) {
      throw new Error('No profile pictures found');
    }

    const randomIndex = Math.floor(Math.random() * filesOnly.length);
    const selectedFile = filesOnly[randomIndex];

    return await getDownloadURL(selectedFile);
  }
}
