import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function AverageUtilizationChart({ data }) {
    // Get unique resource IDs for the dropdown
    const resourceIds = [...new Set(data.map((item) => item.resource_id))];
    const [selectedResourceId, setSelectedResourceId] = useState(resourceIds[0]);

    // Filter data for the selected resource ID
    const filteredData = data
        .filter((item) => item.resource_id === selectedResourceId)
        .map((item) => ({
            ...item,
            // Ensure month labels are consistent and sortable
            monthLabel: item.month,
            // Convert average utilization to a number between 0 and 100
            average_monthly_utilization_percentage: Math.min(
                Math.max(
                    isNaN(Number(item.average_monthly_utilization_percentage))
                        ? 0
                        : Number(item.average_monthly_utilization_percentage),
                    0
                ),
                100
            ),
        }));

    // Sort the filtered data by month
    filteredData.sort((a, b) => {
        // Assuming month format is 'MMMYY', e.g., 'M0121' for January 2021
        // Extract the numerical part for sorting
        const getMonthNumber = (monthStr) => parseInt(monthStr.slice(1), 10);
        return getMonthNumber(a.month) - getMonthNumber(b.month);
    });

    return (
        <div className="chart-container">
            {/* Dropdown to select the resource ID */}
            <div className="mb-4" style={{ textAlign: 'center' }}>
                <label htmlFor="resourceSelect" className="mr-2 font-bold">
                    Select Resource ID:
                </label>
                <select
                    id="resourceSelect"
                    value={selectedResourceId}
                    onChange={(e) => setSelectedResourceId(e.target.value)}
                    className="border rounded p-2"
                >
                    {resourceIds.map((id) => (
                        <option key={id} value={id}>
                            {id}
                        </option>
                    ))}
                </select>
            </div>

            {/* Line chart for the selected resource */}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={filteredData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }}
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* Reference lines at 50%, 75%, and 100% */}
                    <YAxis
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 12, fill: '#333' }}
                        style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }}
                    />
                    <XAxis dataKey="monthLabel" angle={-20} textAnchor="end" dy={10} />
                    <Tooltip
                        formatter={(value) => `${value}%`}
                        labelFormatter={(label) => `Month: ${label}`}
                        contentStyle={{ fontSize: 12, color: '#333' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="average_monthly_utilization_percentage"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
