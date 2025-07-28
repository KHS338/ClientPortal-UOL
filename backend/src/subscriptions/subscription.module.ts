import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { UserSubscriptionService } from './user-subscription.service';
import { UserSubscriptionController } from './user-subscription.controller';
import { CreditHistoryService } from './credit-history.service';
import { Subscription } from './subscription.entity';
import { UserSubscription } from './user-subscription.entity';
import { CreditHistory } from './credit-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, UserSubscription, CreditHistory])],
  controllers: [SubscriptionController, UserSubscriptionController],
  providers: [SubscriptionService, UserSubscriptionService, CreditHistoryService],
  exports: [SubscriptionService, UserSubscriptionService, CreditHistoryService]
})
export class SubscriptionModule {}
