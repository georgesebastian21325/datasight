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

function ResourceRevenueForecastChart({ data }) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Format the data and ensure proper parsing
  const formattedData = data.map((item) => {
    const [year, month] = item.month_year.split("-");
    const monthName = monthNames[parseInt(month, 10) - 1];
    return {
      ...item,
      resource_id: item.resource_id.trim(),
      month_year: `${monthName} ${year}`, // Format as "Month Year"
      total_resource_revenue: parseFloat(item.total_resource_revenue || 0),
      predicted_revenue: parseFloat(item.predicted_revenue || 0),
      forecast_revenue: parseFloat(item.forecast_revenue || 0),
    };
  });

  // Extract unique resource IDs and sorted month-year options
  const resourceIds = [
    ...new Set(formattedData.map((item) => item.resource_id)),
  ];
  const monthYearOptions = [
    ...new Set(formattedData.map((item) => item.month_year)),
  ].sort((a, b) => new Date(a) - new Date(b));

  // Ensure valid default values
  const initialResourceId = resourceIds[0] || "";
  const initialStartDate = monthYearOptions[0] || "";
  const initialEndDate = monthYearOptions[monthYearOptions.length - 1] || "";

  // State for selected filters
  const [selectedResourceId, setSelectedResourceId] =
    useState(initialResourceId);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Filter data by selected resource ID and date range
  const filteredData = formattedData.filter((item) => {
    const itemDate = new Date(item.month_year);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (
      item.resource_id === selectedResourceId &&
      (!startDate || itemDate >= start) &&
      (!endDate || itemDate <= end)
    );
  });

  // Sort data by month_year for proper rendering
  filteredData.sort((a, b) => new Date(a.month_year) - new Date(b.month_year));

  return (
    <div style={{ margin: "2rem" }}>
      {/* Filters */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        {/* Resource Filter */}
        <label
          htmlFor="resource-filter"
          style={{ marginRight: "0.5rem", fontWeight: "bold" }}
        >
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
        <label
          htmlFor="start-date-filter"
          style={{ marginRight: "0.5rem", fontWeight: "bold" }}
        >
          Start Date:
        </label>
        <select
          id="start-date-filter"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: "1rem" }}
          className="border rounded p-2"
        >
          {monthYearOptions.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>

        {/* End Date Filter */}
        <label
          htmlFor="end-date-filter"
          style={{ marginRight: "0.5rem", fontWeight: "bold" }}
        >
          End Date:
        </label>
        <select
          id="end-date-filter"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded p-2"
        >
          {monthYearOptions.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={filteredData}
          margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month_year"
            label={{
              value: "Month-Year",
              position: "insideBottom",
              offset: -10,
            }}
            style={{ fontSize: 12, fontWeight: "bold" }}
          />
          <YAxis
            label={{
              value: "Revenue",
              angle: -90,
              position: "insideLeft",
              offset: -10,
            }}
            style={{ fontSize: 12, fontWeight: "bold" }}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />

          {/* Lines for each metric */}
          <Line
            type="monotone"
            dataKey="total_resource_revenue"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 2 }}
            name="Total Resource Revenue"
          />
          <Line
            type="monotone"
            dataKey="predicted_revenue"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 2 }}
            name="Predicted Revenue"
          />
          <Line
            type="monotone"
            dataKey="forecast_revenue"
            stroke="#ff7300"
            strokeWidth={2}
            dot={{ r: 2 }}
            name="Forecast Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ResourceRevenueForecastChart;
