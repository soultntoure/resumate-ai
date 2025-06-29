import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, Res, UseGuards, Request, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from '@resumate-ai/types';

@Controller('files')
@UseGuards(AuthGuard('jwt'))
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req: { user: User },
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
        new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
      ],
    }))
    file: Express.Multer.File,
  ) {
    const path = `avatars/${req.user.id}/${Date.now()}-${file.originalname}`;
    const url = await this.filesService.uploadFile(file.buffer, path, file.mimetype);
    // You might want to update the user's avatar URL in the database here
    return { url };
  }

  @Get('download/:key(*)') // Catch-all for file key
  async downloadFile(@Param('key') key: string, @Res() res: Response) {
    const { stream, contentType } = await this.filesService.getFile(key);
    res.set({ 'Content-Type': contentType });
    stream.pipe(res);
  }
}
