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
        const connectedNodeIds = new Set<string>(); // To track connected nodes

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

        // Map resource-service data (Green)
        Object.values(resourceMappingData).forEach((mapping, index) => {
            const serviceNodeId = `${mapping.service_id}`;
            const resourceNodeId = `${mapping.resource_id}`;

            // Create service nodes (green)
            if (!nodes.find((n) => n.id === serviceNodeId)) {
                nodes.push({
                    id: serviceNodeId,
                    data: { label: `${mapping.service_id}` },
                    position: { x: serviceXStart + index * xGap, y: yServicePosition },
                    style: { cursor: "pointer", borderColor: "green" },
                });
            }

            // Create resource nodes (green)
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
                    style: { cursor: "pointer", borderColor: "green" },
                });
                currentResourceRow++;
            }

            // Create edges between services and resources (green)
            edges.push({
                id: `edge-${serviceNodeId}-${resourceNodeId}`,
                source: serviceNodeId,
                target: resourceNodeId,
                type: "simplebezier",
                style: { stroke: "green" },
            });

            // Track connected nodes
            if (selectedNodeId === serviceNodeId || selectedNodeId === resourceNodeId) {
                connectedNodeIds.add(serviceNodeId);
                connectedNodeIds.add(resourceNodeId);
            }
        });

        // Map product-service data (Blue)
        Object.values(productMappingData).forEach((mapping, index) => {
            const serviceNodeId = `${mapping.service_id}`;
            const productNodeId = `${mapping.product_id}`;

            // Create product nodes (blue)
            if (!nodes.find((n) => n.id === productNodeId)) {
                nodes.push({
                    id: productNodeId,
                    data: { label: `${mapping.product_id}` },
                    position: { x: productXStart + index * xGap, y: yProductPosition },
                    style: { cursor: "pointer", borderColor: "blue" },
                });
                currentProductRow++;
            }

            // Create edges between services and products (blue)
            edges.push({
                id: `edge-${serviceNodeId}-${productNodeId}`,
                source: productNodeId,
                target: serviceNodeId,
                type: "simplebezier",
                style: { stroke: "blue" },
            });

            // Track connected nodes
            if (selectedNodeId === serviceNodeId || selectedNodeId === productNodeId) {
                connectedNodeIds.add(serviceNodeId);
                connectedNodeIds.add(productNodeId);
            }
        });

        // Map product-offering data (Purple)
        Object.values(offeringMappingData).forEach((mapping, index) => {
            const offeringNodeId = `${mapping.offering_id}`;
            const productNodeId = `${mapping.product_id}`;

            // Create offering nodes (purple)
            if (!nodes.find((n) => n.id === offeringNodeId)) {
                nodes.push({
                    id: offeringNodeId,
                    data: { label: `${mapping.offering_id}` },
                    position: { x: offeringXStart + index * xGap, y: yOfferingPosition },
                    style: { cursor: "pointer", borderColor: "purple" },
                });
                currentOfferingRow++;
            }

            // Create edges between products and offerings (purple)
            edges.push({
                id: `edge-${productNodeId}-${offeringNodeId}`,
                source: offeringNodeId,
                target: productNodeId,
                type: "simplebezier",
                style: { stroke: "purple" },
            });

            // Track connected nodes
            if (selectedNodeId === productNodeId || selectedNodeId === offeringNodeId) {
                connectedNodeIds.add(offeringNodeId);
                connectedNodeIds.add(productNodeId);
            }
        });

        // Apply styling to highlight selected nodes and their edges with glow
        const styledEdges = edges.map((edge) => ({
            ...edge,
            style: {
                strokeWidth:
                    connectedNodeIds.has(edge.source) || connectedNodeIds.has(edge.target) ? 3 : 1,
                stroke:
                    connectedNodeIds.has(edge.source) || connectedNodeIds.has(edge.target)
                        ? edge.style?.stroke
                        : "#000", // Keep the original stroke color per layer
                boxShadow:
                    connectedNodeIds.has(edge.source) || connectedNodeIds.has(edge.target)
                        ? `0 0 10px ${edge.style?.stroke}` // Glow in the stroke's color (green/blue/purple)
                        : "none",
            },
        }));

        const styledNodes = nodes.map((node) => ({
            ...node,
            style: {
                ...node.style,
                borderColor: connectedNodeIds.has(node.id) ? node.style?.borderColor : "#000",
                boxShadow: connectedNodeIds.has(node.id)
                    ? `0 0 10px ${node.style?.borderColor}` // Glow in the node's color (green/blue/purple)
                    : "none",
            },
        }));

        return { nodes: styledNodes, edges: styledEdges };
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
