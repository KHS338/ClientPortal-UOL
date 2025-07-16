"use client";
import React from "react"; // Assuming you have a profile image in your assets
import { useState, useRef, useCallback, useMemo } from "react";
import { Camera, Edit3, Save, User, Briefcase, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClientProfilePage({ initial = {} }) {
  // Optimized initial state setup
  const initialForm = useMemo(() => ({
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
  }), [initial]);

  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const fileRef = useRef();

  // Performance-optimized handlers
  const handleChange = useCallback((e) => {
    const { name, value, files, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Immediate visual feedback
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsLoading(false);
        setIsEditing(false);
      }, 10); // Minimal delay for visual feedback
    });
  }, []);

  const handlePlanChange = useCallback((serviceTitle, cycle) => {
    const planKey = `${serviceTitle.toLowerCase()}-${cycle}`;
    setForm(prev => ({
      ...prev,
      currentPlan: planKey,
      currentService: serviceTitle
    }));
  }, []);

  const toggleEditing = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleFileUpload = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleBillingCycleChange = useCallback((cycle) => {
    setBillingCycle(cycle);
  }, []);

  // Memoized static data
  const billingOptions = useMemo(() => [
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
    }
  ], []);

  const companySizeOptions = useMemo(() => 
    ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"], []);

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
            {/* Profile Card */}
            <div className="xl:col-span-4">
              <Card className="p-8 bg-gradient-to-br from-[#19AF1A] to-[#158A15] text-white shadow-2xl border-0 h-full">
                <div className="text-center h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="mx-auto">
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                        {form.avatar ? (
                          <img
                            src={Profile}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <User className="w-16 h-16 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleFileUpload}
                        className="mx-auto mt-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
                      >
                        <Camera className="text-[#19AF1A]" />
                        <input
                          type="file"
                          name="avatar"
                          ref={fileRef}
                          className="hidden"
                          onChange={handleChange}
                          accept="image/*"
                        />
                      </button>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {form.firstName} {form.lastName}
                      </h2>
                      <p className="text-green-100 text-base mb-1">{form.companyName}</p>
                      <p className="text-green-200 text-sm">{form.companymail}</p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4">
                      <Calendar className="mx-auto mb-2" />
                      <div className="text-xs text-green-100 mb-1">Member Since</div>
                      <div className="font-bold text-sm">{form.joinDate}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Form Section */}
            <div className="xl:col-span-8">
              <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <User className="text-[#19AF1A]" />
                    Profile Information
                  </h3>
                  <Button
                    onClick={toggleEditing}
                    variant="outline"
                    className="flex items-center gap-2 border-[#19AF1A] text-[#19AF1A] hover:bg-[#19AF1A] hover:text-white"
                  >
                    {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    icon={<User size={16} />}
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    icon={<User size={16} />}
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Company Email"
                    name="companymail"
                    type="email"
                    value={form.companymail}
                    onChange={handleChange}
                    icon={<Mail size={16} />}
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Personal Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    icon={<Mail size={16} />}
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Company Name"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    icon={<Briefcase size={16} />}
                    disabled={!isEditing}
                  />
                  <SelectField
                    label="Company Size"
                    name="companySize"
                    value={form.companySize}
                    onChange={handleChange}
                    options={companySizeOptions}
                    icon={<Briefcase size={16} />}
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    icon={<Phone size={16} />}
                    disabled={!isEditing}
                  />
                  <div className="relative">
                    <InputField
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      icon={<Lock size={16} />}
                      disabled={!isEditing}
                      placeholder="••••••••"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex justify-end space-x-4">
                    <Button
                      type="button"
                      onClick={toggleEditing}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-[#19AF1A] to-[#158A15] hover:from-[#158A15] hover:to-[#0F6B0F]"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Optimized InputField Component
const InputField = React.memo(({ label, name, type = "text", value, onChange, icon, disabled, placeholder }) => {
  const handleChange = (e) => {
    if (!disabled) {
      onChange(e);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19AF1A] ${
            disabled ? "bg-gray-50 text-gray-500" : "bg-white hover:border-[#19AF1A]/50"
          }`}
        />
      </div>
    </div>
  );
});

// Optimized SelectField Component
const SelectField = React.memo(({ label, name, value, onChange, options, icon, disabled }) => {
  const handleChange = (e) => {
    if (!disabled) {
      onChange(e);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <select
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19AF1A] ${
            disabled ? "bg-gray-50 text-gray-500" : "bg-white hover:border-[#19AF1A]/50"
          }`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});
