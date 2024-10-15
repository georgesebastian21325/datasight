"use client";

import React, { useState } from "react";
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

// Define the props to pass fetched data from the parent component
interface ServiceResourceProductMappingProps {
    resourceMappingData: ResourceServiceMappingData[];
    productMappingData: ProductServiceMappingData[];
    offeringMappingData: ProductOfferingMappingData[]; // New prop for product-offering data
    loading: boolean;
    error: string | null;
}

export default function ServiceResourceProductMapping({
    resourceMappingData,
    productMappingData,
    offeringMappingData, // Receive offering data
    loading,
    error
}: ServiceResourceProductMappingProps) {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // Track selected node (service or resource/product)

    const handleNodeClick = (event: any, node: Node) => {
        setSelectedNodeId(node.id);  // Set the clicked node as selected
    };

    const generateNodesAndEdges = () => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        const serviceXStart = 800; // Adjusted to center the services better
        const resourceXStart = 300; // Adjusted to match the services
        const productXStart = 800; // Adjusted to place products to the right of services
        const offeringXStart = 800; // Adjusted to place offerings to the right of products
        const yProductPosition = -30;
        const yServicePosition = 100; // y position for services
        const yOfferingPosition = -200;
        const xGap = 200; // Horizontal gap between nodes
        const yGap = 150; // Vertical gap between rows of resources/products

        let currentResourceRow = 0;
        let currentProductRow = 0;
        let currentOfferingRow = 0;

        // Map resource-service data
        resourceMappingData.forEach((mapping, index) => {
            const serviceNodeId = `${mapping.service_id}`;
            const resourceNodeId = `${mapping.resource_id}`;

            // Create nodes for each service, aligned at the top
            if (!nodes.find((n) => n.id === serviceNodeId)) {
                nodes.push({
                    id: serviceNodeId,
                    data: { label: `${mapping.service_id}` },
                    position: { x: serviceXStart + index * xGap, y: yServicePosition },
                    style: { cursor: "pointer" },
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
                    strokeWidth: selectedNodeId === serviceNodeId || selectedNodeId === resourceNodeId ? 3 : 1,
                    stroke: selectedNodeId === serviceNodeId || selectedNodeId === resourceNodeId ? "green" : "#000",
                }, // Highlight selected service or resource
            });
        });

        // Map product-service data
        productMappingData.forEach((mapping, index) => {
            const serviceNodeId = `${mapping.service_id}`;
            const productNodeId = `${mapping.product_id}`;

            if (!nodes.find((n) => n.id === productNodeId)) {
                nodes.push({
                    id: productNodeId,
                    data: { label: `${mapping.product_id}` },
                    position: { x: productXStart + index * xGap, y: yProductPosition }, // Place services in a row
                    style: { cursor: "pointer" },
                });
                currentProductRow++; // Move to the next product position
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
                }, // Highlight selected service or product
            });
        });

        // Map product-offering data (new part)
        offeringMappingData.forEach((mapping, index) => {
            const offeringNodeId = `${mapping.offering_id}`;
            const productNodeId = `${mapping.product_id}`;

            if (!nodes.find((n) => n.id === offeringNodeId)) {
                nodes.push({
                    id: offeringNodeId,
                    data: { label: `${mapping.offering_id}` },
                    position: { x: offeringXStart + index * xGap, y: yOfferingPosition }, // Place offerings in a row
                    style: { cursor: "pointer" },
                });
                currentOfferingRow++; // Move to the next offering position
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
                }, // Highlight selected product or offering
            });
        });

        return { nodes, edges };
    };

    if (loading) {
        return <DataMappingLoadingState />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const { nodes, edges } = generateNodesAndEdges();

    return (
        <div style={{ height: "77vh" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                onNodeClick={handleNodeClick}  // Add click event for node selection
            >
            </ReactFlow>
        </div>
    );
}
