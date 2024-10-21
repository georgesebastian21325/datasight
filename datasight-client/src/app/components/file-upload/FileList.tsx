import React from 'react';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

interface FileListProps {
    selectedFiles: { file: File; status: 'uploaded' | 'uploading' | 'error' }[];
    removeFile: (index: number) => void;
}

const FileList: React.FC<FileListProps> = ({ selectedFiles, removeFile }) => {
    return (
        <ul className="mt-4 space-y-2">
            {selectedFiles.map((fileStatus, index) => (
                <li
                    key={index}
                    className="flex justify-between items-center border border-gray-200 p-2 rounded"
                >
                    <span className="truncate">{fileStatus.file.name}</span>
                    <span className="ml-4">
                        {fileStatus.status === 'uploaded' && (
                            <FaCheckCircle className="text-green-500" size={20} />
                        )}
                        {fileStatus.status === 'uploading' && (
                            <FaSpinner className="text-blue-500 animate-spin" size={20} />
                        )}
                        {fileStatus.status === 'error' && (
                            <FaTimesCircle className="text-red-500" size={20} />
                        )}
                    </span>
                    <button
                        onClick={() => removeFile(index)}
                        className="ml-4 text-red-500 hover:text-red-700"
                    >
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default FileList;
