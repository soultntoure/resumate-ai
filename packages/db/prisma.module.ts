import { Module, Global } from '@nestjs/common';
import { PrismaService } from './index'; // Import PrismaService class

@Global() // Make PrismaService available throughout the application
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
