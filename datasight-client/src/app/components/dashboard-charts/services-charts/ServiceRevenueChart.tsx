import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, LabelList
} from 'recharts';

export default function ServiceRevenueChart({ data }) {

    // Format data: Ensure total_service_revenue is a number
    const formattedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            total_service_revenue: Number(item.total_service_revenue)
        }));
    }, [data]);

    // Calculate the total revenue across all services
    const totalRevenue = useMemo(() => {
        return formattedData.reduce((acc, item) => acc + item.total_service_revenue, 0);
    }, [formattedData]);

    return (
        <div className="chart-container">
            {/* Display the total revenue formatted as 000,000,000.00 */}
            <h2 className="text-sm">
                Current Revenue: <span className='font-bold text-black'> $ {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </h2>

            <ResponsiveContainer width="100%" height={400} className="py-5">
                <BarChart
                    layout="vertical"
                    data={formattedData}
                    margin={{ top: 10, right: 20, left: -30 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="total_service_revenue"
                        tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        style={{ fontSize: '12px', fontWeight: 'bold', fill: 'black' }}
                    />
                    <YAxis
                        type="category"
                        dataKey="service_id"
                        width={80}
                        style={{ fontSize: '12px', fontWeight: 'bold', fill: 'black' }}
                    />
                    <Tooltip
                        formatter={(value) => `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        cursor={{ fill: '#f5f5f5' }}
                    />
                    <Bar dataKey="total_service_revenue" fill="purple" barSize={40}>
                        <LabelList
                            dataKey="total_service_revenue"
                            position="right"
                            formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            style={{ fontSize: '12px', fontWeight: 'bold', fill: 'black' }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
