import React, { useState } from "react";
import { ChartContainer } from "@/vcomponents/dashboard-ui/resource-components/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

const SERVICE_COLORS = {
  SVC0001: "#3D2B1F", // Dark brown
  SVC0002: "#2F4858", // Dark slate blue
  SVC0003: "#4A235A", // Dark purple
  SVC0004: "#1B4F72", // Dark steel blue
  SVC0005: "#2C3E50", // Dark teal
};

// Helper function to generate an array of month-year strings
const generateMonthYearOptions = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options = [];
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

  while (start <= end) {
    options.push(`${monthNames[start.getMonth()]} ${start.getFullYear()}`);
    start.setMonth(start.getMonth() + 1);
  }
  return options;
};

function ServiceUtilTrendLineChart({ data }) {
  // Extract unique service IDs for dropdown options and sort them in ascending order
  const serviceIds = [...new Set(data.map((item) => item.service_id))].sort();

  // Extract unique date range for filtering
  const rawDates = data.map((item) => new Date(item.date));
  const minDate = new Date(Math.min(...rawDates));
  const maxDate = new Date(Math.max(...rawDates));

  // Generate month-year options
  const monthYearOptions = generateMonthYearOptions(minDate, maxDate);

  // Initialize state with default values
  const [selectedService, setSelectedService] = useState("SVC0001"); // Default to "SVC0001"
  const [startMonth, setStartMonth] = useState(monthYearOptions[0]); // Default to the earliest month-year
  const [endMonth, setEndMonth] = useState(
    monthYearOptions[monthYearOptions.length - 1]
  ); // Default to the latest month-year

  // Filter data based on the selected service and month-year range
  const filteredData = data
    .filter((item) => item.service_id === selectedService)
    .filter((item) => {
      const itemMonthYear = `${new Date(item.date).toLocaleString("default", {
        month: "long",
      })} ${new Date(item.date).getFullYear()}`;
      return (
        monthYearOptions.indexOf(itemMonthYear) >=
          monthYearOptions.indexOf(startMonth) &&
        monthYearOptions.indexOf(itemMonthYear) <=
          monthYearOptions.indexOf(endMonth)
      );
    })
    .map((item) => ({
      ...item,
      date: new Date(item.date).toISOString().split("T")[0], // Format date as "YYYY-MM-DD"
      avg_daily_service_utilization: Math.min(
        Math.max(
          isNaN(item.avg_daily_service_utilization)
            ? 0
            : item.avg_daily_service_utilization,
          0
        ),
        100
      ),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure dates are sorted in ascending order

  // Calculate the average utilization
  const averageUtilization =
    filteredData.reduce(
      (sum, item) => sum + item.avg_daily_service_utilization,
      0
    ) / (filteredData.length || 1); // Avoid division by zero

  // Determine the color of the average utilization line
  const averageLineColor =
    averageUtilization <= 50
      ? "green"
      : averageUtilization <= 70
      ? "yellow"
      : "red";

  return (
    <ChartContainer
      config={{
        cost: {
          label: "Service Utilization Trend",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[500px] w-[1300px] py-[3rem]"
    >
      {/* Filters */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        {/* Service ID Filter */}
        <label
          htmlFor="service-filter"
          style={{ marginRight: "0.5rem", fontWeight: "bold" }}
        >
          Select Service ID:
        </label>
        <select
          id="service-filter"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          style={{ marginRight: "1rem" }}
          className="border rounded p-2"
        >
          {serviceIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>

        {/* Start Month Filter */}
        <label
          htmlFor="start-month-filter"
          style={{ marginRight: "0.5rem", fontWeight: "bold" }}
        >
          Start Date:
        </label>
        <select
          id="start-month-filter"
          value={startMonth}
          onChange={(e) => setStartMonth(e.target.value)}
          style={{ marginRight: "1rem" }}
          className="border rounded p-2"
        >
          {monthYearOptions.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        {/* End Month Filter */}
        <label
          htmlFor="end-month-filter"
          style={{ marginRight: "0.5rem", fontWeight: "bold" }}
        >
          End Date:
        </label>
        <select
          id="end-month-filter"
          value={endMonth}
          onChange={(e) => setEndMonth(e.target.value)}
          className="border rounded p-2"
        >
          {monthYearOptions.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={filteredData} margin={{ right: 70 }}>
          <CartesianGrid strokeDasharray="3 3" />

          {/* Reference lines at 50%, 75%, and 100% */}
          <ReferenceLine
            y={100}
            stroke="red"
            strokeDasharray="3 3"
            strokeWidth={1}
            label={{ position: "insideTopRight", fill: "#555", value: "100%" }}
          />
          <ReferenceLine
            y={75}
            stroke="orange"
            strokeDasharray="3 3"
            strokeWidth={1}
            label={{ position: "insideTopRight", fill: "#555", value: "75%" }}
          />
          <ReferenceLine
            y={50}
            stroke="green"
            strokeDasharray="3 3"
            strokeWidth={1}
            label={{ position: "insideTopRight", fill: "#555", value: "50%" }}
          />

          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 12, fill: "#333" }}
            style={{ fontSize: "9px", fontWeight: "bold", fill: "black" }}
          />
          <XAxis
            dataKey="date"
            style={{ fontSize: "9px", fontWeight: "bold", fill: "black" }}
            angle={-20}
            textAnchor="end"
            dy={10}
          />
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{ fontSize: 12, color: "#333" }}
            labelFormatter={(label) => `Month: ${label}`}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              bottom: -20,
              left: "45%",
              transform: "translateX(-41%)",
            }}
          />

          <Line
            type="monotone"
            dataKey="avg_daily_service_utilization"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 2 }}
            name={selectedService}
            connectNulls={true}
          />

          <ReferenceLine
            y={averageUtilization}
            stroke={averageLineColor}
            label={{
              position: "right",
              value: `${averageUtilization.toFixed(2)}%`,
              fill: averageLineColor,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default ServiceUtilTrendLineChart;
