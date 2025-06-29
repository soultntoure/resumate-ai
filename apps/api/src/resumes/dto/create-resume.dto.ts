import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { IsJson } from '../../common/decorators/is-json.decorator'; // Assuming a custom decorator for JSON

export class CreateResumeDto {
  @IsNotEmpty()
  @IsString()
  templateId!: string;

  @IsNotEmpty()
  @IsObject() // Or IsJson if you have a custom validator for JSON string
  data!: Record<string, any>; // JSON blob of resume data
}
