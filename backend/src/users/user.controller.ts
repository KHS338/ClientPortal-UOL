// backend/src/users/user.controller.ts
import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // 👈 Base route
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // 👈 Full route: GET /users
  async findAll() {
    return this.usersService.findAll();
  }

  @Post('register') // 👈 Full route: POST /users/register
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(createUserDto);
      return {
        success: true,
        message: 'User registered successfully',
        user: user
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.name
      };
    }
  }

  @Get('seed') // 👈 Full route: GET /users/seed
  async seed() {
    return this.usersService.createDummyUser();
  }
}
