import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

function ResourceRevenueForecastChart({ data }) {
    // Format the data and ensure proper parsing
    const formattedData = data.map((item) => ({
        ...item,
        resource_id: item.resource_id.trim(),
        month_year: item.month_year.trim(),
        year: item.month_year.split('-')[0],
        month: item.month_year.split('-')[1],
        total_resource_revenue: parseFloat(item.total_resource_revenue || 0),
        predicted_revenue: parseFloat(item.predicted_revenue || 0),
        forecast_revenue: parseFloat(item.forecast_revenue || 0),
    }));

    // Get unique resource IDs, years, and months for filtering
    const resourceIds = [...new Set(formattedData.map((item) => item.resource_id))];
    const years = [...new Set(formattedData.map((item) => item.year))];
    const months = [...new Set(formattedData.map((item) => item.month))];

    // State for selected filters
    const [selectedResourceId, setSelectedResourceId] = useState(resourceIds[0] || '');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    // Filter data by selected resource ID, year, and month
    const filteredData = formattedData.filter((item) => {
        return (
            item.resource_id === selectedResourceId &&
            (!selectedYear || item.year === selectedYear) &&
            (!selectedMonth || item.month === selectedMonth)
        );
    });

    // Sort data by month_year for proper rendering
    filteredData.sort((a, b) => new Date(a.month_year) - new Date(b.month_year));

    return (
        <div style={{ margin: '2rem' }}>
            {/* Filters */}
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {/* Resource Filter */}
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

                {/* Year Filter */}
                <label htmlFor="year-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    Select Year:
                </label>
                <select
                    id="year-filter"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{ marginRight: '1rem' }}
                >
                    <option value="">All Years</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                {/* Month Filter */}
                <label htmlFor="month-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    Select Month:
                </label>
                <select
                    id="month-filter"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="">All Months</option>
                    {months.map((month) => (
                        <option key={month} value={month}>
                            {month}
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
                        label={{ value: 'Month-Year', position: 'insideBottom', offset: -10 }}
                        style={{ fontSize: 12, fontWeight: 'bold' }}
                    />
                    <YAxis
                        label={{
                            value: 'Revenue',
                            angle: -90,
                            position: 'insideLeft',
                            offset: -10,
                        }}
                        style={{ fontSize: 12, fontWeight: 'bold' }}
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
