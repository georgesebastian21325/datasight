import {
  PieChart,
  Pie,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/vcomponents/dashboard-ui/resource-components/chart";

// Define color palette for consistent styling
const COLORS = [
  "#4B0082", // Backup and Recovery Systems
  "#2E8B57", // Cloud Infrastructure
  "#B8860B", // Communication Infrastructure
  "#556B2F", // Computer
  "#4682B4", // Network Equipment
  "#6A5ACD", // Server
  "#2F4F4F", // Storage Device
  "#8B008B", // Virtual Infrastructure
];

// Map resource types to colors
const RESOURCE_COLORS = {
  "Backup and Recovery Systems": COLORS[0],
  "Cloud Infrastructure": COLORS[1],
  "Communication Infrastructure": COLORS[2],
  Computer: COLORS[3],
  "Network Equipment": COLORS[4],
  Server: COLORS[5],
  "Storage Device": COLORS[6],
  "Virtual Infrastructure": COLORS[7],
};

// Custom label for Pie chart with percentage
function renderCustomLabel({ name, value, total }) {
  const percentage = ((value / total) * 100).toFixed(2); // Calculate percentage
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} (${percentage}%)`;
}

function RevenueByResourceTypeChart({ data }) {
  // Calculate the total revenue for percentage calculation
  const totalRevenue = data.reduce(
    (acc, entry) => acc + entry.total_resource_revenue,
    0
  );

  return (
    <ChartContainer
      config={{
        cost: { label: "Total Resource Revenue", color: "hsl(var(--chart-1))" },
      }}
      className="h-[410px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total_resource_revenue"
            nameKey="resource_type"
            cx="45%"
            cy="50%"
            outerRadius={150}
            label={(props) =>
              renderCustomLabel({ ...props, total: totalRevenue })
            }
            labelLine={{ stroke: "#8884d8", strokeWidth: 1 }} // Custom label lines
            style={{ fontSize: "11px", fontWeight: "bold" }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={RESOURCE_COLORS[entry.resource_type] || "#000000"}
              />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              bottom: -10,
              left: "45%",
              transform: "translateX(-50%)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default RevenueByResourceTypeChart;
