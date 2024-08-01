"use client";

import React, { useState } from "react";
import CompanyLogo from "../../assets/company-logo.jpg";
import Image from "next/image";

export default function Page() {
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  return (
    <div className="font-sans grid grid-cols-2 h-screen">
      <div className="bg-brand-blue rounded-tr-2xl rounded-br-2xl" />
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <div className="mb-4 text-center flex flex-col items-center">
            <Image src={CompanyLogo} alt="Company Logo" />
            <h2 className="text-xl font-bold">Sign Up</h2>
            <p className="text-gray-600">Create your account</p>
          </div>
          <div className="space-y-4">
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
                  className="border-gray-300 rounded-md shadow-sm w-full"
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
                  className="border-gray-300 rounded-md shadow-sm w-full"
                />
              </div>
            </div>
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
                className="border-gray-300 rounded-md shadow-sm w-full"
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
                className="border-gray-300 rounded-md shadow-sm w-full"
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
                className="border-gray-300 rounded-md shadow-sm w-full"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="border-gray-300 rounded-md shadow-sm w-full"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                className="border-gray-300 rounded-md shadow-sm w-full"
              />
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
