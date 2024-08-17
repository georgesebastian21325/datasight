"use client";

import {
	AtSymbolIcon,
	KeyIcon,
	ExclamationCircleIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "../components/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleSignUp } from "@/lib/cognitoActions";
import Link from "next/link";
import SendVerificationCode from "./send-verification-code-form";

import CompanyLogo from "../../assets/company-logo.jpg";
import Image from "next/image";

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
			<div className="flex-1 rounded-lg  px-6 pb-4 pt-8">
				<div className='flex flex-col items-center mb-2'>
					<Image src={CompanyLogo} alt="Company Logo" height={50} />
				</div>
				<h1 className={`gradient-text font-semibold mb-3 text-2xl text-center`}>
					Create Your Account
				</h1>
				<div className="w-full">
					<div>
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
							htmlFor="name"
						>
							Name
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
								id="name"
								type="text"
								name="name"
								minLength={4}
								placeholder="Enter your name"
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
				<SignUpButton />
				<div className="flex justify-center">
					<Link
						href="/auth/login"
						className="mt-2 cursor-pointer text-blue-500"
					>
						Already have an account? Log in.
					</Link>
				</div>
				<div className="flex h-8 items-end space-x-1">
					<div
						className="flex h-8 items-end space-x-1"
						aria-live="polite"
						aria-atomic="true"
					>
						{errorMessage && (
							<>
								<ExclamationCircleIcon className="h-5 w-5 text-red-500" />
								<p className="text-sm text-red-500">
									{errorMessage}
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</form>
	);
}

function SignUpButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			className="mt-4 w-full flex justify-center items-center"
			aria-disabled={pending}
		>
			<span className="flex items-center">
				Create account
				<ArrowRightIcon className="ml-2 h-5 w-5 text-gray-50" />
			</span>
		</Button>

	);
}
