import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { TimeLog } from '@prisma/client';
import { CreateTimeLogDto } from './dto/create-time-log.dto';
import { UpdateTimeLogDto } from './dto/update-time-log.dto';

@Injectable()
export class TimeLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTimeLogDto & { userId: number }): Promise<TimeLog> {
    return this.prisma.timeLog.create({
      data: {
        userId: dto.userId,
        clockIn: new Date(dto.clockIn),
        clockOut: dto.clockOut ? new Date(dto.clockOut) : null,
        note: dto.note,
      },
    });
  }

  async findByUserAndDateRange(
    userId: number,
    startDate: string,
    endDate: string,
  ): Promise<TimeLog[]> {
    const start = new Date(startDate + 'T00:00:00.000Z');
    const end = new Date(endDate + 'T23:59:59.999Z');
    return this.prisma.timeLog.findMany({
      where: {
        userId,
        clockIn: { gte: start, lte: end },
        isDeleted: false,
      },
      orderBy: { clockIn: 'asc' },
    });
  }

  async getSummaryByDateRange(
    userId: number,
    startDate: string,
    endDate: string,
  ): Promise<{ totalMinutes: number }> {
    const logs = await this.findByUserAndDateRange(userId, startDate, endDate);
    let totalMinutes = 0;
    for (const log of logs) {
      if (log.clockOut) {
        const diff =
          (new Date(log.clockOut).getTime() - new Date(log.clockIn).getTime()) /
          60000;
        totalMinutes += Math.max(0, Math.round(diff));
      }
    }
    return { totalMinutes };
  }

  async findOne(id: number): Promise<TimeLog | null> {
    return this.prisma.timeLog.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateTimeLogDto): Promise<TimeLog> {
    const existing = await this.prisma.timeLog.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('TimeLog not found');
    return this.prisma.timeLog.update({
      where: { id },
      data: {
        clockIn: dto.clockIn ? new Date(dto.clockIn) : undefined,
        clockOut: dto.clockOut ? new Date(dto.clockOut) : undefined,
        note: dto.note,
      },
    });
  }

  async softDelete(id: number): Promise<TimeLog> {
    const existing = await this.prisma.timeLog.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('TimeLog not found');
    return this.prisma.timeLog.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
