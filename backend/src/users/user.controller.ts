// backend/src/users/user.controller.ts
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users') // 👈 Base route
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // 👈 Full route: GET /users
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('seed') // 👈 Full route: GET /users/seed
  async seed() {
    return this.usersService.createDummyUser();
  }
}
