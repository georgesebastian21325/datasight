import { useState, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'; // Adjust the import according to your setup

export default function SignUpErrorPopUp({ errorMessage }) {
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


export {
    SignUpErrorPopUp
}