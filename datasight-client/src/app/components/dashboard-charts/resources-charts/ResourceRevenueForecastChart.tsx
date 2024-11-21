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
    // Helper to map month numbers to full month names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Format the data and ensure proper parsing
    const formattedData = data.map((item) => ({
        ...item,
        resource_id: item.resource_id.trim(),
        month_year: item.month_year.trim(),
        year: parseInt(item.month_year.split('-')[0], 10),
        month: item.month_year.split('-')[1],
        monthName: monthNames[parseInt(item.month_year.split('-')[1], 10) - 1], // Map month to full name
        total_resource_revenue: parseFloat(item.total_resource_revenue || 0),
        predicted_revenue: parseFloat(item.predicted_revenue || 0),
        forecast_revenue: parseFloat(item.forecast_revenue || 0),
    }));

    // Get unique resource IDs, years, and months for filtering
    const resourceIds = [...new Set(formattedData.map((item) => item.resource_id))];
    const years = [...new Set(formattedData.map((item) => item.year))].sort();
    const months = monthNames; // Use monthNames directly for dropdowns

    // State for selected filters
    const [selectedResourceId, setSelectedResourceId] = useState(resourceIds[0] || '');
    const [startYear, setStartYear] = useState(years[0] || '');
    const [endYear, setEndYear] = useState(years[years.length - 1] || '');
    const [startMonth, setStartMonth] = useState(months[0] || ''); // Default to January
    const [endMonth, setEndMonth] = useState(months[months.length - 1] || ''); // Default to December

    // Filter data by selected resource ID, date range, and month range
    const filteredData = formattedData.filter((item) => {
        const isWithinYearRange =
            (!startYear || item.year >= startYear) && (!endYear || item.year <= endYear);
        const isWithinMonthRange =
            (!startMonth || monthNames.indexOf(item.monthName) >= monthNames.indexOf(startMonth)) &&
            (!endMonth || monthNames.indexOf(item.monthName) <= monthNames.indexOf(endMonth));

        return item.resource_id === selectedResourceId && isWithinYearRange && isWithinMonthRange;
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

                {/* Start Year Filter */}
                <label htmlFor="start-year-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    Start Year:
                </label>
                <select
                    id="start-year-filter"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
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
                    onChange={(e) => setEndYear(e.target.value)}
                    style={{ marginRight: '1rem' }}
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                {/* Start Month Filter */}
                <label htmlFor="start-month-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    Start Month:
                </label>
                <select
                    id="start-month-filter"
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    style={{ marginRight: '1rem' }}
                >
                    {months.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>

                {/* End Month Filter */}
                <label htmlFor="end-month-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    End Month:
                </label>
                <select
                    id="end-month-filter"
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                >
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
