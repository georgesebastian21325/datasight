import React from "react";
import Image from "next/image";
import Link from "next/link";
import CompanyLogo from "../../assets/company-logo.jpg";
import BackgroundImage from "../../assets/landing-page-bg.jpg";

function Page() {
  return (
    <main
      className="font-sans bg-cover bg-center bg-no-repeat h-screen"
      style={{ backgroundImage: `url(${BackgroundImage.src})` }}
    >
      <div className="text-center flex flex-col items-center justify-center h-full">
        <div className="mt-[-10rem] flex flex-col items-center">
          <Image src={CompanyLogo} alt="Company Logo" />
          <h1 className="font-bold text-6xl tracking-tighter gradient-text">
            Translating Data into Valuable Insights.
          </h1>
          <p className="max-w-[700px] text-primary-foreground/80 md:text-xl mt-5 ">
            Designed to transform complex data into actionable insights, our
            tool provides a seamless, intuitive interface for visualizing and
            aiding your decisions.
          </p>
          <div className="flex text-white gap-5 mt-5 font-bold">
            <Link
              href="sign-up"
              className="bg-brand-blue px-5 rounded-md py-[0.5rem] flex  hover:bg-blue-800"
            >
              Sign Up
            </Link>
            <Link
              href="login"
              className="bg-black px-7 rounded-md py-[0.5rem] hover:bg-gray-700"
            >
              {" "}
              Login{" "}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
