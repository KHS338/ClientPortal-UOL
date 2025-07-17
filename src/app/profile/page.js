"use client";

import { useState, useRef } from "react";
import Image from "next/image";
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
    }, 1500);
  };

  const primary = "#1a84de";
  const primaryDark = "#06398e";

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
              <Card className="p-8 bg-gradient-to-br from-[#1a84de] to-[#1a84de] text-white shadow-2xl border-0 flex flex-col h-full">
                <div className="text-center flex-1 flex flex-col justify-center">
                  {/* Avatar and User Info - Centered */}
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="mx-auto">
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img
                          src={form.avatar ? URL.createObjectURL(form.avatar) : "/images/profile.png"}
                          alt="Profile"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="mx-auto mt-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group flex"
                      >
                        <FiCamera size={18} className="text-[#1a84de] group-hover:scale-110 transition-transform" />
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
                      <FiUser className="text-black]" />
                      Profile Information
                    </h3>
                    <Button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                      className="flex items-center gap-2 border-[#0958d9] text-[#0958d9] hover:border-[#24AC4A] hover:bg-[#24AC4A] hover:text-white transition-all duration-300"
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
                          className="absolute right-3 top-10 text-gray-500 contnent-center hover:text-gray-700 transition"
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
                        className="px-8 py-2  bg-[#0958d9]  hover:bg-[#24AC4A] text-white shadow-lg hover:shadow-xl transition-all hover:ease-in-out duration-300 hover:-translate-y-1 hover:scale-[1.02]"
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
          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0958d9] focus:border-transparent transition-all duration-300 ${disabled
            ? "bg-gray-50 text-gray-500 cursor-not-allowed"
            : "bg-white hover:border-[#0958d9]/50"
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
          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0958d9] focus:border-transparent transition-all duration-300 appearance-none cursor-pointer ${disabled
            ? "bg-gray-50 text-gray-500 cursor-not-allowed"
            : "bg-white hover:border-[#0958d9]/50"
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