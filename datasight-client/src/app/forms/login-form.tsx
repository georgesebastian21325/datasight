"use client";

import {
	AtSymbolIcon,
	KeyIcon,
	ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

import { useFormState, useFormStatus } from "react-dom";

import { Button } from "../components/button";
import { handleSignIn } from "@/lib/cognitoActions";


export default function LoginForm() {
	const [errorMessage, dispatch] = useFormState(
		handleSignIn,
		undefined,
	);
	return (
		<form
			action={dispatch}
			className="space-y-3"
		>
			<div className="flex-1 rounded-lg  px-6 pb-4 pt-8">
				<div className='text-center'>
				<h1 className={`gradient-text mb-3 text-2xl`}>
					Welcome back. 
				</h1>
				<p> Please log in to continue. </p>
				</div>
				<div className="w-full">
					<div>
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
				<LoginButton />
				<div className="flex justify-center">
					<Link
						href="./sign-up"
						className="mt-2 cursor-pointer text-blue-500"
					>
						{"Don't have an account? "} Sign up.
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

function LoginButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			className="mt-4 w-full"
			aria-disabled={pending}
		>
			Log in{" "}
			<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
		</Button>
	);
}
