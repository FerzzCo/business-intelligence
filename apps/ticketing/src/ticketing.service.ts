import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketingService {
  getHello(): string {
    return 'Hello World!';
  }
}
