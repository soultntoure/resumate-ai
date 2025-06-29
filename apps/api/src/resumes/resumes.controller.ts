import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateResumeDto, UpdateResumeDto } from './dto';
import { Resume, User } from '@resumate-ai/types';

@Controller('resumes')
@UseGuards(AuthGuard('jwt'))
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  async create(@Request() req: { user: User }, @Body() createResumeDto: CreateResumeDto): Promise<Resume> {
    return this.resumesService.create(req.user.id, createResumeDto);
  }

  @Get()
  async findAll(@Request() req: { user: User }): Promise<Resume[]> {
    return this.resumesService.findAllForUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: { user: User }): Promise<Resume> {
    return this.resumesService.findOneForUser(req.user.id, id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Request() req: { user: User }, @Body() updateResumeDto: UpdateResumeDto): Promise<Resume> {
    return this.resumesService.update(req.user.id, id, updateResumeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: { user: User }): Promise<void> {
    await this.resumesService.remove(req.user.id, id);
  }

  @Post(':id/generate-pdf')
  async generatePdf(@Param('id') id: string, @Request() req: { user: User }): Promise<{ pdfUrl: string }> {
    return this.resumesService.generatePdfForUser(req.user.id, id);
  }
}
