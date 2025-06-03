import { Test, TestingModule } from '@nestjs/testing';
import { TicketingController } from './ticketing.controller';
import { TicketingService } from './ticketing.service';

describe('TicketingController', () => {
  let ticketingController: TicketingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TicketingController],
      providers: [TicketingService],
    }).compile();

    ticketingController = app.get<TicketingController>(TicketingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ticketingController.getHello()).toBe('Hello World!');
    });
  });
});
