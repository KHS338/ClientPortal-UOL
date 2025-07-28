export class CreateCreditHistoryDto {
  userId: number;
  userSubscriptionId: number;
  actionType: string; // 'used', 'purchased', 'refunded', 'expired'
  creditAmount: number; // positive for purchased/refunded, negative for used
  remainingCreditsAfter: number;
  serviceType: string;
  serviceTitle: string;
  roleTitle?: string;
  roleId?: number;
  description?: string;
  metadata?: string;
}
