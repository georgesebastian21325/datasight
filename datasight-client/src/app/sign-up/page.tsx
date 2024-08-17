"use client";

import React, { useState } from "react";
import {
	AiOutlineEye,
	AiOutlineEyeInvisible,
} from "react-icons/ai";
import CompanyLogo from "../../assets/company-logo.jpg";
import Image from "next/image";
import { LoginBtn } from "../components/button";
import SignUpForm from "../forms/sign-up-form";

export default function Page() {
	const [selectedRole, setSelectedRole] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState(false);
	const isSignUpPage = true;

	const handleRoleChange = (event: any) => {
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
						Unlock powerful insights and make better
						decisions with our tool.
					</p>

					<h1 className="text-white mt-12">
						Already have an account? Login in now.
					</h1>
					<LoginBtn isSignUpPage={isSignUpPage} />
				</div>
			</div>
			<div className="flex items-center justify-center">
				<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-5 border-2">
					<SignUpForm />
				</div>
			</div>
		</div>
	);
}
