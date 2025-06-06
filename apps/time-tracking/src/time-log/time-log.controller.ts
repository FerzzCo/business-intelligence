import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TimeLogService } from './time-log.service';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';
import { JwtAuthGuard } from '@app/auth';
import * as jalaali from 'jalaali-js';
import {
  jalaliDateTimeToGregorian,
  jalaliToGregorianString,
  mapTimeLogToJalaliClock,
} from '@app/utils';
import { UserService } from '@app/user';

@ApiTags('TimeLog')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('timelog')
export class TimeLogController {
  constructor(
    private readonly service: TimeLogService,
    private readonly userService: UserService,
  ) {}

  @Get('me')
  @ApiResponse({ status: 200, description: 'Get current user info.' })
  async getMe(@Req() req: any) {
    const userId = req.user.userId;
    const user = await this.userService.findOne(userId);
    return user;
  }

  @Post()
  @ApiBody({ type: CreateTimeLogDto })
  @ApiResponse({ status: 201, description: 'Create a new time log.' })
  async create(@Req() req: any, @Body() dto: CreateTimeLogDto) {
    const userId = req.user.userId;
    const clockIn = jalaliDateTimeToGregorian(dto.clockIn);
    const clockOut = dto.clockOut
      ? jalaliDateTimeToGregorian(dto.clockOut)
      : undefined;
    const timeLog = await this.service.create({
      ...dto,
      userId,
      clockIn,
      clockOut,
    });
    return mapTimeLogToJalaliClock(timeLog);
  }

  @Get('day')
  @ApiQuery({ name: 'year', type: Number, example: 1403, required: true })
  @ApiQuery({ name: 'month', type: Number, example: 3, required: true })
  @ApiQuery({ name: 'day', type: Number, example: 21, required: true })
  @ApiResponse({
    status: 200,
    description:
      'Get all time logs for the current user on a specific Jalali day.',
  })
  async findMyLogsByDay(
    @Req() req: any,
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('day') day: number,
  ) {
    const userId = req.user.userId;
    const gDateStr = jalaliToGregorianString(
      Number(year),
      Number(month),
      Number(day),
    );
    const logs = await this.service.findByUserAndDateRange(
      userId,
      gDateStr,
      gDateStr,
    );
    return Array.isArray(logs)
      ? logs.map(mapTimeLogToJalaliClock)
      : mapTimeLogToJalaliClock(logs);
  }

  @Get('month')
  @ApiQuery({ name: 'year', type: Number, example: 1403, required: true })
  @ApiQuery({ name: 'month', type: Number, example: 3, required: true })
  @ApiResponse({
    status: 200,
    description:
      'Get all time logs for the current user in a specific Jalali month.',
  })
  async findMyLogsByMonth(
    @Req() req: any,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const userId = req.user.userId;
    const y = Number(year);
    const m = Number(month);
    const startStr = jalaliToGregorianString(y, m, 1);
    const lastDay = jalaali.jalaaliMonthLength(y, m);
    const endStr = jalaliToGregorianString(y, m, lastDay);
    // Get all logs for the month
    const logs = await this.service.findByUserAndDateRange(
      userId,
      startStr,
      endStr,
    );
    // Group logs by Jalali date
    const grouped: Record<string, any[]> = {};
    for (const log of logs) {
      const jalaliDate = mapTimeLogToJalaliClock(log).clockIn.split(' ')[0]; // e.g., "1403-03-21"
      if (!grouped[jalaliDate]) grouped[jalaliDate] = [];
      grouped[jalaliDate].push(log);
    }
    // For each day, return summary (e.g., total worked minutes)
    const result: Record<string, any> = {};
    for (const date in grouped) {
      const dayLogs = grouped[date].map(mapTimeLogToJalaliClock);
      // Calculate total worked minutes for the day
      let totalMinutes = 0;
      for (const log of grouped[date]) {
        if (log.clockIn && log.clockOut) {
          const start = new Date(log.clockIn).getTime();
          const end = new Date(log.clockOut).getTime();
          totalMinutes += Math.floor((end - start) / 60000);
        }
      }
      result[date] = {
        logs: dayLogs,
        totalMinutes,
      };
    }
    return result;
  }

  @Get('day/summary')
  @ApiQuery({ name: 'year', type: Number, example: 1403, required: true })
  @ApiQuery({ name: 'month', type: Number, example: 3, required: true })
  @ApiQuery({ name: 'day', type: Number, example: 21, required: true })
  @ApiResponse({
    status: 200,
    description:
      'Get total worked minutes for the current user on a specific Jalali day.',
  })
  async getMyDaySummary(
    @Req() req: any,
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('day') day: number,
  ) {
    const userId = req.user.userId;
    const gDateStr = jalaliToGregorianString(
      Number(year),
      Number(month),
      Number(day),
    );
    return this.service.getSummaryByDateRange(userId, gDateStr, gDateStr);
  }

  @Get('month/summary')
  @ApiQuery({ name: 'year', type: Number, example: 1403, required: true })
  @ApiQuery({ name: 'month', type: Number, example: 3, required: true })
  @ApiResponse({
    status: 200,
    description:
      'Get total worked minutes for the current user in a specific Jalali month.',
  })
  async getMyMonthSummary(
    @Req() req: any,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const userId = req.user.userId;
    const y = Number(year);
    const m = Number(month);
    const startStr = jalaliToGregorianString(y, m, 1);
    const lastDay = jalaali.jalaaliMonthLength(y, m);
    const endStr = jalaliToGregorianString(y, m, lastDay);
    return this.service.getSummaryByDateRange(userId, startStr, endStr);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Get a single time log by ID.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const log = await this.service.findOne(id);
    return mapTimeLogToJalaliClock(log);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateTimeLogDto })
  @ApiResponse({ status: 200, description: 'Update a time log.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTimeLogDto,
  ) {
    const clockIn = dto.clockIn
      ? jalaliDateTimeToGregorian(dto.clockIn)
      : undefined;
    const clockOut = dto.clockOut
      ? jalaliDateTimeToGregorian(dto.clockOut)
      : undefined;
    const timeLog = await this.service.update(id, {
      ...dto,
      clockIn,
      clockOut,
    });
    return mapTimeLogToJalaliClock(timeLog);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Soft delete a time log.' })
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    const log = await this.service.softDelete(id);
    return mapTimeLogToJalaliClock(log);
  }
}
