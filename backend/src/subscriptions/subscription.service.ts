import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = this.subscriptionRepository.create(createSubscriptionDto);
    return this.subscriptionRepository.save(subscription);
  }

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', title: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id }
    });
    
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    
    return subscription;
  }

  async findByTitle(title: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { title }
    });
    
    if (!subscription) {
      throw new NotFoundException(`Subscription with title ${title} not found`);
    }
    
    return subscription;
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.findOne(id);
    Object.assign(subscription, updateSubscriptionDto);
    return this.subscriptionRepository.save(subscription);
  }

  async remove(id: number): Promise<void> {
    const subscription = await this.findOne(id);
    await this.subscriptionRepository.remove(subscription);
  }

  async seedData(): Promise<void> {
    const existingCount = await this.subscriptionRepository.count();
    
    if (existingCount > 0) {
      console.log('Subscription data already exists, skipping seed');
      return;
    }

    const subscriptions = [
      {
        title: 'CV Sourcing',
        description: 'Essential CV sourcing and basic candidate filtering',
        monthlyPrice: 19,
        monthlyPriceDisplay: '$19/mo',
        monthlyKey: 'cv-sourcing-monthly',
        monthlyCredits: 30,
        annualPrice: 190,
        annualPriceDisplay: '$190/yr',
        annualKey: 'cv-sourcing-annual',
        annualSavings: 'Save $38',
        annualCredits: 360,
        adhocPrice: 50,
        adhocPriceDisplay: '£50/credit',
        adhocKey: 'cv-sourcing-adhoc',
        creditPrice: 50.00,
        features: ['Basic CV Collection', 'Standard Filtering', 'Email Support', 'Monthly Reports'],
        isEnterprise: false,
        sortOrder: 1
      },
      {
        title: 'Prequalification',
        description: 'Comprehensive candidate prequalification and assessment',
        monthlyPrice: 39,
        monthlyPriceDisplay: '$39/mo',
        monthlyKey: 'prequalification-monthly',
        monthlyCredits: 30,
        annualPrice: 390,
        annualPriceDisplay: '$390/yr',
        annualKey: 'prequalification-annual',
        annualSavings: 'Save $78',
        annualCredits: 360,
        adhocPrice: 70,
        adhocPriceDisplay: '£70/credit',
        adhocKey: 'prequalification-adhoc',
        creditPrice: 70.00,
        features: ['Advanced CV Sourcing', 'Skill Assessment', 'Video Interviews', 'Priority Support', 'Weekly Reports'],
        isEnterprise: false,
        sortOrder: 2
      },
      {
        title: '360/Direct',
        description: 'Complete recruitment solution with direct placement services',
        monthlyPrice: 69,
        monthlyPriceDisplay: '$69/mo',
        monthlyKey: '360-direct-monthly',
        monthlyCredits: 30,
        annualPrice: 690,
        annualPriceDisplay: '$690/yr',
        annualKey: '360-direct-annual',
        annualSavings: 'Save $138',
        annualCredits: 360,
        adhocPrice: 90,
        adhocPriceDisplay: '£90/credit',
        adhocKey: '360-direct-adhoc',
        creditPrice: 90.00,
        features: ['Full 360° Assessment', 'Direct Placement', 'Custom Integrations', 'Dedicated Support', 'Real-time Analytics', 'White-label Options'],
        isEnterprise: false,
        sortOrder: 3
      },
      {
        title: 'Lead Generation',
        description: 'Comprehensive lead generation and outreach solution',
        monthlyPrice: 69,
        monthlyPriceDisplay: '$69/mo',
        monthlyKey: 'lead-generation-monthly',
        monthlyCredits: 30,
        annualPrice: 690,
        annualPriceDisplay: '$690/yr',
        annualKey: 'lead-generation-annual',
        annualSavings: 'Save $138',
        annualCredits: 360,
        adhocPrice: 110,
        adhocPriceDisplay: '£110/credit',
        adhocKey: 'lead-generation-adhoc',
        creditPrice: 110.00,
        features: ['Lead Identification', 'Contact Discovery', 'Email Campaigns', 'CRM Integration', 'Analytics Dashboard', 'Lead Scoring'],
        isEnterprise: false,
        sortOrder: 4
      },
      {
        title: 'VA',
        description: 'Complete recruitment solution with direct placement services',
        monthlyPrice: 69,
        monthlyPriceDisplay: '$69/mo',
        monthlyKey: 'va-monthly',
        monthlyCredits: 30,
        annualPrice: 690,
        annualPriceDisplay: '$690/yr',
        annualKey: 'va-annual',
        annualSavings: 'Save $138',
        annualCredits: 360,
        adhocPrice: 130,
        adhocPriceDisplay: '£130/credit',
        adhocKey: 'va-adhoc',
        creditPrice: 130.00,
        features: ['Full 360° Assessment', 'Direct Placement', 'Custom Integrations', 'Dedicated Support', 'Real-time Analytics', 'White-label Options'],
        isEnterprise: false,
        sortOrder: 5
      },
      {
        title: 'Enterprise',
        description: 'Fully customizable enterprise solution with dedicated support',
        monthlyPriceDisplay: 'Get Quote',
        monthlyKey: 'enterprise-monthly',
        annualPriceDisplay: 'Get Quote',
        annualKey: 'enterprise-annual',
        monthlyCredits: 0,
        annualCredits: 0,
        creditPrice: 0,
        features: ['Unlimited Everything', 'White-label Solution', 'Custom Development', '24/7 Priority Support', 'Dedicated Account Manager', 'SLA Guarantee', 'Custom Integrations', 'On-premise Deployment'],
        isEnterprise: true,
        sortOrder: 6
      }
    ];

    for (const subscriptionData of subscriptions) {
      const subscription = this.subscriptionRepository.create(subscriptionData);
      await this.subscriptionRepository.save(subscription);
    }

    console.log('Subscription data seeded successfully');
  }
}
