import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return this.prisma.user.create({
        data: { ...data, password: hashedPassword },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email is already in use');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      if (data.password !== undefined) {
        if (typeof data.password === 'string') {
          data.password = await bcrypt.hash(data.password, 10);
        } else if (
          typeof data.password === 'object' &&
          data.password !== null &&
          'set' in data.password &&
          typeof data.password.set === 'string'
        ) {
          data.password = { set: await bcrypt.hash(data.password.set, 10) };
        } else {
          throw new BadRequestException('Invalid password format');
        }
      }

      return await this.prisma.user.update({ where: { id }, data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email is already in use');
      }
      throw error;
    }
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.prisma.user.delete({ where: { id } });
  }
}
