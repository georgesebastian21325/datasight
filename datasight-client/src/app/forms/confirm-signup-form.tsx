"use client";

import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
    ArrowRightIcon
} from "@heroicons/react/24/outline";
import { Button } from "../components/button";
import { useFormState, useFormStatus } from "react-dom";
import { useState,useEffect } from "react";
import { handleConfirmSignUp } from "@/lib/cognitoActions";
import { handleSendEmailVerificationCode } from "@/lib/cognitoActions";

import BackgroundImage from '../../assets/background-image.jpg'
import CompanyLogo from '../../assets/company-logo.jpg'
import Image from "next/image";

export default function ConfirmSignUpForm() {
    const [errorMessage, dispatch] = useFormState(handleConfirmSignUp, undefined);
    
    const [error, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (errorMessage || successMessage) {
            timer = setTimeout(() => {
                setErrorMessage(null);
                setSuccessMessage(null);
            }, 5000); // Adjust time (5000ms = 5 seconds) as needed
        }

        return () => clearTimeout(timer); // Clean up timer on component unmount
    }, [errorMessage, successMessage]);

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${BackgroundImage.src})` }}
        >
            <form action={dispatch} className="space-y-3">
                <div className='flex flex-col items-center justify-center space-y-3'>
                    <div className="flex flex-col rounded-lg w-[30%] px-6 pt-5 py-5 items-center border-2 mt-[5rem]">
                        <Image src={CompanyLogo} alt='company_logo' width={170} height={50} />
                        <h1 className="b-3 text-2xl gradient-text font-bold">
                            CONFIRM ACCOUNT.
                        </h1>
                        <p className='text-sm text-gray-500'> Check your email for the verification code. </p>
                        <div className="w-full">
                            <div>
                                <div
                                    className="flex items-center justify-center h-8 space-x-1 mt-5"
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {errorMessage && (
                                        <div className='flex gap-x-2 bg-red-100 w-full justify-center py-2 rounded-md'>
                                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                            <p className="text-sm text-red-500">{errorMessage}</p>
                                        </div>
                                    )}
                                    {successMessage && (
                                        <div className='flex gap-x-2 bg-green-100 w-full justify-center py-2 rounded-md'>
                                            <p className="text-sm text-green-500">{successMessage}</p>
                                        </div>
                                    )}
                                </div>
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
                                    htmlFor="code"
                                >
                                    Code
                                </label>
                                <div className="relative">
                                    <input
                                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        id="code"
                                        type="text"
                                        name="code"
                                        placeholder="Enter code"
                                        required
                                        minLength={6}
                                    />
                                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        </div>
                        <ConfirmButton />
                        <SendVerificationCode setSuccessMessage={setSuccessMessage} />
                    </div>
                </div>
            </form>
        </div>
    );
}


function ConfirmButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="mt-4 w-full text-white flex items-center justify-center gap-x-2 font-semibold" aria-disabled={pending}>
            <span className='flex justify-center'>
                Confirm <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </span>
        </Button>
    );
}

function SendVerificationCode({ setSuccessMessage }) {
    const [response, dispatch] = useFormState(handleSendEmailVerificationCode, {
        message: "",
        errorMessage: "",
    });
    const { pending } = useFormStatus();

    useEffect(() => {
        if (response.message) {
            setSuccessMessage(response.message);
        } else {
            setSuccessMessage("");
        }
    }, [response.message, setSuccessMessage]);

    return (
        <Button
            className="mt-4 w-full text-white flex items-center justify-center bg-brand-blue hover:bg-blue-500"
            aria-disabled={pending}
            formAction={dispatch}
        >
            <span className='flex gap-x-2 font-semibold'>
                Resend Verification Code{" "}
                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </span>
        </Button>
    );
}