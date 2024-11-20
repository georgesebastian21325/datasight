import React, { useState } from 'react';
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
    ReferenceLine
} from 'recharts';

function AverageUtilizationChart({ data }) {
    // Format the data and ensure utilization percentage is valid
    const formattedData = data.map((item) => ({
        ...item,
        resource_id: item.resource_id.trim().toUpperCase(),
        resource_type: item.resource_type.trim(),
        month: item.month.trim().toUpperCase(),
        year: parseInt(item.year.replace("Y", ""), 10), // Convert year from "Y202X" to numeric
        avg_monthly_resource_utilization: Math.min(
            Math.max(
                parseFloat(item.avg_monthly_resource_utilization || 0),
                0
            ),
            100
        ),
    }));

    // Get unique resource IDs and years for filtering
    const resourceIds = [...new Set(formattedData.map((item) => item.resource_id))];
    const years = [...new Set(formattedData.map((item) => item.year))].sort((a, b) => a - b);

    const [selectedResourceId, setSelectedResourceId] = useState(resourceIds[0] || '');
    const [startYear, setStartYear] = useState(years[0] || 0);
    const [endYear, setEndYear] = useState(years[years.length - 1] || 0);

    // Filter data based on the selected resource ID and year range
    const filteredData = formattedData.filter(
        (item) =>
            item.resource_id === selectedResourceId &&
            item.year >= startYear &&
            item.year <= endYear
    );

    // Prepare data for the chart
    const dataByMonth = filteredData.map((item) => ({
        month: item.month,
        year: item.year,
        avg_monthly_resource_utilization: item.avg_monthly_resource_utilization,
    }));

    // Sort the data by year and month
    dataByMonth.sort((a, b) => {
        const parseDate = (item) =>
            new Date(item.year, parseInt(item.month.slice(1, 3), 10) - 1).getTime();
        return parseDate(a) - parseDate(b);
    });

    return (
        <ChartContainer
            config={{ cost: { label: "Average Monthly Utilization by Resource ID", color: "hsl(var(--chart-1))" } }}
            className="h-[500px] w-[1300px] py-[3rem]"
        >
            {/* Filters */}
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {/* Resource ID Filter */}
                <label htmlFor="resource-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    Select Resource ID:
                </label>
                <select
                    id="resource-filter"
                    value={selectedResourceId}
                    onChange={(e) => setSelectedResourceId(e.target.value)}
                    style={{ marginRight: '1rem' }}
                >
                    {resourceIds.map((id) => (
                        <option key={id} value={id}>
                            {id}
                        </option>
                    ))}
                </select>

                {/* Start Year Filter */}
                <label htmlFor="start-year-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    Start Year:
                </label>
                <select
                    id="start-year-filter"
                    value={startYear}
                    onChange={(e) => setStartYear(Number(e.target.value))}
                    style={{ marginRight: '1rem' }}
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                {/* End Year Filter */}
                <label htmlFor="end-year-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    End Year:
                </label>
                <select
                    id="end-year-filter"
                    value={endYear}
                    onChange={(e) => setEndYear(Number(e.target.value))}
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <LineChart data={dataByMonth} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
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
                        style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }}
                    />
                    <XAxis
                        dataKey="month"
                        tickFormatter={(month, index) => `${month} ${dataByMonth[index]?.year}`}
                        style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }}
                        angle={-20}
                        textAnchor="end"
                        dy={10}
                    />
                    <Tooltip
                        formatter={(value) => `${value}%`}
                        contentStyle={{ fontSize: 12, color: "#333" }}
                        labelFormatter={(label) => {
                            // Find the corresponding entry in dataByMonth
                            const matchedEntry = dataByMonth.find((item) => item.month === label);
                            return matchedEntry
                                ? `Month: ${matchedEntry.month} ${matchedEntry.year}`
                                : `Month: ${label}`;
                        }}
                    />


                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{
                            bottom: -20,
                            left: '45%',
                            transform: 'translateX(-41%)'
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="avg_monthly_resource_utilization"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        name={selectedResourceId}
                        connectNulls={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default AverageUtilizationChart;
