"use client";
 
import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiCamera, FiEye, FiEyeOff, FiUser, FiBriefcase, FiMail, FiPhone, FiLock, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClientRegistrationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companymail: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    companyName: "",
    companySize: "",
    email: "",
    phone: "",
    avatar: null
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();
 
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
    
    setForm((f) => ({
      ...f,
      [name]: type === "file" ? files[0] : value,
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match!");
      setIsLoading(false);
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    try {
      console.log("Submitting to backend:", form);
      
      // Prepare data for backend (exclude confirmPassword and avatar file)
      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        companymail: form.companymail,
        email: form.email,
        password: form.password,
        companyName: form.companyName,
        companySize: form.companySize,
        phone: form.phone,
        avatar: form.avatar ? 'uploaded-avatar.jpg' : null // For now, just a placeholder
      };

      // Call backend API
      const response = await fetch('https://8w2mk49p-3001.inc1.devtunnels.ms/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      console.log("Backend response:", result);

      if (result.success) {
        // Success - show success message
        setIsLoading(false);
        setShowSuccess(true);
        
        // Store user data in localStorage for later use
        localStorage.setItem('registeredUser', JSON.stringify(result.user));
        
        // Redirect to login page after showing success message
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // Handle backend errors
        setIsLoading(false);
        setError(result.message || 'Registration failed. Please try again.');
      }
      
    } catch (error) {
      // Handle network errors
      console.error('Registration error:', error);
      setIsLoading(false);
      setError('Network error. Please check your connection and try again.');
    }
  };
 
  const primary = "#19AF1A";
  const primaryDark = "#158A15";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl"
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-6"
              >
                <Image src="/images/Logoname.jpg" alt="Company Logo" width={250} height={250} className="h-32 md:h-40 object-contain" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-3"
              >
                Join Our Platform
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Create your account and start managing your business with ease
              </motion.p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl"
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-800 mb-1">Account Created Successfully!</h3>
                    <p className="text-green-700">Welcome to our platform. Redirecting you to choose your subscription...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl"
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-red-800 mb-1">Registration Failed</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Avatar Upload */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-32 h-32 mx-auto bg-[#0958d9] rounded-full overflow-hidden border-4 border-white shadow-xl"
                  >
                      <img
                        src={"images/profile.png"}
                        alt="Profile"
                        width={130}
                        height={130}
                        className="w-full h-full object-cover"
                      />
                    
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-100">
                    <FiUser size={16} className="text-gray-600" />
                  </div>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    ref={fileRef}
                    className="hidden"
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              {/* Form Fields */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <InputField
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  icon={<FiUser />}
                  required
                />
                <InputField
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  icon={<FiUser />}
                  required
                />
                <InputField
                  name="companymail"
                  type="email"
                  placeholder="Company Email"
                  value={form.companymail}
                  onChange={handleChange}
                  icon={<FiMail />}
                  required
                />
                <InputField
                  name="email"
                  type="email"
                  placeholder="Personal Email"
                  value={form.email}
                  onChange={handleChange}
                  icon={<FiMail />}
                  required
                />
                <div className="relative">
                  <InputField
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    icon={<FiLock />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <InputField
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    icon={<FiLock />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                <InputField
                  name="companyName"
                  type="text"
                  placeholder="Company Name"
                  value={form.companyName}
                  onChange={handleChange}
                  icon={<FiBriefcase />}
                  required
                />
                <SelectField
                  name="companySize"
                  value={form.companySize}
                  onChange={handleChange}
                  options={["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10000+"]}
                  placeholder="Select Company Size"
                  icon={<FiBriefcase />}
                  required
                />
                <InputField
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  icon={<FiPhone />}
                  required
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="pt-6"
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0958d9]  hover:bg-[#24AC4A] text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>

              {/* Terms */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="text-center text-sm text-gray-600 mt-6"
              >
                By creating an account, you agree to our{" "}
                <a href="#" className="text-[#0958d9]  hover:text-[#24AC4A] font-medium transition">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#0958d9]  hover:text-[#24AC4A] font-medium transition">
                  Privacy Policy
                </a>
              </motion.p>

              {/* Go back to login button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="text-center mt-6"
              >
                <Button
                  type="button"
                  onClick={() => router.push('/login')}
                  variant="outline"
                  className="inline-flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg text-white hover:text-white bg-[#0958d9]  hover:bg-[#24AC4A] transition-all duration-300"
                >
                  <FiArrowLeft size={16} />
                  <span>Go back to login</span>
                </Button>
              </motion.div>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// Helper Components
function InputField({ name, type, placeholder, value, onChange, icon, required = false, className = "" }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0958d9] focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-[#0958d9]/50 text-gray-800 placeholder-gray-500 ${className}`}
      />
    </div>
  );
}

function SelectField({ name, value, onChange, options, placeholder, icon, required = false, className = "" }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
        {icon}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0958d9] focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-[#0958d9]/50 text-gray-800 appearance-none cursor-pointer ${className}`}
      >
        <option value="" disabled>
          {placeholder}
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
  );
}