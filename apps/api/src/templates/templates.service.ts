import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@resumate-ai/db';
import { CreateTemplateDto, UpdateTemplateDto } from './dto';
import { Template } from '@resumate-ai/types';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Template[]> {
    return this.prisma.template.findMany();
  }

  async findOne(id: string): Promise<Template | null> {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }
    return template;
  }

  async create(data: CreateTemplateDto): Promise<Template> {
    return this.prisma.template.create({ data });
  }

  async update(id: string, data: UpdateTemplateDto): Promise<Template> {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }
    return this.prisma.template.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }
    await this.prisma.template.delete({ where: { id } });
  }
}
