"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiCamera, FiEdit3, FiSave, FiUser, FiBriefcase, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiCalendar, FiX } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function ClientProfilePage({ initial = {} }) {
  const router = useRouter();
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [form, setForm] = useState({
    companymail: "",
    firstName: "",
    lastName: "",
    companyName: "",
    companySize: "",
    email: "",
    phone: "",
    avatar: null,
    joinDate: "",
    lastLogin: "",
    twoFactorEnabled: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorCode: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const fileRef = useRef();

  // Load user data from authentication context
  useEffect(() => {
    console.log('Profile page - Auth state:', { isAuthenticated, authLoading, authUser });
    
    if (!authLoading && !isAuthenticated) {
      console.log('Profile page - User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }
    
    if (authUser) {
      console.log('Profile page - Loading user data from auth context:', authUser);
      
      // Format dates
      const joinDate = authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      }) : "N/A";
      
      const lastLogin = authUser.lastLogin ? new Date(authUser.lastLogin).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : "Never";

      setForm({
        companymail: authUser.companymail || "",
        firstName: authUser.firstName || "",
        lastName: authUser.lastName || "",
        companyName: authUser.companyName || "",
        companySize: authUser.companySize || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        avatar: authUser.avatar || null,
        joinDate: joinDate,
        lastLogin: lastLogin,
        twoFactorEnabled: authUser.twoFactorEnabled || false,
      });
    }
  }, [authUser, isAuthenticated, authLoading, router]);

  // Show loading state while authentication is loading
  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-0 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1a84de] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === "file" ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Prepare update data - only include fields that have actually changed
      const updateData = {
        userId: authUser.id,
      };

      // Only include fields that have changed from the original user data
      if (form.firstName !== authUser.firstName) updateData.firstName = form.firstName;
      if (form.lastName !== authUser.lastName) updateData.lastName = form.lastName;
      if (form.companyName !== authUser.companyName) updateData.companyName = form.companyName;
      if (form.companySize !== authUser.companySize) updateData.companySize = form.companySize;
      if (form.email !== authUser.email) updateData.email = form.email;
      if (form.phone !== authUser.phone) updateData.phone = form.phone;
      if (form.companymail !== authUser.companymail) updateData.companymail = form.companymail;

      // Don't include password in regular profile update
      // Password changes will be handled separately

      // Call the backend API to update user profile
      const response = await fetch('http://localhost:3001/users/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update localStorage with new user data (for compatibility)
        const updatedUser = { ...authUser, ...result.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update form state with the updated user data
        setForm(prev => ({
          ...prev,
          firstName: updatedUser.firstName || "",
          lastName: updatedUser.lastName || "",
          companyName: updatedUser.companyName || "",
          companySize: updatedUser.companySize || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
          companymail: updatedUser.companymail || "",
        }));
        
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Clear message after 5 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile. Please try again.' });
      
      // Clear error message after 5 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate password form
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long!' });
      return;
    }
    
    if (form.twoFactorEnabled && !passwordForm.twoFactorCode) {
      setMessage({ type: 'error', text: 'Two-factor authentication code is required!' });
      return;
    }

    setPasswordLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:3001/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authUser.id,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          twoFactorCode: passwordForm.twoFactorCode || null
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setShowPasswordModal(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          twoFactorCode: ''
        });
        
        // Clear message after 5 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        throw new Error(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to change password. Please try again.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const primary = "#1a84de";
  const primaryDark = "#06398e";

  return (
    <ProtectedRoute>
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

          {/* Message Display */}
          {message.text && (
            <div className={`p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <p className="text-center font-medium">{message.text}</p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Profile Card */}
            <div className="xl:col-span-4">
              <div className="sticky top-8">
                <Card className="p-8 bg-gradient-to-br from-[#1a84de] to-[#1a84de] text-white shadow-2xl border-0 flex flex-col h-full">
                  <div className="text-center flex-1 flex flex-col justify-center">
                    {/* Avatar and User Info - Centered */}
                    <div className="space-y-6">
                      {/* Avatar */}
                      <div className="mx-auto">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                          <img
                            src={form.avatar && form.avatar instanceof File 
                              ? URL.createObjectURL(form.avatar) 
                              : form.avatar 
                              ? form.avatar 
                              : "/images/profile.png"
                            }
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
            </div>

            {/* Right Column - Form */}
            <div className="xl:col-span-8">
              <div className="space-y-8">
                {/* Profile Information */}
                <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                  <form onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <FiUser className="text-black" />
                        Profile Information
                      </h3>
                      <Button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        variant="outline"
                        className="min-w-[100px] flex items-center justify-center gap-2 border-[#0958d9] text-[#0958d9] hover:border-[#24AC4A] hover:bg-[#24AC4A] hover:text-white transition-all duration-300"
                      >
                        {isEditing ? (
                          <>
                            <FiSave size={16} />
                            <span>Cancel</span>
                          </>
                        ) : (
                          <>
                            <FiEdit3 size={16} />
                            <span>Edit</span>
                          </>
                        )}
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
                  </div>

                  {isEditing && (
                    <div className="mt-8 flex justify-end space-x-4">
                      <Button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="min-w-[100px] px-6 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="min-w-[140px] px-8 py-2 bg-[#0958d9] hover:bg-[#24AC4A] text-white shadow-lg hover:shadow-xl transition-all hover:ease-in-out duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  )}
                  </form>
                </Card>

                {/* Security Settings */}
                <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <FiLock className="text-black" />
                      Security Settings
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FiLock className="text-gray-600" />
                        <div>
                          <h4 className="font-semibold text-gray-800">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">
                            {form.twoFactorEnabled 
                              ? "Enabled - Your account is protected with 2FA" 
                              : "Disabled - Add an extra layer of security to your account"
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {form.twoFactorEnabled && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FiCheckCircle className="w-3 h-3 mr-1" />
                            Enabled
                          </span>
                        )}
                        <Button
                          type="button"
                          onClick={() => router.push('/profile/2fa')}
                          className="min-w-[120px] bg-[#0958d9] hover:bg-[#24AC4A] text-white px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer"
                        >
                          Manage 2FA
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FiLock className="text-gray-600" />
                        <div>
                          <h4 className="font-semibold text-gray-800">Password</h4>
                          <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setShowPasswordModal(true)}
                        variant="outline"
                        className="min-w-[150px] border-[#0958d9] text-[#0958d9] hover:border-[#24AC4A] hover:bg-[#24AC4A] hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Password Change Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <FiLock className="text-black" />
                    Change Password
                  </h2>
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactorCode: '' });
                      setMessage({ type: '', text: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0958d9] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0958d9] focus:border-transparent"
                        required
                        minLength="6"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0958d9] focus:border-transparent"
                        required
                      />
                    </div>

                    {form.twoFactorEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          2FA Code
                        </label>
                        <input
                          type="text"
                          value={passwordForm.twoFactorCode}
                          onChange={(e) => setPasswordForm({ ...passwordForm, twoFactorCode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0958d9] focus:border-transparent"
                          placeholder="Enter 6-digit code"
                          maxLength="6"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactorCode: '' });
                        setMessage({ type: '', text: '' });
                      }}
                      variant="outline"
                      className="flex-1 min-w-[100px]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={passwordLoading}
                      className="flex-1 min-w-[140px] bg-[#24AC4A] hover:bg-[#1e8b3a] text-white"
                    >
                      {passwordLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Changing...
                        </div>
                      ) : (
                        'Change Password'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
      </div>
    </ProtectedRoute>
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