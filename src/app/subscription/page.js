"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiStar, FiArrowRight, FiGift, FiZap } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StripePayment from "@/components/StripePayment";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SubscriptionPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanSelection = (serviceTitle, cycle, price) => {
    console.log(`Plan selected: ${serviceTitle} (${cycle}) - ${price}`);
    
    // Add visual feedback
    setIsRedirecting(true);
    
    // Check if it's a trial or free plan
    if (serviceTitle === "Free Trial" || serviceTitle === "Trial" || price === "Free") {
      // For trial/free plans, proceed directly without payment
      setTimeout(() => {
        completeSubscription(serviceTitle, cycle, price, null);
      }, 1000);
    } else {
      // For paid plans, show Stripe payment modal
      setTimeout(() => {
        setIsRedirecting(false);
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
    completeSubscription(
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

  const completeSubscription = (serviceTitle, cycle, price, paymentResult) => {
    // Store subscription information in localStorage
    const subscriptionData = {
      service: serviceTitle,
      billingCycle: cycle,
      price: price,
      subscribedDate: new Date().toISOString(),
      nextPayment: getNextPaymentDate(cycle),
      planKey: `${serviceTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cycle}`,
      paymentInfo: paymentResult ? {
        paymentIntentId: paymentResult.paymentIntentId,
        paymentMethod: paymentResult.paymentMethod,
        status: 'paid'
      } : {
        status: 'trial'
      }
    };
    
    console.log('Subscription - Storing data:', subscriptionData);
    localStorage.setItem('userSubscription', JSON.stringify(subscriptionData));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('subscriptionUpdated', { 
      detail: subscriptionData 
    }));
    
    setShowPayment(false);
    setSelectedPlan(null);
    setIsRedirecting(true);
    
    // Show a brief loading state before redirecting
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  // Helper function to calculate next payment date
  const getNextPaymentDate = (cycle) => {
    const now = new Date();
    if (cycle === 'monthly') {
      now.setMonth(now.getMonth() + 1);
    } else if (cycle === 'annual') {
      now.setFullYear(now.getFullYear() + 1);
    } else {
      // For enterprise or other plans, set a placeholder date
      now.setMonth(now.getMonth() + 1);
    }
    return now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const billingOptions = [
    {
      title: "Free Trial",
      isTrial: true,
      monthly: { price: "Free", key: "trial-monthly" },
      annual: { price: "Free", key: "trial-annual" },
      features: ["5 CV Collections", "Basic Filtering", "Email Support", "7-day Trial", "No Credit Card Required"],
      description: "Try our platform with limited features for 7 days",
      trialDays: 7,
      highlighted: true
    },
    {
      title: "CV Sourcing",
      monthly: { price: "$19/mo", key: "cv-sourcing-monthly" },
      annual: { price: "$190/yr", key: "cv-sourcing-annual", savings: "Save $38" },
      features: ["Basic CV Collection", "Standard Filtering", "Email Support", "Monthly Reports"],
      description: "Essential CV sourcing and basic candidate filtering"
    },
    {
      title: "Prequalification", 
      monthly: { price: "$39/mo", key: "prequalification-monthly" },
      annual: { price: "$390/yr", key: "prequalification-annual", savings: "Save $78" },
      features: ["Advanced CV Sourcing", "Skill Assessment", "Video Interviews", "Priority Support", "Weekly Reports"],
      description: "Comprehensive candidate prequalification and assessment"
    },
    {
      title: "360/Direct",
      monthly: { price: "$69/mo", key: "360-direct-monthly" },
      annual: { price: "$690/yr", key: "360-direct-annual", savings: "Save $138" },
      features: ["Full 360° Assessment", "Direct Placement", "Custom Integrations", "Dedicated Support", "Real-time Analytics", "White-label Options"],
      description: "Complete recruitment solution with direct placement services"
    },
    {
      title: "VA",
      monthly: { price: "$69/mo", key: "va-monthly" },
      annual: { price: "$690/yr", key: "va-annual", savings: "Save $138" },
      features: ["Virtual Assistant Services", "Administrative Support", "Calendar Management", "Email Management", "Data Entry", "Research Tasks"],
      description: "Professional virtual assistant services for your business"
    },
    {
      title: "Lead Generation",
      monthly: { price: "$69/mo", key: "lead-generation-monthly" },
      annual: { price: "$690/yr", key: "lead-generation-annual", savings: "Save $138" },
      features: ["Lead Identification", "Contact Discovery", "Email Campaigns", "CRM Integration", "Analytics Dashboard", "Lead Scoring"],
      description: "Comprehensive lead generation and outreach solution"
    },
    {
      title: "Enterprise",
      isEnterprise: true,
      monthly: { price: "Get Quote", key: "enterprise-monthly" },
      annual: { price: "Get Quote", key: "enterprise-annual" },
      features: ["Unlimited Everything", "White-label Solution", "Custom Development", "24/7 Priority Support", "Dedicated Account Manager", "SLA Guarantee", "Custom Integrations", "On-premise Deployment"],
      description: "Fully customizable enterprise solution with dedicated support"
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-0 via-white to-green-50 relative">
      {/* Loading Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
            <div className="w-8 h-8 border-4 border-[#19AF1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-800">Setting up your subscription...</p>
            <p className="text-sm text-gray-600 mt-2">Redirecting to dashboard</p>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1a84de] to-[#0958d9] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                <FiGift className="w-4 h-4" />
                Welcome! Choose Your Plan
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Get Started with Your Subscription
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. Start with our free trial and upgrade anytime.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-xl inline-flex">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-[#0958d9] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  billingCycle === "annual"
                    ? "bg-[#0958d9] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Annual
              </button>
              <button
                onClick={() => setBillingCycle("enterprise")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  billingCycle === "enterprise"
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
                  <h4 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#1a84de] to-[#1a84de] group-hover:from-[#24AC4A] group-hover:to-[#24AC4A] bg-clip-text mb-4 transition-all duration-300">
                    Enterprise Plan
                  </h4>
                  <p className="text-lg text-gray-600 mb-6">
                    Fully customizable enterprise solution with dedicated support
                  </p>
                  
                  <div className="mb-6 sm:mb-8">
                    <p className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-[#1a84de] to-[#1a84de] group-hover:from-[#24AC4A] group-hover:to-[#24AC4A] bg-clip-text mb-4 transition-all duration-300">
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
                      console.log('Enterprise button clicked');
                      handlePlanSelection("Enterprise", billingCycle, "Custom Quote");
                    }}
                    className="w-full px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-[#1a84de] group-hover:bg-[#24AC4A] hover:bg-[#1a84de] group-hover:hover:bg-[#24AC4A] text-white transition-all duration-300 shadow-lg"
                  >
                    🏢 Get Custom Quote
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
          ) : (
            /* Regular Plans Display */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 grid-rows-2">
              {billingOptions.filter(service => !service.isEnterprise).map((service, index) => {
                const currentPlan = billingCycle === "monthly" ? service.monthly : service.annual;
                const isTrialPlan = service.isTrial;
                const isHighlighted = service.highlighted;
                
                return (
                  <div
                    key={service.title}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col group ${
                      isHighlighted
                        ? "border-[#0958d9] bg-gradient-to-br from-[#0958d9]/10 to-[#06398e]/10 shadow-xl"
                        : "border-gray-200 bg-white hover:border-[#24AC4A]/50 hover:shadow-lg"
                    }`}
                  >
                    {isTrialPlan && (
                      <div className="absolute -top-3 right-6 bg-[#0958d9] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <FiZap className="w-3 h-3" />
                        Start Free
                      </div>
                    )}

                    <div className="text-center flex-1 flex flex-col">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          {service.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                        
                        <div className="mb-4">
                          <p className={`text-4xl font-bold mb-1 transition-colors duration-300 ${
                            isTrialPlan 
                              ? "text-transparent bg-gradient-to-r from-[#0958d9] to-[#0958d9] bg-clip-text" 
                              : isHighlighted 
                                ? "text-[#0958d9]" 
                                : "text-[#0958d9] group-hover:text-[#24AC4A]"
                          }`}>
                            {currentPlan.price}
                          </p>
                          {billingCycle === "annual" && service.annual?.savings && (
                            <p className={`text-sm font-medium transition-colors duration-300 ${
                              isHighlighted 
                                ? "text-[#1a84de]" 
                                : "text-[#1a84de] group-hover:text-[#24AC4A]"
                            }`}>{service.annual.savings}</p>
                          )}
                          {isTrialPlan && (
                            <p className="text-sm text-gray-500 font-medium">
                              {service.trialDays} days free trial
                            </p>
                          )}
                        </div>

                        <ul className="text-sm text-gray-600 mb-6 space-y-3">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2">
                              <FiCheckCircle className={`flex-shrink-0 transition-colors duration-300 ${
                                isHighlighted 
                                  ? "text-[#0958d9]" 
                                  : "text-[#0958d9] group-hover:text-[#24AC4A]"
                              }`} size={16} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        onClick={() => {
                          console.log('Button clicked for:', service.title, billingCycle, currentPlan.price);
                          handlePlanSelection(service.title, billingCycle, currentPlan.price);
                        }}
                        className={`w-full transition-all duration-300 mt-auto py-3 text-lg font-semibold ${
                          isHighlighted
                            ? "bg-[#0958d9] hover:bg-[#24AC4A] text-white shadow-lg"
                            : "bg-[#1a84de] hover:bg-[#24AC4A] text-white group-hover:bg-[#24AC4A] shadow-md"
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isTrialPlan ? "🚀 Start Free Trial" : "💳 Choose Plan"}
                          <FiArrowRight className="w-4 h-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Why Choose Our Platform?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-gradient-to-r from-[#1a84de] to-[#0958d9] rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiCheckCircle className="text-white" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">No Setup Fees</h4>
                  <p className="text-sm text-gray-600">Get started instantly with no hidden costs or setup fees</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-gradient-to-r from-[#1a84de] to-[#0958d9] rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiZap className="text-white" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Instant Access</h4>
                  <p className="text-sm text-gray-600">Start using all features immediately after subscription</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-gradient-to-r from-[#1a84de] to-[#0958d9] rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiGift className="text-white" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Cancel Anytime</h4>
                  <p className="text-sm text-gray-600">No long-term commitments. Cancel or upgrade anytime</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

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
