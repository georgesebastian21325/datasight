"use client";

import { useGlobalState } from "../context/GlobalStateContext";
import React, {
	useState,
	useEffect,
	useCallback,
} from "react";

interface MetricRecord {
	resource_id: string;
	metric_type: string;
	week: string;
	average_metric_value: number;
}

interface GroupedData {
	[metric_type: string]: MetricRecord[];
}

export default function EntityGraphs() {
	const { selectedNodeId } = useGlobalState();
	const [groupedData, setGroupedData] = useState<Record<
		string,
		any
	> | null>(null);
	const resourceEntityAPI =
		"https://8i6i5nm7ba.execute-api.ap-southeast-2.amazonaws.com/development/getEntityMetrics";

	const handleFetchData = async () => {
		try {
			const response = await fetch(
				`${resourceEntityAPI}?resource_id=${selectedNodeId}`,
			);

			if (response.ok) {
				const result: MetricRecord[] =
					await response.json();

				const grouped = result.reduce(
					(acc: GroupedData, record: MetricRecord) => {
						const { metric_type } = record;
						if (!acc[metric_type]) {
							acc[metric_type] = [];
						}
						acc[metric_type].push(record);
						return acc;
					},
					{},
				);

				setGroupedData(grouped);
				console.log(grouped);
			} else {
				console.error(
					"Error fetching data:",
					response.statusText,
				);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		if (selectedNodeId) {
			handleFetchData();
		}
	}, [selectedNodeId]);

	return (
		<div className="bg-red-50">
			Hello
			{selectedNodeId}
		</div>
	);
}
