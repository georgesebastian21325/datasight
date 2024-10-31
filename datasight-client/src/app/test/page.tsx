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

    const handleValidate = async () => {
        if (!file || !datasetName) {
            setError('Please select a file and dataset.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('datasetName', datasetName);

        try {
            const response = await fetch('/api/checkAttributes', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'An unknown error occurred.');
                setMessage('');
                return;
            }

            const result = await response.json();
            setMessage(result.message);
            setError('');
        } catch (err) {
            console.error('Error validating file:', err);
            setError('An error occurred during validation.');
            setMessage('');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h2>Validate CSV Attributes</h2>
            <div>
                <label>Dataset Name</label>
                <select value={datasetName} onChange={handleDatasetChange}>
                    <option value="">Select a dataset</option>
                    <option value="backup-and-recovery-systems.csv">Backup and Recovery Systems</option>
                    <option value="cloud-infrastructure.csv">Cloud Infrastructure</option>
                    {/* Add more options as needed */}
                </select>
            </div>
            <div>
                <label>Upload CSV File</label>
                <input type="file" accept=".csv" onChange={handleFileChange} />
            </div>
            <button onClick={handleValidate} style={{ marginTop: '20px' }}>
                Validate Attributes
            </button>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default UploadPage;
