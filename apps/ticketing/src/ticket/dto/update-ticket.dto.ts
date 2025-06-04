import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';
import { TicketPriority, TicketStatus, TicketType } from './create-ticket.dto';

export class UpdateTicketDto {
  @ApiProperty({
    example: 'Updated title',
    description: 'New ticket title',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    example: 'New ticket description',
    description: 'New ticket description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  description?: string;

  @ApiProperty({
    example: TicketPriority.MEDIUM,
    enum: TicketPriority,
    description: 'New ticket priority',
    required: false,
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({
    example: TicketStatus.IN_PROGRESS,
    enum: TicketStatus,
    description: 'New ticket status',
    required: false,
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiProperty({
    example: TicketType.FEATURE,
    enum: TicketType,
    description: 'New ticket type',
    required: false,
  })
  @IsOptional()
  @IsEnum(TicketType)
  type?: TicketType;

  @ApiProperty({
    example: 3,
    description: 'New assigned user ID',
    required: false,
  })
  @IsOptional()
  @IsInt()
  assignedToId?: number;

  @ApiProperty({
    example: '1403-04-01T11:00:00',
    description: 'New ticket deadline (Jalali, e.g. 1403-04-01T11:00:00)',
    required: false,
  })
  @IsOptional()
  @IsString()
  deadlineJalali?: string;
}
