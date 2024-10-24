"use client";

import { useEffect, useState } from 'react';

interface HealthStatus {
    resource_id: string;
    resource_type: string;
    obsolescence_health: string;
    capacity_health: string;
    total_health: string;
}

const HealthStatusDashboard = () => {
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
                computerData = computerData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                const parsedComputerData: HealthStatus[] = JSON.parse(computerData); // Parse cleaned JSON

                // Fetch server health data
                const serverResponse = await fetch(
                    'https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getServerHealthStatus'
                );
                let serverData: string = await serverResponse.text(); // Get the data as text
                serverData = serverData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                const parsedServerData: HealthStatus[] = JSON.parse(serverData); // Parse cleaned JSON

                // Fetch storage device (SD) health data
                const sdResponse = await fetch(
                    'https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getSDHealthStatus'
                );
                let sdData: string = await sdResponse.text(); // Get the data as text
                sdData = sdData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                const parsedSDData: HealthStatus[] = JSON.parse(sdData); // Parse cleaned JSON

                // Fetch communication infrastructure health data
                const infraResponse = await fetch(
                    'https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getCommunicationInfraHealthStatus'
                );
                let infraData: string = await infraResponse.text(); // Get the data as text
                infraData = infraData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                const parsedInfraData: HealthStatus[] = JSON.parse(infraData); // Parse cleaned JSON

                // Fetch network equipment health data
                const networkResponse = await fetch(
                    'https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getNetworkEquipmentHealthStatus'
                );
                let networkData: string = await networkResponse.text(); // Get the data as text
                networkData = networkData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                const parsedNetworkData: HealthStatus[] = JSON.parse(networkData); // Parse cleaned JSON

                // Fetch backup and recovery (BR) health data
                const brResponse = await fetch(
                    'https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getBRHealthStatus'
                );
                let brData: string = await brResponse.text(); // Get the data as text
                brData = brData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                const parsedBRData: HealthStatus[] = JSON.parse(brData); // Parse cleaned JSON

                // Fetch virtual infrastructure (VI) health data
                const viResponse = await fetch(
                    'https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getVIHealthStatus'
                );
                let viData: string = await viResponse.text(); // Get the data as text
                viData = viData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                const parsedVIData: HealthStatus[] = JSON.parse(viData); // Parse cleaned JSON

                // Fetch cloud infrastructure (CI) health data
                const ciResponse = await fetch(
                    'https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getCIHealthStatus'
                );
                let ciData: string = await ciResponse.text(); // Get the data as text
                ciData = ciData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                const parsedCIData: HealthStatus[] = JSON.parse(ciData); // Parse cleaned JSON

                // Fetch software health data
                const softwareResponse = await fetch(
                    'https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getSoftwareHealthStatus'
                );
                let softwareData: string = await softwareResponse.text(); // Get the data as text
                softwareData = softwareData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                const parsedSoftwareData: HealthStatus[] = JSON.parse(softwareData); // Parse cleaned JSON

                // Combine all health data
                const combinedData = [
                    ...parsedComputerData,
                    ...parsedServerData,
                    ...parsedSDData,
                    ...parsedInfraData,
                    ...parsedNetworkData,
                    ...parsedBRData,
                    ...parsedVIData,
                    ...parsedCIData,
                    ...parsedSoftwareData, // Added software data
                ];

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
            <h1 className='font-bold'>Health Status Dashboard</h1>
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
                        <span>
                            {item.resource_id} ({item.resource_type}) - {item.total_health}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HealthStatusDashboard;
