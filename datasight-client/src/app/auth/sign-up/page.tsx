import SignUpForm from "../../forms/sign-up-form";

export default function Page() {

	const isSignUpPage = true;

	return (
		<div className="font-sans grid grid-cols-2 h-screen">
			<div className="flex flex-col justify-center items-center bg-gradient-to-br from-black to-brand-blue rounded-tr-2xl rounded-br-2xl">
				<div className="flex flex-col items-center justify-center text-center">
					<h1 className="gradient-text font-bold text-4xl">
						See Data Differently with Datasight.
					</h1>
					<p className="text-white">
						Unlock powerful insights and make better
						decisions with our tool.
					</p>
				</div>
			</div>
			<div className="flex items-center justify-center">
				<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-5 border-2">
					<SignUpForm />
				</div>
			</div>
		</div>
	);
}
