"use client";

import { useState, useEffect } from "react";
import { FiUser, FiDollarSign, FiCalendar, FiBriefcase, FiClock, FiCheckCircle, FiSettings, FiTarget, FiUsers, FiFileText } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    currentPlan: "No Active Plan",
    billingCycle: "N/A",
    nextPayment: "N/A",
    planPrice: "N/A"
  });
  const [userSubscription, setUserSubscription] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load subscription data from localStorage
  useEffect(() => {
    const loadSubscription = () => {
      const savedSubscription = localStorage.getItem('userSubscription');
      if (savedSubscription) {
        const data = JSON.parse(savedSubscription);
        console.log('Dashboard - Loaded subscription data:', data);
        setUserSubscription(data.service);
        setSubscriptionInfo({
          currentPlan: data.service,
          billingCycle: data.billingCycle === 'monthly' ? 'Monthly' : 
                       data.billingCycle === 'annual' ? 'Annual' : 
                       data.billingCycle === 'enterprise' ? 'Enterprise' : 'Custom',
          nextPayment: data.nextPayment,
          planPrice: data.price
        });
      } else {
        // Reset to default state if no subscription
        setUserSubscription(null);
        setSubscriptionInfo({
          currentPlan: "No Active Plan",
          billingCycle: "N/A",
          nextPayment: "N/A",
          planPrice: "N/A"
        });
      }
    };

    // Load initial subscription data
    loadSubscription();

    // Listen for custom event when subscription is updated
    const handleSubscriptionUpdate = () => {
      console.log('Dashboard - Subscription update event detected');
      loadSubscription();
    };

    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);

    return () => {
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    };
  }, []);

  // Mock data for dashboard metrics - focused on roles and subscription

  const roleStats = {
    activeRoles: 12,
    totalApplications: 247,
    interviewsScheduled: 8,
    placementsThisMonth: 3
  };

  const recentRoleActivity = [
    { id: 1, action: "New role posted", service: "CV Sourcing", role: "Senior Developer", time: "2 hours ago", status: "active" },
   
  ];

  const subscriptionServices = [
    { 
      name: "CV Sourcing", 
      status: (userSubscription === "CV Sourcing" || userSubscription === "Free Trial") ? "active" : "inactive", 
      usage: userSubscription === "CV Sourcing" ? "45/100 searches" : 
             userSubscription === "Free Trial" ? "3/5 trial searches" : "Not subscribed", 
      color: (userSubscription === "CV Sourcing" || userSubscription === "Free Trial") ? "blue" : "gray" 
    },
    { 
      name: "Prequalification", 
      status: userSubscription === "Prequalification" ? "active" : "inactive", 
      usage: userSubscription === "Prequalification" ? "12/50 assessments" : "Not subscribed", 
      color: userSubscription === "Prequalification" ? "green" : "gray" 
    },
    { 
      name: "360/Direct", 
      status: userSubscription === "360/Direct" ? "active" : "inactive", 
      usage: userSubscription === "360/Direct" ? "8/25 placements" : "Not subscribed", 
      color: userSubscription === "360/Direct" ? "orange" : "gray" 
    },
    { 
      name: "Lead Generation", 
      status: userSubscription === "Lead Generation" ? "active" : "inactive", 
      usage: userSubscription === "Lead Generation" ? "15/50 leads" : "Not subscribed", 
      color: userSubscription === "Lead Generation" ? "purple" : "gray" 
    },
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-0 via-white to-green-50">
      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-6xl lg:max-w-7xl xl:max-w-[85%] 2xl:max-w-[80%] mx-auto p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-1 sm:mb-2">
                Welcome!
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Manage your recruitment roles and subscription services
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a84de]">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>

          {/* Current Subscription Status */}
          <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#1a84de] to-[#06398e] text-white shadow-xl border-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                <FiCheckCircle size={20} className="sm:w-6 sm:h-6" />
                Current Subscription
              </h3>
              <Button 
                className="bg-white text-[#1a84de] hover:bg-gray-100 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 w-fit"
                onClick={() => window.location.href = '/subscription-info'}
              >
                Manage
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Active Plan</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold break-words">{subscriptionInfo.currentPlan}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Billing</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{subscriptionInfo.billingCycle}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Price</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{subscriptionInfo.planPrice}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Next Payment</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold break-words">{subscriptionInfo.nextPayment}</p>
              </div>
            </div>
          </Card>

          

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Recent Role Activity */}
            <Card className="xl:col-span-1 2xl:col-span-2 p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                  <FiBriefcase className="text-[#1a84de] w-5 h-5 sm:w-6 sm:h-6" />
                  Recent Role Activity
                </h3>
               
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentRoleActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 sm:p-4 lg:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 min-w-0 flex-1">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full flex-shrink-0 ${
                        activity.status === 'completed' ? 'bg-green-500' : 
                        activity.status === 'active' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 text-sm sm:text-base lg:text-lg truncate">{activity.action}</p>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-600 truncate">{activity.role} • {activity.service}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-xs sm:text-sm lg:text-base text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Subscription Services */}
            <Card className="p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                  <FiSettings className="text-[#1a84de] w-5 h-5 sm:w-6 sm:h-6" />
                  Subscription Services
                </h3>
                <Button 
                  variant="outline" 
                  className="text-[#1a84de] border-[#1a84de] hover:bg-[#1a84de] hover:text-white text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3 w-fit"
                  onClick={() => window.location.href = '/subscription-info'}
                >
                  Manage Plans
                </Button>
              </div>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {subscriptionServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border border-gray-200 rounded-xl hover:border-[#1a84de]/50 transition-colors">
                    <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 min-w-0 flex-1">
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full flex-shrink-0 ${
                        service.color === 'blue' ? 'bg-blue-500' :
                        service.color === 'green' ? 'bg-green-500' :
                        service.color === 'orange' ? 'bg-orange-500' :
                        service.color === 'purple' ? 'bg-purple-500' :
                        'bg-gray-300'
                      }`}></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 text-sm sm:text-base lg:text-lg truncate">{service.name}</p>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-600 truncate">{service.usage}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className={`px-2 py-1 sm:px-3 sm:py-1 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-medium ${
                        service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions for Roles & Subscription */}
          <Card className="p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3">
              <FiTarget className="text-[#1a84de] w-5 h-5 sm:w-6 sm:h-6" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
              <Button 
                className={`h-16 sm:h-20 lg:h-24 xl:h-28 flex flex-col items-center justify-center gap-1 sm:gap-2 shadow-lg transition-all duration-300 ${
                  (userSubscription === 'CV Sourcing' || userSubscription === 'Free Trial')
                    ? 'bg-gradient-to-br from-[#1a84de] to-[#06398e] hover:from-[#24AC4A] hover:to-[#1e8f3a] text-white hover:shadow-xl cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                }`}
                onClick={() => (userSubscription === 'CV Sourcing' || userSubscription === 'Free Trial') && (window.location.href = '/roles/cvSourcing')}
                disabled={!(userSubscription === 'CV Sourcing' || userSubscription === 'Free Trial')}
              >
                <FiBriefcase size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span className="text-xs sm:text-sm lg:text-base font-medium text-center">CV Sourcing</span>
                {userSubscription === 'Free Trial' && (
                  <span className="text-xs lg:text-sm text-center">Trial Access</span>
                )}
                {!(userSubscription === 'CV Sourcing' || userSubscription === 'Free Trial') && (
                  <span className="text-xs lg:text-sm text-center">Not subscribed</span>
                )}
              </Button>
              <Button 
                className={`h-16 sm:h-20 lg:h-24 xl:h-28 flex flex-col items-center justify-center gap-1 sm:gap-2 shadow-lg transition-all duration-300 ${
                  userSubscription === 'Prequalification'
                    ? 'bg-gradient-to-br from-[#24AC4A] to-[#1e8f3a] hover:from-[#1a84de] hover:to-[#06398e] text-white hover:shadow-xl cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                }`}
                onClick={() => userSubscription === 'Prequalification' && (window.location.href = '/roles/PreQualification')}
                disabled={userSubscription !== 'Prequalification'}
              >
                <FiUser size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span className="text-xs sm:text-sm lg:text-base font-medium text-center">Prequalification</span>
                {userSubscription !== 'Prequalification' && (
                  <span className="text-xs lg:text-sm text-center">Not subscribed</span>
                )}
              </Button>
              <Button 
                className={`h-16 sm:h-20 lg:h-24 xl:h-28 flex flex-col items-center justify-center gap-1 sm:gap-2 shadow-lg transition-all duration-300 ${
                  userSubscription === '360/Direct'
                    ? 'bg-gradient-to-br from-[#f59e0b] to-[#d97706] hover:from-[#1a84de] hover:to-[#06398e] text-white hover:shadow-xl cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                }`}
                onClick={() => userSubscription === '360/Direct' && (window.location.href = '/roles/360Direct')}
                disabled={userSubscription !== '360/Direct'}
              >
                <FiTarget size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span className="text-xs sm:text-sm lg:text-base font-medium text-center">360/Direct</span>
                {userSubscription !== '360/Direct' && (
                  <span className="text-xs lg:text-sm text-center">Not subscribed</span>
                )}
              </Button>
              <Button 
                className={`h-16 sm:h-20 lg:h-24 xl:h-28 flex flex-col items-center justify-center gap-1 sm:gap-2 shadow-lg transition-all duration-300 ${
                  userSubscription === 'Lead Generation'
                    ? 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] hover:from-[#1a84de] hover:to-[#06398e] text-white hover:shadow-xl cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                }`}
                onClick={() => userSubscription === 'Lead Generation' && (window.location.href = '/leadsGeneration')}
                disabled={userSubscription !== 'Lead Generation'}
              >
                <FiUsers size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span className="text-xs sm:text-sm lg:text-base font-medium text-center">Lead Generation</span>
                {userSubscription !== 'Lead Generation' && (
                  <span className="text-xs lg:text-sm text-center">Not subscribed</span>
                )}
              </Button>
              <Button 
                className={`h-16 sm:h-20 lg:h-24 xl:h-28 flex flex-col items-center justify-center gap-1 sm:gap-2 shadow-lg transition-all duration-300 ${
                  userSubscription === 'VA'
                    ? 'bg-gradient-to-br from-[#ec4899] to-[#db2777] hover:from-[#1a84de] hover:to-[#06398e] text-white hover:shadow-xl cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                }`}
                onClick={() => userSubscription === 'VA' && (window.location.href = '/va')}
                disabled={userSubscription !== 'VA'}
              >
                <FiFileText size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span className="text-xs sm:text-sm lg:text-base font-medium text-center">VA Services</span>
                {userSubscription !== 'VA' && (
                  <span className="text-xs lg:text-sm text-center">Not subscribed</span>
                )}
              </Button>
              <Button 
                className="h-16 sm:h-20 lg:h-24 xl:h-28 flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gradient-to-br from-[#1a84de] to-[#06398e] hover:from-[#24AC4A] hover:to-[#1e8f3a] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/subscription-info'}
              >
                <FiSettings size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <span className="text-xs sm:text-sm lg:text-base font-medium text-center">Subscriptions</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
