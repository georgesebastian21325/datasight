"use client";

import React, { useState, useEffect } from "react";
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import DataMappingLoadingState from '../components/global/DataMappingLoadingState';

// Define the type for the resource-service, product-service, and product-offering data
interface ResourceServiceMappingData {
    mapping_id: string;
    service_id: string;
    resource_id: string;
    resource_type: string;
}

interface ProductServiceMappingData {
    mapping_id: string;
    service_id: string;
    product_id: string;
    start_date: string;
    end_date: string;
}

interface ProductOfferingMappingData {
    mapping_id: string;
    offering_id: string;
    product_id: string;
}

// Main component to handle data fetching and display using ReactFlow
export default function OPSRMapping() {
    const [resourceMappingData, setResourceMappingData] = useState<ResourceServiceMappingData[]>([]);
    const [productMappingData, setProductMappingData] = useState<ProductServiceMappingData[]>([]);
    const [offeringMappingData, setOfferingMappingData] = useState<ProductOfferingMappingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // Track selected node

    useEffect(() => {
        const fetchResourceServiceMapping = async () => {
            try {
                const response = await fetch(
                    "https://t210ywcjr3.execute-api.ap-southeast-1.amazonaws.com/development/fetchResourceServiceMapping?bucket=datasight-capstone-3b&key=data/service_resource_mapping/run-1729159626753-part-r-00000"
                );
                const data = await response.json();
                console.log('Resource-Service Mapping Data:', data);  // Log the fetched data
                setResourceMappingData(data);
            } catch (err) {
                setError("Error fetching resource-service mapping.");
            }
        };

        const fetchServiceProductMapping = async () => {
            try {
                const response = await fetch(
                    "https://t210ywcjr3.execute-api.ap-southeast-1.amazonaws.com/development/fetchServiceProductMapping?bucket=datasight-capstone-3b&key=data/product_service_mapping/run-1729159594421-part-r-00000"
                );
                const data = await response.json();
                console.log('Service-Product Mapping Data:', data);  // Log the fetched data
                setProductMappingData(data);
            } catch (err) {
                setError("Error fetching product-service mapping.");
            }
        };

        const fetchProductOfferingMapping = async () => {
            try {
                const response = await fetch(
                    "https://t210ywcjr3.execute-api.ap-southeast-1.amazonaws.com/development/fetchProductOfferingMapping?bucket=datasight-capstone-3b&key=data/offering_product_mapping/run-1729159589993-part-r-00000"
                );
                const data = await response.json();
                console.log('Product-Offering Mapping Data:', data);  // Log the fetched data
                setOfferingMappingData(data);
            } catch (err) {
                setError("Error fetching product-offering mapping.");
            }
        };

        // Call all fetch functions and manage loading state
        Promise.all([fetchResourceServiceMapping(), fetchServiceProductMapping(), fetchProductOfferingMapping()])
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, []);


    const handleNodeClick = (event: any, node: Node) => {
        setSelectedNodeId(node.id);  // Set the clicked node as selected
    };

    const generateNodesAndEdges = () => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        const serviceXStart = 800;
        const resourceXStart = 300;
        const productXStart = 800;
        const offeringXStart = 800;
        const yProductPosition = -30;
        const yServicePosition = 100;
        const yOfferingPosition = -200;
        const xGap = 200;
        const yGap = 150;

        let currentResourceRow = 0;
        let currentProductRow = 0;
        let currentOfferingRow = 0;

        // Map resource-service data
        Object.values(resourceMappingData).forEach((mapping, index) => {
            const serviceNodeId = `${mapping.service_id}`;
            const resourceNodeId = `${mapping.resource_id}`;

            // Create service nodes
            if (!nodes.find((n) => n.id === serviceNodeId)) {
                nodes.push({
                    id: serviceNodeId,
                    data: { label: `${mapping.service_id}` },
                    position: { x: serviceXStart + index * xGap, y: yServicePosition },
                    style: { cursor: "pointer" },
                });
            }

            // Create resource nodes
            const rowIndex = Math.floor(currentResourceRow / 10);
            const columnIndex = currentResourceRow % 10;
            if (!nodes.find((n) => n.id === resourceNodeId)) {
                nodes.push({
                    id: resourceNodeId,
                    data: { label: `${mapping.resource_id}` },
                    position: {
                        x: resourceXStart + columnIndex * xGap,
                        y: yServicePosition + yGap * (rowIndex + 2),
                    },
                    style: { cursor: "pointer" },
                });
                currentResourceRow++;
            }

            // Create edges between services and resources
            edges.push({
                id: `edge-${serviceNodeId}-${resourceNodeId}`,
                source: serviceNodeId,
                target: resourceNodeId,
                type: "simplebezier",
                style: {
                    strokeWidth: selectedNodeId === serviceNodeId || selectedNodeId === resourceNodeId ? 3 : 1,
                    stroke: selectedNodeId === serviceNodeId || selectedNodeId === resourceNodeId ? "green" : "#000",
                    boxShadow: selectedNodeId === serviceNodeId || selectedNodeId === resourceNodeId ? "0 0 10px #33ff33" : "none",
                },
            });
        });

        // Map product-service data
        Object.values(productMappingData).forEach((mapping, index) => {
            const serviceNodeId = `${mapping.service_id}`;
            const productNodeId = `${mapping.product_id}`;

            if (!nodes.find((n) => n.id === productNodeId)) {
                nodes.push({
                    id: productNodeId,
                    data: { label: `${mapping.product_id}` },
                    position: { x: productXStart + index * xGap, y: yProductPosition },
                    style: { cursor: "pointer" },
                });
                currentProductRow++;
            }

            // Create edges between services and products
            edges.push({
                id: `edge-${serviceNodeId}-${productNodeId}`,
                source: productNodeId,
                target: serviceNodeId,
                type: "simplebezier",
                style: {
                    strokeWidth: selectedNodeId === serviceNodeId || selectedNodeId === productNodeId ? 3 : 1,
                    stroke: selectedNodeId === serviceNodeId || selectedNodeId === productNodeId ? "blue" : "#000",
                    boxShadow: selectedNodeId === serviceNodeId || selectedNodeId === productNodeId ? "0 0 10px #33ccff" : "none",
                },
            });
        });

        // Map product-offering data
        Object.values(offeringMappingData).forEach((mapping, index) => {
            const offeringNodeId = `${mapping.offering_id}`;
            const productNodeId = `${mapping.product_id}`;

            if (!nodes.find((n) => n.id === offeringNodeId)) {
                nodes.push({
                    id: offeringNodeId,
                    data: { label: `${mapping.offering_id}` },
                    position: { x: offeringXStart + index * xGap, y: yOfferingPosition },
                    style: { cursor: "pointer" },
                });
                currentOfferingRow++;
            }

            // Create edges between products and offerings
            edges.push({
                id: `edge-${productNodeId}-${offeringNodeId}`,
                source: offeringNodeId,
                target: productNodeId,
                type: "simplebezier",
                style: {
                    strokeWidth: selectedNodeId === productNodeId || selectedNodeId === offeringNodeId ? 3 : 1,
                    stroke: selectedNodeId === productNodeId || selectedNodeId === offeringNodeId ? "purple" : "#000",
                    boxShadow: selectedNodeId === productNodeId || selectedNodeId === offeringNodeId ? "0 0 10px #ff33ff" : "none",
                },
            });
        });

        return { nodes, edges };
    };


    if (loading) {
        return <DataMappingLoadingState />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const { nodes, edges } = generateNodesAndEdges();

    return (
        <div style={{ height: "77vh" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                onNodeClick={handleNodeClick}
            >
            </ReactFlow>
        </div>
    );
}
