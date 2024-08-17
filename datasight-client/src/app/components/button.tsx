// button.tsx

import Link from "next/link";

function SignUpBtn() {
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
			className={`rounded-md mt-2 hover:bg-gray-700 transform transition-transform duration-300 hover:scale-105 ${
				isSignUpPage
					? "text-black bg-white font-bold hover:bg-black px-5 py-2 hover:text-white"
					: "px-5 bg-black text-white  py-2 flex mt-[-0.1rem]"
			} ${isLoginPage ? "hidden" : ""}`}
		>
			Login
		</Link>
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
				"flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
				className,
			)}
		>
			{children}
		</button>
	);
}

export { SignUpBtn, LoginBtn };
