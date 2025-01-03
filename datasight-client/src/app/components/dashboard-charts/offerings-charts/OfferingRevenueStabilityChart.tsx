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

// Define the structure of a single data item
interface OfferingRevenueData {
    offering_id: string;
    date: string; // Date in string format
    daily_offering_revenue: number | string;
}

// Define the component props
interface OfferingRevenueStabilityChartProps {
    data: OfferingRevenueData[];
}

const OfferingRevenueStabilityChart: React.FC<OfferingRevenueStabilityChartProps> = ({ data }) => {
    // Get unique offering IDs for the dropdown
    const offeringIds: string[] = Array.from(new Set(data.map((item) => item.offering_id)));
    const [selectedOffering, setSelectedOffering] = useState<string>(offeringIds[0]);

    // Filter data for the selected offering and format the date and revenue
    const filteredData = data
        .filter((item) => item.offering_id === selectedOffering)
        .map((item) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            daily_offering_revenue: Number(item.daily_offering_revenue),
        }));

    return (
        <div className="chart-container">
            {/* Dropdown to select the offering ID */}
            <div className="mb-4">
                <label htmlFor="offeringSelect" className="mr-2 font-bold">
                    Select Offering:
                </label>
                <select
                    id="offeringSelect"
                    value={selectedOffering}
                    onChange={(e) => setSelectedOffering(e.target.value)}
                    className="border rounded p-2"
                >
                    {offeringIds.map((id) => (
                        <option key={id} value={id}>
                            {id}
                        </option>
                    ))}
                </select>
            </div>

            {/* Line chart for the selected offering */}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={filteredData}
                    margin={{ top: 20, right: 30, bottom: 20, left: 60 }}
                    style={{ fontSize: "9px", fontWeight: "bold" }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                        tickFormatter={(value) =>
                            `₱ ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        }
                    />
                    <Tooltip
                        formatter={(value) =>
                            `₱ ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="daily_offering_revenue"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OfferingRevenueStabilityChart;
