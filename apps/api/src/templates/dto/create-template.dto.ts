import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @IsNotEmpty()
  @IsString()
  content!: string; // HTML or JSON string
}
