import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignTicketDto {
  @ApiProperty({
    example: 'ce33f5b4-7bf7-4228-979d-1b525d966221',
    description: 'User ID to assign the ticket to',
  })
  @IsInt()
  assignedToId: string;
}
