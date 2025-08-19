import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Get all users from the database
  async getAllUsers() {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...user }) => user);
  }

  // Create a new user with hashed password
  async createUser(dto: CreateUserDto) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
      },
    });
    // Never return the password
    const { password, ...result } = user;
    return result;
  }

  // Update a user by id, hash password if present
  async updateUser(id: number, dto: UpdateUserDto) {
    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 12);
    }
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { password, ...result } = user;
    return result;
  }

  // Delete a user by id
  async deleteUser(id: number) {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    const { password, ...result } = user;
    return result;
  }

  // Find a user by email
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
