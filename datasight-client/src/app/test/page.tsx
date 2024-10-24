"use client";

import { useEffect, useState } from 'react';

interface HealthStatus {
    resource_id: string;
    resource_type: string;
    obsolescence_health: string;
    capacity_health: string;
    total_health: string;
}

const ComputerAndServerHealth = () => {
    const [healthData, setHealthData] = useState<HealthStatus[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch the data from the API endpoints
    useEffect(() => {
        const fetchHealthData = async () => {
            try {
                // Fetch computer health data
                const computerResponse = await fetch(
                    'https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getComputerHealthStatus'
                );
                let computerData: string = await computerResponse.text(); // Get the data as text
                // Clean up JSON if necessary by removing escape characters and newlines
                computerData = computerData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                const parsedComputerData: HealthStatus[] = JSON.parse(computerData); // Parse cleaned JSON

                // Fetch server health data
                const serverResponse = await fetch(
                    'https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getServerHealthStatus'
                );
                let serverData: string = await serverResponse.text(); // Get the data as text
                // Clean up JSON if necessary by removing escape characters and newlines
                serverData = serverData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                const parsedServerData: HealthStatus[] = JSON.parse(serverData); // Parse cleaned JSON

                const storageDeviceResponse = await fetch(
                    'https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getSDHealthStatus'
                )

                // Combine computer and server data
                const combinedData = [...parsedComputerData, ...parsedServerData];

                // Set the parsed data to state
                setHealthData(combinedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching or parsing data:', error);
                setLoading(false);
            }
        };

        fetchHealthData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    // Function to get the color for the dot based on total health
    const getDotColor = (health: string) => {
        switch (health) {
            case 'Green':
                return 'green';
            case 'Yellow':
                return 'yellow';
            case 'Red':
                return 'red';
            default:
                return 'gray'; // Fallback color if the status is not recognized
        }
    };

    return (
        <div>
            <h1>Resource Health Status</h1>
            <ul>
                {/* Use map to loop over health data */}
                {healthData.map((item) => (
                    <li key={item.resource_id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <span
                            style={{
                                display: 'inline-block',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: getDotColor(item.total_health),
                                marginRight: '10px',
                            }}
                        ></span>
                        <span>{item.resource_id} ({item.resource_type}) - {item.total_health}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ComputerAndServerHealth;
