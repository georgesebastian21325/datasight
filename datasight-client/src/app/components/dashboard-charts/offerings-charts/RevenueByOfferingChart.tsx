import { PieChart, Pie, Tooltip as ChartTooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ChartContainer } from "@/vcomponents/dashboard-ui/service-components/chart";

const COLORS = [
    "#4B0082", "#2E8B57", "#B8860B", "#556B2F", "#4682B4",
    "#6A5ACD", "#2F4F4F", "#8B008B", "#8B4513", "#B22222",
    "#2F2F2F", "#8B0000", "#A0522D", "#483D8B", "#2B2B2B"
];

// Function to calculate percentage
function calculatePercentage(value, total) {
    return ((value / total) * 100).toFixed(2); // Keep 2 decimal places
}

// Custom label renderer with percentage
const renderCustomLabel = ({ name, value, total }) => {
    const percentage = calculatePercentage(value, total);
    return ` $${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${percentage}%)`;
};

function RevenueByOfferingChart({ data }) {
    // Sort the data by offering_id
    const sortedData = [...data].sort((a, b) => a.offering_id.localeCompare(b.offering_id));

    // Calculate the total revenue
    const totalRevenue = sortedData.reduce((acc, entry) => acc + (entry.total_offering_revenue || 0), 0);

    return (
        <ChartContainer config={{ revenue: { label: "Total Offering Revenue", color: "hsl(var(--chart-2))" } }} className="h-[410px] w-[600px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={sortedData}
                        dataKey="total_offering_revenue"
                        nameKey="offering_id"
                        cx="50%"
                        cy="60%"
                        outerRadius={160}
                        label={(props) => renderCustomLabel({ ...props, total: totalRevenue })} // Add total to props
                        labelLine={{ stroke: '#8884d8', strokeWidth: 1 }}
                        style={{ fontSize: '9px', fontWeight: 'bold' }}
                    >
                        {sortedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <ChartTooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const { offering_id, total_offering_revenue } = payload[0].payload;
                                const percentage = calculatePercentage(total_offering_revenue, totalRevenue);
                                return (
                                    <div style={{ backgroundColor: "#fff", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}>
                                        <p><strong>{offering_id}</strong></p>
                                        <p>Revenue: ${total_offering_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                        <p>Percentage: {percentage}%</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{
                            bottom: -20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                        payload={sortedData.map((entry, index) => ({
                            id: entry.offering_id,
                            type: "square",
                            value: `${entry.offering_id}`,
                            color: COLORS[index % COLORS.length],
                        }))}
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default RevenueByOfferingChart;
