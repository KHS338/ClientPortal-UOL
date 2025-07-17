"use client";
 
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
 
export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Check credentials
    if (form.email === "user@gmail.com" && form.password === "1234") {
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      }, 1500);
    } else {
      // Invalid credentials
      setTimeout(() => {
        setIsLoading(false);
        setError("Invalid email or password. Please use: user@gmail.com / 1234");
      }, 1500);
    }
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-6"
              >
                <Image src="/images/Logoname.jpg" alt="Company Logo" width={128} height={128} className="h-24 md:h-32 object-contain" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
              >
                Welcome Back
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-gray-600"
              >
                Sign in to access your client portal
              </motion.p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="space-y-4"
              >
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  icon={<FiMail />}
                  required
                />
                
                <div className="relative">
                  <InputField
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    icon={<FiLock />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#19AF1A] bg-gray-100 border-gray-300 rounded focus:ring-[#19AF1A] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  href="#"
                  className="text-sm text-[#19AF1A] hover:text-[#158A15] font-medium transition"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-700 text-sm text-center">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#19AF1A] to-[#158A15] hover:from-[#158A15] hover:to-[#0F6B0F] text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <FiUser size={18} />
                      <span>Sign In</span>
                      <FiArrowRight size={18} />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/registration"
                  className="text-[#19AF1A] hover:text-[#158A15] font-semibold transition-colors duration-300 hover:underline"
                >
                  Create one now
                </Link>
              </p>
            </motion.div>

            {/* Additional Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-[#19AF1A]" size={20} />
                  </div>
                  <span className="text-xs text-gray-600">Secure Login</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FiLock className="text-[#19AF1A]" size={20} />
                  </div>
                  <span className="text-xs text-gray-600">Data Protected</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FiArrowRight className="text-[#19AF1A]" size={20} />
                  </div>
                  <span className="text-xs text-gray-600">Quick Access</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// Helper Component
function InputField({ label, name, type = "text", placeholder, value, onChange, icon, required = false, className = "" }) {
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
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19AF1A] focus:border-transparent transition-all duration-300 bg-white hover:border-[#19AF1A]/50 text-gray-800 placeholder-gray-500 ${className}`}
        />
      </div>
    </div>
  );
}