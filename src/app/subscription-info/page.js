"use client";

import { useState } from "react";
import { FiCheckCircle, FiCalendar, FiCreditCard } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubscriptionInfoPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [currentPlan, setCurrentPlan] = useState("prequalification-monthly");
  const [currentService, setCurrentService] = useState("Prequalification");

  const handlePlanChange = (serviceTitle, cycle) => {
    console.log(`Plan switch requested: ${serviceTitle} (${cycle})`);

    const planKey = `${serviceTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cycle}`;
    setCurrentPlan(planKey);
    setCurrentService(serviceTitle);
  };

  const billingOptions = [
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
      features: ["Full 360° Assessment", "Direct Placement", "Custom Integrations", "Dedicated Support", "Real-time Analytics", "White-label Options"],
      description: "Complete recruitment solution with direct placement services"
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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Subscription Information
            </h1>
            <p className="text-lg text-gray-600">
              Manage your subscription plans and billing preferences
            </p>
          </div>

          {/* Current Subscription Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-[#1a84de] to-[#06398e] text-white">
              <div className="flex items-center gap-3 mb-2">
                <FiCheckCircle size={24} />
                <h3 className="text-lg font-semibold">Current Plan</h3>
              </div>
              <p className="text-2xl font-bold">{currentService}</p>
              <p className="text-blue-100 text-sm">Active subscription</p>
            </Card>

            <Card className="p-6 bg-white border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <FiCalendar size={24} className="text-[#1a84de]" />
                <h3 className="text-lg font-semibold text-gray-800">Billing Cycle</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {billingCycle === "monthly" ? "Monthly" : billingCycle === "annual" ? "Annual" : "Enterprise"}
              </p>
              <p className="text-gray-600 text-sm">
                {billingCycle === "monthly" ? "Billed monthly" : billingCycle === "annual" ? "Billed annually" : "Custom billing"}
              </p>
            </Card>

            <Card className="p-6 bg-white border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <FiCreditCard size={24} className="text-[#1a84de]" />
                <h3 className="text-lg font-semibold text-gray-800">Next Payment</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">Feb 15, 2025</p>
              <p className="text-gray-600 text-sm">Auto-renewal enabled</p>
            </Card>
          </div>

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
              <div className="max-w-4xl mx-auto">
                <div className="relative p-8 rounded-2xl border-2 border-[#0958d9] bg-white shadow-2xl">
                  <div className="text-center">
                    <h4 className="text-3xl font-bold text-transparent bg-[#1a84de] bg-clip-text mb-4">
                      Enterprise Plan
                    </h4>
                    <p className="text-lg text-gray-600 mb-6">
                      Fully customizable enterprise solution with dedicated support
                    </p>

                    <div className="mb-8">
                      <p className="text-4xl font-bold text-transparent bg-[#1a84de] bg-clip-text mb-4">
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
                          className="flex items-center gap-3 bg-white/70 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white/90"
                        >
                          <FiCheckCircle className="text-[#0958d9] flex-shrink-0" size={18} />
                          <span className="font-medium text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => console.log("Enterprise quotation requested")}
                      className="w-full md:w-auto px-12 py-4 text-lg bg-[#1a84de] hover:from-[#06398e] hover:bg-[#24AC4A] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Get Custom Quote
                    </Button>

                    <div className="mt-6 p-4 bg-gradient-to-r from-[#0958d9]/10 to-[#06398e]/10 rounded-xl border border-[#0958d9]/20">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 grid-rows-2">
                {billingOptions.filter(service => !service.isEnterprise).map((service, index) => {
                  const currentPlanPrice = billingCycle === "monthly" ? service.monthly : service.annual;
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
                            {billingCycle === "annual" && service.annual.savings && (
                              <p className={`text-sm font-medium transition-colors duration-300 ${
                                isCurrentPlan 
                                  ? "text-[#1a84de]" 
                                  : "text-[#1a84de] group-hover:text-[#24AC4A]"
                              }`}>{service.annual.savings}</p>
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
                            if (!isCurrentPlan) {
                              handlePlanChange(service.title, billingCycle);
                            }
                          }}
                          className={`w-full transition-all duration-300 mt-auto ${isCurrentPlan
                            ? "bg-gray-100 text-gray-500 cursor-default"
                            : "bg-[#1a84de] hover:bg-[#24AC4A] text-white group-hover:bg-[#24AC4A]"
                            }`}
                          disabled={isCurrentPlan}
                        >
                          {isCurrentPlan ? "Current Plan" : "Switch to This Plan"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Current Plan Summary */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[#0958d9]/10 to-[#06398e]/10 rounded-xl border border-[#0958d9]/20">
              <h4 className="font-semibold text-gray-800 mb-2">Current Subscription</h4>
              <p className="text-gray-600">
                You are currently subscribed to <span className="font-semibold text-[#0958d9]">{currentService}</span>
                {" "}({billingCycle === "monthly" ? "Monthly" : "Annual"} billing)
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
