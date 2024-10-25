"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import DataMappingLoadingState from '../components/global/DataMappingLoadingState';

interface ResourceServiceMappingData {
    service_id: string;
    resource_id: string;
    resource_type: string;
}

interface ProductServiceMappingData {
    service_id: string;
    product_id: string;
    start_date: string;
    end_date: string;
}

interface ProductOfferingMappingData {
    offering_id: string;
    product_id: string;
}

interface HealthStatus {
    resource_id: string;
    resource_type: string;
    obsolescence_health: string;
    capacity_health: string;
    total_health: string;
}

const nodeTypes = {};
const edgeTypes = {};

export default function OPSRMapping() {
    const [resourceMappingData, setResourceMappingData] = useState<ResourceServiceMappingData[]>([]);
    const [productMappingData, setProductMappingData] = useState<ProductServiceMappingData[]>([]);
    const [offeringMappingData, setOfferingMappingData] = useState<ProductOfferingMappingData[]>([]);
    const [healthData, setHealthData] = useState<HealthStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());

    const getHealthColor = (health: string) => {
        switch (health) {
            case 'Green':
                return 'green';
            case 'Yellow':
                return 'yellow';
            case 'Red':
                return 'red';
            default:
                return 'gray'; // Default color if the health status is unknown
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all health statuses
                const healthEndpoints = [
                    'getComputerHealthStatus',
                    'getServerHealthStatus',
                    'getSDHealthStatus',
                    'getCommunicationInfraHealthStatus',
                    'getNetworkEquipmentHealthStatus',
                    'getBRHealthStatus',
                    'getVIHealthStatus',
                    'getCIHealthStatus',
                    'getSoftwareHealthStatus'
                ];
                const healthFetches = healthEndpoints.map(endpoint =>
                    fetch(`https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/${endpoint}`)
                );
                const healthResponses = await Promise.all(healthFetches);

                // Process each health status response
                const healthData = await Promise.all(healthResponses.map(async (res) => {
                    let textData = await res.text();
                    textData = textData.replace(/\\n/g, '').replace(/\\"/g, '"').trim();
                    return JSON.parse(textData);  // Convert to JSON
                }));

                // Flatten health data and set state
                const combinedHealthData = healthData.flat();
                setHealthData(combinedHealthData);

                // Fetch mappings with enhanced error handling
                const [resourceRes, productRes, offeringRes] = await Promise.all([
                    fetch("https://jyghjk6217.execute-api.ap-southeast-2.amazonaws.com/development/getResourceServiceMapping"),
                    fetch("https://jyghjk6217.execute-api.ap-southeast-2.amazonaws.com/development/getServiceProductMapping"),
                    fetch("https://jyghjk6217.execute-api.ap-southeast-2.amazonaws.com/development/getProductOfferingMapping")
                ]);

                // Ensure responses are OK before parsing JSON
                if (!resourceRes.ok || !productRes.ok || !offeringRes.ok) {
                    throw new Error("Failed to fetch one or more mappings.");
                }

                // Parse mapping data
                const [resourceData, productData, offeringData] = await Promise.all([
                    resourceRes.json(),
                    productRes.json(),
                    offeringRes.json()
                ]);

                // Use fallback for JSON parsing to handle inconsistent structures
                const parsedResourceData = Array.isArray(resourceData) ? resourceData : Object.values(resourceData);
                const parsedProductData = Array.isArray(productData) ? productData : Object.values(productData);
                const parsedOfferingData = Array.isArray(offeringData) ? offeringData : Object.values(offeringData);

                setResourceMappingData(parsedResourceData);
                setProductMappingData(parsedProductData);
                setOfferingMappingData(parsedOfferingData);

                // Clear error if successful
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);  // Log specific error details
                setError("Error fetching mapping data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleNodeClick = (event: any, node: Node) => {
        setSelectedNodeId(node.id);

        const connectedNodes = new Set<string>();
        const connectedEdges = new Set<string>();

        // Highlight direct connections for product-offering layer
        offeringMappingData.forEach((mapping) => {
            if (node.id === mapping.product_id) {
                connectedNodes.add(mapping.offering_id);
                connectedEdges.add(`edge-${mapping.offering_id}-${mapping.product_id}`);
            } else if (node.id === mapping.offering_id) {
                connectedNodes.add(mapping.product_id);
                connectedEdges.add(`edge-${mapping.offering_id}-${mapping.product_id}`);
            }
        });

        // Highlight direct connections for product-service layer
        productMappingData.forEach((mapping) => {
            if (node.id === mapping.service_id) {
                connectedNodes.add(mapping.product_id);
                connectedEdges.add(`edge-${mapping.product_id}-${mapping.service_id}`);
            } else if (node.id === mapping.product_id) {
                connectedNodes.add(mapping.service_id);
                connectedEdges.add(`edge-${mapping.product_id}-${mapping.service_id}`);
            }
        });

        // Highlight direct connections for resource-service layer
        resourceMappingData.forEach((mapping) => {
            if (node.id === mapping.service_id) {
                connectedNodes.add(mapping.resource_id);
                connectedEdges.add(`edge-${mapping.resource_id}-${mapping.service_id}`);
            } else if (node.id === mapping.resource_id) {
                connectedNodes.add(mapping.service_id);
                connectedEdges.add(`edge-${mapping.resource_id}-${mapping.service_id}`);
            }
        });

        connectedNodes.add(node.id); // Add the clicked node itself
        setHighlightedNodes(connectedNodes);
    };

    const generateNodesAndEdges = useCallback(() => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        const xGap = 200; // Gap between nodes horizontally
        const yGap = 150; // Gap between nodes vertically

        const containerWidth = 1000; // Assume a container width of 1000px for balancing

        // Helper to center nodes
        const getXStart = (totalItems: number) => (containerWidth - (totalItems * xGap)) / 2;

        const yPositions = {
            offering: 0,  // Offering at the top
            product: 200, // Product below offering
            service: 400, // Service below product
            resource: 600  // Resource at the bottom
        };

        // Create nodes and edges for product-offering mappings
        const productNodes = new Set<string>();
        const offeringNodes = new Set<string>();

        offeringMappingData.forEach((mapping, index) => {
            const productNodeId = mapping.product_id;
            const offeringNodeId = mapping.offering_id;

            offeringNodes.add(offeringNodeId);
            productNodes.add(productNodeId);

            edges.push({
                id: `edge-${offeringNodeId}-${productNodeId}`,
                source: offeringNodeId,
                target: productNodeId,
                type: "simplebezier",
                style: {
                    stroke: highlightedNodes.has(offeringNodeId) && highlightedNodes.has(productNodeId) ? "purple" : "gray",
                    strokeWidth: highlightedNodes.has(offeringNodeId) && highlightedNodes.has(productNodeId) ? 3 : 1,
                    boxShadow: highlightedNodes.has(offeringNodeId) && highlightedNodes.has(productNodeId) ? "0 0 15px purple" : "none",
                },
            });
        });

        // Create offering nodes
        Array.from(offeringNodes).forEach((offeringNodeId, index) => {
            nodes.push({
                id: offeringNodeId,
                data: { label: offeringNodeId },
                position: { x: getXStart(offeringNodes.size) + index * xGap, y: yPositions.offering },
                style: {
                    cursor: "pointer",
                    borderColor: "black",
                    boxShadow: highlightedNodes.has(offeringNodeId) ? "0 0 15px 5px purple" : "none",
                },
            });
        });

        // Create product nodes
        Array.from(productNodes).forEach((productNodeId, index) => {
            nodes.push({
                id: productNodeId,
                data: { label: productNodeId },
                position: { x: getXStart(productNodes.size) + index * xGap, y: yPositions.product },
                style: {
                    cursor: "pointer",
                    borderColor: "black",
                    boxShadow: highlightedNodes.has(productNodeId) ? "0 0 15px 5px #4169E1" : "none",
                },
            });
        });

        // Create service nodes and edges for product-service mappings
        const serviceNodes = new Set<string>();

        productMappingData.forEach((mapping, index) => {
            const serviceNodeId = mapping.service_id;
            const productNodeId = mapping.product_id;

            serviceNodes.add(serviceNodeId);

            edges.push({
                id: `edge-${productNodeId}-${serviceNodeId}`,
                source: productNodeId,
                target: serviceNodeId,
                type: "simplebezier",
                style: {
                    stroke: highlightedNodes.has(productNodeId) && highlightedNodes.has(serviceNodeId) ? "blue" : "gray",
                    strokeWidth: highlightedNodes.has(productNodeId) && highlightedNodes.has(serviceNodeId) ? 3 : 1,
                    boxShadow: highlightedNodes.has(productNodeId) && highlightedNodes.has(serviceNodeId) ? "0 0 15px blue" : "none",
                },
            });
        });

        // Create service nodes
        Array.from(serviceNodes).forEach((serviceNodeId, index) => {
            nodes.push({
                id: serviceNodeId,
                data: { label: serviceNodeId },
                position: { x: getXStart(serviceNodes.size) + index * xGap, y: yPositions.service },
                style: {
                    cursor: "pointer",
                    borderColor: "black",
                    boxShadow: highlightedNodes.has(serviceNodeId) ? "0 0 15px 5px #2E8B57" : "none",
                },
            });
        });

        // Create resource nodes and edges for resource-service mappings
        const resourceNodes = new Set<string>();

        resourceMappingData.forEach((mapping, index) => {
            const resourceNodeId = mapping.resource_id;
            const serviceNodeId = mapping.service_id;

            resourceNodes.add(resourceNodeId);

            edges.push({
                id: `edge-${resourceNodeId}-${serviceNodeId}`,
                source: resourceNodeId,
                target: serviceNodeId,
                type: "simplebezier",
                style: {
                    stroke: highlightedNodes.has(resourceNodeId) && highlightedNodes.has(serviceNodeId) ? "green" : "gray",
                    strokeWidth: highlightedNodes.has(resourceNodeId) && highlightedNodes.has(serviceNodeId) ? 3 : 1,
                    boxShadow: highlightedNodes.has(resourceNodeId) && highlightedNodes.has(serviceNodeId) ? "0 0 15px green" : "none",
                },
            });
        });

        // Create resource nodes with health status colored dots
        Array.from(resourceNodes).forEach((resourceNodeId, index) => {
            const rowIndex = Math.floor(index / 10); // Every 5 items will start a new row
            const columnIndex = index % 10; // Position within the row

            // Find the corresponding health data for the resource node
            const healthStatus = healthData.find(h => h.resource_id === resourceNodeId);
            const healthColor = healthStatus ? getHealthColor(healthStatus.total_health) : 'gray';

            nodes.push({
                id: resourceNodeId,
                data: {
                    label: (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    backgroundColor: healthColor,
                                    marginRight: "10px",
                                }}
                            ></span>
                            {resourceNodeId}
                        </div>
                    ),
                },
                position: {
                    x: getXStart(10) + columnIndex * xGap,
                    y: yPositions.resource + rowIndex * yGap,
                },
                style: {
                    cursor: "pointer",
                    borderColor: "black",
                    boxShadow: highlightedNodes.has(resourceNodeId) ? `0 0 15px 5px green` : "none",
                },

            });
        });

        return { nodes, edges };
    }, [resourceMappingData, productMappingData, offeringMappingData, highlightedNodes, healthData]);

    if (loading) {
        return <DataMappingLoadingState />;
    }

    if (error) {
        return <p className='text-center text-red-500 font-bold'> Huy Baks, Wait Lang Ah.  </p>;
    }

    const { nodes, edges } = generateNodesAndEdges();

    return (
        <div style={{ height: "77vh" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeClick={handleNodeClick}
            />
        </div>
    );
}
