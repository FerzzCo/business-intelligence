import { Controller, Get } from '@nestjs/common';
import { TicketingService } from './ticketing.service';

@Controller()
export class TicketingController {
  constructor(private readonly ticketingService: TicketingService) {}

  @Get()
  getHello(): string {
    return this.ticketingService.getHello();
  }
}
