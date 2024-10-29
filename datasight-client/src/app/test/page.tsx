'use client'

import { useState } from 'react';

export default function Page() {
    const [bucketStatus, setBucketStatus] = useState<string | null>(null);

    const createAndCheckBucket = async () => {
        try {
            // Step 1: Create the bucket
            const createResponse = await fetch('/api/createBucket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const createData = await createResponse.json();

            if (!createResponse.ok) {
                console.error('Error creating bucket:', createData.error);
                setBucketStatus(createData.error);
                return;
            }

            const { bucketName } = createData;
            console.log(`Bucket "${bucketName}" created successfully`);

            // Step 2: Add a delay before checking if the bucket is empty
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Step 3: Check if the created bucket is empty
            const checkResponse = await fetch(`/api/checkBucket?bucketName=${bucketName}`);
            const checkData = await checkResponse.json();

            if (!checkResponse.ok) {
                console.error('Error checking bucket:', checkData.error);
                setBucketStatus(checkData.error);
                return;
            }

            setBucketStatus(checkData.isEmpty ? 'The bucket is empty.' : 'The bucket is not empty.');
        } catch (error) {
            console.error('Error:', error);
            setBucketStatus('An error occurred');
        }
    };

    return (
        <div>
            <button onClick={createAndCheckBucket}>Create and Check Bucket</button>
            {bucketStatus && <p>{bucketStatus}</p>}
        </div>
    );
}
