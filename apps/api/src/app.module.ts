import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TemplatesModule } from './templates/templates.module';
import { ResumesModule } from './resumes/resumes.module';
import { FilesModule } from './files/files.module';
import { PdfGeneratorModule } from './pdf-generator/pdf-generator.module';
import appConfig from './config'; // Import the default exported configuration

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
      envFilePath: `../../.env` // Load .env from monorepo root
    }),
    AuthModule,
    UsersModule,
    TemplatesModule,
    ResumesModule,
    FilesModule,
    PdfGeneratorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
