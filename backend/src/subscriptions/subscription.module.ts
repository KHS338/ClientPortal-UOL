import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { UserSubscriptionService } from './user-subscription.service';
import { UserSubscriptionController } from './user-subscription.controller';
import { Subscription } from './subscription.entity';
import { UserSubscription } from './user-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, UserSubscription])],
  controllers: [SubscriptionController, UserSubscriptionController],
  providers: [SubscriptionService, UserSubscriptionService],
  exports: [SubscriptionService, UserSubscriptionService]
})
export class SubscriptionModule {}
