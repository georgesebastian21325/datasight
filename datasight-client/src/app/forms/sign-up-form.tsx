"use client";

import {
	AtSymbolIcon,
	KeyIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import CompanyLogo from "../../assets/company-logo.jpg";
import Image from "next/image";
import Link from "next/link";

import { useFormState, useFormStatus } from "react-dom";
import { handleSignUp } from "@/lib/cognitoActions";
import SendVerificationCode from "./send-verification-code-form";

import { SignUpBtn } from "../components/button";
import { SignUpErrorPopUp } from "../components/popup"

export default function SignUpForm() {
	const [errorMessage, dispatch] = useFormState(
		handleSignUp,
		undefined,
	);
	return (
		<form
			action={dispatch}
			className="space-y-3"
		>
			<div className="flex-1 rounded-lg  px-4 pb-4 pt-8">
				<div className="flex flex-col items-center mb-2">
					<Image
						src={CompanyLogo}
						alt="Company Logo"
						height={50}
					/>
				</div>
				<h1 className={`gradient-text font-bold mb-1 text-2xl text-center`}>
					Get Started with Your Account
				</h1>
				<p className='text-center text-gray-500'>
					Create your account in just a few steps.
				</p>
				{errorMessage && (
					<SignUpErrorPopUp errorMessage={errorMessage} />
				)}

				<div className="w-full">
					<div>
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
							htmlFor="given_name"
						>
							First Name
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
								id="given_name"
								type="text"
								name="given_name"
								minLength={4}
								placeholder="Enter your first name"
								required
							/>
							<UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
					<div>
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
							htmlFor="family_name"
						>
							Last Name
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
								id="family_name"
								type="text"
								name="family_name"
								minLength={4}
								placeholder="Enter your last name"
								required
							/>
							<UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
					<div className="mt-4">
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
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
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
								id="password"
								type="password"
								name="password"
								placeholder="Enter password"
								required
								minLength={6}
							/>
							<KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
				</div>
				<div>
					<div className="flex flex-col justify-center mt-5">
						<SignUpBtn />
						<Link
							href="./login"
							className="mt-2 cursor-pointer text-blue-500 text-center"
						>
							Already have an account? Log in.
						</Link>
					</div>
				</div>
			</div>
		</form>
	);
}