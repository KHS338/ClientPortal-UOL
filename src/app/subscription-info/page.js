"use client";
//subscription page
import { useState, useEffect } from "react";
import { FiCheckCircle, FiCalendar, FiCreditCard, FiFileText } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, Toast } from "@/components/ui/alert-dialog";
import StripePayment from "@/components/StripePayment";
import ProtectedRoute from "@/components/ProtectedRoute";
import CreditHistoryComponent from '../../components/CreditHistoryComponent';
import { useAuth } from "@/contexts/AuthContext";
import { authUtils } from "@/lib/auth";
import { getCurrentSubscription, updateSubscriptionData } from "@/lib/subscription";
import { generateInvoiceForSubscription } from "@/lib/invoice";

export default function SubscriptionInfoPage() {
  const { user, isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState("");
  const [currentService, setCurrentService] = useState("");
  const [currentBillingCycle, setCurrentBillingCycle] = useState("monthly");
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [billingOptions, setBillingOptions] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [userCredits, setUserCredits] = useState(null);
  const [totalRemainingCredits, setTotalRemainingCredits] = useState(0);
  
  // Payment modal states
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Adhoc states
  const [selectedService, setSelectedService] = useState("");
  const [creditsCount, setCreditsCount] = useState(1);
  
  // Load subscription data and plans from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if user is authenticated
        if (!isAuthenticated || !user?.id) {
          console.log('Subscription-info - User not authenticated');
          setCurrentService("No Active Subscription");
          setCurrentBillingCycle("monthly");
          setCurrentPlan("");
          setBillingCycle("monthly");
          setSubscriptionData(null);
          setUserCredits([]);
          setTotalRemainingCredits(0);
          return;
        }
        
        // Load user subscription and credits from backend first (source of truth)
        const userId = parseInt(user.id);
        const subscriptionData = await getCurrentSubscription(userId);
        
        if (subscriptionData) {
          // Use backend data as source of truth
          setUserCredits(subscriptionData.credits.history);
          setTotalRemainingCredits(subscriptionData.credits.total);
          
          // Update current subscription info from active subscription
          setCurrentService(subscriptionData.service);
          setCurrentBillingCycle(subscriptionData.billingCycle);
          setCurrentPlan(subscriptionData.planKey);
          setBillingCycle(subscriptionData.billingCycle);
          setSubscriptionData(subscriptionData);
          
          console.log('Subscription-info - Loaded from backend:', subscriptionData.service);
        } else {
          // No active subscription found in backend
          console.log('Subscription-info - No active subscription found in backend');
          
          setCurrentService("No Active Subscription");
          setCurrentBillingCycle("monthly");
          setCurrentPlan("");
          setBillingCycle("monthly");
          setSubscriptionData(null);
          setUserCredits([]);
          setTotalRemainingCredits(0);
        }
      } catch (error) {
        console.error('Error loading user subscription data from backend:', error);
        
        // Set empty state on error
        setCurrentService("No Active Subscription");
        setCurrentBillingCycle("monthly");
        setCurrentPlan("");
        setBillingCycle("monthly");
        setSubscriptionData(null);
        setUserCredits([]);
        setTotalRemainingCredits(0);
      }

      // Load subscription plans from API
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiBaseUrl}/subscriptions`);
        const result = await response.json();
        
        if (result.success) {
          setBillingOptions(result.data);
        } else {
          console.error('Failed to load subscription plans:', result.message);
          // Fallback to hardcoded data if API fails
          setBillingOptions(getDefaultSubscriptions());
        }
      } catch (error) {
        console.error('Error loading subscription plans:', error);
        // Fallback to hardcoded data if API fails
        setBillingOptions(getDefaultSubscriptions());
      } finally {
        setIsLoadingPlans(false);
      }
    };

    loadData();

    // Listen for user logout event to reset state
    const handleUserLogout = () => {
      console.log('Subscription-info - User logout detected, resetting state');
      setCurrentService("No Active Subscription");
      setCurrentBillingCycle("monthly");
      setCurrentPlan("");
      setBillingCycle("monthly");
      setSubscriptionData(null);
      setUserCredits([]);
      setTotalRemainingCredits(0);
    };

    // Listen for subscription updates to refresh credits
    const handleSubscriptionUpdate = () => {
      console.log('Subscription-info - Subscription update detected, refreshing data');
      loadData();
    };

    // Listen for credit usage updates
    const handleCreditsUpdate = () => {
      console.log('Subscription-info - Credits update detected, refreshing data');
      loadData();
    };

    window.addEventListener('userLoggedOut', handleUserLogout);
    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    window.addEventListener('creditsUpdated', handleCreditsUpdate);

    return () => {
      window.removeEventListener('userLoggedOut', handleUserLogout);
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
      window.removeEventListener('creditsUpdated', handleCreditsUpdate);
    };
  }, [user, isAuthenticated]); // Add user dependencies

  // Fallback subscription data (same as before)
  const getDefaultSubscriptions = () => [
    {
      title: "CV Sourcing",
      monthly: { price: "$19/mo", key: "cv-sourcing-monthly", credits: 30 },
      annual: { price: "$190/yr", key: "cv-sourcing-annual", savings: "Save $38", credits: 360 },
      adhoc: { price: "£50/credit", key: "cv-sourcing-adhoc" },
      creditPrice: 50,
      features: ["Basic CV Collection", "Standard Filtering", "Email Support", "Monthly Reports"],
      description: "Essential CV sourcing and basic candidate filtering"
    },
    {
      title: "Prequalification",
      monthly: { price: "$39/mo", key: "prequalification-monthly", credits: 30 },
      annual: { price: "$390/yr", key: "prequalification-annual", savings: "Save $78", credits: 360 },
      adhoc: { price: "£70/credit", key: "prequalification-adhoc" },
      creditPrice: 70,
      features: ["Advanced CV Sourcing", "Skill Assessment", "Video Interviews", "Priority Support", "Weekly Reports"],
      description: "Comprehensive candidate prequalification and assessment"
    },
    {
      title: "360/Direct",
      monthly: { price: "$69/mo", key: "360-direct-monthly", credits: 30 },
      annual: { price: "$690/yr", key: "360-direct-annual", savings: "Save $138", credits: 360 },
      adhoc: { price: "£90/credit", key: "360-direct-adhoc" },
      creditPrice: 90,
      features: ["Full 360° Assessment", "Direct Placement", "Custom Integrations", "Dedicated Support", "Real-time Analytics", "White-label Options"],
      description: "Complete recruitment solution with direct placement services"
    },
    {
      title: "Lead Generation",
      monthly: { price: "$69/mo", key: "lead-generation-monthly", credits: 30 },
      annual: { price: "$690/yr", key: "lead-generation-annual", savings: "Save $138", credits: 360 },
      adhoc: { price: "£110/credit", key: "lead-generation-adhoc" },
      creditPrice: 110,
      features: ["Lead Identification", "Contact Discovery", "Email Campaigns", "CRM Integration", "Analytics Dashboard", "Lead Scoring"],
      description: "Comprehensive lead generation and outreach solution"
    },
    {
      title: "VA",
      monthly: { price: "$69/mo", key: "va-monthly", credits: 30 },
      annual: { price: "$690/yr", key: "va-annual", savings: "Save $138", credits: 360 },
      adhoc: { price: "£130/credit", key: "va-adhoc" },
      creditPrice: 130,
      features: ["Full 360° Assessment", "Direct Placement", "Custom Integrations", "Dedicated Support", "Real-time Analytics", "White-label Options"],
      description: "Complete recruitment solution with direct placement services"
    },
    {
      title: "Enterprise",
      isEnterprise: true,
      monthly: { price: "Get Quote", key: "enterprise-monthly" },
      annual: { price: "Get Quote", key: "enterprise-annual" },
      creditPrice: 0,
      features: ["Unlimited Everything", "White-label Solution", "Custom Development", "24/7 Priority Support", "Dedicated Account Manager", "SLA Guarantee", "Custom Integrations", "On-premise Deployment"],
      description: "Fully customizable enterprise solution with dedicated support"
    }
  ];
  
  // Alert states
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning"
  });
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success"
  });

  const handlePlanChange = (serviceTitle, cycle) => {
    console.log(`Plan switch requested: ${serviceTitle} (${cycle})`);

    // Get the service details to find the price
    const service = billingOptions.find(s => s.title === serviceTitle);
    const planDetails = service[cycle];
    const price = planDetails?.price || "N/A";

    // Determine if switching between monthly/annual for the same service
    const isSameService = serviceTitle === currentService;
    const isSameCycle = cycle === currentBillingCycle;
    const isFree = price === "Free";

    // Always show payment modal for paid plans if:
    // - Switching between monthly/annual for the same service
    // - Switching to a different paid service
    // Only skip payment if switching to a free plan
    if (isFree) {
      // For free plans, proceed directly without payment
      completePlanChange(serviceTitle, cycle, price, null);
    } else if (isSameService && isSameCycle) {
      // If already on this paid plan/cycle, do nothing
      setToast({
        isOpen: true,
        message: `You are already subscribed to ${serviceTitle} (${cycle})`,
        type: "info"
      });
    } else {
      // For paid plans, always show Stripe payment modal
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setSelectedPlan({
          title: serviceTitle,
          billingCycle: cycle,
          price: price
        });
        setShowPayment(true);
      }, 1000);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    console.log('Payment successful:', paymentResult);
    completePlanChange(
      selectedPlan.title, 
      selectedPlan.billingCycle, 
      selectedPlan.price, 
      paymentResult
    );
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedPlan(null);
  };

  const handleAdhocPayment = () => {
    if (!selectedService) {
      setToast({
        isOpen: true,
        message: "Please select a subscription type.",
        type: "error"
      });
      return;
    }

    if (creditsCount < 1) {
      setToast({
        isOpen: true,
        message: "Please enter a valid number of credits.",
        type: "error"
      });
      return;
    }

    // Get the credit price for the selected service
    const service = billingOptions.find(s => s.title === selectedService);
    const creditPrice = parseFloat(service?.creditPrice || '50');
    const totalPrice = creditsCount * creditPrice;
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedPlan({
        title: selectedService,
        billingCycle: "adhoc",
        price: `£${totalPrice}`, // Pass as string for Stripe compatibility
        credits: creditsCount,
        creditPrice: creditPrice,
        description: `${creditsCount} credit${creditsCount > 1 ? 's' : ''} for ${selectedService}`
      });
      setShowPayment(true);
    }, 1000);
  };

  const completePlanChange = async (serviceTitle, cycle, price, paymentResult) => {
    // Calculate next payment date based on new billing cycle
    const getNextPaymentDate = (billingCycle) => {
      const now = new Date();
      if (billingCycle === 'monthly') {
        now.setMonth(now.getMonth() + 1);
      } else if (billingCycle === 'annual') {
        now.setFullYear(now.getFullYear() + 1);
      } else {
        now.setMonth(now.getMonth() + 1);
      }
      return now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    try {
      // Check if user is authenticated
      if (!isAuthenticated || !user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Create user subscription entry in database
      const userId = parseInt(user.id);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Find the subscription ID from the service title
      const subscription = billingOptions.find(s => s.title === serviceTitle);
      if (!subscription) {
        console.error('Subscription not found for title:', serviceTitle);
        console.error('Available subscriptions:', billingOptions);
        throw new Error('Subscription not found');
      }

      if (!subscription.id) {
        console.error('Subscription found but has no ID:', subscription);
        throw new Error('Subscription ID is missing');
      }

      console.log('Found subscription:', subscription);

      // Determine credits based on billing cycle
      let totalCredits = 0;
      let paidAmount = 0;
      
      if (cycle === 'monthly') {
        totalCredits = subscription.monthlyCredits || 30;
        paidAmount = parseFloat(subscription.monthlyPrice || '0');
      } else if (cycle === 'annual') {
        totalCredits = subscription.annualCredits || 360;
        paidAmount = parseFloat(subscription.annualPrice || '0');
      } else if (cycle === 'adhoc') {
        totalCredits = selectedPlan?.credits || 1;
        paidAmount = (selectedPlan?.creditPrice ? parseFloat(selectedPlan.creditPrice) : parseFloat(subscription.creditPrice || '0')) * totalCredits;
      }

      const userSubscriptionData = {
        userId: userId,
        subscriptionId: subscription.id,
        billingCycle: cycle,
        paidAmount: paidAmount,
        currency: 'GBP',
        totalCredits: totalCredits,
        startDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        paymentIntentId: paymentResult?.paymentIntentId || null,
        status: 'active'
      };

      console.log('Creating user subscription with data:', userSubscriptionData);

      const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/user-subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userSubscriptionData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Failed to create user subscription: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('User subscription created:', result);

      // Generate invoice for the new subscription
      try {
        if (result && result.id) {
          console.log('Generating invoice for subscription ID:', result.id);
          const invoice = await generateInvoiceForSubscription(result.id);
          if (invoice) {
            console.log('Invoice generated successfully:', invoice);
            // Dispatch event to notify invoice page
            window.dispatchEvent(new CustomEvent('invoiceGenerated', { 
              detail: invoice 
            }));
          } else {
            console.warn('Invoice generation returned null/undefined');
          }
        } else {
          console.warn('No subscription ID found in result:', result);
        }
      } catch (invoiceError) {
        console.error('Error generating invoice (non-blocking):', invoiceError);
        // Don't fail the subscription if invoice generation fails
      }

      // Reload credits data
      const subscriptionResponse = await authUtils.fetchWithAuth(`${apiBaseUrl}/user-subscriptions/user/${userId}/summary`);
      const subscriptionResult = await subscriptionResponse.json();
      
      if (subscriptionResult && subscriptionResult.activeSubscription) {
        setUserCredits(subscriptionResult.subscriptionHistory || []);
        setTotalRemainingCredits(subscriptionResult.totalRemainingCredits || 0);
      }

    } catch (error) {
      console.error('Error creating user subscription:', error);
      setToast({
        isOpen: true,
        message: 'Subscription created but there was an error saving to database: ' + error.message,
        type: "warning"
      });
    }

    const planKey = `${serviceTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cycle}`;
    
    // Update state variables
    setCurrentPlan(planKey);
    setCurrentService(serviceTitle);
    setCurrentBillingCycle(cycle);
    
    // Update localStorage with new subscription data
    const updatedSubscriptionData = {
      service: serviceTitle,
      billingCycle: cycle,
      price: price, // Price is now always a string
      subscribedDate: subscriptionData?.subscribedDate || new Date().toISOString(),
      nextPayment: getNextPaymentDate(cycle),
      planKey: planKey,
      credits: selectedPlan?.credits || null, // Store credits for adhoc purchases
      paymentInfo: paymentResult ? {
        paymentIntentId: paymentResult.paymentIntentId,
        paymentMethod: paymentResult.paymentMethod,
        status: 'paid'
      } : subscriptionData?.paymentInfo || {
        status: 'trial'
      }
    };
    
    // Use the subscription utility to update data
    updateSubscriptionData(updatedSubscriptionData);
    setSubscriptionData(updatedSubscriptionData);
    
    // Clear payment modal states
    setShowPayment(false);
    setSelectedPlan(null);
    
    // Show success toast
    setToast({
      isOpen: true,
      message: `Successfully switched to ${serviceTitle} (${cycle})!`,
      type: "success"
    });
  };

  const handleUnsubscribe = (serviceTitle) => {
    setAlertConfig({
      isOpen: true,
      title: "Confirm Unsubscription",
      message: `Are you sure you want to unsubscribe from ${serviceTitle}? This action cannot be undone and you will lose access to all features after your current billing period ends.`,
      type: "warning",
      onConfirm: async () => {
        console.log(`Unsubscribe requested for: ${serviceTitle}`);
        
        try {
          // Check if user is authenticated
          if (!isAuthenticated || !user?.id) {
            throw new Error('User not authenticated');
          }
          
          // Call API to cancel subscription in database
          const userId = parseInt(user.id);
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
          
          const response = await authUtils.fetchWithAuth(`${apiBaseUrl}/user-subscriptions/user/${userId}/cancel`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to cancel subscription:', errorText);
            throw new Error(`Failed to cancel subscription: ${response.status} ${errorText}`);
          }

          const result = await response.json();
          console.log('Subscription cancelled:', result);

          // Clear the current plan selection
          setCurrentPlan("");
          setCurrentService("No Active Subscription");
          setCurrentBillingCycle("monthly");
          setSubscriptionData(null);
          setUserCredits([]);
          setTotalRemainingCredits(0);
          
          // Clear localStorage using utility function
          localStorage.removeItem('userSubscription');
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('subscriptionUpdated', { 
            detail: null 
          }));
          
          // Show success toast
          setToast({
            isOpen: true,
            message: `Successfully unsubscribed from ${serviceTitle}`,
            type: "success"
          });

        } catch (error) {
          console.error('Error cancelling subscription:', error);
          setToast({
            isOpen: true,
            message: 'Failed to cancel subscription: ' + error.message,
            type: "error"
          });
        }
      }
    });
  };

  // Show loading state while plans are being fetched
  if (isLoadingPlans) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-green-0 via-white to-green-50">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Subscription Information
                </h1>
                <p className="text-lg text-gray-600">
                  Loading subscription plans...
                </p>
              </div>
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-[#19AF1A] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-0 via-white to-green-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <div></div> {/* Spacer for center alignment */}
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Subscription Information
                </h1>
                <p className="text-lg text-gray-600">
                  Manage your subscription plans and billing preferences
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/invoice'}
                  className="flex items-center gap-2 text-[#0958d9] border-[#0958d9] hover:bg-[#0958d9] hover:text-white"
                >
                  <FiFileText size={16} />
                  View Invoices
                </Button>
              </div>
            </div>
            
            {/* Temporary seed button for development
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/subscriptions/seed', { method: 'POST' });
                      const result = await response.json();
                      if (result.success) {
                        setToast({
                          isOpen: true,
                          message: "Subscription data seeded successfully!",
                          type: "success"
                        });
                        // Reload the page to show seeded data
                        window.location.reload();
                      } else {
                        setToast({
                          isOpen: true,
                          message: "Failed to seed data: " + result.message,
                          type: "error"
                        });
                      }
                    } catch (error) {
                      setToast({
                        isOpen: true,
                        message: "Error seeding data: " + error.message,
                        type: "error"
                      });
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                >
                  🌱 Seed Subscription Data (Dev Only)
                </button>
              </div>
            )} */}
          </div>

          {/* Current Subscription Overview - Only show if user has an active subscription */}
          {currentService && currentService !== "No Active Subscription" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-[#1a84de] to-[#06398e] text-white">
                <div className="flex items-center gap-3 mb-2">
                  <FiCheckCircle size={24} />
                  <h3 className="text-lg font-semibold">Current Plan</h3>
                </div>
                <p className="text-2xl font-bold">{currentService}</p>
                <p className="text-blue-100 text-sm">Active subscription</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#1a84de] to-[#06398e] text-white">
                <div className="flex items-center gap-3 mb-2">
                  <FiCalendar size={24}  />
                  <h3 className="text-lg font-semibold ">Billing Cycle</h3>
                </div>
                <p className="text-2xl font-bold">
                  {currentBillingCycle === "monthly" ? "Monthly" : currentBillingCycle === "annual" ? "Annual" : currentBillingCycle === "adhoc" ? "Adhoc" : "Enterprise"}
                </p>
                <p className="text-sm">
                  {currentBillingCycle === "monthly" ? "Billed monthly" : currentBillingCycle === "annual" ? "Billed annually" : currentBillingCycle === "adhoc" ? "Pay per use" : "Custom billing"}
                </p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#1a84de] to-[#06398e] text-white">
                <div className="flex items-center gap-3 mb-2">
                  <FiCreditCard size={24}  />
                  <h3 className="text-lg font-semibold ">Next Payment</h3>
                </div>
                <p className="text-2xl font-bold">
                  {subscriptionData?.nextPayment || "Not Available"}
                </p>
                <p className="text-sm">Auto-renewal enabled</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-[#1a84de] to-[#06398e] text-white">
                <div className="flex items-center gap-3 mb-2">
                  <FiCheckCircle size={24} />
                  <h3 className="text-lg font-semibold">Credits</h3>
                </div>
                <p className="text-2xl font-bold">{totalRemainingCredits}</p>
                <p className="text-blue-100 text-sm">
                  {userCredits && userCredits.length > 0 ? 
                    `${userCredits.filter(sub => sub.status === 'active').length} active subscription${userCredits.filter(sub => sub.status === 'active').length !== 1 ? 's' : ''}` : 
                    "No active subscriptions"}
                </p>
              </Card>
            </div>
          )}

          {/* No Subscription Message - Only show if user has no active subscription */}
          {(!currentService || currentService === "No Active Subscription") && (
            <div className="mb-8">
              <Card className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
                    <FiCheckCircle className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No Active Subscription</h3>
                  <p className="text-gray-600">
                    You currently don&apos;t have an active subscription. Choose a plan below to get started!
                  </p>
                  {totalRemainingCredits > 0 && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">
                        You have {totalRemainingCredits} credits available for use!
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Credits Breakdown - Show if user has any subscriptions */}
          {userCredits && userCredits.length > 0 && (
            <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <FiCreditCard className="text-[#0958d9]" />
                Credits Breakdown
              </h3>
              <div className="space-y-4">
                {userCredits.map((subscription, index) => (
                  <div key={subscription.id || index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {subscription.subscription?.title || 'Unknown Service'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {subscription.billingCycle} • Status: {subscription.status}
                      </p>
                      {subscription.endDate && (
                        <p className="text-xs text-gray-500">
                          Expires: {new Date(subscription.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">
                        {subscription.remainingCredits} / {subscription.totalCredits}
                      </p>
                      <p className="text-sm text-gray-600">Credits</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Credit History - Show if user has any subscriptions */}
          {userCredits && userCredits.length > 0 && (
            <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <FiFileText className="text-[#0958d9]" />
                  Recent Credit Activity
                </h3>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/credit-history'}
                  className="text-[#0958d9] border-[#0958d9] hover:bg-[#0958d9] hover:text-white"
                >
                  View Full History
                </Button>
              </div>
              <CreditHistoryComponent 
                userId={user?.id} 
                serviceType={null}
                className=""
              />
            </Card>
          )}

          {/* Subscription Plans */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <FiCheckCircle className="text-[#0958d9]" />
              Subscription Plans
            </h3>

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${billingCycle === "monthly"
                    ? "bg-[#0958d9] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${billingCycle === "annual"
                    ? "bg-[#0958d9] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  Annual
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("adhoc")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${billingCycle === "adhoc"
                    ? "bg-[#0958d9] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  Adhoc
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("enterprise")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${billingCycle === "enterprise"
                    ? "bg-[#0958d9] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  Enterprise
                </button>
              </div>
            </div>

            {billingCycle === "enterprise" ? (
              /* Enterprise Solutions Display */
              <div className="max-w-4xl mx-auto px-4 sm:px-0">
                <div className="relative p-4 sm:p-8 rounded-2xl border-2 border-[#0958d9] bg-white shadow-2xl group hover:border-[#24AC4A]/50 transition-all duration-300">
                  <div className="text-center">
                    <h4 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#0958d9] to-[#0958d9] group-hover:from-[#24AC4A] group-hover:to-[#24AC4A] bg-clip-text mb-4 transition-all duration-300">
                      Enterprise Plan
                    </h4>
                    <p className="text-lg text-gray-600 mb-6">
                      Fully customizable enterprise solution with dedicated support
                    </p>

                    <div className="mb-6 sm:mb-8">
                      <p className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-[#0958d9] to-[#0958d9] group-hover:from-[#24AC4A] group-hover:to-[#24AC4A] bg-clip-text mb-4 transition-all duration-300">
                        Custom Pricing
                      </p>
                      <p className="text-base sm:text-lg text-gray-500 font-medium">Tailored to your organization&apos;s needs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                      {[
                        "Unlimited Everything",
                        "White-label Solution",
                        "Custom Development",
                        "24/7 Priority Support",
                        "Dedicated Account Manager",
                        "SLA Guarantee",
                        "Custom Integrations",
                        "On-premise Deployment"
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 sm:gap-3 bg-white/70 rounded-lg px-3 sm:px-4 py-2 sm:py-3 transition-all duration-300 hover:bg-white/90"
                        >
                          <FiCheckCircle className="text-[#0958d9] group-hover:text-[#24AC4A] flex-shrink-0 transition-colors duration-300" size={16} />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => {
                        setAlertConfig({
                          isOpen: true,
                          title: "Enterprise Consultation",
                          message: "Thank you for your interest! Our enterprise team will contact you within 24 hours to discuss your custom requirements and provide a personalized quote.",
                          type: "info",
                          onConfirm: () => {
                            console.log("Enterprise quotation requested");
                            setToast({
                              isOpen: true,
                              message: "Enterprise consultation request submitted successfully!",
                              type: "success"
                            });
                          }
                        });
                      }}
                      className="w-full px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg bg-[#0958d9] group-hover:bg-[#24AC4A] hover:bg-[#0958d9] group-hover:hover:bg-[#24AC4A] text-white transition-all duration-300"
                    >
                      Get Custom Quote
                    </Button>

                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-[#0958d9]/10 to-[#06398e]/10 group-hover:from-[#24AC4A]/10 group-hover:to-[#24AC4A]/10 rounded-xl border border-[#0958d9]/20 group-hover:border-[#24AC4A]/20 transition-all duration-300">
                      <p className="text-xs sm:text-sm text-gray-600">
                        <strong>Ready to scale?</strong> Our enterprise solutions are designed for organizations with complex requirements.
                        Contact our sales team for a personalized demo and custom pricing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : billingCycle === "adhoc" ? (
              /* Adhoc Credit Purchase UI */
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-[#0958d9]/20 p-8 hover:border-[#24AC4A]/30 transition-all duration-300">
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">Adhoc Credit Purchase</h4>
                    <p className="text-gray-600">Pay as you go - prices vary by service</p>
                  </div>

                  <div className="space-y-6">
                    {/* Service Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Subscription Type
                      </label>
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0958d9] focus:border-[#0958d9] transition-all duration-200 hover:border-[#0958d9]/50"
                      >
                        <option value="">-- Select a service --</option>
                        {billingOptions.filter(service => !service.isEnterprise).map((service) => (
                          <option key={service.title} value={service.title}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Credits Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Credits
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={creditsCount}
                        onChange={(e) => setCreditsCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0958d9] focus:border-[#0958d9] transition-all duration-200 hover:border-[#0958d9]/50"
                        placeholder="Enter number of credits"
                      />
                    </div>

                    {/* Price Display */}
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="text-sm text-gray-600 mb-2">Total Amount</div>
                      <div className="text-3xl font-bold text-[#0958d9]">
                        £{creditsCount * parseFloat(billingOptions.find(s => s.title === selectedService)?.creditPrice || '50')}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {creditsCount} credit{creditsCount > 1 ? 's' : ''} × £{parseFloat(billingOptions.find(s => s.title === selectedService)?.creditPrice || '50')} each
                      </div>
                      {selectedService && (
                        <div className="text-xs text-gray-400 mt-2">
                          Service: {selectedService}
                        </div>
                      )}
                    </div>

                    {/* Selected Service Info */}
                    {selectedService && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-900 mb-2">{selectedService}</h5>
                        <p className="text-blue-700 text-sm">
                          {billingOptions.find(s => s.title === selectedService)?.description}
                        </p>
                        <div className="mt-3">
                          <div className="text-xs text-blue-600 font-medium mb-1">Features included:</div>
                          <ul className="text-xs text-blue-700 space-y-1">
                            {billingOptions.find(s => s.title === selectedService)?.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <FiCheckCircle size={12} className="text-blue-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Purchase Button */}
                    <Button
                      onClick={handleAdhocPayment}
                      disabled={!selectedService || creditsCount < 1 || isProcessing}
                      className="w-full py-4 text-lg font-semibold bg-[#0958d9] hover:bg-[#24AC4A] text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        `Purchase ${creditsCount} Credit${creditsCount > 1 ? 's' : ''} for £${creditsCount * parseFloat(billingOptions.find(s => s.title === selectedService)?.creditPrice || '50')}`
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Regular Plans Display */
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 grid-rows-2">
                {billingOptions.filter(service => !service.isEnterprise).map((service, index) => {
                  const currentPlanPrice = billingCycle === "monthly" ? service.monthly : billingCycle === "annual" ? service.annual : service.adhoc;
                  const isCurrentPlan = currentPlan === currentPlanPrice.key;

                  return (
                    <div
                      key={service.title}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col group ${
                        index === 2 ? "row-span-2" : ""
                      } ${isCurrentPlan
                        ? "border-[#0958d9] bg-gradient-to-br from-[#0958d9]/10 to-[#06398e]/10 shadow-xl"
                        : "border-gray-200 bg-white hover:border-[#24AC4A]/50 hover:shadow-lg"
                        }`}
                    >
                      {isCurrentPlan && (
                        <div className="absolute -top-3 right-6 bg-[#0958d9] text-white px-4 py-1 rounded-full text-sm font-medium">
                          Current Plan
                        </div>
                      )}

                      <div className="text-center flex-1 flex flex-col">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h4>
                          <p className="text-sm text-gray-600 mb-4">{service.description}</p>

                          <div className="mb-4">
                            <p className={`text-4xl font-bold mb-1 transition-colors duration-300 ${
                              isCurrentPlan 
                                ? "text-[#0958d9]" 
                                : "text-[#0958d9] group-hover:text-[#24AC4A]"
                            }`}>{currentPlanPrice.price}</p>
                            {billingCycle === "annual" && service.annual?.savings && (
                              <p className={`text-sm font-medium transition-colors duration-300 ${
                                isCurrentPlan 
                                  ? "text-[#1a84de]" 
                                  : "text-[#1a84de] group-hover:text-[#24AC4A]"
                              }`}>{service.annual.savings}</p>
                            )}
                            {billingCycle === "adhoc" && (
                              <p className="text-sm text-gray-500">Pay per use</p>
                            )}
                            {(billingCycle === "monthly" || billingCycle === "annual") && currentPlanPrice.credits && (
                              <p className="text-sm text-green-600 font-medium">
                                {currentPlanPrice.credits} credits included
                              </p>
                            )}
                          </div>

                          <ul className={`text-sm text-gray-600 mb-6 ${
                            service.title === "360/Direct" ? "space-y-14" : "space-y-3"
                          }`}>
                            {service.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center gap-2">
                                <FiCheckCircle className={`flex-shrink-0 transition-colors duration-300 ${
                                  isCurrentPlan 
                                    ? "text-[#0958d9]" 
                                    : "text-[#0958d9] group-hover:text-[#24AC4A]"
                                }`} size={16} />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Button clicked for:', service.title, billingCycle);
                            if (isCurrentPlan) {
                              handleUnsubscribe(service.title);
                            } else {
                              handlePlanChange(service.title, billingCycle);
                            }
                          }}
                          className={`w-full transition-all duration-300 mt-auto py-3 text-lg font-semibold ${isCurrentPlan
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                            : "bg-[#0958d9] hover:bg-[#24AC4A] text-white group-hover:bg-[#24AC4A] shadow-md"
                            }`}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Processing...
                            </div>
                          ) : isCurrentPlan ? (
                            "❌ Unsubscribe"
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Pay {service[billingCycle]?.price}
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </Card>
        </div>
      </div>
      
      {/* Custom Alert Dialog */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.type === "warning" ? "Unsubscribe" : "Confirm"}
        cancelText="Cancel"
      />
      
      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
        message={toast.message}
        type={toast.type}
      />

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
            <div className="w-8 h-8 border-4 border-[#19AF1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-800">Processing plan change...</p>
            <p className="text-sm text-gray-600 mt-2">Please wait</p>
          </div>
        </div>
      )}

      {/* Stripe Payment Modal */}
      {showPayment && selectedPlan && (
        <StripePayment
          planDetails={selectedPlan}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
      </div>
    </ProtectedRoute>
  );
}
