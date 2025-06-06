import { Module } from '@nestjs/common';
import { TimeLogService } from './time-log.service';
import { TimeLogController } from './time-log.controller';
import { UserService } from '@app/user';

@Module({
  controllers: [TimeLogController],
  providers: [TimeLogService, UserService],
})
export class TimeLogModule {}
