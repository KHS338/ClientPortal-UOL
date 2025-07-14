"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCamera } from "react-icons/fi";
export default function ClientRegistrationPage() {
  const [form, setForm] = useState({
    service: "",
    clientNumber: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    sector: "",
    companyName: "",
    companyLi: "",
    companySize: "",
    email: "",
    clientLi: "",
    phone: "",
    subscription: "",
    credits: "",
    creditsPerDay: "",
    amount: "",
    startDate: null,
    endDate: null,
    reminder: null,
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleDate = (name, date) => {
    setForm((f) => ({ ...f, [name]: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", form);
    // TODO: call your API here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-12 rounded-2xl shadow-xl w-full max-w-4xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          Add New Client
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Fill in the details below to register your client
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Upload */}
          <div className="flex justify-center mb-8">
            <label className="cursor-pointer">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
              <div className="w-28 h-28 rounded-full bg-green-200 flex items-center justify-center text-gray-600 hover:bg-green-400 transition">
                {form.avatar ? (
                  <img
                    src={URL.createObjectURL(form.avatar)}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FiCamera size={28} />
                )}
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            >
              <option value="" disabled>
                Select Service
              </option>
              <option>Consulting</option>
              <option>Implementation</option>
              <option>Support</option>
            </select>

            <input
              name="clientNumber"
              type="text"
              placeholder="Client Number"
              value={form.clientNumber}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />

            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />

            <input
              name="jobTitle"
              type="text"
              placeholder="Job Title"
              value={form.jobTitle}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition col-span-full"
            />

            <select
              name="sector"
              value={form.sector}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            >
              <option value="" disabled>
                Select Sector
              </option>
              <option>Finance</option>
              <option>Healthcare</option>
              <option>Education</option>
            </select>

            <input
              name="companyName"
              type="text"
              placeholder="Company Name"
              value={form.companyName}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />
            <input
              name="companyLi"
              type="text"
              placeholder="Company LI"
              value={form.companyLi}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />

            <select
              name="companySize"
              value={form.companySize}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            >
              <option value="" disabled>
                Select Company Size
              </option>
              <option>1-10</option>
              <option>11-50</option>
              <option>51-200</option>
            </select>

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />
            <input
              name="clientLi"
              type="text"
              placeholder="Client LI"
              value={form.clientLi}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />

            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />

            <select
              name="subscription"
              value={form.subscription}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            >
              <option value="" disabled>
                Subscription Type
              </option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>

            <input
              name="credits"
              type="number"
              placeholder="Credits"
              value={form.credits}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />
            <input
              name="creditsPerDay"
              type="number"
              placeholder="Credits/Day"
              value={form.creditsPerDay}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />

            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />

            <DatePicker
              selected={form.startDate}
              onChange={(d) => handleDate("startDate", d)}
              placeholderText="Start Date"
              className="block w-full placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />
            <DatePicker
              selected={form.endDate}
              onChange={(d) => handleDate("endDate", d)}
              placeholderText="End Date"
              className="block w-full placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />

            <DatePicker
              selected={form.reminder}
              onChange={(d) => handleDate("reminder", d)}
              placeholderText="Reminder Date"
              className="block w-full placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition col-span-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            Add Client
          </button>
        </form>
      </div>
    </div>
  );
}
