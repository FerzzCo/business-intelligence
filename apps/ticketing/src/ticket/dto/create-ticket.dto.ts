import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export enum TicketType {
  BUG = 'BUG',
  FEATURE = 'FEATURE',
  SUPPORT = 'SUPPORT',
  PAYMENT = 'PAYMENT',
  OTHER = 'OTHER',
}

export class CreateTicketDto {
  @ApiProperty({
    example: 'Dashboard not loading',
    description: 'Ticket title',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: 'Dashboard does not show any data.',
    description: 'Ticket description',
  })
  @IsString()
  @MinLength(5)
  description: string;

  @ApiProperty({
    example: TicketPriority.HIGH,
    enum: TicketPriority,
    description: 'Ticket priority',
  })
  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @ApiProperty({
    example: TicketStatus.OPEN,
    enum: TicketStatus,
    description: 'Ticket status',
    required: false,
    default: TicketStatus.OPEN,
  })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus = TicketStatus.OPEN;

  @ApiProperty({
    example: TicketType.BUG,
    enum: TicketType,
    description: 'Ticket type',
  })
  @IsEnum(TicketType)
  type: TicketType;

  @ApiProperty({
    example: 'ce33f5b4-7bf7-4228-979d-1b525d966221',
    description: 'Assigned user ID',
    required: false,
  })
  @IsOptional()
  @IsInt()
  assignedToId?: string;

  @ApiProperty({
    example: '1403-03-21T13:00:00',
    description: 'Ticket deadline (Jalali, e.g. 1403-03-21T13:00:00)',
    required: false,
  })
  @IsOptional()
  @IsString()
  deadlineJalali?: string;
}
