// backend/src/users/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'email', 'isActive'], // Don't return password
    });
  }

  async createDummyUser() {
    // Check if user already exists
    const existingUser = await this.userRepo.findOne({
      where: { email: 'seed@example.com' }
    });
    
    if (existingUser) {
      return { message: 'Dummy user already exists', user: existingUser };
    }

    const user = this.userRepo.create({
      email: 'seed@example.com',
      password: 'test1234',
    });
    const savedUser = await this.userRepo.save(user);
    
    return { 
      message: 'Dummy user created successfully', 
      user: { id: savedUser.id, email: savedUser.email, isActive: savedUser.isActive }
    };
  }
}
