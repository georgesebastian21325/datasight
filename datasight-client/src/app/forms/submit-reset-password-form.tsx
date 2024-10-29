"use client";

import {
    AtSymbolIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import CompanyLogo from '../../assets/company-logo.jpg'
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleResetPassword } from "@/lib/cognitoActions";

import BackgroundImage from '../../assets/background-image.jpg'

export default function SubmitResetPasswordFrom() {
    const [errorMessage, dispatch] = useFormState(handleResetPassword, undefined);
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed "
            style={{ backgroundImage: `url(${BackgroundImage.src})` }}
        >
            <form action={dispatch} className="flex flex-col items-center justify-center space-y-3">
                <div className="flex flex-col rounded-lg w-[30%] px-6 pb-4 pt-8 items-center border-2 mt-[12rem]">
                    <Image src={CompanyLogo} alt='company_logo' width={170} height={50} />
                    <h1 className='font-bold gradient-text text-xl '> RESET PASSWORD </h1>
                    <h1 className={`mb-3 text-sm text-gray-500`}>
                        Please enter your email to get the confirmation code.
                    </h1>
                    <div className="w-[70%]">
                        <div>
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
                    </div>
                    <div className='flex space-x-5 w-[70%]'>
                        <BackBtn />
                        <SendConfirmationCodeButton />
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
            </form>
        </div>
    );
}

function SendConfirmationCodeButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="flex mt-9 w-[50%] bg-brand-blue text-center items-center hover:bg-blue-800 justify-center gap-x-2" aria-disabled={pending}>
            <p className='text-sm text-white font-semibold'> Send Code </p> <ArrowRightIcon className=" h-5 w-5 text-gray-50" />
        </Button>
    );
}

function BackBtn() {
    return (
        <Link href='/' className="flex mt-9 w-[50%] bg-black justify-center rounded-md items-center transition-transform transform hover:scale-105 hover:bg-gray-800">
            <button>
                <div className='flex gap-2 items-center '>
                    <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" /> <p className='text-white text-sm  font-semibold'> Go Back </p>
                </div>
            </button>
        </Link>
    );
}