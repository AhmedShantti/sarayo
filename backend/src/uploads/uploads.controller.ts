import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomBytes } from 'crypto';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

@ApiTags('Uploads')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly config: ConfigService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload a single product image (jpg/png/webp, max 5MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  // TODO: swap diskStorage for an S3 / Cloudinary storage engine in production
  // and return the CDN URL instead of a local /uploads path.
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_DEST ?? './uploads',
        filename: (_req, file, cb) => {
          const unique = randomBytes(16).toString('hex');
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE ?? '5242880', 10) },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Only JPG, PNG and WEBP images are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    // Served by the static-assets middleware configured in main.ts.
    const url = `/uploads/${file.filename}`;
    return {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url,
    };
  }
}
