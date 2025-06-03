import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '@app/prisma';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
