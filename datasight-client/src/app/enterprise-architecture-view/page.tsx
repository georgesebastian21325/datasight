"use client"

import { useState } from "react";
import Header from "../components/global/Header";
import ServiceResourceProductMapping from "../data-mapping/ServiceResourceProductMapping";
import GenerateMappingBtn from "../components/button/GenerateMappingBtn";  // Import the new button component
import Link from "next/link";
import axios from "axios";

export default function page() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resourceMappingData, setResourceMappingData] = useState([]);
    const [productMappingData, setProductMappingData] = useState([]);

    // Fetch resource-service mapping data
    const fetchResourceServiceMapping = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "https://t210ywcjr3.execute-api.ap-southeast-1.amazonaws.com/development/fetchResourceServiceMapping",
                {
                    params: {
                        bucket: "datasight-capstone-3b",
                        key: "data/service_resource_mapping/service_resource_mapping.csv",
                    },
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data && typeof response.data.body === "string") {
                const parsedData = JSON.parse(response.data.body);
                const castedData = parsedData.map((item: any) => ({
                    mapping_id: String(item.mapping_id),
                    service_id: String(item.service_id),
                    resource_id: String(item.resource_id),
                    resource_type: String(item.resource_type),
                }));
                setResourceMappingData(castedData);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch product-service mapping data
    const fetchProductServiceMapping = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "https://t210ywcjr3.execute-api.ap-southeast-1.amazonaws.com/development/fetchServiceProductMapping",
                {
                    params: {
                        bucket: "datasight-capstone-3b",
                        key: "data/product_service_mapping/product_service_mapping.csv",
                    },
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data && typeof response.data.body === "string") {
                const parsedData = JSON.parse(response.data.body);
                const castedData = parsedData.map((item: any) => ({
                    mapping_id: String(item.mapping_id),
                    service_id: String(item.service_id),
                    product_id: String(item.product_id),
                    start_date: String(item.start_date),
                    end_date: String(item.end_date),
                }));
                setProductMappingData(castedData);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    // Handler to trigger both mappings
    const handleGenerateMapping = () => {
        setError(null); // Clear previous errors
        fetchProductServiceMapping();
        fetchResourceServiceMapping();
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen relative">
            {/* Back Button */}
            <Link href='/home-page'>
                <button className="absolute rounded-md top-4 right-4 px-4 py-2 text-white bg-black hover:bg-gray-500 transition-transform transform hover:scale-105 font-medium shadow-sm">
                    Back
                </button>
            </Link>

            {/* Left sidebar - Console */}
            <div className="w-full lg:w-1/5 h-full overflow-auto border-r border-gray-200 p-4 flex flex-col">
                {/* Logo */}
                <div className='mb-8'>
                    <Header />
                </div>

                <h2 className="text-xl font-bold mb-4">Optimization Options</h2>
                <div className="space-y-2 flex-grow">
                    <button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">Obsolescences</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">Capacity</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">Finance</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-blue-800 rounded-md bg-brand-blue text-white transition-transform transform hover:scale-105">Risk</button>
                </div>

                <button className="mt-12 py-2 mb-12 lg:mt-auto lg:mb-4 lg:px-6 lg:py-2 bg-yellow-500 hover:bg-gray-900 text-white rounded">
                    Present With AI
                </button>

            </div>

            {/* Right side - Enterprise Mapping */}
            <div className="w-full lg:w-4/5 h-full overflow-auto p-4 pt-16">
                <h2 className="text-xl font-bold mb-1">Enterprise Architecture</h2>
                <p className='mb-3 text-gray-500'> This is the current mapping of your enterprise architecture. </p>

                {/* Generate Mapping Button in separate component */}
                <GenerateMappingBtn onGenerateMapping={handleGenerateMapping} />

                {/* Mapping visualization should fit this container */}
                <div className="flex items-center justify-center w-full h-[calc(100%-80px)] border-2 border-dashed border-gray-300 rounded-lg ">
                    <div className="w-full h-50 min-w-[1200px]"> {/* Ensure full width */}
                        <ServiceResourceProductMapping
                            resourceMappingData={resourceMappingData} // Pass fetched data as props
                            productMappingData={productMappingData}
                            loading={loading}
                            error={error}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
