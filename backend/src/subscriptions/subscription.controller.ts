import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const subscription = await this.subscriptionService.create(createSubscriptionDto);
      return {
        success: true,
        message: 'Subscription created successfully',
        data: subscription
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create subscription',
          error: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const subscriptions = await this.subscriptionService.findAll();
      
      // Transform data to match frontend format
      const formattedSubscriptions = subscriptions.map(sub => ({
        id: sub.id, // Include the ID for user subscription creation
        title: sub.title,
        description: sub.description,
        monthlyPrice: sub.monthlyPrice, // Include raw price values
        annualPrice: sub.annualPrice,
        monthlyCredits: sub.monthlyCredits, // Include credit values
        annualCredits: sub.annualCredits,
        creditPrice: sub.creditPrice,
        monthly: sub.monthlyPrice ? {
          price: sub.monthlyPriceDisplay,
          key: sub.monthlyKey,
          credits: sub.monthlyCredits
        } : null,
        annual: sub.annualPrice ? {
          price: sub.annualPriceDisplay,
          key: sub.annualKey,
          savings: sub.annualSavings,
          credits: sub.annualCredits
        } : null,
        adhoc: sub.adhocPrice ? {
          price: sub.adhocPriceDisplay,
          key: sub.adhocKey
        } : null,
        features: sub.features,
        isEnterprise: sub.isEnterprise
      }));

      return {
        success: true,
        message: 'Subscriptions retrieved successfully',
        data: formattedSubscriptions
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve subscriptions',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const subscription = await this.subscriptionService.findOne(+id);
      return {
        success: true,
        message: 'Subscription retrieved successfully',
        data: subscription
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve subscription',
          error: error.message
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      const subscription = await this.subscriptionService.update(+id, updateSubscriptionDto);
      return {
        success: true,
        message: 'Subscription updated successfully',
        data: subscription
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to update subscription',
          error: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.subscriptionService.remove(+id);
      return {
        success: true,
        message: 'Subscription deleted successfully'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete subscription',
          error: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('seed')
  async seedData() {
    try {
      await this.subscriptionService.seedData();
      return {
        success: true,
        message: 'Subscription data seeded successfully'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to seed subscription data',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
