// ActionButtons.tsx
import React from "react";

interface ActionButtonsProps {
 loading: boolean;
 error: string | null;
 optimizationType: string;
 fetchText: () => void;
 toggleModal: () => void;
 showVideo: boolean;
 setShowVideo: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
 loading,
 error,
 optimizationType,
 fetchText,
 toggleModal,
 showVideo,
 setShowVideo,
}) => {
 return (
  <div className="flex gap-x-4">
   {loading && (
    <p className="text-center items-center px-5 bg-blue-100 rounded-md flex flex-row gap-2 font-semibold">
     <span className="loading"></span> Loading AI Presenter
    </p>
   )}

   <button
    onClick={toggleModal}
    className="py-3 px-4 rounded-md bg-black text-white font-medium transition-all duration-300 hover:bg-brand-orange hover:scale-105"
   >
    View Results
   </button>

   {!showVideo && (
    <button
     className={`py-3 px-4 rounded-md bg-black text-white font-medium transition-all duration-300 hover:bg-brand-orange hover:scale-105${optimizationType ? "" : "cursor-not-allowed opacity-50"
      }`}
     onClick={fetchText}
    >
     Present with AI
    </button>
   )}

   {error && (
    <p className="mt-4 px-5 py-2 bg-red-300 rounded-md w-fit flex flex-row gap-2">
     <span className="text-red-600">Error:</span> {error}
    </p>
   )}

   {showVideo && (
    <button
     className={`py-3 px-4 rounded-md bg-red-500 text-white font-bold transition-all duration-300 hover:bg-red-900 hover:scale-105${optimizationType ? "" : "cursor-not-allowed opacity-50"
      }`}
     onClick={() => setShowVideo(!showVideo)}
    >
     Hide Video
    </button>
   )}
  </div>
 );
};

export default ActionButtons;
