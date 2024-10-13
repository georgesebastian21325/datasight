"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge
} from "reactflow";
import "reactflow/dist/style.css";

// Define the type for the resource-service and product-service API responses
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

export default function ServiceResourceProductMapping() {
    const [resourceMappingData, setResourceMappingData] = useState<ResourceServiceMappingData[]>([]);
    const [productMappingData, setProductMappingData] = useState<ProductServiceMappingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // Track selected node (service or resource/product)

    // Fetch resource-service mapping data
    const fetchResourceServiceMapping = async () => {
        try {
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

                if (Array.isArray(parsedData)) {
                    const castedData: ResourceServiceMappingData[] = parsedData.map((item: any) => ({
                        mapping_id: String(item.mapping_id),
                        service_id: String(item.service_id),
                        resource_id: String(item.resource_id),
                        resource_type: String(item.resource_type),
                    }));

                    setResourceMappingData(castedData);
                } else {
                    console.error("Unexpected response format:", parsedData);
                    throw new Error("Data is not in expected array format");
                }
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
            const response = await axios.get(
                "https://t210ywcjr3.execute-api.ap-southeast-1.amazonaws.com/development/fetchServiceResourceMapping",
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

                if (Array.isArray(parsedData)) {
                    const castedData: ProductServiceMappingData[] = parsedData.map((item: any) => ({
                        mapping_id: String(item.mapping_id),
                        service_id: String(item.service_id),
                        product_id: String(item.product_id),
                        start_date: String(item.start_date),
                        end_date: String(item.end_date),
                    }));

                    setProductMappingData(castedData);
                } else {
                    console.error("Unexpected response format:", parsedData);
                    throw new Error("Data is not in expected array format");
                }
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResourceServiceMapping();
        fetchProductServiceMapping();
    }, []);

    const generateNodesAndEdges = () => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        const serviceXStart = 800; // Adjusted to center the services better
        const resourceXStart = 300; // Adjusted to match the services
        const productXStart = 1300; // Adjusted to place products to the right of services
        const yServicePosition = 100; // y position for services
        const xGap = 200; // Horizontal gap between nodes
        const yGap = 150; // Vertical gap between rows of resources/products

        let currentResourceRow = 0;
        let currentProductRow = 0;

        // Map resource-service data
        resourceMappingData.forEach((mapping, index) => {
            const serviceNodeId = `${mapping.service_id}`;
            const resourceNodeId = `${mapping.resource_id}`;

            // Create nodes for each service, aligned at the top
            if (!nodes.find((n) => n.id === serviceNodeId)) {
                nodes.push({
                    id: serviceNodeId,
                    data: { label: `${mapping.service_id}` },
                    position: { x: serviceXStart + index * xGap, y: yServicePosition }, // Place services in a row
                    style: { cursor: "pointer" }, // Add pointer cursor to indicate clickability
                });
            }

            // Arrange resources in rows of 10
            const rowIndex = Math.floor(currentResourceRow / 10);
            const columnIndex = currentResourceRow % 10;

            if (!nodes.find((n) => n.id === resourceNodeId)) {
                nodes.push({
                    id: resourceNodeId,
                    data: { label: `${mapping.resource_id} (${mapping.resource_type})` },
                    position: {
                        x: resourceXStart + columnIndex * xGap, // Place resources in columns
                        y: yServicePosition + yGap * (rowIndex + 2), // Space rows
                    },
                    style: { cursor: "pointer" },
                });
                currentResourceRow++; // Move to the next resource position
            }

            // Create edges between services and resources
            edges.push({
                id: `edge-${serviceNodeId}-${resourceNodeId}`,
                source: serviceNodeId,
                target: resourceNodeId,
                type: "simplebezier",
                style: {
                    strokeWidth:
                        selectedNodeId === serviceNodeId || selectedNodeId === resourceNodeId
                            ? 3
                            : 1,
                    stroke:
                        selectedNodeId === serviceNodeId || selectedNodeId === resourceNodeId
                            ? "green"
                            : "#000",
                }, // Glow effect for selected service or resource
            });
        });

        // Map product-service data
        productMappingData.forEach((mapping, index) => {
            const serviceNodeId = `${mapping.service_id}`;
            const productNodeId = `${mapping.product_id}`;

            // Adjust product placement based on `currentProductRow` and `xGap`
            const productRowIndex = Math.floor(currentProductRow / 5);  // Limit 5 products per row
            const productColumnIndex = currentProductRow % 5;

            if (!nodes.find((n) => n.id === productNodeId)) {
                nodes.push({
                    id: productNodeId,
                    data: { label: `${mapping.product_id}` },
                    position: {
                        x: 800 + productColumnIndex * xGap * 1, // Increase gap to avoid overlap
                        y: -100, // Space rows more to avoid overlap
                    },
                    style: { cursor: "pointer" },
                });
                currentProductRow++; // Move to the next product position
            }

            // Create edges between services and products
            edges.push({
                id: `edge-${serviceNodeId}-${productNodeId}`,
                source: serviceNodeId,
                target: productNodeId,
                type: "simplebezier",
                style: {
                    strokeWidth:
                        selectedNodeId === serviceNodeId || selectedNodeId === productNodeId
                            ? 3
                            : 1,
                    stroke:
                        selectedNodeId === serviceNodeId || selectedNodeId === productNodeId
                            ? "blue"
                            : "#000",
                }, // Glow effect for selected service or product
            });
        });

        return { nodes, edges };
    };

    const handleNodeClick = (event: any, node: Node) => {
        // Set the clicked node (either service or resource/product) as selected
        setSelectedNodeId(node.id);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const { nodes, edges } = generateNodesAndEdges();

    return (
        <div style={{ height: "100vh" }}>
            <h1>Service, Resource, and Product Mapping</h1>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                onNodeClick={handleNodeClick} // Add node click event handler
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}
