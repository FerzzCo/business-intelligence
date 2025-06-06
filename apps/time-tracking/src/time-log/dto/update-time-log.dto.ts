import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTimeLogDto {
  @ApiProperty({ example: 'جلسه با تیم فنی', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: '1403-03-21T10:00:00',
    required: false,
    description: 'Clock in (Jalali, e.g. 1403-03-21T10:00:00)',
  })
  @IsString()
  @IsOptional()
  clockIn?: string;

  @ApiProperty({
    example: '1403-03-21T15:00:00',
    required: false,
    description: 'Clock out (Jalali, e.g. 1403-03-21T15:00:00)',
  })
  @IsString()
  @IsOptional()
  clockOut?: string;

  @ApiProperty({ example: 'جلسه با تیم فنی', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
