"use client";

import React, { useState } from "react";
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
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
