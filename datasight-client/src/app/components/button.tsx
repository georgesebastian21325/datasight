import Link from "next/link";

function SignUpBtn() {
  return (
    <>
      <Link
        href="/sign-up"
        className="bg-brand-blue px-5 rounded-md py-[0.5rem] flex hover:bg-blue-800"
      >
        Sign Up
      </Link>
    </>
  );
}

function LoginBtn() {
  return (
    <>
      <Link
        href="/login"
        className="bg-black px-7 rounded-md py-[0.5rem] hover:bg-gray-700"
      >
        Login
      </Link>
    </>
  );
}

export { SignUpBtn, LoginBtn };
