"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiArrowLeft, FiSend } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:3001/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(result.message);
        setEmailSent(true);
      } else {
        setError(result.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#1a84de] to-[#0958d9] rounded-full flex items-center justify-center mb-4">
              <FiMail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {emailSent ? "Check Your Email" : "Forgot Password"}
            </h1>
            <p className="text-gray-600">
              {emailSent 
                ? "We've sent a password reset link to your email address"
                : "Enter your email address and we'll send you a link to reset your password"
              }
            </p>
          </div>

          {emailSent ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <FiSend className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Email Sent!</h3>
                    <p className="text-sm text-green-700 mt-1">{message}</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>• Check your email inbox and spam folder</p>
                <p>• The reset link will expire in 1 hour</p>
                <p>• Click the link in the email to reset your password</p>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                    setMessage("");
                    setError("");
                  }}
                  variant="outline"
                  className="w-full border-[#1a84de] text-[#1a84de] hover:bg-[#1a84de] hover:text-white transition-all duration-300"
                >
                  Send Another Email
                </Button>
                
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
                  >
                    <FiArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a84de] focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#1a84de] to-[#0958d9] hover:from-[#0958d9] hover:to-[#1a84de] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <FiSend className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </div>
                )}
              </Button>

              <div className="text-center">
                <Link href="/login">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-[#1a84de] hover:text-[#0958d9] hover:bg-blue-50 transition-all duration-300"
                  >
                    <FiArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </form>
          )}
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Remember your password?{" "}
            <Link href="/login" className="text-[#1a84de] hover:text-[#0958d9] font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
