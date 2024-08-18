import CompanyLogo from '../../assets/company-logo.jpg';

import Image from 'next/image';

import { Button, UploadDataSetBtn, EnterpriseArchitectureBtn, SettingsBtn } from '../components/button';

export default function HomePage() {
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='mt-12'>
                <div className='flex items-center justify-center'>
                    <Image src={CompanyLogo} alt='company logo' />
                </div>
                <div className='bg-brand-blue py-[1rem] px-[12rem] rounded-md mt-12'>
                    <div className='flex flex-col items-center justify-center text-center text-white '>
                        <h1 className='font-semibold text-xl mb-5'> Welcome John Doe, how can we help you today? </h1>
                        <p> Manage your enterprise architecture with ease. </p>
                    </div>
                    <div className='flex gap-x-12 mt-10 text-black'>
                        <UploadDataSetBtn />
                        <EnterpriseArchitectureBtn />
                        <SettingsBtn />
                    </div>
                </div>
            </div>

        </div>
    )
}