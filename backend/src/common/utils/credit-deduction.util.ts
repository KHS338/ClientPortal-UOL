// backend/src/common/utils/credit-deduction.util.ts
import { Injectable } from '@nestjs/common';
import { UserSubscriptionService } from '../../subscriptions/user-subscription.service';

@Injectable()
export class CreditDeductionUtil {
  constructor(
    private readonly userSubscriptionService: UserSubscriptionService
  ) {}

  /**
   * Maps service endpoints to subscription titles
   */
  private getSubscriptionTitle(serviceType: string): string {
    const serviceMapping = {
      'cv-sourcing': 'CV Sourcing',
      'prequalification': 'Prequalification',
      'direct': '360/Direct',
      'lead-generation-job': 'Lead Generation',
      'lead-generation-industry': 'Lead Generation'
    };

    return serviceMapping[serviceType] || serviceType;
  }

  /**
   * Checks if user has sufficient credits for a service and deducts 1 credit if available
   * @param userId - The user ID
   * @param serviceType - The service type (cv-sourcing, prequalification, direct, etc.)
   * @returns Promise<boolean> - true if credit was deducted, false if insufficient credits
   */
  async checkAndDeductCredit(userId: number, serviceType: string): Promise<{
    success: boolean;
    message?: string;
    remainingCredits?: number;
  }> {
    try {
      // Get subscription title from service type
      const subscriptionTitle = this.getSubscriptionTitle(serviceType);
      
      // Get user's active subscriptions
      const userSubscriptions = await this.userSubscriptionService.findByUserId(userId);
      
      if (!userSubscriptions || userSubscriptions.length === 0) {
        return {
          success: false,
          message: 'No active subscription found. Please subscribe to a plan to create roles.'
        };
      }

      // Find subscription matching the service type with remaining credits
      const matchingSubscription = userSubscriptions.find(sub => 
        sub.subscription?.title === subscriptionTitle && 
        sub.status === 'active' && 
        sub.remainingCredits > 0
      );

      if (!matchingSubscription) {
        // Check if user has any subscription for this service type (but no credits)
        const anyMatchingSubscription = userSubscriptions.find(sub => 
          sub.subscription?.title === subscriptionTitle && 
          sub.status === 'active'
        );

        if (anyMatchingSubscription) {
          return {
            success: false,
            message: `Insufficient credits for ${subscriptionTitle}. You have ${anyMatchingSubscription.remainingCredits} credits remaining. Please purchase more credits or upgrade your plan.`
          };
        } else {
          return {
            success: false,
            message: `No active ${subscriptionTitle} subscription found. Please subscribe to this service to create roles.`
          };
        }
      }

      // Deduct 1 credit using the service-specific method
      const creditDeducted = await this.userSubscriptionService.useCreditsForService(
        userId, 
        subscriptionTitle, 
        1
      );
      
      if (creditDeducted) {
        // Get updated credits count
        const updatedCredits = await this.getRemainingCredits(userId, serviceType);
        
        return {
          success: true,
          message: `Credit deducted successfully. ${updatedCredits} credits remaining for ${subscriptionTitle}.`,
          remainingCredits: updatedCredits
        };
      } else {
        return {
          success: false,
          message: 'Failed to deduct credit. Please try again.'
        };
      }

    } catch (error) {
      console.error('Error in credit deduction:', error);
      return {
        success: false,
        message: 'An error occurred while processing credits. Please try again.'
      };
    }
  }

  /**
   * Gets remaining credits for a specific service type
   * @param userId - The user ID
   * @param serviceType - The service type
   * @returns Promise<number> - Remaining credits for the service
   */
  async getRemainingCredits(userId: number, serviceType: string): Promise<number> {
    try {
      const subscriptionTitle = this.getSubscriptionTitle(serviceType);
      const userSubscriptions = await this.userSubscriptionService.findByUserId(userId);
      
      if (!userSubscriptions || userSubscriptions.length === 0) {
        return 0;
      }

      // Sum all active credits for this service type
      const totalCredits = userSubscriptions
        .filter(sub => 
          sub.subscription?.title === subscriptionTitle && 
          sub.status === 'active'
        )
        .reduce((sum, sub) => sum + sub.remainingCredits, 0);

      return totalCredits;
    } catch (error) {
      console.error('Error getting remaining credits:', error);
      return 0;
    }
  }
}
