import { FaFileAlt, FaTimes } from 'react-icons/fa';

interface FileListProps {
    selectedFiles: File[];
    removeFile: (index: number) => void;
}

const FileList: React.FC<FileListProps> = ({ selectedFiles, removeFile }) => {
    return (
        <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Selected Files:</h3>
            <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center bg-gray-100 border rounded-lg px-3 py-2 space-x-2">
                        <FaFileAlt className="text-gray-600" />
                        <span className="text-sm">{file.name}</span>
                        <button onClick={() => removeFile(index)} className="text-gray-500 hover:text-red-600">
                            <FaTimes />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileList;
