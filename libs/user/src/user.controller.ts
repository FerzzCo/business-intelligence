import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'ثبت کاربر جدید' })
  @ApiResponse({ status: 201, description: 'کاربر ساخته شد.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'لیست کاربران' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت یک کاربر' })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'ویرایش کاربر' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف کاربر' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }
}
