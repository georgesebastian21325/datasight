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

function OfferingRevenueForecastChart({ data }) {
    // Helper to map month numbers to names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Format the data and ensure proper parsing
    const formattedData = data.map((item) => {
        const [year, month] = item.month_year ? item.month_year.split('-') : [null, null];
        const monthName = month ? monthNames[parseInt(month, 10) - 1] : '';
        return {
            ...item,
            offering_id: item.offering_id ? item.offering_id.trim() : '',
            month_year: item.month_year ? `${monthName} ${year}` : '',
            year: year ? parseInt(year, 10) : null,
            monthName,
            offering_revenue: parseFloat(item.offering_revenue || 0),
            predicted_revenue: parseFloat(item.predicted_revenue || 0),
            forecast_revenue: parseFloat(item.forecast_revenue || 0),
        };
    }).filter(item => item.offering_id && item.month_year); // Filter out invalid entries

    // Get unique offering IDs and month-year options for filtering
    const offeringIds = [...new Set(formattedData.map((item) => item.offering_id))];
    const monthYearOptions = [...new Set(formattedData.map((item) => item.month_year))].sort((a, b) => new Date(a) - new Date(b));

    // State for selected filters
    const [selectedOfferingId, setSelectedOfferingId] = useState(offeringIds[0] || '');
    const [startDate, setStartDate] = useState(monthYearOptions[0] || '');
    const [endDate, setEndDate] = useState(monthYearOptions[monthYearOptions.length - 1] || '');

    // Filter data by selected offering ID and date range
    const filteredData = formattedData.filter((item) => {
        const itemDate = new Date(item.month_year);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (
            item.offering_id === selectedOfferingId &&
            (!startDate || itemDate >= start) &&
            (!endDate || itemDate <= end)
        );
    });

    // Sort data by month_year for proper rendering
    filteredData.sort((a, b) => new Date(a.month_year) - new Date(b.month_year));

    return (
        <div style={{ margin: '2rem' }}>
            {/* Filters */}
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {/* Offering Filter */}
                <label htmlFor="offering-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    Select Offering ID:
                </label>
                <select
                    id="offering-filter"
                    value={selectedOfferingId}
                    onChange={(e) => setSelectedOfferingId(e.target.value)}
                    style={{ marginRight: '1rem' }}
                    className="border rounded p-2"
                >
                    {offeringIds.map((id) => (
                        <option key={id} value={id}>
                            {id}
                        </option>
                    ))}
                </select>

                {/* Start Date Filter */}
                <label htmlFor="start-date-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    Start Date:
                </label>
                <select
                    id="start-date-filter"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ marginRight: '1rem' }}
                    className="border rounded p-2"
                >
                    {monthYearOptions.map((date) => (
                        <option key={date} value={date}>
                            {date}
                        </option>
                    ))}
                </select>

                {/* End Date Filter */}
                <label htmlFor="end-date-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
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
                        dataKey="offering_revenue"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        name="Offering Revenue"
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

export default OfferingRevenueForecastChart;
