"use client"

import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [data, setData] = useState<any>(null); // State to store API response
    const [error, setError] = useState<string | null>(null); // State to handle error

    // Function to fetch data from API Gateway
    const fetchData = async () => {
        try {
            const response = await axios.get(
                "https://t210ywcjr3.execute-api.ap-southeast-1.amazonaws.com/development/fetchResourceServiceMapping",
                {
                    params: {
                        bucket: "datasight-capstone-3b",
                        key: "data/service_resource_mapping/run-1729159626753-part-r-00000",
                    },
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setData(response.data); // Save the API response data
        } catch (err: any) {
            console.error("Error fetching data:", err);
            setError(err.message); // Save the error message
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array to run the effect once on component mount

    return (
        <div>
            <h1>Fetch Resource Service Mapping</h1>
            {error && <p>Error: {error}</p>}
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default Home;
