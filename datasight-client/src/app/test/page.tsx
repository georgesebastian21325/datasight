"use client";

import React, { useState } from "react";
import { X, Check, Trash2, Upload } from "lucide-react";

interface FileInfo {
    name: string;
    size: string;
    status: "uploaded" | "uploading" | "error";
}

export default function Component() {
    const [isOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const removeFile = (fileName: string) => {
        setFiles(files.filter((file) => file.name !== fileName));
    };

    const closeUploadBox = () => {
        setIsOpen(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        setSelectedFiles(newFiles);

        const fileInfo = newFiles.map((file) => ({
            name: file.name,
            size: (file.size / 1024).toFixed(1) + "KB", // File size in KB
            status: "uploading" as const,
        }));

        setFiles(fileInfo);
    };

    const uploadFiles = async () => {
        if (!selectedFiles.length) {
            alert("Please select files to upload.");
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Files uploaded successfully.");
                setFiles((prevFiles) =>
                    prevFiles.map((file) => ({
                        ...file,
                        status: "uploaded",
                    }))
                );
            } else {
                alert("Failed to upload files.");
            }
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    return (
        <div className="p-4">
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-brand-blue text-white rounded "
            >
                Open Upload Box
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white shadow-lg rounded-md overflow-hidden">
                        <div className="bg-brand-blue py-3 px-4 flex justify-between items-center">
                            <h2 className="text-white text-lg font-semibold">Upload Box</h2>
                            <button
                                onClick={closeUploadBox}
                                className="text-white hover:text-gray-200"
                            >
                                <X size={24} />
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                        <div className="p-4">
                            <input
                                type="file"
                                accept=".csv"
                                multiple
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm "
                            />
                            <table className="w-full mt-4">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left pb-2 font-semibold text-gray-600">Name</th>
                                        <th className="text-left pb-2 font-semibold text-gray-600">Size</th>
                                        <th className="text-left pb-2 font-semibold text-gray-600">Status</th>
                                        <th className="pb-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file) => (
                                        <tr key={file.name} className="border-b last:border-b-0">
                                            <td className="py-2 text-gray-800">{file.name}</td>
                                            <td className="py-2 text-gray-600">{file.size}</td>
                                            <td className="py-2">
                                                {file.status === "uploaded" && (
                                                    <Check className="text-green-500" size={20} />
                                                )}
                                                {file.status === "uploading" && (
                                                    <Upload className="text-blue-500" size={20} />
                                                )}
                                            </td>
                                            <td className="py-2 text-right">
                                                <button
                                                    onClick={() => removeFile(file.name)}
                                                    className="text-gray-500 hover:text-red-500"
                                                >
                                                    <Trash2 size={20} />
                                                    <span className="sr-only">Remove {file.name}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={closeUploadBox}
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-[#8FBC8F] focus:outline-none focus:ring-2 focus:ring-[#9ACD32] focus:ring-opacity-50"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={uploadFiles}
                                    className="px-4 py-2 bg-green-900 text-white rounded-md "
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
