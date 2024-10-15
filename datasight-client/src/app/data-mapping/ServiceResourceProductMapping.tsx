"use client";

import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import DataMappingLoadingState from '../components/global/DataMappingLoadingState';

// Define the type for the resource-service and product-service data
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

// Define the props to pass fetched data from the parent component
interface ServiceResourceProductMappingProps {
    resourceMappingData: ResourceServiceMappingData[];
    productMappingData: ProductServiceMappingData[];
    loading: boolean;
    error: string | null;
}

export default function ServiceResourceProductMapping({
    resourceMappingData,
    productMappingData,
    loading,
    error
}: ServiceResourceProductMappingProps) {

    const generateNodesAndEdges = () => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        const serviceXStart = 800; // Adjusted to center the services better
        const resourceXStart = 300; // Adjusted to match the services
        const productXStart = 800; // Adjusted to place products to the right of services
        const yProductPosition = -30;
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
                style: { stroke: "#000", strokeWidth: 1 }, // Default style
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
                style: { stroke: "#000", strokeWidth: 1 }, // Default style
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
            <ReactFlow nodes={nodes} edges={edges} fitView />
        </div>
    );
}
