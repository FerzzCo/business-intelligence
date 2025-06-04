import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateTimeLogDto {
  @ApiProperty({
    example: '1403-03-20T09:00:00', 
    description: 'Clock in (Jalali, e.g. 1403-03-20T09:00:00)',
  })
  @IsString()
  clockIn: string;

  @ApiProperty({
    example: '1403-03-20T13:00:00',
    required: false,
    description: 'Clock out (Jalali, e.g. 1403-03-20T13:00:00)',
  })
  @IsString()
  clockOut?: string;

  @ApiProperty({ example: 'جلسه با تیم فنی', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
