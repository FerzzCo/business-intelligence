import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    example: 'کامنت آپدیت شد.',
    description: 'متن جدید کامنت.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  content?: string;
}
