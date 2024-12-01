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

export default function ProfitabilityOptimizationTable() {
	// State to hold the fetched data
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [filters, setFilters] = useState({
		resource_id: "",
		period: "",
		new_service_id: "",
	});
	const [uniqueValues, setUniqueValues] = useState({
		resource_id: [],
		period: [],
		new_service_id: [],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Function to map status to color class
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
		async function fetchProfitabilityOptimizationTable() {
			try {
				const response = await fetch(
					"https://d9b890dlsg.execute-api.ap-southeast-2.amazonaws.com/development/getProfitabilityOptimizedTable",
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
					predicted_usage: parseFloat(
						item.predicted_usage,
					).toFixed(5),
					ideal_usage: parseFloat(item.ideal_usage).toFixed(
						5,
					),
					resource_optimized_usage: parseFloat(
						item.resource_optimized_usage,
					).toFixed(5),
					predicted_demand_percentage: parseFloat(
						item.predicted_demand_percentage,
					).toFixed(5),
					deviation_from_ideal_usage: parseFloat(
						item.deviation_from_ideal_usage,
					).toFixed(5),
				}));

				setData(formattedData);
				setFilteredData(formattedData);

				// Extract unique values for filters
				setUniqueValues({
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
					new_service_id: Array.from(
						new Set(
							formattedData.map(
								(item) => item.new_service_id,
							),
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

		fetchProfitabilityOptimizationTable();
	}, []);

	const handleFilterChange = (key, value) => {
		const newFilters = {
			...filters,
			[key]: value === "all" ? "" : value,
		};
		setFilters(newFilters);

		const newFilteredData = data.filter(
			(item) =>
				(newFilters.resource_id === "" ||
					item.resource_id === newFilters.resource_id) &&
				(newFilters.period === "" ||
					item.period === newFilters.period) &&
				(newFilters.new_service_id === "" ||
					item.new_service_id ===
						newFilters.new_service_id),
		);
		setFilteredData(newFilteredData);
	};

	return (
		<Card className="w-full mt-12">
			<CardHeader>
				<CardTitle className="text-2xl font-bold mb-3">
					Profitability Optimization Table
				</CardTitle>
				<div className="flex space-x-4 mt-4">
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
							handleFilterChange("new_service_id", value)
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="New Service ID" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								All Services
							</SelectItem>
							{uniqueValues.new_service_id.map((id) => (
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
					<Table className="table-fixed w-full border-collapse">
						<TableHeader>
							<TableRow>
								<TableHead>Resource ID</TableHead>
								<TableHead>Period</TableHead>
								<TableHead>Predicted Usage Ratio</TableHead>
								<TableHead>Ideal Usage Ratio</TableHead>
								<TableHead>
									Resource Optimized Usage Ratio
								</TableHead>
								<TableHead>New Service ID</TableHead>
								<TableHead>
									Predicted Demand Ratio
								</TableHead>
								<TableHead>
									Deviation from Ideal Usage
								</TableHead>
								<TableHead>
									Predicted Usage Risk Status
								</TableHead>
								<TableHead>
									Resource Optimized Usage Risk Status
								</TableHead>
								<TableHead>
									Predicted Usage Finance Status
								</TableHead>
								<TableHead>
									Resource Optimized Usage Finance Status
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredData.map((item, index) => (
								<TableRow key={index}>
									<TableCell>{item.resource_id}</TableCell>
									<TableCell>{item.period}</TableCell>
									<TableCell>
										{item.predicted_usage}
									</TableCell>
									<TableCell>{item.ideal_usage}</TableCell>
									<TableCell>
										{item.resource_optimized_usage}
									</TableCell>
									<TableCell>
										{item.new_service_id}
									</TableCell>
									<TableCell>
										{item.predicted_demand_percentage}
									</TableCell>
									<TableCell>
										{item.deviation_from_ideal_usage}
									</TableCell>
									<TableCell>
										<span
											className={getStatusColor(
												item.predicted_usage_risk_status,
											)}
										>
											{" "}
											{
												item.predicted_usage_risk_status
											}{" "}
										</span>
									</TableCell>
									<TableCell>
										<span
											className={getStatusColor(
												item.resource_optimized_usage_risk_status,
											)}
										>
											{" "}
											{
												item.resource_optimized_usage_risk_status
											}{" "}
										</span>
									</TableCell>
									<TableCell>
										<span
											className={getStatusColor(
												item.predicted_usage_finance_status,
											)}
										>
											{" "}
											{
												item.predicted_usage_finance_status
											}{" "}
										</span>
									</TableCell>
									<TableCell>
										<span
											className={getStatusColor(
												item.resource_optimized_usage_finance_status,
											)}
										>
											{" "}
											{
												item.resource_optimized_usage_finance_status
											}{" "}
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
