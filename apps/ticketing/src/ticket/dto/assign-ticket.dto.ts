import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignTicketDto {
  @ApiProperty({ example: 5, description: 'User ID to assign the ticket to' })
  @IsInt()
  assignedToId: number;
}
