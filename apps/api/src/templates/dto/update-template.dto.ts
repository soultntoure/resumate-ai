import { PartialType } from '@nestjs/mapped-types'; // Or use OmitType/PickType from @nestjs/swagger
import { CreateTemplateDto } from './create-template.dto';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {}
