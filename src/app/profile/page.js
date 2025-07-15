"use client";

import { useState, useRef } from "react";
import { FiCamera, FiEdit3, FiSave, FiUser, FiBriefcase, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
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
    currentPlan: initial.currentPlan || "Monthly",
    joinDate: initial.joinDate || "January 2025",
    lastLogin: initial.lastLogin || "2 hours ago",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      alert("Profile updated successfully!");
    }, 1500);
  };

  const billingOptions = [
    { title: "Monthly", price: "$29/mo", key: "Monthly", features: ["Full Access", "Priority Support", "Advanced Analytics"] },
    { title: "Annual", price: "$290/yr", key: "Annual", features: ["Full Access", "Priority Support", "Advanced Analytics", "2 Months Free"] },
  ];

  const primary = "#19AF1A";
  const primaryDark = "#158A15";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold text-gray-800 mb-2"
            >
              My Profile
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-gray-600"
            >
              Manage your account settings and preferences
            </motion.p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="xl:col-span-4"
            >
              <Card className="p-8 bg-gradient-to-br from-[#19AF1A] to-[#158A15] text-white shadow-2xl border-0">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src={form.avatar ? URL.createObjectURL(form.avatar) : "/default-avatar.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="absolute bottom-2 right-1/2 transform translate-x-6 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
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
                  <h2 className="text-2xl font-bold mb-2">
                    {form.firstName} {form.lastName}
                  </h2>
                  <p className="text-green-100 mb-1">{form.companyName}</p>
                  <p className="text-green-200 text-sm mb-6">{form.companymail}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <FiCalendar className="mx-auto mb-2" size={20} />
                      <div className="text-sm text-green-100">Member Since</div>
                      <div className="font-semibold">{form.joinDate}</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <FiCheckCircle className="mx-auto mb-2" size={20} />
                      <div className="text-sm text-green-100">Last Login</div>
                      <div className="font-semibold">{form.lastLogin}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="xl:col-span-8"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
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
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-8 flex justify-end space-x-4"
                    >
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
                    </motion.div>
                  )}
                </Card>

                {/* Subscription & Billing */}
                <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FiCheckCircle className="text-[#19AF1A]" />
                    Subscription & Billing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {billingOptions.map((option) => {
                      const isCurrent = form.currentPlan === option.key;
                      return (
                        <motion.div
                          key={option.key}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            isCurrent
                              ? "border-[#19AF1A] bg-gradient-to-br from-[#19AF1A]/10 to-[#158A15]/10 shadow-lg"
                              : "border-gray-200 bg-white hover:border-[#19AF1A]/50 hover:shadow-md"
                          }`}
                        >
                          {isCurrent && (
                            <div className="absolute -top-3 left-6 bg-[#19AF1A] text-white px-4 py-1 rounded-full text-sm font-medium">
                              Current Plan
                            </div>
                          )}
                          <div className="text-center">
                            <h4 className="text-xl font-bold text-gray-800 mb-2">{option.title}</h4>
                            <p className="text-3xl font-bold text-[#19AF1A] mb-4">{option.price}</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                              {option.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <FiCheckCircle className="text-[#19AF1A] flex-shrink-0" size={14} />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </form>
            </motion.div>
          </div>
        </motion.div>
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