import { CreateSubscriptionDto } from './create-subscription.dto';

export class UpdateSubscriptionDto {
  title?: string;
  description?: string;
  monthlyPrice?: number;
  monthlyPriceDisplay?: string;
  monthlyKey?: string;
  annualPrice?: number;
  annualPriceDisplay?: string;
  annualKey?: string;
  annualSavings?: string;
  adhocPrice?: number;
  adhocPriceDisplay?: string;
  adhocKey?: string;
  monthlyCredits?: number;
  annualCredits?: number;
  creditPrice?: number;
  features?: string[];
  isEnterprise?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}
