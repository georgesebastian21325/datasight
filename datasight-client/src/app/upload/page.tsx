"use client";

import React, { useState } from "react";

const UploadPage = () => {
	const [selectedFiles, setSelectedFiles] =
		useState<FileList | null>(null);

	const handleFileChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSelectedFiles(event.target.files);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!selectedFiles) {
			alert("Please select files to upload.");
			return;
		}

		const formData = new FormData();

		Array.from(selectedFiles).forEach((file) => {
			formData.append("files", file);
		});

		// Send files to the back-end API route
		const response = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			alert("Files uploaded successfully");
		} else {
			alert("Failed to upload files");
		}
	};

	return (
		<div className="flex flex-col items-center">
			<h1 className="mt-[2rem] font-bold text-xl">
				Upload CSV Files
			</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="file"
					multiple
					accept=".csv"
					onChange={handleFileChange}
				/>
				<button
					type="submit"
					className="rounded-sm p-[10px] bg-blue-600"
				>
					Upload
				</button>
			</form>
		</div>
	);
};

export default UploadPage;
