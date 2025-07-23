export class UpdateUserSubscriptionDto {
  billingCycle?: string;
  paidAmount?: number;
  currency?: string;
  totalCredits?: number;
  usedCredits?: number;
  remainingCredits?: number;
  startDate?: Date;
  endDate?: Date;
  dueDate?: Date;
  nextRenewalDate?: Date;
  status?: string;
  autoRenew?: boolean;
  paymentIntentId?: string;
  stripeSubscriptionId?: string;
  notes?: string;
}
