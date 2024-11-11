import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { offering_id: "OFF003", total_offering_cost: 4212452.492388888 },
    { offering_id: "OFF004", total_offering_cost: 3106052.0787555547 },
    { offering_id: "OFF001", total_offering_cost: 2394266.6394499997 },
    { offering_id: "OFF002", total_offering_cost: 2394266.6394499997 },
    { offering_id: "OFF005", total_offering_cost: 1702413.3670055552 },
];

export default function OfferingCostChart() {
    // Calculate the total cost across all offerings
    const totalCost = useMemo(() => {
        return data.reduce((acc, item) => acc + item.total_offering_cost, 0);
    }, [data]);

    return (
        <div className="chart-container">
            {/* Display the total cost */}
            <h2 className="text-2xl font-bold mb-4">
                Total Offering Cost: ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="total_offering_cost"
                        tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    />
                    <YAxis
                        type="category"
                        dataKey="offering_id"
                        width={80}
                    />
                    <Tooltip
                        formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    />
                    <Bar dataKey="total_offering_cost" fill="#337AFF" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
