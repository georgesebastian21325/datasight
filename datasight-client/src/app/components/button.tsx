// button.tsx

import Link from "next/link";

function SignUpBtn() {
  return (
    <Link
      href="/sign-up"
      className="bg-brand-blue px-5 rounded-md py-[0.5rem] flex hover:bg-blue-800"
    >
      Sign Up
    </Link>
  );
}

function LoginBtn({ isSignUpPage = false }: { isSignUpPage?: boolean }) {
  return (
    <Link
      href="/login"
      className={`px-7 rounded-md py-[0.5rem] mt-2 hover:bg-gray-700 ${
        isSignUpPage ? "text-black bg-white font-semibold hover:bg-black hover:text-white" : "text-black bg-black"
      }`}
    >
      Login
    </Link>
  );
}

export { SignUpBtn, LoginBtn };
