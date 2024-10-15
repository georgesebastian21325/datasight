// components/button/GenerateMappingBtn.tsx

import React from 'react';

interface GenerateMappingBtnProps {
    onGenerateMapping: () => void;  // Function to trigger when the button is clicked
}

const GenerateMappingBtn: React.FC<GenerateMappingBtnProps> = ({ onGenerateMapping }) => {
    return (
        <button
            className="mb-4 px-6 py-2 bg-green-900 hover:bg-green-600 font-medium text-white rounded-md transition-transform transform hover:scale-105"
            onClick={onGenerateMapping}  // Call the passed-in function when clicked
        >
            Generate Mapping
        </button>
    );
};

export default GenerateMappingBtn;
