import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { UserSubscriptionService } from './user-subscription.service';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user-subscriptions')
@UseGuards(JwtAuthGuard)
export class UserSubscriptionController {
  constructor(private readonly userSubscriptionService: UserSubscriptionService) {}

  @Post()
  async create(@Body() createUserSubscriptionDto: CreateUserSubscriptionDto, @Request() req: any) {
    // Extract user ID from the authenticated request
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in authenticated request');
    }
    
    // Override the userId from the request with the authenticated user's ID
    const userSubscriptionData = {
      ...createUserSubscriptionDto,
      userId: userId
    };
    
    try {
      return await this.userSubscriptionService.create(userSubscriptionData);
    } catch (error) {
      console.error('Error in user subscription controller:', error);
      throw error;
    }
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.userSubscriptionService.findByUserId(userId);
  }

  @Get('user/:userId/active')
  findActiveByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.userSubscriptionService.findActiveByUserId(userId);
  }

  @Get('user/:userId/summary')
  getSubscriptionSummary(@Param('userId', ParseIntPipe) userId: number) {
    return this.userSubscriptionService.getSubscriptionSummary(userId);
  }

  @Get('user/:userId/credits')
  getTotalCredits(@Param('userId', ParseIntPipe) userId: number) {
    return this.userSubscriptionService.getTotalRemainingCredits(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userSubscriptionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserSubscriptionDto: UpdateUserSubscriptionDto) {
    return this.userSubscriptionService.update(id, updateUserSubscriptionDto);
  }

  @Post('user/:userId/use-credits')
  useCredits(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { creditsToUse: number; serviceType?: string }
  ) {
    if (body.serviceType) {
      // Use service-specific credit deduction
      const serviceMapping = {
        'cv-sourcing': 'CV Sourcing',
        'prequalification': 'Prequalification',
        'direct': '360/Direct',
        'lead-generation-job': 'Lead Generation',
        'lead-generation-industry': 'Lead Generation'
      };
      
      const subscriptionTitle = serviceMapping[body.serviceType] || body.serviceType;
      return this.userSubscriptionService.useCreditsForService(userId, subscriptionTitle, body.creditsToUse);
    } else {
      // Use general credit deduction
      return this.userSubscriptionService.useCredits(userId, body.creditsToUse);
    }
  }

  @Post('user/:userId/add-adhoc-credits')
  addAdhocCredits(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { 
      subscriptionId: number;
      credits: number;
      paidAmount: number;
      paymentIntentId: string;
    }
  ) {
    return this.userSubscriptionService.addAdhocCredits(
      userId,
      body.subscriptionId,
      body.credits,
      body.paidAmount,
      body.paymentIntentId
    );
  }

  @Post('check-expired')
  checkExpiredSubscriptions() {
    return this.userSubscriptionService.checkExpiredSubscriptions();
  }

  @Post('user/:userId/check-credits')
  async checkCreditsForService(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { serviceType: string }
  ) {
    try {
      const userSubscriptions = await this.userSubscriptionService.findByUserId(userId);
      
      // Map service type to subscription title
      const serviceMapping = {
        'cv-sourcing': 'CV Sourcing',
        'prequalification': 'Prequalification',
        'direct': '360/Direct',
        'lead-generation-job': 'Lead Generation',
        'lead-generation-industry': 'Lead Generation'
      };
      
      const subscriptionTitle = serviceMapping[body.serviceType] || body.serviceType;
      
      // Calculate remaining credits for this service
      const remainingCredits = userSubscriptions
        .filter(sub => 
          sub.subscription?.title === subscriptionTitle && 
          sub.status === 'active'
        )
        .reduce((sum, sub) => sum + sub.remainingCredits, 0);
      
      const hasCredits = remainingCredits > 0;
      
      return {
        success: true,
        hasCredits,
        remainingCredits,
        serviceType: body.serviceType,
        subscriptionTitle,
        message: hasCredits 
          ? `You have ${remainingCredits} credits available for ${subscriptionTitle}`
          : `No credits available for ${subscriptionTitle}. Please purchase more credits or upgrade your plan.`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error checking credits: ' + error.message
      };
    }
  }

  @Post('user/:userId/cancel')
  cancelUserSubscription(@Param('userId', ParseIntPipe) userId: number) {
    return this.userSubscriptionService.cancelUserSubscription(userId);
  }
}
