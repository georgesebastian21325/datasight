import { useState, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { FaCheckCircle } from 'react-icons/fa';

function AuthenticationErrorPopUp({ errorMessage }) {

    const [visible, setVisible] = useState(!!errorMessage);

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
        <div className="flex items-center justify-center p-2 mt-2 rounded-md bg-[#FFD1D1] space-x-2" aria-live="polite" aria-atomic="true">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
    );
}


function SuccessMessage() {
    return (
        <div className="mt-6 flex justify-center items-center">
            <FaCheckCircle className="text-green-600 mr-2" size={24} />
            <h4 className="text-green-600 text-lg font-medium">Files successfully uploaded!</h4>
        </div>
    );
};





export {
    AuthenticationErrorPopUp,
    SuccessMessage
}