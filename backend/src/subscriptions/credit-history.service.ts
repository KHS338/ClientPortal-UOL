import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditHistory } from './credit-history.entity';
import { CreateCreditHistoryDto } from './dto/create-credit-history.dto';

@Injectable()
export class CreditHistoryService {
  constructor(
    @InjectRepository(CreditHistory)
    private creditHistoryRepository: Repository<CreditHistory>,
  ) {}

  /**
   * Create a new credit history entry
   */
  async create(createCreditHistoryDto: CreateCreditHistoryDto): Promise<CreditHistory> {
    const creditHistory = this.creditHistoryRepository.create(createCreditHistoryDto);
    return this.creditHistoryRepository.save(creditHistory);
  }

  /**
   * Get credit history for a specific user
   */
  async findByUserId(userId: number, limit: number = 50): Promise<CreditHistory[]> {
    return this.creditHistoryRepository.find({
      where: { userId },
      relations: ['userSubscription', 'userSubscription.subscription'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get credit history for a specific user and service type
   */
  async findByUserIdAndService(userId: number, serviceType: string, limit: number = 50): Promise<CreditHistory[]> {
    return this.creditHistoryRepository.find({
      where: { userId, serviceType },
      relations: ['userSubscription', 'userSubscription.subscription'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Log credit usage for role creation
   */
  async logCreditUsage(
    userId: number,
    userSubscriptionId: number,
    serviceType: string,
    serviceTitle: string,
    remainingCreditsAfter: number,
    roleTitle?: string,
    roleId?: number
  ): Promise<CreditHistory> {
    const description = roleTitle 
      ? `Credit used to create role: ${roleTitle} (${serviceTitle})`
      : `Credit used for ${serviceTitle} service`;

    const createDto: CreateCreditHistoryDto = {
      userId,
      userSubscriptionId,
      actionType: 'used',
      creditAmount: -1, // negative because credit was used
      remainingCreditsAfter,
      serviceType,
      serviceTitle,
      roleTitle,
      roleId,
      description,
    };

    return this.create(createDto);
  }

  /**
   * Log credit purchase
   */
  async logCreditPurchase(
    userId: number,
    userSubscriptionId: number,
    creditAmount: number,
    remainingCreditsAfter: number,
    serviceTitle: string,
    billingCycle: string
  ): Promise<CreditHistory> {
    const description = `${creditAmount} credits purchased for ${serviceTitle} (${billingCycle})`;

    const createDto: CreateCreditHistoryDto = {
      userId,
      userSubscriptionId,
      actionType: 'purchased',
      creditAmount,
      remainingCreditsAfter,
      serviceType: this.getServiceTypeFromTitle(serviceTitle),
      serviceTitle,
      description,
    };

    return this.create(createDto);
  }

  /**
   * Helper method to map service title to service type
   */
  private getServiceTypeFromTitle(serviceTitle: string): string {
    const titleMapping = {
      'CV Sourcing': 'cv-sourcing',
      'Prequalification': 'prequalification',
      '360/Direct': 'direct',
      'Lead Generation': 'lead-generation-job'
    };

    return titleMapping[serviceTitle] || 'unknown';
  }
}
