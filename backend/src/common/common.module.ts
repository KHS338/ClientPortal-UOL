// backend/src/common/common.module.ts
import { Module } from '@nestjs/common';
import { CreditDeductionUtil } from './utils/credit-deduction.util';
import { SubscriptionModule } from '../subscriptions/subscription.module';

@Module({
  imports: [SubscriptionModule],
  providers: [CreditDeductionUtil],
  exports: [CreditDeductionUtil],
})
export class CommonModule {}
