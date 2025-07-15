"use client";
 
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCamera } from "react-icons/fi";
export default function ClientRegistrationPage() {
  const [form, setForm] = useState({
    companymail: "",
    password:"",
    firstName: "",
    lastName: "",
    companyName: "",
    companySize: "",
    email: "",
    phone: "",
    avatar: null
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
        <div className="flex justify-center">
          <img src="/images/Logoname.jpg" alt="Asset" className="h-40" />
        </div>
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
              <div className="w-28 h-28 rounded-full bg-[#19AF1A] flex items-center justify-center text-gray-600 hover:bg-[#158A15] transition">
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
            <input
              name="companymail"
              type="text"
              placeholder="Email"
              value={form.companymail}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />    
            <input
              name="password"
              type="text"
              placeholder="Password"
              value={form.companymail}
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
              name="companyName"
              type="text"
              placeholder="Company Name"
              value={form.companyName}
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
              <option>201-500</option>
              <option>501-1000</option>
              <option>1001-5000</option>
              <option>5001-10000</option>
              <option>10000+</option>
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
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="block w-full text-black placeholder-gray-500 border border-green-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#19AF1A] text-white py-4 rounded-lg hover:bg-[#158A15] transition-transform duration-300 transform hover:scale-105"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}
 
 