import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OfferingCostChart({ data }) {
    // Calculate the total cost across all offerings
    const totalCost = useMemo(() => {
        return data.reduce((acc, item) => acc + Number(item.total_offering_cost), 0);
    }, [data]);

    return (
        <div className="chart-container">
            {/* Display the total cost formatted as 000,000,000.00 */}
            <h2 className="text-2xl font-bold mb-4">
                Total Offering Cost: ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>

            <ResponsiveContainer width="100%" height={400} className="py-5">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 10, right: 30, left: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="total_offering_cost"
                        tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <YAxis
                        type="category"
                        dataKey="offering_id"
                        width={80}
                    />
                    <Tooltip
                        formatter={(value) => `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        cursor={{ fill: '#f5f5f5' }}
                    />
                    <Bar dataKey="total_offering_cost" fill="red" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
