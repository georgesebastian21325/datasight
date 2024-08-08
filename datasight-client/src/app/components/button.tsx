// button.tsx

import Link from "next/link";

function SignUpBtn() {
  return (
    <Link
      href="/sign-up"
      className="bg-brand-blue px-5 rounded-md py-[0.5rem] mt-[-0.1rem] hover:bg-blue-800 h-50 transform transition-transform duration-300 hover:scale-105"
    >
      Sign Up
    </Link>
  );
}

function LoginBtn({ isSignUpPage = false, isLoginPage = false }) {
  return (
    <Link
      href="/login"
      className={`rounded-md mt-2 hover:bg-gray-700 transform transition-transform duration-300 hover:scale-105 ${
        isSignUpPage
          ? "text-black bg-white font-semibold hover:bg-black px-5 py-2 hover:text-white"
          : "px-5 bg-black text-white py-2 flex mt-[-0.1rem]"
      } ${isLoginPage ? "hidden" : ""}`} 
    >
      Login
    </Link>
  );
}

export { SignUpBtn, LoginBtn };
