"use client";

import {
	AtSymbolIcon,
	KeyIcon
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../components/button";
import { handleSignIn } from "@/lib/cognitoActions";
import { AuthenticationErrorPopUp } from "../components/popup";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
	const [errorMessage, dispatch] = useFormState(
		handleSignIn,
		undefined,
	);

	// State to manage the visibility of the password
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	};

	return (
		<form
			action={dispatch}
			className="space-y-3 w-[24rem]"
		>
			<div className="flex-1 rounded-lg  px-6 pb-4 pt-8">
				<div className='flex flex-col items-center'>
					<div className='text-center'>
						<h1 className={`gradient-text font-semibold mb-3 text-2xl`}>
							Account Login
						</h1>
					</div>
					{errorMessage && (
						<AuthenticationErrorPopUp errorMessage={errorMessage} />
					)}
				</div>
				<div className="w-full">
					<div>
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900 "
							htmlFor="email"
						>
							Email
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
								id="email"
								type="email"
								name="email"
								placeholder="Enter your email address"
								required
							/>
							<AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
					<div className="mt-4">
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
							htmlFor="password"
						>
							Password
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 pr-10 text-sm outline-2 placeholder:text-gray-500"
								id="password"
								type={showPassword ? "text" : "password"} // Switch between 'text' and 'password'
								name="password"
								placeholder="Enter password"
								required
								minLength={6}
							/>
							<KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

							{/* Add the Eye/EyeSlash Icon for password visibility toggle */}
							<div
								className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
								onClick={togglePasswordVisibility}
							>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</div>
						</div>
						<div className='flex items-end justify-end mt-2'>
							<Link href='/auth/reset-password/submit' className='text-sm text-blue-600 hover:underline font-medium'> Forget Password?</Link>
						</div>
					</div>
				</div>
				<div className='flex flex-col mt-5'>
					<LoginButton />
				</div>
			</div>
		</form>
	);
}

// LoginButton Component with loading spinner
function LoginButton() {
	const { pending } = useFormStatus(); // Get the form status to know if it's pending

	return (
		<Button
			className="mt-4 w-full flex justify-center items-center bg-brand-blue"
			aria-disabled={pending} // Disable the button when pending
			disabled={pending} // Also disable for accessibility
		>
			{pending ? (
				// Show spinner while form is pending
				<div className="flex items-center">
					<svg
						className="animate-spin h-5 w-5 mr-3 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8v8H4z"
						></path>
					</svg>
					<span>Loading...</span>
				</div>
			) : (
				// Default login text when not pending
				<span className="flex items-center font-semibold">
					Log In
					<ArrowRightIcon className="ml-2 h-5 w-5 text-gray-50" />
				</span>
			)}
		</Button>
	);
}
