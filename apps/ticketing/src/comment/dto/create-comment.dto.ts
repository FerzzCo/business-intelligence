import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'نیاز به اطلاعات بیشتر دارم.',
    description: 'متن کامنت (حداقل 2 کاراکتر).',
  })
  @IsString()
  @MinLength(2)
  content: string;
}
