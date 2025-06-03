import { Module } from '@nestjs/common';
import { TicketingController } from './ticketing.controller';
import { TicketingService } from './ticketing.service';

@Module({
  imports: [],
  controllers: [TicketingController],
  providers: [TicketingService],
})
export class TicketingModule {}
