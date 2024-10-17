"use client";

import React, { useState, useEffect } from "react";

export default function page() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            try {
                const response = await fetch("https://t210ywcjr3.execute-api.ap-southeast-1.amazonaws.com/development/fetchResourceHealthMetrics?bucket=datasight-capstone-3b&key=data/resource_health_metrics.csv");
                const result = await response.json();

                // Parse the body to display the actual JSON object
                const parsedData = JSON.parse(result.body);
                setData(parsedData);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch data from the API");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Display loading, error, or JSON data
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>API Output</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre> {/* Display the JSON object in a readable format */}
        </div>
    );
}
