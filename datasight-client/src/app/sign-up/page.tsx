"use client";

import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import CompanyLogo from "../../assets/company-logo.jpg";
import Image from "next/image";
import { LoginBtn } from "../components/button";

export default function Page() {
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isSignUpPage = true;

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="font-sans grid grid-cols-2 h-screen">
      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-black to-brand-blue rounded-tr-2xl rounded-br-2xl">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="gradient-text font-bold text-4xl">
            See Data Differently with Datasight.
          </h1>
          <p className="text-white">
            Unlock powerful insights and make better decisions with our tool.
          </p>

          <h1 className="text-white mt-12">
            Already have an account? Login in now.
          </h1>
          <LoginBtn isSignUpPage={isSignUpPage} />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-5 border-2">
          <div className="text-center flex flex-col items-center">
            <Image src={CompanyLogo} alt="Company Logo" height={50} />
            <h2 className="text-lg font-bold mt-[-0.2rem]">Sign Up</h2>
            <p className="text-gray-600 mt-[-0.4rem] text-sm">
              Create your account
            </p>
          </div>
          <div className="space-y-4 mt-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="first-name"
                  placeholder="John"
                  required
                  className="border-gray-300 rounded-md shadow-sm w-full border-[0.09rem] p-2"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="middle-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Middle Name
                </label>
                <input
                  id="middle-name"
                  placeholder="Doe"
                  className="border-gray-300 rounded-md shadow-sm w-full border-[0.09rem] p-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="last-name"
                  placeholder="Doe"
                  required
                  className="border-gray-300 rounded-md shadow-sm w-full border-[0.09rem] p-2"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={handleRoleChange}
                  className="border-gray-300 rounded-md shadow-sm w-full border-[0.09rem] p-2"
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="border-gray-300 rounded-md shadow-sm w-full border-[0.09rem] p-2"
              />
            </div>
            <div className="space-y-2 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="border-gray-300 rounded-md shadow-sm w-full border-[0.09rem] p-2 pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="text-gray-500 mt-[0.9rem] " />
                ) : (
                  <AiOutlineEye className="text-gray-500 mt-[0.9rem]" />
                )}
              </button>
            </div>
            <div className="space-y-2 relative">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="border-gray-300 rounded-md shadow-sm w-full border-[0.09rem] p-2 pr-10"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible className="text-gray-500 mt-[0.9rem]" />
                ) : (
                  <AiOutlineEye className="text-gray-500 mt-[0.9rem]" />
                )}
              </button>
            </div>
          </div>
          <div className="mt-6">
            <button className="w-full bg-black text-white py-2 px-4 rounded-md">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
