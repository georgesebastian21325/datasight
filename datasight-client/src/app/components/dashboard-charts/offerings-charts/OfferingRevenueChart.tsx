import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OfferingRevenueChart({ data }) {
    // Calculate the total cost across all offerings
    const totalRevenue = useMemo(() => {
        return data.reduce((acc, item) => acc + Number(item.total_offering_revenue), 0);
    }, [data]);

    return (
        <div className="chart-container">
            {/* Display the total cost formatted as 000,000,000.00 */}
            <h2 className="text-sm">
                Current Revenue: <span className='font-bold text-green-900'>  $ {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </h2>

            <ResponsiveContainer width="100%" height={400} className="py-5">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 10, right: 20, left: -30 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="total_offering_revenue"
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
                    <Bar dataKey="total_offering_revenue" fill="green" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
