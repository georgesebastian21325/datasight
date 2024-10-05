import { handleSignOut } from '@/lib/cognitoActions';

import Link from 'next/link';
import { VscSignOut } from "react-icons/vsc";



interface SignOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignOut: () => void;
}

const SignOutModal: React.FC<SignOutModalProps> = ({ isOpen, onClose, onSignOut }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg z-50 w-96 text-center flex flex-col items-center">
                <VscSignOut className='text-[4rem] text-red-500 text-center items-center mb-6' />
                <h2 className="text-xl font-semibold text-gray-900">Sign Out</h2>
                <p className="mt-2 text-gray-600">Are you sure you want to sign out?</p>

                <div className="mt-4 flex justify-center space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <Link href='/'>
                        <button
                            onClick={async () => {
                                await handleSignOut(); // Call the sign-out function
                                onSignOut(); // Close the modal after sign-out
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Sign Out
                        </button>                    
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignOutModal;
