import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: string;

  @ApiProperty({ example: 'john@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'John' })
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Expose()
  lastName: string;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: 'employee' })
  @Expose()
  role: string;

  @ApiProperty({ example: '2025-06-04T12:05:39.565Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2025-06-04T12:06:00.000Z' })
  @Expose()
  updatedAt: Date;
}
