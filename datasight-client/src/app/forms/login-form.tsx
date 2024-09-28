"use client";

import {
	AtSymbolIcon,
	KeyIcon
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

import { useFormState, useFormStatus } from "react-dom";

import { Button } from "../components/button";
import { handleSignIn } from "@/lib/cognitoActions";

import Link from "next/link";
import Image from "next/image";

import CompanyLogo from '../../assets/company-logo.jpg'

import { AuthenticationErrorPopUp } from "../components/popup";


export default function LoginForm() {
	const [errorMessage, dispatch] = useFormState(
		handleSignIn,
		undefined,
	);
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
				<div className='flex flex-col mt-5'>
					<LoginButton />
				</div>
			</div>
		</form>
	);
}

function LoginButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			className="mt-4 w-full flex justify-center items-center bg-brand-blue"
			aria-disabled={pending}
		>
			<span className="flex items-center font-semibold">
				Log In
				<ArrowRightIcon className="ml-2 h-5 w-5 text-gray-50" />
			</span>
		</Button>
	);
}
