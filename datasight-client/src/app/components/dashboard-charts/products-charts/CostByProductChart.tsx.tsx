import {
    PieChart,
    Pie,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    Cell,
    Legend,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/service-components/chart";

// Define the data structure for the chart
interface DataItem {
    product_id: string; // The unique identifier for the product
    total_product_cost: number; // The total cost associated with the product
}

// Define the component props
interface CostByProductChartProps {
    data: DataItem[];
}

// Define color palette for the chart
const COLORS = [
    "#4B0082", "#2E8B57", "#B8860B", "#556B2F", "#4682B4",
    "#6A5ACD", "#2F4F4F", "#8B008B", "#8B4513", "#B22222",
    "#2F2F2F", "#8B0000", "#A0522D", "#483D8B", "#2B2B2B",
];

// Function to calculate percentage
const calculatePercentage = (value: number, total: number): string => {
    return ((value / total) * 100).toFixed(2); // Keep 2 decimal places
};

// Custom label renderer with percentage
const renderCustomLabel = ({
    name,
    value,
    total,
}: {
    name: string;
    value: number;
    total: number;
}): string => {
    const percentage = calculatePercentage(value, total);
    return `₱ ${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} (${percentage}%)`;
};

const CostByProductChart: React.FC<CostByProductChartProps> = ({ data }) => {
    // Sort the data by product_id
    const sortedData = [...data].sort((a, b) =>
        a.product_id.localeCompare(b.product_id)
    );

    // Calculate the total cost
    const totalCost = sortedData.reduce(
        (acc, entry) => acc + (entry.total_product_cost || 0),
        0
    );

    return (
        <ChartContainer
            config={{
                cost: { label: "Total Product Cost", color: "hsl(var(--chart-1))" },
            }}
            className="h-[410px] w-[600px]"
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={sortedData}
                        dataKey="total_product_cost"
                        nameKey="product_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={160}
                        label={(props) =>
                            renderCustomLabel({ ...props, total: totalCost })
                        } // Add total to props
                        labelLine={{ stroke: "#8884d8", strokeWidth: 1 }}
                        style={{ fontSize: "9px", fontWeight: "bold" }}
                    >
                        {sortedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <ChartTooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const { product_id, total_product_cost } = payload[0].payload;
                                const percentage = calculatePercentage(
                                    total_product_cost,
                                    totalCost
                                );
                                return (
                                    <div
                                        style={{
                                            backgroundColor: "#fff",
                                            padding: "8px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        <p>
                                            <strong>{product_id}</strong>
                                        </p>
                                        <p>
                                            Cost: ₱
                                            {total_product_cost.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </p>
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
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                        payload={sortedData.map((entry, index) => ({
                            id: entry.product_id,
                            type: "square",
                            value: `${entry.product_id}`,
                            color: COLORS[index % COLORS.length],
                        }))}
                    />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};

export default CostByProductChart;
