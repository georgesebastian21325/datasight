'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CompanyLogo from "../../assets/company-logo.jpg";
import BackgroundImage from "../../assets/landing-page-bg.jpg";

export default function Page() {
  return (
    <main
      className="font-sans bg-cover bg-center bg-no-repeat h-screen"
      style={{ backgroundImage: `url(${BackgroundImage.src})` }}
    >
      <div className="text-center flex flex-col items-center justify-center h-full">
        <section className="w-full mt-[8rem]">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6">
            <div
              className="mt-[-17rem] flex flex-col items-center"
            >
              <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} // Adjust delay as needed
              >
                <Image src={CompanyLogo} alt="Company Logo" />
              </motion.div>
              <motion.h1
                className="font-bold text-6xl tracking-tighter gradient-text"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }} // Adjust delay as needed
              >
                Translating Data into Valuable Insights.
              </motion.h1>
              <motion.p
                className="max-w-[700px] text-xl mt-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.6 }} // Adjust delay as needed
              >
                Designed to transform complex data into actionable insights, our
                tool provides a seamless, intuitive interface for visualizing
                and aiding your decisions.
              </motion.p>
              <motion.div
                className="flex text-white gap-5 mt-5 font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 1 }} // Adjust delay as needed
              >
                <Link
                  href="/sign-up"
                  className="bg-brand-blue px-5 rounded-md py-[0.5rem] flex hover:bg-blue-800"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="bg-black px-7 rounded-md py-[0.5rem] hover:bg-gray-700"
                >
                  Login
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
