"use client";

import { useState } from "react";
import { FiCheckCircle, FiStar, FiArrowRight, FiGift, FiZap } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handlePlanSelection = (serviceTitle, cycle, price) => {
    console.log(`Plan selected: ${serviceTitle} (${cycle}) - ${price}`);
    // Redirect to dashboard or payment processing
    // window.location.href = "/dashboard";
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
    <div className="min-h-screen bg-gradient-to-br from-green-0 via-white to-green-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#19AF1A] to-[#158A15] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
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
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-[#19AF1A] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === "annual"
                    ? "bg-[#19AF1A] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Annual
              </button>
              <button
                onClick={() => setBillingCycle("enterprise")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === "enterprise"
                    ? "bg-[#19AF1A] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Enterprise
              </button>
            </div>
          </div>

          {billingCycle === "enterprise" ? (
            /* Enterprise Solutions Display */
            <div className="max-w-4xl mx-auto">
              <div className="relative p-8 rounded-2xl border-2 border-[#19AF1A] bg-white shadow-2xl">
                <div className="text-center">
                  <h4 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#19AF1A] to-[#158A15] bg-clip-text mb-4">
                    Enterprise Plan
                  </h4>
                  <p className="text-lg text-gray-600 mb-6">
                    Fully customizable enterprise solution with dedicated support
                  </p>
                  
                  <div className="mb-8">
                    <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-[#19AF1A] to-[#158A15] bg-clip-text mb-4">
                      Custom Pricing
                    </p>
                    <p className="text-lg text-gray-500 font-medium">Tailored to your organization&apos;s needs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
                        className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 shadow-sm"
                      >
                        <FiCheckCircle className="text-[#19AF1A] flex-shrink-0" size={18} />
                        <span className="font-medium text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handlePlanSelection("Enterprise", billingCycle, "Custom Quote")}
                    className="w-full md:w-auto px-12 py-4 text-lg bg-gradient-to-r from-[#19AF1A] to-[#158A15] hover:from-[#158A15] hover:to-[#0F6B0F] text-white"
                  >
                    <span>Get Custom Quote</span>
                    <FiArrowRight className="ml-2" />
                  </Button>

                  <div className="mt-6 p-4 bg-gradient-to-r from-[#19AF1A]/10 to-[#158A15]/10 rounded-xl border border-[#19AF1A]/20">
                    <p className="text-sm text-gray-600">
                      <strong>Ready to scale?</strong> Our enterprise solutions are designed for organizations with complex requirements. 
                      Contact our sales team for a personalized demo and custom pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Regular Plans Display */
            <div 
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {billingOptions.filter(service => !service.isEnterprise).map((service, index) => {
                const currentPlan = billingCycle === "monthly" ? service.monthly : service.annual;
                const isTrialPlan = service.isTrial;
                const isHighlighted = service.highlighted;
                
                return (
                  <div
                    key={service.title}
                    className={`relative p-6 rounded-2xl border-2 flex flex-col ${
                      isHighlighted
                        ? "border-[#19AF1A] bg-gradient-to-br from-[#19AF1A]/10 to-[#158A15]/10 shadow-xl scale-105"
                        : "border-gray-200 bg-white hover:border-[#19AF1A]/50"
                    }`}
                  >
                    {isTrialPlan && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#19AF1A] to-[#158A15] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <FiZap className="w-3 h-3" />
                        Start Free
                      </div>
                    )}

                    <div className="text-center flex-1 flex flex-col">
                      <div className="flex-1">
                        <h4 className={`text-xl font-bold mb-2 ${
                          isTrialPlan ? "text-transparent bg-gradient-to-r from-[#19AF1A] to-[#158A15] bg-clip-text" : "text-gray-800"
                        }`}>
                          {service.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                        
                        <div className="mb-4">
                          <p className={`text-4xl font-bold mb-1 ${
                            isTrialPlan ? "text-transparent bg-gradient-to-r from-[#19AF1A] to-[#158A15] bg-clip-text" : "text-[#19AF1A]"
                          }`}>
                            {currentPlan.price}
                          </p>
                          {billingCycle === "annual" && service.annual?.savings && (
                            <p className="text-sm text-green-600 font-medium">{service.annual.savings}</p>
                          )}
                          {isTrialPlan && (
                            <p className="text-sm text-gray-500 font-medium">
                              {service.trialDays} days free trial
                            </p>
                          )}
                        </div>

                        <ul className="space-y-3 text-sm text-gray-600 mb-6">
                          {service.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2">
                              <FiCheckCircle className="text-[#19AF1A] flex-shrink-0" size={16} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        onClick={() => handlePlanSelection(service.title, billingCycle, currentPlan.price)}
                        className="w-full mt-auto bg-gradient-to-r from-[#19AF1A] to-[#158A15] hover:from-[#158A15] hover:to-[#0F6B0F] text-white"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isTrialPlan ? "Start Free Trial" : "Choose Plan"}
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
                  <div className="w-12 h-12 bg-gradient-to-r from-[#19AF1A] to-[#158A15] rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiCheckCircle className="text-white" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">No Setup Fees</h4>
                  <p className="text-sm text-gray-600">Get started instantly with no hidden costs or setup fees</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-gradient-to-r from-[#19AF1A] to-[#158A15] rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiZap className="text-white" size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Instant Access</h4>
                  <p className="text-sm text-gray-600">Start using all features immediately after subscription</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-gradient-to-r from-[#19AF1A] to-[#158A15] rounded-full flex items-center justify-center mx-auto mb-3">
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
    </div>
  );
}
