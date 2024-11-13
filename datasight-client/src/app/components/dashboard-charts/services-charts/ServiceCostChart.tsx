import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, LabelList
} from 'recharts';

export default function ServiceCostChart({ data }) {

    // Format data: Ensure total_service_revenue is a number
    const formattedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            total_service_cost: Number(item.total_service_cost)
        }));
    }, [data]);

    // Calculate the total revenue across all services
    const totalCost = useMemo(() => {
        return formattedData.reduce((acc, item) => acc + item.total_service_cost, 0);
    }, [formattedData]);

    return (
        <div className="chart-container">
            {/* Display the total revenue formatted as 000,000,000.00 */}
            <h2 className="text-sm">
                Current Cost: <span className='font-bold text-black'> $ {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                        dataKey="total_service_cost"
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
                    <Bar dataKey="total_service_cost" fill="#08296C" barSize={40}>
                        <LabelList
                            dataKey="total_service_cost"
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
