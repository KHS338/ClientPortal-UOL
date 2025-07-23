import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscription } from './user-subscription.entity';
import { Subscription } from './subscription.entity';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';

@Injectable()
export class UserSubscriptionService {
  constructor(
    @InjectRepository(UserSubscription)
    private userSubscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createUserSubscriptionDto: CreateUserSubscriptionDto): Promise<UserSubscription> {
    // Validate subscription exists
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: createUserSubscriptionDto.subscriptionId }
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Deactivate any existing active subscriptions for this user
    await this.userSubscriptionRepository.update(
      { userId: createUserSubscriptionDto.userId, status: 'active' },
      { status: 'cancelled' }
    );

    // Calculate dates
    const now = new Date();
    const startDate = createUserSubscriptionDto.startDate ? new Date(createUserSubscriptionDto.startDate) : now;
    
    let endDate: Date | null = null;
    let dueDate: Date | null = null;
    let nextRenewalDate: Date | null = null;

    if (createUserSubscriptionDto.billingCycle === 'monthly') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      dueDate = new Date(endDate);
      dueDate.setDate(dueDate.getDate() - 3); // Due 3 days before end
      nextRenewalDate = new Date(endDate);
    } else if (createUserSubscriptionDto.billingCycle === 'annual') {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      dueDate = new Date(endDate);
      dueDate.setDate(dueDate.getDate() - 7); // Due 7 days before end
      nextRenewalDate = new Date(endDate);
    }
    // For adhoc, dates remain null

    const userSubscription = this.userSubscriptionRepository.create({
      ...createUserSubscriptionDto,
      startDate,
      endDate,
      dueDate,
      nextRenewalDate,
      remainingCredits: createUserSubscriptionDto.totalCredits,
      usedCredits: 0,
      status: createUserSubscriptionDto.status || 'active'
    });

    try {
      const savedSubscription = await this.userSubscriptionRepository.save(userSubscription);
      return savedSubscription;
    } catch (error) {
      console.error('Error saving user subscription:', error);
      throw error;
    }
  }

  async findByUserId(userId: number): Promise<UserSubscription[]> {
    return this.userSubscriptionRepository.find({
      where: { userId },
      relations: ['subscription'],
      order: { createdAt: 'DESC' }
    });
  }

  async findActiveByUserId(userId: number): Promise<UserSubscription | null> {
    return this.userSubscriptionRepository.findOne({
      where: { userId, status: 'active' },
      relations: ['subscription'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<UserSubscription> {
    const userSubscription = await this.userSubscriptionRepository.findOne({
      where: { id },
      relations: ['subscription', 'user']
    });

    if (!userSubscription) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    return userSubscription;
  }

  async update(id: number, updateUserSubscriptionDto: UpdateUserSubscriptionDto): Promise<UserSubscription> {
    const userSubscription = await this.findOne(id);
    Object.assign(userSubscription, updateUserSubscriptionDto);
    return this.userSubscriptionRepository.save(userSubscription);
  }

  async useCredits(userId: number, creditsToUse: number): Promise<boolean> {
    const activeSubscription = await this.findActiveByUserId(userId);
    
    if (!activeSubscription || activeSubscription.remainingCredits < creditsToUse) {
      return false; // Insufficient credits
    }

    activeSubscription.usedCredits += creditsToUse;
    activeSubscription.remainingCredits -= creditsToUse;

    await this.userSubscriptionRepository.save(activeSubscription);
    return true;
  }

  async addAdhocCredits(userId: number, subscriptionId: number, credits: number, paidAmount: number, paymentIntentId: string): Promise<UserSubscription> {
    // Check if user has existing adhoc subscription for this service
    const existingAdhoc = await this.userSubscriptionRepository.findOne({
      where: { 
        userId, 
        subscriptionId, 
        billingCycle: 'adhoc',
        status: 'active'
      }
    });

    if (existingAdhoc) {
      // Add to existing adhoc credits
      existingAdhoc.totalCredits += credits;
      existingAdhoc.remainingCredits += credits;
      existingAdhoc.paidAmount += paidAmount;
      return this.userSubscriptionRepository.save(existingAdhoc);
    } else {
      // Create new adhoc subscription
      return this.create({
        userId,
        subscriptionId,
        billingCycle: 'adhoc',
        paidAmount,
        currency: 'GBP',
        totalCredits: credits,
        paymentIntentId,
        status: 'active'
      });
    }
  }

  async getTotalRemainingCredits(userId: number): Promise<number> {
    const subscriptions = await this.userSubscriptionRepository.find({
      where: { userId, status: 'active' }
    });

    return subscriptions.reduce((total, sub) => total + sub.remainingCredits, 0);
  }

  async getSubscriptionSummary(userId: number) {
    const activeSubscription = await this.findActiveByUserId(userId);
    const totalCredits = await this.getTotalRemainingCredits(userId);
    const allSubscriptions = await this.findByUserId(userId);

    return {
      activeSubscription,
      totalRemainingCredits: totalCredits,
      subscriptionHistory: allSubscriptions
    };
  }

  async checkExpiredSubscriptions(): Promise<void> {
    const now = new Date();
    
    // Find expired subscriptions
    const expiredSubscriptions = await this.userSubscriptionRepository.find({
      where: { status: 'active' },
      relations: ['subscription']
    });

    for (const subscription of expiredSubscriptions) {
      if (subscription.endDate && subscription.endDate <= now) {
        subscription.status = 'expired';
        await this.userSubscriptionRepository.save(subscription);
      }
    }
  }
}
