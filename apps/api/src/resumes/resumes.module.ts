import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { PrismaModule } from '@resumate-ai/db/prisma.module';
import { PdfGeneratorModule } from '../pdf-generator/pdf-generator.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [PrismaModule, PdfGeneratorModule, FilesModule],
  providers: [ResumesService],
  controllers: [ResumesController],
})
export class ResumesModule {}
