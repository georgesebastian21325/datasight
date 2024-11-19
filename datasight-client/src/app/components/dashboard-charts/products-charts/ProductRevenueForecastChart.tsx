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
    // Format the data and ensure proper parsing
    const formattedData = data.map((item) => ({
        ...item,
        product_id: item.product_id.trim(),
        month_year: item.month_year.trim(),
        year: parseInt(item.month_year.split('-')[0], 10),
        month: item.month_year.split('-')[1],
        total_product_revenue: parseFloat(item.total_product_revenue || 0),
        predicted_revenue: parseFloat(item.predicted_revenue || 0),
        forecast_revenue: parseFloat(item.forecast_revenue || 0),
    }));

    // Get unique product IDs, years, and months for filtering
    const productIds = [...new Set(formattedData.map((item) => item.product_id))];
    const years = [...new Set(formattedData.map((item) => item.year))].sort();

    // State for selected filters
    const [selectedProductId, setSelectedProductId] = useState(productIds[0] || '');
    const [startYear, setStartYear] = useState(years[0] || '');
    const [endYear, setEndYear] = useState(years[years.length - 1] || '');
    const [selectedMonth, setSelectedMonth] = useState('');

    // Filter data by selected product ID, date range, and month
    const filteredData = formattedData.filter((item) => {
        return (
            item.product_id === selectedProductId &&
            (!startYear || item.year >= startYear) &&
            (!endYear || item.year <= endYear) &&
            (!selectedMonth || item.month === selectedMonth)
        );
    });

    // Sort data by month_year for proper rendering
    filteredData.sort((a, b) => new Date(a.month_year) - new Date(b.month_year));

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
                >
                    {productIds.map((id) => (
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
                    {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((month) => (
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
