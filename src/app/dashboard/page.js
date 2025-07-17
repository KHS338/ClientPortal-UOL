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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load subscription data from localStorage
  useEffect(() => {
    const savedSubscription = localStorage.getItem('userSubscription');
    if (savedSubscription) {
      const data = JSON.parse(savedSubscription);
      console.log('Dashboard - Loaded subscription data:', data);
      setSubscriptionInfo({
        currentPlan: data.service,
        billingCycle: data.billingCycle === 'monthly' ? 'Monthly' : 
                     data.billingCycle === 'annual' ? 'Annual' : 
                     data.billingCycle === 'enterprise' ? 'Enterprise' : 'Custom',
        nextPayment: data.nextPayment,
        planPrice: data.price
      });
    }
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
    { name: "CV Sourcing", status: "active", usage: "45/100 searches", color: "blue" },
    { name: "Prequalification", status: "active", usage: "12/50 assessments", color: "green" },
    { name: "360/Direct", status: "inactive", usage: "Not subscribed", color: "gray" },
    { name: "Lead Generation", status: "inactive", usage: "Not subscribed", color: "gray" },
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
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Roles & Subscription Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Manage your recruitment roles and subscription services
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-2xl font-bold text-[#1a84de]">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>

          {/* Current Subscription Status */}
          <Card className="p-6 bg-gradient-to-br from-[#1a84de] to-[#06398e] text-white shadow-xl border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <FiCheckCircle size={24} />
                Current Subscription
              </h3>
              <Button 
                className="bg-white text-[#1a84de] hover:bg-gray-100"
                onClick={() => window.location.href = '/subscription-info'}
              >
                Manage
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Active Plan</p>
                <p className="text-xl font-bold">{subscriptionInfo.currentPlan}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Billing</p>
                <p className="text-xl font-bold">{subscriptionInfo.billingCycle}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Price</p>
                <p className="text-xl font-bold">{subscriptionInfo.planPrice}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Next Payment</p>
                <p className="text-xl font-bold">{subscriptionInfo.nextPayment}</p>
              </div>
            </div>
          </Card>

          

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Role Activity */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <FiBriefcase className="text-[#1a84de]" />
                  Recent Role Activity
                </h3>
               
              </div>
              <div className="space-y-4">
                {recentRoleActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-500' : 
                        activity.status === 'active' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.role} • {activity.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Subscription Services */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <FiSettings className="text-[#1a84de]" />
                  Subscription Services
                </h3>
                <Button 
                  variant="outline" 
                  className="text-[#1a84de] border-[#1a84de] hover:bg-[#1a84de] hover:text-white ml-2"
                  onClick={() => window.location.href = '/subscription-info'}
                >
                  Manage Plans
                </Button>
              </div>
              <div className="space-y-4">
                {subscriptionServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#1a84de]/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${
                        service.color === 'blue' ? 'bg-blue-500' :
                        service.color === 'green' ? 'bg-green-500' :
                        'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-800">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.usage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <FiTarget className="text-[#1a84de]" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1a84de] to-[#06398e] hover:from-[#24AC4A] hover:to-[#1e8f3a] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/roles/cvSourcing'}
              >
                <FiBriefcase size={20} />
                <span className="text-sm">CV Sourcing</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#24AC4A] to-[#1e8f3a] hover:from-[#1a84de] hover:to-[#06398e] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/roles/PreQualification'}
              >
                <FiUser size={20} />
                <span className="text-sm">Prequalification</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#f59e0b] to-[#d97706] hover:from-[#1a84de] hover:to-[#06398e] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/roles/360Direct'}
              >
                <FiTarget size={20} />
                <span className="text-sm">360/Direct</span>
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] hover:from-[#1a84de] hover:to-[#06398e] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/subscription-info'}
              >
                <FiSettings size={20} />
                <span className="text-sm">Subscriptions</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
