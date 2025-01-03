import { useState, useEffect } from 'react';
import { ExclamationCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import { FaCheckCircle } from 'react-icons/fa';

interface AuthenticationErrorPopUpProps {
    errorMessage: string; // Define the type of errorMessage
}

interface MappingViewPopUpProps {
    message: string;
    bgColor: string;
    loading: boolean; // Add a loading prop
}

const AuthenticationErrorPopUp: React.FC<AuthenticationErrorPopUpProps> = ({ errorMessage }) => {
    const [visible, setVisible] = useState<boolean>(!!errorMessage);

    useEffect(() => {
        if (errorMessage) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000); // 3 seconds

            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    if (!visible) return null;

    return (
        <div
            className="flex items-center justify-center p-2 mt-2 bg-[#FFD1D1] space-x-2"
            aria-live="polite"
            aria-atomic="true"
        >
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
    );
};

function SuccessMessage() {
    return (
        <div className="mt-6 flex justify-center items-center">
            <FaCheckCircle className="text-green-600 mr-2" size={24} />
            <h4 className="text-green-600 text-lg font-medium">Files successfully uploaded!</h4>
        </div>
    );
};


function MappingViewPopUp({ message, bgColor, loading }: MappingViewPopUpProps) {
    return (
        <div className={`${bgColor} font-medium px-2 flex items-center rounded-br-md rounded-bl-md mt-[-0.3rem] absolute`}>
            {loading ? (
                <div className="flex items-center">
                    <div className={`loading h-5 w-5 border-4 border-t-transparent border-${bgColor}  mr-2`} />
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    <EyeIcon className="h-5 w-5 text-black mr-2" />
                    <p>{message}</p>
                </>
            )}
        </div>
    );
}




export {
    AuthenticationErrorPopUp,
    SuccessMessage,
    MappingViewPopUp
}
