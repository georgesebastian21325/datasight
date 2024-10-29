// button.tsx
"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from 'react'

function LandingPageSignUpBtn() {
	return (
		<Link
			href="auth/sign-up"
			className="bg-brand-blue px-5 rounded-md py-[0.5rem] mt-[-0.1rem] hover:bg-blue-800 h-50 transform transition-transform duration-300 hover:scale-105"
		>
			Sign Up
		</Link>
	);
}

function LoginBtn({
	isSignUpPage = false,
	isLoginPage = false,
}) {
	return (
		<Link
			href="auth/login"
			className={`rounded-md mt-2 hover:bg-gray-700 transform transition-transform duration-300 hover:scale-105 ${isSignUpPage
				? "text-black bg-white font-bold hover:bg-black px-5 py-2 hover:text-white"
				: "px-5 bg-black text-white  py-2 flex mt-[-0.1rem]"
				} ${isLoginPage ? "hidden" : ""}`}
		>
			Login To Your Account
		</Link>
	);
}

function SignUpBtn() {
	const { pending } = useFormStatus();

	return (
		<Button
			className="mt-4 w-full flex justify-center items-center bg-brand-blue"
			aria-disabled={pending}
		>
			<span className="flex items-center">
				Create Acount
				<ArrowRightIcon className="ml-2 h-5 w-5 text-gray-50" />
			</span>
		</Button>
	);
}


function UploadDataSetBtn() {
	return (
		<Link
			href='./upload-dataset'
			className='bg-white text-black text-sm px-12 font-semibold py-3 rounded-md hover:bg-black hover:text-white transform transition-transform duration-300 hover:scale-105'
		>
			UPLOAD DATASET
		</Link>
	)
}

function EnterpriseArchitectureBtn() {
	return (
		<Link
			href='./enterprise-architecture'
			className='bg-white text-black text-sm px-7 font-semibold py-3 rounded-md hover:bg-black hover:text-white transform transition-transform duration-300 hover:scale-105'
		>
			ENTERPRISE ARCHITECTURE
		</Link>
	)
}

function SettingsBtn() {
	return (
		<Link
			href='./settings'
			className='bg-white text-black text-sm px-[4rem] font-semibold py-3 rounded-md hover:bg-black hover:text-white transform transition-transform duration-300 hover:scale-105'
		>
			SETTINGS
		</Link>
	)
}

function SignOutBtn() {
	return (
		<Link
			href='./sign-out'
			className=' bg-white text-black text-sm px-12 font-semibold py-3 rounded-md hover:bg-brand-red hover:text-white transform transition-transform duration-300 hover:scale-105'>
			SIGN OUT
		</Link>
	)
}

function OptimizeObsolenceBtn() {
	const [isActive, setIsActive] = useState(false);

	const handleClick = () => {
		setIsActive(!isActive);
	};

	return (
		<button
			className={`text-white text-sm px-12 font-semibold py-3 rounded-md transform transition-transform duration-300 hover:scale-105 ${isActive ? 'bg-black hover:bg-black' : 'bg-brand-blue hover:bg-black'
				}`}
			onClick={handleClick}
		>
			Optimize For Obsolescence
		</button>
	);
}

function OptimizeRiskBtn() {
	const [isActive, setIsActive] = useState(false);

	const handleClick = () => {
		setIsActive(!isActive);
	};

	return (
		<button
			className={`text-white text-sm px-12 font-semibold py-3 rounded-md transform transition-transform duration-300 hover:scale-105 ${isActive ? 'bg-black hover:bg-black' : 'bg-brand-blue hover:bg-black'
				}`}
			onClick={handleClick}
		>
			Optimize For Risk
		</button>
	);
}

function OptimizeCapacityBtn() {
	const [isActive, setIsActive] = useState(false);

	const handleClick = () => {
		setIsActive(!isActive);
	};

	return (
		<button
			className={`text-white text-sm px-12 font-semibold py-3 rounded-md transform transition-transform duration-300 hover:scale-105 ${isActive ? 'bg-black hover:bg-black' : 'bg-brand-blue hover:bg-black'
				}`}
			onClick={handleClick}
		>
			Optimize For Capacity
		</button>
	);
}

function OptimizeFinanceBtn() {
	const [isActive, setIsActive] = useState(false);

	const handleClick = () => {
		setIsActive(!isActive);
	};

	return (
		<button
			className={`text-white text-sm px-12 font-semibold py-3 rounded-md transform transition-transform duration-300 hover:scale-105 ${isActive ? 'bg-black hover:bg-black' : 'bg-brand-blue hover:bg-black'
				}`}
			onClick={handleClick}
		>
			Optimize For Finance
		</button>
	);
}

function GenerateMapBtn() {
	const [isActive, setIsActive] = useState(false);

	const handleClick = () => {
		setIsActive(!isActive);
	};

	return (
		<button
			className={`text-white text-sm px-12 font-semibold py-3 rounded-md transform transition-transform duration-300 hover:scale-105 ${isActive ? 'bg-black hover:bg-black' : 'bg-green-900 hover:bg-black'
				}`}
			onClick={handleClick}
		>
			Generate Mapping
		</button>
	);
}



import clsx from "clsx";

interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export function Button({
	children,
	className,
	...rest
}: ButtonProps) {
	return (
		<button
			{...rest}
			className={clsx(
				"flex h-10 items-center rounded-lg bg-black px-4 text-sm transition-transform transform hover:scale-105 font-medium text-white hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ",
				className,
			)}
		>
			{children}
		</button>
	);
}

export { LandingPageSignUpBtn, SignUpBtn, LoginBtn, UploadDataSetBtn, EnterpriseArchitectureBtn, SettingsBtn, SignOutBtn, OptimizeObsolenceBtn, OptimizeRiskBtn, OptimizeFinanceBtn, OptimizeCapacityBtn, GenerateMapBtn };
