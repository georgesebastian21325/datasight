"use client";

import React, {
	useState,
	useEffect,
	useCallback,
} from "react";
import ReactFlow, { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import DataMappingLoadingState from "../components/global/DataMappingLoadingState";
import { useGlobalState } from "../context/GlobalStateContext"; // Import the global state

import {
	fetchResourceHealthStatus,
	fetchServiceHealthStatus,
	fetchProductHealthStatus,
	fetchOfferingHealthStatus,
} from "../api/dataMapping/mapping-functions";
import { ListBucketInventoryConfigurationsOutputFilterSensitiveLog } from "@aws-sdk/client-s3";

interface ResourceServiceMappingData {
	service_id: string;
	resource_id: string;
	resource_type: string;
	status?: string;
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

interface ResourceHealthStatus {
	resource_id: string;
	resource_risk_status: string;
}

interface ServiceHealthStatus {
	service_id: string;
	service_risk_status: string;
}

interface ProductHealthStatus {
	product_id: string;
	product_risk_status: string;
}

interface OfferingHealthStatus {
	offering_id: string;
	offering_risk_status: string;
}

interface OptimizedOPSRMappingProps {
	optimizationType: string;
}

const nodeTypes = {};
const edgeTypes = {};

export default function OptimizedOPSRMapping({
	optimizationType,
}: OptimizedOPSRMappingProps) {
	console.log(optimizationType);
	const [resourceMappingData, setResourceMappingData] =
		useState<ResourceServiceMappingData[]>([]);
	const [productMappingData, setProductMappingData] =
		useState<ProductServiceMappingData[]>([]);
	const [offeringMappingData, setOfferingMappingData] =
		useState<ProductOfferingMappingData[]>([]);

	const [healthResourceData, setResourceHealthData] =
		useState<ResourceHealthStatus[]>([]);
	const [healthServiceData, setServiceHealthData] =
		useState<ServiceHealthStatus[]>([]);
	const [healthProductData, setProductHealthData] =
		useState<ProductHealthStatus[]>([]);
	const [healthOfferingData, setOfferingHealthData] =
		useState<OfferingHealthStatus[]>([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { handleSetSelectedNodeId } = useGlobalState();
	const [highlightedNodes, setHighlightedNodes] = useState<
		Set<string>
	>(new Set());

	const getHealthColor = (health: string) => {
		switch (health) {
			case "Green":
				return "green";
			case "Yellow":
				return "yellow";
			case "Red":
				return "red";
			default:
				return "gray"; // Default color if the health status is unknown
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [resourceRes, productRes, offeringRes] =
					await Promise.all([
						fetch(
							`https://jyghjk6217.execute-api.ap-southeast-2.amazonaws.com/development/getOptimizedResourceServiceMapping?mapping_type=${optimizationType}`,
						),
						fetch(
							"https://jyghjk6217.execute-api.ap-southeast-2.amazonaws.com/development/getServiceProductMapping",
						),
						fetch(
							"https://jyghjk6217.execute-api.ap-southeast-2.amazonaws.com/development/getProductOfferingMapping",
						),
					]);

				if (
					!resourceRes.ok ||
					!productRes.ok ||
					!offeringRes.ok
				) {
					throw new Error(
						"Failed to fetch one or more mappings.",
					);
				}

				const [resourceData, productData, offeringData] =
					await Promise.all([
						resourceRes.json(),
						productRes.json(),
						offeringRes.json(),
					]);
				console.log(resourceData.body);
				const parsedResourceData: ResourceServiceMappingData[] =
					JSON.parse(resourceData.body);

				console.log(parsedResourceData);

				// Step 1: Compute Service Health Status
				const statusToScore: Record<string, number> = {
					green: 1,
					yellow: 3,
					red: 7,
				};

				////////// RESOURCE HEALTH

				// Derive resource health data from parsedResourceData
				const derivedResourceHealthData =
					parsedResourceData.map((resource) => {
						const { resource_id, status } = resource;
						const resource_risk_status =
							status?.toLowerCase() || "unknown"; // Default to "unknown" if status is not defined
						return {
							resource_id,
							resource_risk_status,
						};
					});

				// Define score ranges to determine color
				const scoreToStatus = (averageScore: number) => {
					if (averageScore <= 3) return "green";
					if (averageScore <= 7) return "yellow";
					return "red";
				};

				// Aggregate by resource_id and calculate average score
				const aggregatedResourceHealthData = Array.from(
					derivedResourceHealthData.reduce(
						(acc, resource) => {
							const { resource_id, resource_risk_status } =
								resource;
							const score =
								statusToScore[
									resource_risk_status.toLowerCase()
								] || 1;

							if (!acc.has(resource_id)) {
								acc.set(resource_id, {
									totalScore: 0,
									count: 0,
								});
							}

							const resourceData = acc.get(resource_id);
							resourceData!.totalScore += score;
							resourceData!.count += 1;

							return acc;
						},
						new Map<
							string,
							{ totalScore: number; count: number }
						>(),
					),
				).map(([resource_id, { totalScore, count }]) => {
					const averageScore = totalScore / count;
					const resource_risk_status =
						scoreToStatus(averageScore);

					return { resource_id, resource_risk_status };
				});

				// Log the aggregated results
				console.log(
					"Aggregated Resource Health Data:",
					aggregatedResourceHealthData,
				);

				const serviceScores = parsedResourceData.reduce(
					(
						acc: Record<
							string,
							{ totalScore: number; resourceCount: number }
						>,
						resource,
					) => {
						const { service_id, status } = resource;
						const score =
							statusToScore[status!.toLowerCase()] || 1;

						if (!acc[service_id]) {
							acc[service_id] = {
								totalScore: 0,
								resourceCount: 0,
							};
						}

						acc[service_id].totalScore += score;
						acc[service_id].resourceCount += 1;

						return acc;
					},
					{},
				);

				////////// SERVICE HEALTH
				const derivedServiceHealthData = Object.entries(
					serviceScores,
				).map(
					([service_id, { totalScore, resourceCount }]) => {
						const averageScore = totalScore / resourceCount;
						let service_risk_status = "";
						console.log(
							service_id,
							totalScore,
							averageScore,
						);
						if (averageScore < 1.5) {
							service_risk_status = "green";
						} else if (
							averageScore >= 1.5 &&
							averageScore <= 2.5
						) {
							service_risk_status = "yellow";
						} else {
							service_risk_status = "red";
						}

						return {
							service_id,
							service_risk_status,
						};
					},
				);

				////////// PRODUCT HEALTH

				// Step 2: Compute Product Health Status Based on Services
				const parsedProductData: ProductServiceMappingData[] =
					Array.isArray(productData)
						? productData
						: Object.values(productData);

				const productScores = parsedProductData.reduce(
					(
						acc: Record<
							string,
							{ totalScore: number; serviceCount: number }
						>,
						product,
					) => {
						const { product_id, service_id } = product;
						const serviceHealth =
							derivedServiceHealthData.find(
								(h) => h.service_id === service_id,
							);

						if (!acc[product_id]) {
							acc[product_id] = {
								totalScore: 0,
								serviceCount: 0,
							};
						}

						if (serviceHealth) {
							const score =
								statusToScore[
									serviceHealth.service_risk_status
								];
							acc[product_id].totalScore += score;
							acc[product_id].serviceCount += 1;
						}

						return acc;
					},
					{},
				);

				const derivedProductHealthData = Object.entries(
					productScores,
				).map(
					([product_id, { totalScore, serviceCount }]) => {
						const averageScore = totalScore / serviceCount;
						let product_risk_status = "";
						console.log("PRODUCT");
						console.log(
							product_id,
							totalScore,
							averageScore,
						);
						if (averageScore < 1.5) {
							product_risk_status = "green";
						} else if (
							averageScore >= 1.5 &&
							averageScore <= 2.5
						) {
							product_risk_status = "yellow";
						} else {
							product_risk_status = "red";
						}

						return {
							product_id,
							product_risk_status,
						};
					},
				);

				////////// OFFERING HEALTH

				// Step 3: Compute Offering Health Status Based on Products
				const parsedOfferingData: ProductOfferingMappingData[] =
					Array.isArray(offeringData)
						? offeringData
						: Object.values(offeringData);

				const offeringScores = parsedOfferingData.reduce(
					(
						acc: Record<
							string,
							{ totalScore: number; productCount: number }
						>,
						offering,
					) => {
						const { offering_id, product_id } = offering;
						const productHealth =
							derivedProductHealthData.find(
								(h) => h.product_id === product_id,
							);

						if (!acc[offering_id]) {
							acc[offering_id] = {
								totalScore: 0,
								productCount: 0,
							};
						}

						if (productHealth) {
							const score =
								statusToScore[
									productHealth.product_risk_status
								];
							acc[offering_id].totalScore += score;
							acc[offering_id].productCount += 1;
						}

						return acc;
					},
					{},
				);

				const derivedOfferingHealthData = Object.entries(
					offeringScores,
				).map(
					([offering_id, { totalScore, productCount }]) => {
						const averageScore = totalScore / productCount;
						let offering_risk_status = "";
						console.log("OFFERING");
						console.log(
							offering_id,
							totalScore,
							averageScore,
						);

						if (averageScore < 1.5) {
							offering_risk_status = "green";
						} else if (
							averageScore >= 1.5 &&
							averageScore <= 2.5
						) {
							offering_risk_status = "yellow";
						} else {
							offering_risk_status = "red";
						}

						return {
							offering_id,
							offering_risk_status,
						};
					},
				);

				// console.log(parsedResourceData);

				// Update State
				setResourceMappingData(parsedResourceData);
				setProductMappingData(parsedProductData);
				setOfferingMappingData(parsedOfferingData);
				setResourceHealthData(aggregatedResourceHealthData);
				setServiceHealthData(derivedServiceHealthData);
				setProductHealthData(derivedProductHealthData);
				setOfferingHealthData(derivedOfferingHealthData);

				setError(null);
			} catch (err) {
				console.error("Error fetching data:", err);
				setError("Error fetching mapping data.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleNodeClick = (event: any, node: Node) => {
		handleSetSelectedNodeId(node.id);

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
				const healthStatus = healthOfferingData.find(
					(h) => {
						console.log(
							"Checking product_id:",
							h.offering_id,
						); // Logs each product_id
						return h.offering_id === offeringNodeId;
					},
				);

				const healthColor = healthStatus
					? healthStatus.offering_risk_status
					: "gray";

				nodes.push({
					id: offeringNodeId,
					data: {
						label: (
							<div
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
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
								{offeringNodeId}
							</div>
						),
					},
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
				const healthStatus = healthProductData.find((h) => {
					console.log("Checking product_id:", h.product_id); // Logs each product_id
					return h.product_id === productNodeId;
				});

				const healthColor = healthStatus
					? healthStatus.product_risk_status
					: "gray";

				nodes.push({
					id: productNodeId,
					data: {
						label: (
							<div
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
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
								{productNodeId}
							</div>
						),
					},
					position: {
						x: getXStart(productNodes.size) + index * xGap,
						y: yPositions.product,
					},
					style: {
						cursor: "pointer",
						borderColor: "black",
						boxShadow: highlightedNodes.has(productNodeId)
							? "0 0 15px 5px purple"
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
							? "purple"
							: "gray",
					strokeWidth:
						highlightedNodes.has(productNodeId) &&
						highlightedNodes.has(serviceNodeId)
							? 3
							: 1,
					boxShadow:
						highlightedNodes.has(productNodeId) &&
						highlightedNodes.has(serviceNodeId)
							? "0 0 15px purple"
							: "none",
				},
			});
		});

		// Create service nodes
		Array.from(serviceNodes).forEach(
			(serviceNodeId, index) => {
				const healthStatus = healthServiceData.find((h) => {
					console.log("Checking service_id:", h.service_id); // Logs each service_id
					console.log(h.service_id, h.service_risk_status);
					return h.service_id === serviceNodeId;
				});

				const healthColor = healthStatus
					? healthStatus.service_risk_status
					: "gray";

				console.log("Service Ids: ", serviceNodes);
				console.log(healthColor);

				nodes.push({
					id: serviceNodeId,
					data: {
						label: (
							<div
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
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
								{serviceNodeId}
							</div>
						),
					},
					position: {
						x: getXStart(serviceNodes.size) + index * xGap,
						y: yPositions.service,
					},
					style: {
						cursor: "pointer",
						borderColor: "black",
						boxShadow: highlightedNodes.has(serviceNodeId)
							? "0 0 15px 5px purple"
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
				source: serviceNodeId,
				target: resourceNodeId,
				type: "simplebezier",
				style: {
					stroke:
						highlightedNodes.has(resourceNodeId) &&
						highlightedNodes.has(serviceNodeId)
							? "purple"
							: "gray",
					strokeWidth:
						highlightedNodes.has(resourceNodeId) &&
						highlightedNodes.has(serviceNodeId)
							? 3
							: 1,
					boxShadow:
						highlightedNodes.has(resourceNodeId) &&
						highlightedNodes.has(serviceNodeId)
							? "0 0 15px purple"
							: "none",
				},
			});
		});

		// Create resource nodes with health status colored dots
		Array.from(resourceNodes).forEach(
			(resourceNodeId, index) => {
				const rowIndex = Math.floor(index / 10); // Every 5 items will start a new row
				const columnIndex = index % 10; // Position within the row

				// Find the corresponding health data for the resource node
				const healthStatus = healthResourceData.find(
					(h) => h.resource_id === resourceNodeId,
				);
				const healthColor = healthStatus
					? healthStatus.resource_risk_status
					: "gray";

				nodes.push({
					id: resourceNodeId,
					data: {
						label: (
							<div
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
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
						boxShadow: highlightedNodes.has(resourceNodeId)
							? `0 0 15px 5px purple`
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
		healthResourceData,
		healthServiceData,
		healthProductData,
		healthOfferingData,
	]);

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
