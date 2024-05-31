import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ConvertToWebpPipe implements PipeTransform {
  async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
    if (!file) {
      throw new BadRequestException('File upload request is empty');
    }

    const supportedFormats = ['image/jpeg', 'image/png', 'image/tiff'];
    if (!supportedFormats.includes(file.mimetype)) {
      throw new BadRequestException('File format is not supported');
    }

    try {
      const buffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      return {
        ...file,
        buffer: buffer,
        originalname:
          uniqueSuffix + '-' + file.originalname.replace(/\..+$/, '.webp'),
        mimetype: 'image/webp',
      };
    } catch (error) {
      throw new BadRequestException('Failed to convert image to WebP');
    }
  }
}

@Injectable()
export class ParseCategoriesPipe implements PipeTransform {
  transform(value: any): any {
    try {
      if (value.categories && typeof value.categories === 'string') {
        value.categories = JSON.parse(value.categories);
      }
    } catch (error) {
      throw new BadRequestException('Invalid JSON data for categories');
    }
    return value;
  }
}

@Injectable()
export class ConvertMultipleToWebpPipe implements PipeTransform {
  async transform(files: {
    [fieldname: string]: Express.Multer.File[];
  }): Promise<{ [fieldname: string]: Express.Multer.File[] }> {
    const supportedFormats = ['image/jpeg', 'image/png', 'image/tiff'];
    for (const fieldname in files) {
      const fileArray = files[fieldname];
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        if (!file || !supportedFormats.includes(file.mimetype)) {
          throw new BadRequestException('File format is not supported');
        }
        const buffer = await sharp(file.buffer)
          .webp({ quality: 80 })
          .toBuffer();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        fileArray[i] = {
          ...file,
          buffer: buffer,
          originalname:
            uniqueSuffix + '-' + file.originalname.replace(/\..+$/, '.webp'),
          mimetype: 'image/webp',
        };
      }
    }
    return files;
  }
}
