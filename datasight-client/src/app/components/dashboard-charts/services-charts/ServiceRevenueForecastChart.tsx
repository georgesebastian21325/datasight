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

// Define types for data item and props
type ServiceRevenueData = {
    service_id: string;
    month_year: string;
    total_service_revenue: string | number;
    predicted_revenue: string | number;
    forecast_revenue: string | number;
};

type ServiceRevenueForecastChartProps = {
    data: ServiceRevenueData[];
};

const ServiceRevenueForecastChart: React.FC<ServiceRevenueForecastChartProps> = ({ data }) => {
    // Helper to map month numbers to full month names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Format the data and ensure proper parsing
    const formattedData = data.map((item) => {
        const [year, month] = item.month_year.split('-');
        const monthName = monthNames[parseInt(month, 10) - 1];
        return {
            ...item,
            service_id: item.service_id.trim(),
            month_year: `${monthName} ${year}`, // Format as "Month Year"
            year: parseInt(year, 10),
            monthName,
            total_service_revenue: parseFloat(item.total_service_revenue as string) || 0,
            predicted_revenue: parseFloat(item.predicted_revenue as string) || 0,
            forecast_revenue: parseFloat(item.forecast_revenue as string) || 0,
        };
    });

    // Get unique service IDs and month-year options for filtering
    const serviceIds = Array.from(new Set(formattedData.map((item) => item.service_id)));
    const monthYearOptions = Array.from(new Set(formattedData.map((item) => item.month_year))).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // State for selected filters
    const [selectedServiceId, setSelectedServiceId] = useState<string>(serviceIds[0] || '');
    const [startDate, setStartDate] = useState<string>(monthYearOptions[0] || '');
    const [endDate, setEndDate] = useState<string>(monthYearOptions[monthYearOptions.length - 1] || '');

    // Filter data by selected service ID and date range
    const filteredData = formattedData.filter((item) => {
        const itemDate = new Date(item.month_year);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (
            item.service_id === selectedServiceId &&
            (!startDate || itemDate >= start) &&
            (!endDate || itemDate <= end)
        );
    });

    // Sort data by month_year for proper rendering
    filteredData.sort((a, b) => new Date(a.month_year).getTime() - new Date(b.month_year).getTime());

    return (
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            {/* Service Filter */}
            <label htmlFor="service-filter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                Select Service ID:
            </label>
            <select
                id="service-filter"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                style={{ marginRight: '1rem' }}
                className="border rounded p-2"
            >
                {serviceIds.map((id) => (
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
                    <Tooltip formatter={(value, name) => [`₱${value}`, name]} />
                    <Legend verticalAlign="top" height={36} />

                    {/* Lines for each metric */}
                    <Line
                        type="monotone"
                        dataKey="total_service_revenue"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        name="Total Service Revenue"
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
};

export default ServiceRevenueForecastChart;
