"use client";

import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClientProfilePage({ initial = {} }) {
  const [form, setForm] = useState({
    companymail: initial.companymail || "", 
    password: initial.password || "",
    firstName: initial.firstName || "",
    lastName: initial.lastName || "",
    companyName: initial.companyName || "",
    companySize: initial.companySize || "",
    email: initial.email || "",
    phone: initial.phone || "",
    avatar: initial.avatar || null,
  });
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setForm((f) => ({ ...f, [name]: type === "file" ? files[0] : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", form);
    // TODO: API call
  };

  const subscriptionPlans = [
    { title: "Basic", price: "$10/mo", features: ["Feature A", "Feature B"], color: "bg-blue-200" },
    { title: "Standard", price: "$30/mo", features: ["Feature A", "Feature B", "Feature C"], color: "bg-green-200" },
    { title: "Premium", price: "$60/mo", features: ["Feature A", "Feature B", "Feature C", "Feature D"], color: "bg-purple-200" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <Card>
          <CardHeader className="bg-indigo-600 text-white p-6 text-center">
            <div className="relative inline-block">
              <img
                src={
                  form.avatar ? URL.createObjectURL(form.avatar) : "/default-avatar.png"
                }
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
              />
              <button
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition"
              >
                <FiCamera className="text-indigo-600" size={18} />
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
            <CardTitle className="mt-4 text-2xl font-semibold">
              {form.firstName} {form.lastName}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="Company Email" name="companymail" value={form.companymail} onChange={handleChange} />
                <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
                <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
                <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
                <Input label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} />
                <Select
                  label="Company Size"
                  name="companySize"
                  value={form.companySize}
                  options={["1-10","11-50","201-500","501-1000","1001-5000","5001-10000","10000+"]}
                  onChange={handleChange}
                />
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow">
                  Save Profile
                </Button>
              </div>
            </form>

            {/* Subscription Plans Cards */}
            <div className="mt-12">
              <h3 className="text-lg font-medium mb-4">Current Subscription Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <div key={plan.title} className={`${plan.color} p-6 rounded-lg shadow-md`}>
                    <h4 className="text-xl font-semibold mb-2">{plan.title}</h4>
                    <p className="text-2xl font-bold mb-4">{plan.price}</p>
                    <ul className="list-disc list-inside space-y-1">
                      {plan.features.map((feat) => (
                        <li key={feat}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
      />
    </div>
  );
}

function Select({ label, name, value, options, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
