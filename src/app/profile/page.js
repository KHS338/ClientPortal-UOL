"use client";

import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, FiLock, FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage({ initial = {} }) {
  const [form, setForm] = useState({ ...initial });
  const [avatar, setAvatar] = useState(initial.avatar ?? "");
  const [showChange, setShowChange] = useState(false);
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDate = (name, date) => {
    setForm((prev) => ({ ...prev, [name]: date }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: send form + avatar to API
    console.log("Saved profile:", { ...form, avatar });
  };

  const handlePassword = (e) => {
    e.preventDefault();
    // TODO: password change logic
    setShowChange(false);
  };

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-500 to-indigo-500 text-white p-8 flex flex-col items-center">
            <div className="relative">
              <img
                src={avatar || "/default-avatar.png"}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <button
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition"
              >
                <FiCamera className="text-green-500" size={20} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                className="hidden"
                onChange={onAvatarChange}
              />
            </div>
            <CardTitle className="mt-4 text-3xl font-semibold">
              {form.firstName || "First"} {form.lastName || "Last"}
            </CardTitle>
            <span className="mt-1 text-sm opacity-90">
              {form.jobTitle || "Your Title"}
            </span>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Contact Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Company Email" name="companymail" value={form.companymail || ""} onChange={handleChange} />
                  <Input label="Phone Number" name="phone" type="tel" value={form.phone || ""} onChange={handleChange} />
                </div>
              </div>

              {/* Subscription Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Subscription Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input label="Subscription Plan" name="subscription" value={form.subscription || ""} onChange={handleChange} />
                  <Input label="Credits/Day" name="creditsPerDay" type="number" value={form.creditsPerDay || ""} onChange={handleChange} />
                  <Input label="Company Size" name="companySize" value={form.companySize || ""} onChange={handleChange} />
                </div>
              </div>

              {/* Dates Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Important Dates</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DateInput label="Start Date" selected={form.startDate || null} onChange={(d) => handleDate("startDate", d)} />
                  <DateInput label="End Date" selected={form.endDate || null} onChange={(d) => handleDate("endDate", d)} />
                  <DateInput label="Reminder Date" selected={form.reminder || null} onChange={(d) => handleDate("reminder", d)} />
                </div>
              </div>

              {/* Additional Info Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Company Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="LinkedIn Profile" name="clientLi" value={form.clientLi || ""} onChange={handleChange} />
                  <Input label="Sector" name="sector" value={form.sector || ""} onChange={handleChange} />
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="bg-gray-50 p-6 flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setShowChange(true)} className="flex items-center">
              <FiLock className="mr-2" /> Change Password
            </Button>
            <Button type="submit" onClick={handleSave} className="shadow-md">
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Password Modal */}
        {showChange && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-lg">
              <CardHeader className="pb-0">
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePassword} className="space-y-6">
                  <Input label="Current Password" name="currentPassword" type="password" value={form.currentPassword || ''} onChange={handleChange} />
                  <Input label="New Password" name="newPassword" type="password" value={form.newPassword || ''} onChange={handleChange} />
                  <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword || ''} onChange={handleChange} />

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button variant="outline" onClick={() => setShowChange(false)}>Cancel</Button>
                    <Button type="submit">Update</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
      />
    </div>
  );
}

function DateInput({ label, selected, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <DatePicker
          selected={selected}
          onChange={onChange}
          placeholderText={label}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
        <FiCalendar className="absolute right-3 top-3 text-gray-400" />
      </div>
    </div>
  );
}
