// backend/src/users/user.service.ts
import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      select: ['id', 'firstName', 'lastName', 'companymail', 'email', 'companyName', 'companySize', 'phone', 'isActive', 'subscriptionStatus', 'createdAt'], // Don't return password
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user already exists with either email
    const existingUser = await this.userRepo.findOne({
      where: [
        { companymail: createUserDto.companymail },
        { email: createUserDto.email }
      ]
    });
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // Create user entity
    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
      emailVerified: false,
      subscriptionStatus: 'inactive'
    });

    try {
      const savedUser = await this.userRepo.save(user);
      
      // Return user without password
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'companymail', 'email', 'companyName', 'companySize', 'phone', 'isActive', 'subscriptionStatus', 'createdAt']
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: [
        { companymail: email },
        { email: email }
      ]
    });
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepo.update(userId, { lastLogin: new Date() });
  }

  async updateSubscription(userId: number, subscriptionPlan: string, subscriptionStatus: string): Promise<void> {
    await this.userRepo.update(userId, { 
      subscriptionPlan, 
      subscriptionStatus 
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

    const hashedPassword = await bcrypt.hash('test1234', 10);

    const user = this.userRepo.create({
      firstName: 'John',
      lastName: 'Doe',
      companymail: 'seed@example.com',
      email: 'john.doe@personal.com',
      password: hashedPassword,
      companyName: 'Test Company',
      companySize: '11-50',
      phone: '+1234567890',
      avatar: null,
      isActive: true,
      emailVerified: true,
      subscriptionStatus: 'active'
    });
    
    const savedUser = await this.userRepo.save(user);
    const { password, ...userWithoutPassword } = savedUser;
    
    return { 
      message: 'Dummy user created successfully', 
      user: userWithoutPassword
    };
  }
}
