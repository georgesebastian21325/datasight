"use client";

import React, {
	useState,
	useEffect,
	useCallback,
} from "react";
import ReactFlow, {
	Background,
	Controls,
	MiniMap,
	Node,
	Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import DataMappingLoadingState from "../components/global/DataMappingLoadingState";
import { useGlobalState } from "../context/GlobalStateContext"; // Import the global state

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

const nodeTypes = {};
const edgeTypes = {};

export default function OPSRMapping() {
	const [resourceMappingData, setResourceMappingData] =
		useState<ResourceServiceMappingData[]>([]);
	const [productMappingData, setProductMappingData] =
		useState<ProductServiceMappingData[]>([]);
	const [offeringMappingData, setOfferingMappingData] =
		useState<ProductOfferingMappingData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	// const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const { selectedNodeId, setSelectedNodeId } =
		useGlobalState();
	const [highlightedNodes, setHighlightedNodes] = useState<
		Set<string>
	>(new Set());

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [resourceRes, productRes, offeringRes] =
					await Promise.all([
						fetch(
							"https://ps11pluldf.execute-api.ap-southeast-2.amazonaws.com/development/getResourceServiceMapping",
						),
						fetch(
							"https://ps11pluldf.execute-api.ap-southeast-2.amazonaws.com/development/getServiceProductMapping",
						),
						fetch(
							"https://ps11pluldf.execute-api.ap-southeast-2.amazonaws.com/development/getProductOfferingMapping",
						),
					]);

				const [resourceData, productData, offeringData] =
					await Promise.all([
						resourceRes.json(),
						productRes.json(),
						offeringRes.json(),
					]);

				const parsedResourceData = resourceData.body
					? JSON.parse(resourceData.body)
					: resourceData;
				const parsedProductData = productData.body
					? JSON.parse(productData.body)
					: productData;
				const parsedOfferingData = offeringData.body
					? JSON.parse(offeringData.body)
					: offeringData;

				setResourceMappingData(
					Array.isArray(parsedResourceData)
						? parsedResourceData
						: Object.values(parsedResourceData),
				);
				setProductMappingData(
					Array.isArray(parsedProductData)
						? parsedProductData
						: Object.values(parsedProductData),
				);
				setOfferingMappingData(
					Array.isArray(parsedOfferingData)
						? parsedOfferingData
						: Object.values(parsedOfferingData),
				);
				setLoading(false);
			} catch (err) {
				setError("Error fetching mapping data.");
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
				connectedEdges.add(
					`edge-${mapping.offering_id}-${mapping.product_id}`,
				);
			} else if (node.id === mapping.offering_id) {
				connectedNodes.add(mapping.product_id);
				connectedEdges.add(
					`edge-${mapping.offering_id}-${mapping.product_id}`,
				);
			}
		});

		// Highlight direct connections for product-service layer
		productMappingData.forEach((mapping) => {
			if (node.id === mapping.service_id) {
				connectedNodes.add(mapping.product_id);
				connectedEdges.add(
					`edge-${mapping.product_id}-${mapping.service_id}`,
				);
			} else if (node.id === mapping.product_id) {
				connectedNodes.add(mapping.service_id);
				connectedEdges.add(
					`edge-${mapping.product_id}-${mapping.service_id}`,
				);
			}
		});

		// Highlight direct connections for resource-service layer
		resourceMappingData.forEach((mapping) => {
			if (node.id === mapping.service_id) {
				connectedNodes.add(mapping.resource_id);
				connectedEdges.add(
					`edge-${mapping.resource_id}-${mapping.service_id}`,
				);
			} else if (node.id === mapping.resource_id) {
				connectedNodes.add(mapping.service_id);
				connectedEdges.add(
					`edge-${mapping.resource_id}-${mapping.service_id}`,
				);
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
		const getXStart = (totalItems: number) =>
			(containerWidth - totalItems * xGap) / 2;

		const yPositions = {
			offering: 0, // Offering at the top
			product: 200, // Product below offering
			service: 400, // Service below product
			resource: 600, // Resource at the bottom
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
					stroke:
						highlightedNodes.has(offeringNodeId) &&
						highlightedNodes.has(productNodeId)
							? "purple"
							: "gray",
					strokeWidth:
						highlightedNodes.has(offeringNodeId) &&
						highlightedNodes.has(productNodeId)
							? 3
							: 1,
					boxShadow:
						highlightedNodes.has(offeringNodeId) &&
						highlightedNodes.has(productNodeId)
							? "0 0 15px purple"
							: "none",
				},
			});
		});

		// Create offering nodes
		Array.from(offeringNodes).forEach(
			(offeringNodeId, index) => {
				nodes.push({
					id: offeringNodeId,
					data: { label: offeringNodeId },
					position: {
						x: getXStart(offeringNodes.size) + index * xGap,
						y: yPositions.offering,
					},
					style: {
						cursor: "pointer",
						borderColor: "black",
						boxShadow: highlightedNodes.has(offeringNodeId)
							? "0 0 15px 5px purple"
							: "none",
					},
				});
			},
		);

		// Create product nodes
		Array.from(productNodes).forEach(
			(productNodeId, index) => {
				nodes.push({
					id: productNodeId,
					data: { label: productNodeId },
					position: {
						x: getXStart(productNodes.size) + index * xGap,
						y: yPositions.product,
					},
					style: {
						cursor: "pointer",
						borderColor: "black",
						boxShadow: highlightedNodes.has(productNodeId)
							? "0 0 15px 5px #4169E1"
							: "none",
					},
				});
			},
		);

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
					stroke:
						highlightedNodes.has(productNodeId) &&
						highlightedNodes.has(serviceNodeId)
							? "blue"
							: "gray",
					strokeWidth:
						highlightedNodes.has(productNodeId) &&
						highlightedNodes.has(serviceNodeId)
							? 3
							: 1,
					boxShadow:
						highlightedNodes.has(productNodeId) &&
						highlightedNodes.has(serviceNodeId)
							? "0 0 15px blue"
							: "none",
				},
			});
		});

		// Create service nodes
		Array.from(serviceNodes).forEach(
			(serviceNodeId, index) => {
				nodes.push({
					id: serviceNodeId,
					data: { label: serviceNodeId },
					position: {
						x: getXStart(serviceNodes.size) + index * xGap,
						y: yPositions.service,
					},
					style: {
						cursor: "pointer",
						borderColor: "black",
						boxShadow: highlightedNodes.has(serviceNodeId)
							? "0 0 15px 5px #2E8B57"
							: "none",
					},
				});
			},
		);

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
					stroke:
						highlightedNodes.has(resourceNodeId) &&
						highlightedNodes.has(serviceNodeId)
							? "green"
							: "gray",
					strokeWidth:
						highlightedNodes.has(resourceNodeId) &&
						highlightedNodes.has(serviceNodeId)
							? 3
							: 1,
					boxShadow:
						highlightedNodes.has(resourceNodeId) &&
						highlightedNodes.has(serviceNodeId)
							? "0 0 15px green"
							: "none",
				},
			});
		});

		// Create resource nodes with a maximum of 5 per row
		Array.from(resourceNodes).forEach(
			(resourceNodeId, index) => {
				const rowIndex = Math.floor(index / 10); // Every 5 items will start a new row
				const columnIndex = index % 10; // Position within the row

				nodes.push({
					id: resourceNodeId,
					data: { label: resourceNodeId },
					position: {
						x: getXStart(10) + columnIndex * xGap,
						y: yPositions.resource + rowIndex * yGap,
					},
					style: {
						cursor: "pointer",
						borderColor: "black",
						boxShadow: highlightedNodes.has(resourceNodeId)
							? "0 0 15px 5px #DC143C"
							: "none",
					},
				});
			},
		);

		return { nodes, edges };
	}, [
		resourceMappingData,
		productMappingData,
		offeringMappingData,
		highlightedNodes,
	]);

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
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onNodeClick={handleNodeClick}
			/>
		</div>
	);
}
