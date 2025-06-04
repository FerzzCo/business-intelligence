import { Module } from '@nestjs/common';
import { TimeLogModule } from './time-log/time-log.module';
import { AuthModule } from '@app/auth';
import { PrismaModule } from '@app/prisma';
import { UserModule } from '@app/user';

@Module({
  imports: [TimeLogModule, AuthModule, PrismaModule, UserModule],
  controllers: [],
  providers: [],
})
export class TimeTrackingModule {}
