import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ===== SELF-MANAGEMENT ENDPOINTS (placed BEFORE :id routes to avoid conflicts) =====
  // GET /users/profile - get own profile (Authenticated users)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getOwnProfile(@Request() req) {
    const userId = req.user.userId;
    return this.usersService.getUserById(userId);
  }

  // PATCH /users/profile - update own profile (Authenticated users)
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateOwnProfile(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateUserDto: UpdateUserDto,
    @Request() req
  ) {
    const userId = req.user.userId;
    return this.usersService.updateUser(userId, updateUserDto);
  }

  // PATCH /users/profile/password - change own password
  @UseGuards(JwtAuthGuard)
  @Patch('profile/password')
  async changeOwnPassword(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) body: ChangePasswordDto,
    @Request() req
  ) {
    const userId = req.user.userId;
    return this.usersService.changeOwnPassword(userId, body);
  }

  // DELETE /users/profile - delete own account (Authenticated users)
  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteOwnAccount(@Request() req) {
    const userId = req.user.userId;
    return this.usersService.deleteUser(userId);
  }

  // GET /users - returns all users (Admin only)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // POST /users - create a new user (Public for regular users, Admin for admin users)
  @Post()
  async createUser(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createUserDto: CreateUserDto
  ) {
    // Allow public registration for regular users
    // But require admin authentication for admin users
    if (createUserDto.role === UserRole.ADMIN) {
      throw new Error('Admin users can only be created by existing admins');
    }
    
    // Set default role to USER if not specified
    if (!createUserDto.role) {
      createUserDto.role = UserRole.USER;
    }
    
    return this.usersService.createUser(createUserDto);
  }

  // POST /users/admin - create admin users (Admin only)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin')
  async createAdminUser(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) createUserDto: CreateUserDto
  ) {
    // Ensure role is set to ADMIN for admin creation endpoint
    createUserDto.role = UserRole.ADMIN;
    return this.usersService.createUser(createUserDto);
  }

  // PATCH /users/:id - update a user (Admin only)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // DELETE /users/:id - delete a user (Admin only)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.deleteUser(id);
  }
}
