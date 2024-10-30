"use client";

import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "../components/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleSignUp } from "@/lib/cognitoActions";

import Link from "next/link";
import CompanyLogo from '../../assets/company-logo.jpg'
import Image from "next/image";
import SendVerificationCode from "./send-verification-form-code";

import BackgroundImage from '../../assets/background-image.jpg'

import { Card } from "@/vcomponents/onboarding-components/card";

export default function SignUpForm() {
    const [errorMessage, dispatch] = useFormState(handleSignUp, undefined);
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed "
            style={{ backgroundImage: `url(${BackgroundImage.src})` }}
        >
            <form action={dispatch} className="space-y-3">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className='flex flex-col rounded-lg w-[30%] px-6 pt-5 items-center border-2 mt-[5rem]'>
                        <Image src={CompanyLogo} alt='company_logo' width={170} height={50} />
                        <h1 className={`mb-3 text-2xl gradient-text font-bold`}>
                            Account Creation
                        </h1>
                        <p className='text-gray-700 text-center w-[90%] text-sm'> Please make sure to use your existing email upon creating your account. </p>
                        <div className="w-full">
                            <div>
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                    htmlFor="name"
                                >
                                    Name
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        id="name"
                                        type="text"
                                        name="name"
                                        minLength={4}
                                        placeholder="Enter your name"
                                        required
                                    />
                                    <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        required
                                    />
                                    <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label
                                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        required
                                        minLength={6}
                                    />
                                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        </div>
                        <SignUpButton />
                        <div className="flex items-center justify-center gap-x-1 mt-5">
                            Already have an account? 
                            <Link
                                href="/"
                                className="cursor-pointer text-blue-500"
                            >
                            Log in.
                            </Link>
                        </div>
                        <div className="flex h-8 items-end space-x-1">
                            <div
                                className="flex h-8 items-end space-x-1"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {errorMessage && (
                                    <>
                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                        <p className="text-sm text-red-500">{errorMessage}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

function SignUpButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="mt-4 w-full flex items-center justify-center space-x-2 transition-transform transform hover:scale-105 text-white font-semibold" aria-disabled={pending}>
            <span>Create Account</span>
            <ArrowRightIcon className="h-5 w-5 text-gray-50" />
        </Button>
    );
}
