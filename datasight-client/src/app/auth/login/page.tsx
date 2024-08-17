"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
	MdEmail,
	MdKey,
	MdVisibility,
	MdVisibilityOff,
} from "react-icons/md";

import CompanyLogo from "../../assets/company-logo.jpg";
import LoginAsset from "../../assets/login-asset.png";
import LoginForm from "../../forms/login-form";

function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);

	const handleTogglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
			<div className="lg:flex items-center justify-center shadow-md bg-gradient-to-br from-black to-brand-blue rounded-br-2xl rounded-tr-2xl hidden"></div>
			<div className="flex items-center justify-center ">
				<div className="rounded-lg border-2 bg-card text-card-foreground shadow-lg w-full max-w-md p-6 ">
					<div className="flex flex-col items-center justify-center py-6 ">
						<LoginForm />
						{/* <Image
							src={CompanyLogo}
							alt="company_logo"
							className="w-[15rem]"
						/>
						<h1 className="gradient-text font-bold text-2xl">
							Login to Your Account
						</h1>
					</div>
					<div className="space-y-4">
						<div className="space-y-2">
							<label
								className="text-sm font-medium"
								htmlFor="email"
							>
								Email
							</label>
							<div className="flex items-center border rounded-md bg-background px-3 py-1">
								<MdEmail className="mr-2 text-muted-foreground" />
								<input
									className="flex h-10 w-full bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none"
									id="email"
									type="email"
									placeholder="johndoe@gmail.com"
									required
								/>
							</div>
						</div>
						<div className="space-y-2">
							<label
								className="text-sm font-medium"
								htmlFor="password"
							>
								Password
							</label>
							<div className="relative flex items-center border rounded-md bg-background px-3 py-1">
								<MdKey className="mr-2 text-muted-foreground" />
								<input
									className="flex h-10 w-full bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none"
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									required
								/>
								<button
									type="button"
									onClick={handleTogglePasswordVisibility}
									className="absolute right-3"
								>
									{showPassword ? (
										<MdVisibilityOff className="text-muted-foreground" />
									) : (
										<MdVisibility className="text-muted-foreground" />
									)}
								</button>
							</div>
							<div className="flex justify-end">
								<a
									href="#"
									className="text-sm font-medium underline underline-offset-4 transition-colors hover:text-primary"
								>
									Forgot password?
								</a>
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center space-y-4 mt-6">
						<button className="w-full bg-black text-white py-2 rounded-md">
							Login
						</button>
						<p className="text-sm">
							Don't have an account?{" "}
							<Link
								href="/sign-up"
								className="font-medium text-primary underline underline-offset-4 hover:text-primary-dark hover:text-gray-700 hover:scale-x-105"
							>
								Sign up now
							</Link>
						</p>*/}
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
