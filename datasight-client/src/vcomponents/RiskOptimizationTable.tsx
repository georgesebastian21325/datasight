"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/vcomponents/risk-optimization-table-components/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/vcomponents/risk-optimization-table-components/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/vcomponents/risk-optimization-table-components/table";

export default function RiskOptimizationTable() {
	// State to hold the fetched data
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [filters, setFilters] = useState({
		service_id: "",
		resource_id: "",
		period: "",
	});
	const [uniqueValues, setUniqueValues] = useState({
		service_id: [],
		resource_id: [],
		period: [],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case "green":
				return "bg-green-200 text-green-800 px-2 py-1 rounded-full ";
			case "yellow":
				return "bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full ";
			case "red":
				return "bg-red-200 text-red-800 px-4 py-1 rounded-full";
			default:
				return "";
		}
	};

	// Fetch data from the endpoint when the component mounts
	useEffect(() => {
		async function fetchRiskOptimizationTable() {
			try {
				const response = await fetch(
					"https://d9b890dlsg.execute-api.ap-southeast-2.amazonaws.com/development/getRiskOptimizedTable",
				);
				if (!response.ok)
					throw new Error(`Error: ${response.statusText}`);

				const data = await response.json();
				// Assuming the response data is in the correct format
				const bodyData = data.body
					? JSON.parse(data.body)
					: data;

				// Format the fetched data
				const formattedData = bodyData.map((item) => ({
					...item,
					predicted_usage_percentage: parseFloat(
						item.predicted_usage_percentage,
					).toFixed(5),
					distributed_utilization_percentage: parseFloat(
						item.distributed_utilization_percentage,
					).toFixed(5),
				}));

				setData(formattedData);
				setFilteredData(formattedData);

				// Extract unique values for filters
				setUniqueValues({
					service_id: Array.from(
						new Set(
							formattedData.map((item) => item.service_id),
						),
					),
					resource_id: Array.from(
						new Set(
							formattedData.map((item) => item.resource_id),
						),
					),
					period: Array.from(
						new Set(
							formattedData.map((item) => item.period),
						),
					),
				});

				setLoading(false);
			} catch (error) {
				console.error("Fetch Error:", error);
				setError(
					"Failed to fetch data. Please try again later.",
				);
				setLoading(false);
			}
		}

		fetchRiskOptimizationTable();
	}, []);

	const handleFilterChange = (key, value) => {
		const newFilters = {
			...filters,
			[key]: value === "all" ? "" : value,
		};
		setFilters(newFilters);

		const newFilteredData = data.filter(
			(item) =>
				(newFilters.service_id === "" ||
					item.service_id === newFilters.service_id) &&
				(newFilters.resource_id === "" ||
					item.resource_id === newFilters.resource_id) &&
				(newFilters.period === "" ||
					item.period === newFilters.period),
		);
		setFilteredData(newFilteredData);
	};

	return (
		<Card className="w-full mt-12">
			<CardHeader>
				<CardTitle className="text-2xl font-bold mb-3">
					Risk Optimization Table
				</CardTitle>
				<div className="flex space-x-4 mt-4">
					<Select
						onValueChange={(value) =>
							handleFilterChange("service_id", value)
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Service ID" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								All Services
							</SelectItem>
							{uniqueValues.service_id.map((id) => (
								<SelectItem
									key={id}
									value={id}
								>
									{id}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						onValueChange={(value) =>
							handleFilterChange("resource_id", value)
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Resource ID" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								All Resources
							</SelectItem>
							{uniqueValues.resource_id.map((id) => (
								<SelectItem
									key={id}
									value={id}
								>
									{id}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						onValueChange={(value) =>
							handleFilterChange("period", value)
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Period" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								All Periods
							</SelectItem>
							{uniqueValues.period.map((period) => (
								<SelectItem
									key={period}
									value={period}
								>
									{period}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<p>Loading data...</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Service ID</TableHead>
								<TableHead>Resource ID</TableHead>
								<TableHead>Period</TableHead>
								<TableHead>Predicted Usage %</TableHead>
								<TableHead>Current Status</TableHead>
								<TableHead>
									Distributed Utilization %
								</TableHead>
								<TableHead>Optimized Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredData.map((item, index) => (
								<TableRow key={index}>
									<TableCell>{item.service_id}</TableCell>
									<TableCell>{item.resource_id}</TableCell>
									<TableCell>{item.period}</TableCell>
									<TableCell>
										{item.predicted_usage_percentage}%
									</TableCell>
									<TableCell>
										<span
											className={getStatusColor(
												item.current_status,
											)}
										>
											{" "}
											{item.current_status}{" "}
										</span>
									</TableCell>
									<TableCell>
										{
											item.distributed_utilization_percentage
										}
										%
									</TableCell>
									<TableCell>
										<span
											className={getStatusColor(
												item.optimized_status,
											)}
										>
											{" "}
											{item.optimized_status}{" "}
										</span>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
