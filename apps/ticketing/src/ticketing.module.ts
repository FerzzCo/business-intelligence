import { AuthModule } from '@app/auth';
import { PrismaModule } from '@app/prisma';
import { UserModule } from '@app/user';
import { Module } from '@nestjs/common';
import { TicketModule } from './ticket/ticket.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, TicketModule, CommentModule],
  controllers: [],
  providers: [],
})
export class TicketingModule {}
