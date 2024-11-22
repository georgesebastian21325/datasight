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

function ProductRevenueForecastChart({ data }) {
    // Helper to map month numbers to names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Format the data and ensure proper parsing
    const formattedData = data.map((item) => {
        const [year, month] = item.month_year.split('-');
        const monthName = monthNames[parseInt(month, 10) - 1]; // Map month to full name

        return {
            ...item,
            product_id: item.product_id.trim(),
            month_year: `${monthName} ${year}`, // Format as "Month Year"
            total_product_revenue: parseFloat(item.total_product_revenue || 0),
            predicted_revenue: parseFloat(item.predicted_revenue || 0),
            forecast_revenue: parseFloat(item.forecast_revenue || 0),
        };
    });

    // Get unique product IDs and month-year combinations for filtering
    const productIds = [...new Set(formattedData.map((item) => item.product_id))];
    const monthYears = [...new Set(formattedData.map((item) => item.month_year))].sort(
        (a, b) => new Date(a) - new Date(b) // Ensure months are sorted
    );

    // State for selected filters
    const [selectedProductId, setSelectedProductId] = useState(productIds[0]);
    const [startMonth, setStartMonth] = useState(monthYears[0]);
    const [endMonth, setEndMonth] = useState(monthYears[monthYears.length - 1]);

    // Filter data by selected product ID and month-year range
    const filteredData = formattedData.filter((item) => {
        const isWithinMonthRange =
            monthYears.indexOf(item.month_year) >= monthYears.indexOf(startMonth) &&
            monthYears.indexOf(item.month_year) <= monthYears.indexOf(endMonth);

        return item.product_id === selectedProductId && isWithinMonthRange;
    });

    return (
        <div style={{ margin: '2rem' }}>
            {/* Filters */}
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {/* Product Filter */}
                <label htmlFor="product-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                    Select Product ID:
                </label>
                <select
                    id="product-filter"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    style={{ marginRight: '1rem' }}
                    className="border rounded p-2"
                >
                    {productIds.map((id) => (
                        <option key={id} value={id}>
                            {id}
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
                    className="border rounded p-2"
                >
                    {monthYears.map((monthYear) => (
                        <option key={monthYear} value={monthYear}>
                            {monthYear}
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
                    className="border rounded p-2"
                >
                    {monthYears.map((monthYear) => (
                        <option key={monthYear} value={monthYear}>
                            {monthYear}
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
                        dataKey="total_product_revenue"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        name="Total Product Revenue"
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

export default ProductRevenueForecastChart;
