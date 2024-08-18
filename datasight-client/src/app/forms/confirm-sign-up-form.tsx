"use client";

import {
	AtSymbolIcon,
	KeyIcon,
	ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

import Image from "next/image";

import { Button } from "../components/button";
import { useFormState, useFormStatus } from "react-dom";

import { handleConfirmSignUp } from "@/lib/cognitoActions";
import SendVerificationCode from "./send-verification-code-form";

import CompanyLogo from '../../assets/company-logo.jpg'


export default function ConfirmSignUpForm() {
	const [errorMessage, dispatch] = useFormState(
		handleConfirmSignUp,
		undefined,
	);
	return (
		<form
			action={dispatch}
			className="space-y-3"
		>
			<div className="flex flex-col items-center rounded-lg px-3 pb-4 pt-8">
				<Image
					src={CompanyLogo}
					alt="Company Logo"
					height={50}
				/>
				<h1 className={`gradient-text font-bold mb-3 text-2xl`}>
					Please Confirm Your Account
				</h1>
				<p className="text-gray-500 text-center text-sm">
					Enter the verification code sent to your email to complete the process.
				</p>
				<div className="w-full">
					<div className="mt-4">
						<label
							className="mb-3 mt-5 block text-xs font-medium text-gray-900"
							htmlFor="code"
						>
							Code
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
								id="code"
								type="text"
								name="code"
								placeholder="Enter code"
								required
								minLength={6}
							/>
							<KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
						</div>
					</div>
				</div>
				<ConfirmButton />
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

function ConfirmButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			className="mt-4 w-full bg-brand-blue flex items-center justify-center"
			aria-disabled={pending}
		>
			<span className='text-center flex space-x-3 font-semibold'>
				Confirm{" "}
				<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50 " />
			</span>
		</Button>
	);
}
