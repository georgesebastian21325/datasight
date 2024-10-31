// pages/upload.tsx
'use client'
import { useState } from 'react';

const UploadPage = () => {
	const [file, setFile] = useState<File | null>(null);
	const [datasetName, setDatasetName] = useState<string>('');
	const [message, setMessage] = useState<string>('');
	const [error, setError] = useState<string>('');

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleDatasetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setDatasetName(e.target.value);
	};

	const handleUpload = async () => {
		if (!file || !datasetName) {
			setError('Please select a file and dataset.');
			return;
		}

		const formData = new FormData();
		formData.append('file', file);
		formData.append('datasetName', datasetName);

		try {
			const response = await fetch('/api/validate-csv', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();

			if (response.ok) {
				setMessage(result.message);
				setError('');
			} else {
				setError(result.error);
				setMessage('');
			}
		} catch (err) {
			console.error('Error uploading file:', err);
			setError('An error occurred while uploading the file.');
			setMessage('');
		}
	};

	return (
		<div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
			<h2>Upload and Validate CSV</h2>
			<div>
				<label>Dataset Name</label>
				<select value={datasetName} onChange={handleDatasetChange}>
					<option value="">Select a dataset</option>
					<option value="backup-and-recovery-systems.csv">Backup and Recovery Systems</option>
					<option value="cloud-infrastructure.csv">Cloud Infrastructure</option>
					<option value="communication-infrastructure.csv">Communication Infrastructure</option>
					<option value="computer.csv">Computer</option>
					<option value="server.csv">Server</option>
					<option value="storage-devices.csv">Storage Devices</option>
					<option value="virtual-infrastructure.csv">Virtual Infrastructure</option>
					{/* Add more options as needed */}
				</select>
			</div>
			<div>
				<label>Upload CSV File</label>
				<input type="file" accept=".csv" onChange={handleFileChange} />
			</div>
			<button onClick={handleUpload} style={{ marginTop: '20px' }}>
				Validate and Upload
			</button>

			{message && <p style={{ color: 'green' }}>{message}</p>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
};

export default UploadPage;
