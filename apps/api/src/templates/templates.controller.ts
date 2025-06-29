import { Controller, Get, Param, UseGuards, Body, Post, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateTemplateDto, UpdateTemplateDto } from './dto';
import { User, Template } from '@resumate-ai/types';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  async findAll(): Promise<Template[]> {
    return this.templatesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Template | null> {
    return this.templatesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt')) // Admin-only route might be needed
  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto): Promise<Template> {
    return this.templatesService.create(createTemplateDto);
  }

  @UseGuards(AuthGuard('jwt')) // Admin-only route might be needed
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto): Promise<Template> {
    return this.templatesService.update(id, updateTemplateDto);
  }

  @UseGuards(AuthGuard('jwt')) // Admin-only route might be needed
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.templatesService.remove(id);
  }
}
