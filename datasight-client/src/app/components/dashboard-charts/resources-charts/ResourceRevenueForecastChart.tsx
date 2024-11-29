import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataItem {
  period: string; // Format: "YYYY-MM-DD"
  resource_id: string;
  predicted_demand_percentage: number;
  predicted_usage: number;
}

interface ResourceRevenueForecastChartProps {
  data: DataItem[];
}

const ResourceRevenueForecastChart: React.FC<ResourceRevenueForecastChartProps> = ({ data }) => {
  // Extract unique resource IDs
  const resourceIds = Array.from(new Set(data.map((item) => item.resource_id)));

  const [selectedResourceId, setSelectedResourceId] = useState(resourceIds[0] || "");

  // Format the period as "Month Year"
  const formattedData = data.map((item) => {
    const date = new Date(item.period);
    const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" });
    return { ...item, monthYear };
  });

  // Extract unique periods (month-year) and sort them
  const periods = Array.from(new Set(formattedData.map((item) => item.monthYear))).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const [startDate, setStartDate] = useState(periods[0] || "");
  const [endDate, setEndDate] = useState(periods[periods.length - 1] || "");

  // Filter data for the selected resource and date range
  const filteredData = formattedData.filter((item) => {
    const itemDate = new Date(item.monthYear);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (
      item.resource_id === selectedResourceId &&
      (!startDate || itemDate >= start) &&
      (!endDate || itemDate <= end)
    );
  });

  return (
    <div style={{ margin: "2rem" }}>
      {/* Filters */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        {/* Resource Filter */}
        <label htmlFor="resource-filter" style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
          Select Resource ID:
        </label>
        <select
          id="resource-filter"
          value={selectedResourceId}
          onChange={(e) => setSelectedResourceId(e.target.value)}
          style={{ marginRight: "1rem" }}
          className="border rounded p-2"
        >
          {resourceIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>

        {/* Start Date Filter */}
        <label htmlFor="start-date" style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
          Start Date:
        </label>
        <select
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: "1rem" }}
          className="border rounded p-2"
        >
          {periods.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>

        {/* End Date Filter */}
        <label htmlFor="end-date" style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
          End Date:
        </label>
        <select
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded p-2"
        >
          {periods.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={filteredData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="category"
            dataKey="monthYear"
            label={{ value: "Date", position: "insideBottom", offset: -10 }}
            style={{ fontSize: 12, fontWeight: "bold" }}
          />
          <YAxis
            type="number"
            label={{
              value: "Prediction Percentage",
              angle: -90,
              position: "insideLeft",
              offset: -10,
            }}
            tickFormatter={(value) => `${(value * 100).toFixed(2)}%`}
            style={{ fontSize: 12, fontWeight: "bold" }}
          />
          <Tooltip
            formatter={(value, name) => [`${(value as number) * 100}%`, name]}
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Legend verticalAlign="top" height={36} />

          {/* Line for Demand Prediction */}
          <Line
            type="monotone"
            dataKey="demand_percentage_prediction"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 2 }}
            name="Demand Prediction (%)"
          />
          {/* Line for Usage Prediction */}
          <Line
            type="monotone"
            dataKey="usage_percentage_prediction"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 2 }}
            name="Usage Prediction (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResourceRevenueForecastChart;
