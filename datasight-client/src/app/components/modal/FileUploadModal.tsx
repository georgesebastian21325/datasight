import { useState } from 'react';
import FileList from '../file-upload/FileList';
import ProgressBar from '../file-upload/ProgressBar';
import { SuccessMessage } from '../popup';
import { FaUpload } from 'react-icons/fa';

interface FileUploadModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isModalOpen, closeModal }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [filesReady, setFilesReady] = useState(false);
    const [isUploadComplete, setIsUploadComplete] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);

        // Reset states if selecting new files
        setFilesReady(true);
        setUploadProgress(0);
        setIsUploadComplete(false);
    };

    const removeFile = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
    };

    const handleUpload = () => {
        if (selectedFiles.length === 0) {
            return;
        }

        const totalFiles = selectedFiles.length;
        let uploadedFiles = 0;

        // Simulate the upload progress (this is just for demonstration)
        const interval = setInterval(() => {
            uploadedFiles += 1;
            const progress = (uploadedFiles / totalFiles) * 100;
            setUploadProgress(progress);

            if (uploadedFiles === totalFiles) {
                clearInterval(interval);
                setIsUploadComplete(true); // Set upload as complete
            }
        }, 500);
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>

                <h1 className="text-2xl font-bold mb-4 text-center">Upload Files</h1>

                <label className="block mb-4">
                    <span className="sr-only">Choose Files</span>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100 cursor-pointer"
                    />
                </label>

                {/* File List */}
                {selectedFiles.length > 0 && (
                    <FileList selectedFiles={selectedFiles} removeFile={removeFile} />
                )}

                {/* Upload Button */}
                {filesReady && !isUploadComplete && (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={handleUpload}
                            className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 flex items-center space-x-2"
                        >
                            <FaUpload />
                            <span>Upload Files</span>
                        </button>
                    </div>
                )}

                {/* Progress Bar */}
                {uploadProgress > 0 && (
                    <ProgressBar uploadProgress={uploadProgress} />
                )}

                {/* Success Message */}
                {isUploadComplete && (
                    <SuccessMessage />
                )}
            </div>
        </div>
    );
};

export default FileUploadModal;
