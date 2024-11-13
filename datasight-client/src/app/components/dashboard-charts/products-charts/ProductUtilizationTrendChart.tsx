import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductUtilizationTrendChart({ data }) {
    // Get unique product IDs for the dropdown
    const productIds = [...new Set(data.map(item => item.product_id))];
    const [selectedProduct, setSelectedProduct] = useState(productIds[0]);

    // Filter data for the selected product
    const filteredData = data
        .filter(item => item.product_id === selectedProduct)
        .map(item => ({
            ...item,
            month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            monthly_avg_usage_percentage: Number(item.monthly_avg_usage_percentage),
        }));

    return (
        <div className="chart-container">
            {/* Dropdown to select the product ID */}
            <div className="mb-4">
                <label htmlFor="productSelect" className="mr-2 font-bold">Select Product:</label>
                <select
                    id="productSelect"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="border rounded p-2"
                >
                    {productIds.map(id => (
                        <option key={id} value={id}>
                            {id}
                        </option>
                    ))}
                </select>
            </div>

            {/* Line chart for the selected product */}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }} style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }}>
                    <CartesianGrid strokeDasharray="3 3" style={{ fontSize: '12px', fontWeight: 'bold', fill: 'black' }}
 />
                    <XAxis dataKey="month" style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }}
 />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Line type="monotone" dataKey="monthly_avg_usage_percentage" stroke="#8884d8" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
