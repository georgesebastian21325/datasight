"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the type for the API response
interface MappingData {
    mapping_id: string;
    service_id: string;
    resource_id: string;
    resource_type: string;
}

export default function page() {
    const [mappingData, setMappingData] = useState<MappingData[]>([]); // Set initial state to an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the data from the API
    const fetchMappingData = async () => {
        try {
            const response = await axios.get('https://t210ywcjr3.execute-api.ap-southeast-1.amazonaws.com/development/fetch-mapping', {
                params: {
                    bucket: 'datasight-capstone-3b',
                    key: 'data/service_resource_mapping/service_resource_mapping.csv',
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Check if the response is an object and has the `body` as a string
            if (response.data && typeof response.data.body === 'string') {
                // Parse the body string as JSON
                const parsedData = JSON.parse(response.data.body);

                // Ensure the parsed data is an array
                if (Array.isArray(parsedData)) {
                    const castedData: MappingData[] = parsedData.map((item: any) => ({
                        mapping_id: String(item.mapping_id), // Cast to string
                        service_id: String(item.service_id), // Cast to string
                        resource_id: String(item.resource_id), // Cast to string
                        resource_type: String(item.resource_type), // Cast to string
                    }));

                    setMappingData(castedData); // Set the casted data
                } else {
                    console.error('Unexpected response format:', parsedData);
                    throw new Error('Data is not in expected array format');
                }
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchMappingData();
    }, []);

    return (
        <div>
            <h1>Service and Resource Mapping</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <ul>
                    {mappingData.length > 0 ? (
                        mappingData.map((mapping) => (
                            <li key={mapping.mapping_id}>
                                {mapping.service_id} is connected to {mapping.resource_id} ({mapping.resource_type})
                            </li>
                        ))
                    ) : (
                        <p>No data available</p>
                    )}
                </ul>
            )}
        </div>
    );
}
