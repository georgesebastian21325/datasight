import { PieChart, Pie, Tooltip as ChartTooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";

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
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${percentage}%)`;
};

function CostByResourceTypeChart({ data }) {
    // Calculate the total cost
    const totalCost = data.reduce((acc, entry) => acc + entry.total_resource_cost, 0);

    // Pass total cost to the custom label
    return (
        <ChartContainer config={{ cost: { label: "Total Resource Cost", color: "hsl(var(--chart-1))" } }} className="h-[410px]">
            <ResponsiveContainer width="100%" height="200%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="total_resource_cost"
                        nameKey="resource_type"
                        cx="45%"
                        cy="50%"
                        outerRadius={150}
                        label={(props) => renderCustomLabel({ ...props, total: totalCost })} // Add total to props
                        labelLine={{ stroke: '#8884d8', strokeWidth: 1 }} // Make label lines more visible
                        style={{ fontSize: '9px', fontWeight: 'bold' }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{
                        bottom: -20, // Adjusts the distance from the bottom of the container
                        left: '45%', // Centers horizontally
                        transform: 'translateX(-50%)', // Centers the legend accurately
                    }} />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default CostByResourceTypeChart;
