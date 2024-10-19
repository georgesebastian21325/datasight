import React from 'react';

interface OpenModalButtonProps {
    openModal: () => void;
}

const OpenFileUploadModalBtn: React.FC<OpenModalButtonProps> = ({ openModal }) => {
    return (
        <button
            onClick={openModal}
            className="bg-black text-white px-4 rounded-md hover:bg-gray-800 transition-transform transform hover:scale-105"
        >
            Open File Upload Modal
        </button>
    );
};

export default OpenFileUploadModalBtn;
