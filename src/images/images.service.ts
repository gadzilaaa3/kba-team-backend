import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { IImageResponse } from './dto/image-response.dto';

@Injectable()
export class ImagesService {
  async saveImage(
    mediaFile: Express.Multer.File,
    folder = 'images',
  ): Promise<IImageResponse> {
    const uploadFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadFolder);

    await writeFile(
      `${uploadFolder}/${mediaFile.originalname}`,
      mediaFile.buffer,
    );

    return {
      url: `/uploads/${folder}/${mediaFile.originalname}`,
      name: mediaFile.originalname,
    };
  }
}
