"use client";
 
import Link from "next/link";
import { useState } from "react";
 
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md my-5">
        <div className="flex justify-center">
          <img src="/images/asset.jpg" alt="Asset" className="h-40" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Login
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign up to access CRM
        </p>
 
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#19AF1A]"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
 
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#19AF1A]"
              placeholder="********"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
 
          <button
            type="button"
            className="w-full bg-[#19AF1A] text-white py-2 rounded-md hover:transition -translate-y-1 hover:ease-in-out hover:scale-105 duration-300 hover:bg-[#128A14]"
          >
            Register
          </button>
        </form>
 
        <p className="mt-6 text-center text-gray-600 text-sm">
          Create an account?{" "}
          <Link href="/registration" className="text-[#19AF1A] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
 
 