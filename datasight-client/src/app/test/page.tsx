"use client"

import { useState } from 'react';
import FileUploadModal from '../components/modal/FileUploadModal';
import OpenFileUploadModalBtn from '../components/button/OpenFileUploadModalBtn'; // Correct button import

const Home: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <OpenFileUploadModalBtn openModal={openModal} />
            <FileUploadModal isModalOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
};

export default Home;
