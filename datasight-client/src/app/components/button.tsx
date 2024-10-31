// button.tsx
"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from 'react'


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
				"flex h-10 items-center rounded-lg bg-black px-4 text-sm transition-transform transform hover:scale-105 ",
				className,
			)}
		>
			{children}
		</button>
	);
}

export { EnterpriseArchitectureBtn, SettingsBtn, SignOutBtn, OptimizeObsolenceBtn, OptimizeRiskBtn, OptimizeFinanceBtn, OptimizeCapacityBtn, GenerateMapBtn };
