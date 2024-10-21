import { useState } from 'react';
import { FaUpload, FaCheckCircle, FaTrash, FaSpinner, FaTimesCircle } from 'react-icons/fa';

interface FileUploadModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
}

interface FileStatus {
    file: File;
    status: 'uploaded' | 'uploading' | 'error';
    progress: number;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isModalOpen, closeModal }) => {
    const [selectedFiles, setSelectedFiles] = useState<FileStatus[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const fileStatusArray = files.map((file) => ({
            file,
            status: 'uploading' as const,
            progress: 0,
        }));
        setSelectedFiles(fileStatusArray);
    };

    const removeFile = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
    };

    const simulateUpload = (fileStatus: FileStatus, index: number) => {
        const isError = Math.random() > 0.8; // Simulate 20% chance of error

        const interval = setInterval(() => {
            setSelectedFiles((prevFiles) =>
                prevFiles.map((f, i) =>
                    i === index && f.progress < 100
                        ? { ...f, progress: f.progress + 10 }
                        : f
                )
            );

            if (fileStatus.progress >= 100) {
                clearInterval(interval);
                setSelectedFiles((prevFiles) =>
                    prevFiles.map((f, i) =>
                        i === index
                            ? {
                                ...f,
                                status: isError ? 'error' : 'uploaded',
                                progress: 100,
                            }
                            : f
                    )
                );
            }
        }, 200); // Simulate upload speed
    };

    const handleUpload = () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);

        // Start upload simulation for each file
        selectedFiles.forEach((fileStatus, index) => {
            simulateUpload(fileStatus, index);
        });

        setTimeout(() => {
            setIsUploading(false);
        }, selectedFiles.length * 2000); // Simulate longer wait for more files
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

                {selectedFiles.length > 0 && (
                    <>
                        <div className="mb-2 text-gray-700">
                            {selectedFiles.length} file{selectedFiles.length > 1 && 's'}
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left pb-2 font-semibold text-gray-600">Name</th>
                                    <th className="text-left pb-2 font-semibold text-gray-600">Status</th>
                                    <th className="text-left pb-2 font-semibold text-gray-600">Progress</th>
                                    <th className="text-left pb-2 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedFiles.map((fileStatus, index) => (
                                    <tr key={index} className="border-b last:border-b-0">
                                        <td className="py-2 text-gray-800">{fileStatus.file.name}</td>
                                        <td className="py-2">
                                            {fileStatus.status === 'uploading' && (
                                                <FaSpinner className="animate-spin" size={20} />
                                            )}
                                            {fileStatus.status === 'uploaded' && (
                                                <FaCheckCircle className="text-green-500" size={20} />
                                            )}
                                            {fileStatus.status === 'error' && (
                                                <FaTimesCircle className="text-red-500" size={20} />
                                            )}
                                        </td>
                                        <td className="py-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`${fileStatus.status === 'error'
                                                            ? 'bg-red-500'
                                                            : 'bg-blue-500'
                                                        } h-2.5 rounded-full`}
                                                    style={{ width: `${fileStatus.progress}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="py-2 text-right">
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="text-gray-500 hover:text-red-500"
                                            >
                                                <FaTrash size={20} />
                                                <span className="sr-only">Remove</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {selectedFiles.length > 0 && (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={handleUpload}
                            className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 flex items-center space-x-2"
                            disabled={isUploading}
                        >
                            <FaUpload />
                            <span>Upload Files</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploadModal;
