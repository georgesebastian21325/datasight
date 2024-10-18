import { handleSignOut } from '@/lib/cognitoActions';
import Link from 'next/link';
import { VscSignOut } from "react-icons/vsc";
import { useState } from 'react';

interface SignOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignOut: () => void;
}

const SignOutModal: React.FC<SignOutModalProps> = ({ isOpen, onClose, onSignOut }) => {
    const [loading, setLoading] = useState(false); // Loading state

    if (!isOpen) return null;

    const handleSignOutClick = async () => {
        setLoading(true); // Set loading to true
        try {
            await handleSignOut(); // Handle sign-out
            onSignOut(); // Call the sign-out function from props
        } finally {
            setLoading(false); // Reset loading state
        }
    };

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
                            onClick={handleSignOutClick}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                            ) : (
                                'Sign Out'
                            )}
                        </button>  
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignOutModal;
