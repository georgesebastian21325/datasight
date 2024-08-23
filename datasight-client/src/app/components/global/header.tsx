import CompanyLogo from '../../../assets/company-logo.jpg'

import Image from 'next/image';

export default function Header() {
    return (
        <div>
            <div className='flex items-center justify-center'>
                <Image src={CompanyLogo} alt='company logo' />
            </div>
        </div>
    )
}