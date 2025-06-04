import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/auth';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created.',
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'All users.',
    type: [UserResponseDto],
  })
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) =>
      plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }),
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'b7eab69f-df30-48d4-8a15-3575fc8e8dba',
  })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: UserResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'b7eab69f-df30-48d4-8a15-3575fc8e8dba',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated.',
    type: UserResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'b7eab69f-df30-48d4-8a15-3575fc8e8dba',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted.',
    type: UserResponseDto,
  })
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
