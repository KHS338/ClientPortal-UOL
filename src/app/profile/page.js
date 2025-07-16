"use client";

import { useState, useRef } from "react";
import { FiCamera, FiEdit3, FiSave, FiUser, FiBriefcase, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiCalendar } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClientProfilePage({ initial = {} }) {
  const [form, setForm] = useState({
    companymail: initial.companymail || "john.doe@company.com",
    password: initial.password || "",
    firstName: initial.firstName || "John",
    lastName: initial.lastName || "Doe",
    companyName: initial.companyName || "Tech Solutions Inc.",
    companySize: initial.companySize || "11-50",
    email: initial.email || "john.personal@gmail.com",
    phone: initial.phone || "+1 (555) 123-4567",
    avatar: initial.avatar || null,
    currentPlan: initial.currentPlan || "prequalification-monthly",
    currentService: initial.currentService || "Prequalification",
    joinDate: initial.joinDate || "January 2025",
    lastLogin: initial.lastLogin || "2 hours ago",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === "file" ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
    }, 1500);
  };

  const handlePlanChange = (serviceTitle, cycle) => {
    console.log(`Plan switch requested: ${serviceTitle} (${cycle})`);
    
    // const planKey = `${serviceTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cycle}`;
    // setForm(prev => ({
    //   ...prev,
    //   currentPlan: planKey,
    //   currentService: serviceTitle
    // }));
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
      monthly: { price: "$69/mo", key: "360-direct-monthly" },
      annual: { price: "$690/yr", key: "360-direct-annual", savings: "Save $138" },
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

  const primary = "#19AF1A";
  const primaryDark = "#158A15";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-0 via-white to-green-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              My Profile
            </h1>
            <p className="text-lg text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Profile Card */}
            <div className="xl:col-span-4">
              <Card className="p-8 bg-gradient-to-br from-[#19AF1A] to-[#158A15] text-white shadow-2xl border-0 flex flex-col h-full">
                <div className="text-center flex-1 flex flex-col justify-center">
                  {/* Avatar and User Info - Centered */}
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="mx-auto">
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img
                          src={form.avatar ? URL.createObjectURL(form.avatar) : "/default-avatar.png"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="mx-auto mt-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group flex"
                      >
                        <FiCamera size={18} className="text-[#19AF1A] group-hover:scale-110 transition-transform" />
                        <input
                          type="file"
                          name="avatar"
                          accept="image/*"
                          ref={fileRef}
                          className="hidden"
                          onChange={handleChange}
                        />
                      </button>
                    </div>

                    {/* User Info */}
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {form.firstName} {form.lastName}
                      </h2>
                      <p className="text-green-100 text-base mb-1">{form.companyName}</p>
                      <p className="text-green-200 text-sm">{form.companymail}</p>
                    </div>

                    {/* Stats */}
                    <div className="w-full">
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
                        <FiCalendar className="mx-auto mb-2" size={20} />
                        <div className="text-xs text-green-100 mb-1">Member Since</div>
                        <div className="font-bold text-sm">{form.joinDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Form */}
            <div className="xl:col-span-8">
              <div className="space-y-8">
                {/* Profile Information */}
                <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <FiUser className="text-[#19AF1A]" />
                      Profile Information
                    </h3>
                    <Button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                      className="flex items-center gap-2 border-[#19AF1A] text-[#19AF1A] hover:bg-[#19AF1A] hover:text-white transition-all duration-300"
                    >
                      {isEditing ? <FiSave size={16} /> : <FiEdit3 size={16} />}
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="First Name"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      icon={<FiUser />}
                      disabled={!isEditing}
                    />
                    <InputField
                      label="Last Name"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      icon={<FiUser />}
                      disabled={!isEditing}
                    />
                    <InputField
                      label="Company Email"
                      name="companymail"
                      type="email"
                      value={form.companymail}
                      onChange={handleChange}
                      icon={<FiMail />}
                      disabled={!isEditing}
                    />
                    <InputField
                      label="Personal Email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      icon={<FiMail />}
                      disabled={!isEditing}
                    />
                    <InputField
                      label="Company Name"
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      icon={<FiBriefcase />}
                      disabled={!isEditing}
                    />
                    <SelectField
                      label="Company Size"
                      name="companySize"
                      value={form.companySize}
                      onChange={handleChange}
                      options={["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10000+"]}
                      icon={<FiBriefcase />}
                      disabled={!isEditing}
                    />
                    <InputField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      icon={<FiPhone />}
                      disabled={!isEditing}
                    />
                    <div className="relative">
                      <InputField
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        icon={<FiLock />}
                        disabled={!isEditing}
                        placeholder="••••••••"
                      />
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 transition"
                        >
                          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-8 flex justify-end space-x-4">
                      <Button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="px-6 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-2 bg-gradient-to-r from-[#19AF1A] to-[#158A15] hover:from-[#158A15] hover:to-[#0F6B0F] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>

          {/* Subscription & Billing - Full Width */}
          <div>
            <form onSubmit={handleSubmit}>
                <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FiCheckCircle className="text-[#19AF1A]" />
                    Subscription & Services
                  </h3>
                  
                  {/* Billing Cycle Toggle */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 p-1 rounded-xl inline-flex">
                      <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                          billingCycle === "monthly"
                            ? "bg-[#19AF1A] text-white shadow-md"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingCycle("annual")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                          billingCycle === "annual"
                            ? "bg-[#19AF1A] text-white shadow-md"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        Annual
                      </button>
                      <button
                        onClick={() => setBillingCycle("enterprise")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                          billingCycle === "enterprise"
                            ? "bg-gradient-to-r from-[#19AF1A] to-[#158A15] text-white shadow-md"
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
                            <p className="text-lg text-gray-500 font-medium">Tailored to your organization's needs</p>
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
                                <FiCheckCircle className="text-[#19AF1A] flex-shrink-0" size={18} />
                                <span className="font-medium text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>

                          <Button
                            onClick={() => console.log("Enterprise quotation requested")}
                            className="w-full md:w-auto px-12 py-4 text-lg bg-gradient-to-r from-[#19AF1A] to-[#158A15] hover:from-[#158A15] hover:to-[#0F6B0F] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                          >
                            Get Custom Quote
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {billingOptions.filter(service => !service.isEnterprise).map((service, index) => {
                        const currentPlan = billingCycle === "monthly" ? service.monthly : service.annual;
                        const isCurrentPlan = form.currentPlan === currentPlan.key;
                        
                        return (
                          <div
                            key={service.title}
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col ${
                              isCurrentPlan
                                ? "border-[#19AF1A] bg-gradient-to-br from-[#19AF1A]/10 to-[#158A15]/10 shadow-xl"
                                : "border-gray-200 bg-white hover:border-[#19AF1A]/50 hover:shadow-lg"
                            }`}
                          >
                            {isCurrentPlan && (
                              <div className="absolute -top-3 right-6 bg-[#19AF1A] text-white px-4 py-1 rounded-full text-sm font-medium">
                                Current Plan
                              </div>
                            )}

                            <div className="text-center flex-1 flex flex-col">
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h4>
                                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                                
                                <div className="mb-4">
                                  <p className="text-4xl font-bold text-[#19AF1A] mb-1">{currentPlan.price}</p>
                                  {billingCycle === "annual" && service.annual.savings && (
                                    <p className="text-sm text-green-600 font-medium">{service.annual.savings}</p>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isCurrentPlan) {
                                    handlePlanChange(service.title, billingCycle);
                                  }
                                }}
                                className={`w-full transition-all duration-300 mt-auto ${
                                  isCurrentPlan
                                    ? "bg-gray-100 text-gray-500 cursor-default"
                                    : "bg-gradient-to-r from-[#19AF1A] to-[#158A15] hover:from-[#158A15] hover:to-[#0F6B0F] text-white"
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
                  <div className="mt-8 p-6 bg-gradient-to-r from-[#19AF1A]/10 to-[#158A15]/10 rounded-xl border border-[#19AF1A]/20">
                    <h4 className="font-semibold text-gray-800 mb-2">Current Subscription</h4>
                    <p className="text-gray-600">
                      You are currently subscribed to <span className="font-semibold text-[#19AF1A]">{form.currentService}</span> 
                      {" "}({billingCycle === "monthly" ? "Monthly" : "Annual"} billing)
                    </p>
                  </div>
            </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InputField({ label, name, type = "text", value, onChange, icon, disabled = false, placeholder, className = "" }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19AF1A] focus:border-transparent transition-all duration-300 ${
            disabled 
              ? "bg-gray-50 text-gray-500 cursor-not-allowed" 
              : "bg-white hover:border-[#19AF1A]/50"
          } ${className}`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, icon, disabled = false, className = "" }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          {icon}
        </div>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19AF1A] focus:border-transparent transition-all duration-300 appearance-none cursor-pointer ${
            disabled 
              ? "bg-gray-50 text-gray-500 cursor-not-allowed" 
              : "bg-white hover:border-[#19AF1A]/50"
          } ${className}`}
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}