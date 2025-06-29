import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@resumate-ai/db';
import { CreateResumeDto, UpdateResumeDto } from './dto';
import { Resume } from '@resumate-ai/types';
import { PdfGeneratorService } from '../pdf-generator/pdf-generator.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class ResumesService {
  constructor(
    private prisma: PrismaService,
    private pdfGeneratorService: PdfGeneratorService,
    private filesService: FilesService,
  ) {}

  async create(userId: string, createResumeDto: CreateResumeDto): Promise<Resume> {
    return this.prisma.resume.create({
      data: {
        userId,
        templateId: createResumeDto.templateId,
        data: createResumeDto.data,
      },
    });
  }

  async findAllForUser(userId: string): Promise<Resume[]> {
    return this.prisma.resume.findMany({ where: { userId } });
  }

  async findOneForUser(userId: string, id: string): Promise<Resume> {
    const resume = await this.prisma.resume.findUnique({ where: { id } });
    if (!resume) {
      throw new NotFoundException(`Resume with ID "${id}" not found.`);
    }
    if (resume.userId !== userId) {
      throw new ForbiddenException('Access to this resume is denied.');
    }
    return resume;
  }

  async update(userId: string, id: string, updateResumeDto: UpdateResumeDto): Promise<Resume> {
    const resume = await this.findOneForUser(userId, id); // Checks ownership and existence
    return this.prisma.resume.update({ where: { id }, data: updateResumeDto });
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOneForUser(userId, id); // Checks ownership and existence
    await this.prisma.resume.delete({ where: { id } });
  }

  async generatePdfForUser(userId: string, resumeId: string): Promise<{ pdfUrl: string }> {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
      include: { template: true },
    });

    if (!resume) {
      throw new NotFoundException(`Resume with ID "${resumeId}" not found.`);
    }
    if (resume.userId !== userId) {
      throw new ForbiddenException('Access to this resume is denied.');
    }

    // Assume template.content is HTML string for Puppeteer
    const htmlContent = resume.template.content; 
    const resumeData = resume.data as any; // Cast to any to access properties for templating

    // In a real scenario, you'd likely use a templating engine (e.g., Handlebars) 
    // to inject resumeData into htmlContent before passing to Puppeteer.
    // For boilerplate, we'll assume the HTML is pre-structured for data injection.
    const finalHtml = this.pdfGeneratorService.renderTemplate(htmlContent, resumeData);

    const pdfBuffer = await this.pdfGeneratorService.generatePdf(finalHtml);

    const fileName = `resumes/${userId}/${resumeId}.pdf`;
    const pdfUrl = await this.filesService.uploadFile(pdfBuffer, fileName, 'application/pdf');

    await this.prisma.resume.update({ where: { id: resumeId }, data: { pdfUrl } });

    return { pdfUrl };
  }
}
