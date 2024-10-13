"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    useEdgesState,
    useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

// Define the type for the API response
interface MappingData {
    mapping_id: string;
    service_id: string;
    resource_id: string;
    resource_type: string;
}

export default function ServiceResourceMapping() {
    const [mappingData, setMappingData] = useState<MappingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // Track selected node (service or resource)

    const fetchMappingData = async () => {
        try {
            const response = await axios.get(
                "https://t210ywcjr3.execute-api.ap-southeast-1.amazonaws.com/development/fetch-mapping",
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
                    const castedData: MappingData[] = parsedData.map((item: any) => ({
                        mapping_id: String(item.mapping_id),
                        service_id: String(item.service_id),
                        resource_id: String(item.resource_id),
                        resource_type: String(item.resource_type),
                    }));

                    setMappingData(castedData);
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
        fetchMappingData();
    }, []);

    const generateNodesAndEdges = (data: MappingData[]) => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        const serviceXStart = 10000; // Adjusted to center the services better
        const resourceXStart = 400; // Adjusted to match the services
        const yServicePosition = 100; // y position for services
        const yResourcePosition = 400; // y position for resources below services
        const xGap = 200; // Horizontal gap between nodes

        data.forEach((mapping, index) => {
            const serviceNodeId = `${mapping.service_id}`;
            const resourceNodeId = `${mapping.resource_id}`;

            // Create nodes for each service and resource, vertically aligned and with gaps
            if (!nodes.find((n) => n.id === serviceNodeId)) {
                nodes.push({
                    id: serviceNodeId,
                    data: { label: `${mapping.service_id}` },
                    position: { x: serviceXStart + index * xGap, y: yServicePosition }, // Add horizontal gap
                    style: { cursor: "pointer" }, // Add pointer cursor to indicate clickability
                });
            }

            if (!nodes.find((n) => n.id === resourceNodeId)) {
                nodes.push({
                    id: resourceNodeId,
                    data: { label: `${mapping.resource_id} (${mapping.resource_type})` },
                    position: { x: resourceXStart + index * xGap, y: yResourcePosition }, // Place resources below services with gaps
                    style: { cursor: "pointer" }, // Add pointer cursor to indicate clickability
                });
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

        return { nodes, edges };
    };

    const handleNodeClick = (event: any, node: Node) => {
        // Set the clicked node (either service or resource) as selected
        setSelectedNodeId(node.id);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const { nodes, edges } = generateNodesAndEdges(mappingData);

    return (
        <div style={{ height: "100vh" }}>
            <h1>Service and Resource Mapping</h1>
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
