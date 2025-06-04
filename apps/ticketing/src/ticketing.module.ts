import { AuthModule } from '@app/auth';
import { PrismaModule } from '@app/prisma';
import { UserModule } from '@app/user';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, PrismaModule, UserModule],
  controllers: [],
  providers: [],
})
export class TicketingModule {}
