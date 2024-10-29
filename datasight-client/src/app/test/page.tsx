// pages/index.tsx
'use client'


import { useState } from 'react';

export default function Page() {
    const [isEmpty, setIsEmpty] = useState<boolean | null>(null);

    const checkBucket = async () => {
        try {
            const response = await fetch('/api/checkBucket');

            if (!response.ok) {
                console.error(`Error: ${response.statusText}`);
                setIsEmpty(null);
                return;
            }

            const data = await response.json();
            setIsEmpty(data.isEmpty);
        } catch (error) {
            console.error('Error checking bucket:', error);
        }
    };

    return (
        <div>
            <button onClick={checkBucket}>Check if Bucket is Empty</button>
            {isEmpty !== null && (
                <p>The bucket is {isEmpty ? 'empty' : 'not empty'}.</p>
            )}
        </div>
    );
}
