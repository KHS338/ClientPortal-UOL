import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe, UseGuards, Request, Delete } from '@nestjs/common';
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

  // Secure endpoints that use authenticated user's ID
  @Get('my-subscriptions')
  findMySubscriptions(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in authenticated request');
    }
    return this.userSubscriptionService.findByUserId(userId);
  }

  @Get('my-active-subscription')
  findMyActiveSubscription(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in authenticated request');
    }
    return this.userSubscriptionService.findActiveByUserId(userId);
  }

  @Get('my-summary')
  getMySubscriptionSummary(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in authenticated request');
    }
    return this.userSubscriptionService.getSubscriptionSummary(userId);
  }

  @Get('my-credits')
  getMyTotalCredits(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in authenticated request');
    }
    return this.userSubscriptionService.getTotalRemainingCredits(userId);
  }

  @Post('use-my-credits')
  useMyCredits(
    @Request() req: any,
    @Body() body: { creditsToUse: number }
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in authenticated request');
    }
    return this.userSubscriptionService.useCredits(userId, body.creditsToUse);
  }

  @Post('add-my-adhoc-credits')
  addMyAdhocCredits(
    @Request() req: any,
    @Body() body: { 
      subscriptionId: number;
      credits: number;
      paidAmount: number;
      paymentIntentId: string;
    }
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in authenticated request');
    }
    return this.userSubscriptionService.addAdhocCredits(
      userId,
      body.subscriptionId,
      body.credits,
      body.paidAmount,
      body.paymentIntentId
    );
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
    @Body() body: { creditsToUse: number }
  ) {
    return this.userSubscriptionService.useCredits(userId, body.creditsToUse);
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

  @Delete('cancel')
  cancelMySubscription(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User ID not found in authenticated request');
    }
    return this.userSubscriptionService.cancelUserSubscription(userId);
  }
}
