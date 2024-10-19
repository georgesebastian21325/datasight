import React from 'react';

interface GenerateMappingBtnProps {
    onGenerateMapping: () => void;  
}

const GenerateMappingBtn: React.FC<GenerateMappingBtnProps> = ({ onGenerateMapping }) => {
    return (
        <button
            className=" px-6 py-2 bg-green-900 hover:bg-green-600 font-medium text-white rounded-md transition-transform transform hover:scale-105"
            onClick={onGenerateMapping} 
        >
            Generate Mapping
        </button>
    );
};

export default GenerateMappingBtn;
