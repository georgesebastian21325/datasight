"use client";
import { useState } from "react";

const UploadForm = () => {
	const [files, setFiles] = useState([]);
	const [uploading, setUploading] = useState(false);

	const handleFileChange = (e: any) => {
		setFiles(e.target.files);
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!files || files.length == 0) return;

		setUploading(true);
		const formData = new FormData();
		Array.from(files).forEach((file) => {
			formData.append("files", file); // Changed to append each file correctly
		});

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();
			console.log(data.status);
			setUploading(false);
		} catch (error) {
			console.log(error);
			setUploading(false);
		}
	};

	return (
		<>
			<h1>Upload Files to S3 Bucket</h1>

			<form onSubmit={handleSubmit}>
				<input
					type="file"
					multiple
					accept="csv"
					onChange={handleFileChange}
				/>
				<button
					type="submit"
					disabled={!files || uploading}
				>
					{uploading ? "Uploading..." : "Upload"}
				</button>
			</form>
		</>
	);
};

export default UploadForm;
