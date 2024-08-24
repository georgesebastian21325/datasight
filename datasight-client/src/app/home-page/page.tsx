import Header from "../components/global/header";

import BackgroundImage from "../../assets/landing-page-bg.jpg";

import { UploadDataSetBtn, EnterpriseArchitectureBtn, SettingsBtn, SignOutBtn } from '../components/button';

export default function HomePage() {
    return (
        <main
            className=" bg-cover bg-center  h-screen flex items-center justify-center"
            style={{ backgroundImage: `url(${BackgroundImage.src})` }}
        >
            <div className='flex flex-col items-center justify-center'>
                <div className='mt-[-25rem]'>
                    <Header />
                    <div className='bg-brand-blue py-[1rem] px-[12rem] rounded-md mt-12'>
                        <div className='flex flex-col items-center justify-center text-center text-white '>
                            <h1 className='font-semibold text-xl mb-5'> Welcome John Doe, how can we help you today? </h1>
                            <p> Manage your enterprise architecture with ease. </p>
                        </div>
                        <div className='flex gap-x-12 mt-10 text-black'>
                            <EnterpriseArchitectureBtn />
                            <SettingsBtn />
                            <SignOutBtn />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}