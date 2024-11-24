import React from "react";
import {
  PieChart,
  Pie,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

// Define the data type
interface DataItem {
  resource_type: string;
  total_resource_revenue: number;
}

// Define the component props
interface RevenueByResourceTypeChartProps {
  data: DataItem[];
}

// Define color mapping for resource types
const RESOURCE_COLORS: Record<string, string> = {
  "Backup and Recovery Systems": "#4B0082", // Indigo
  "Cloud Infrastructure": "#2E8B57", // Sea Green
  "Communication Infrastructure": "#B8860B", // Dark Golden Rod
  Computer: "#556B2F", // Dark Olive Green
  "Network Equipment": "#4682B4", // Steel Blue
  Server: "#6A5ACD", // Slate Blue
  "Storage Device": "#2F4F4F", // Dark Slate Gray
  "Virtual Infrastructure": "#8B008B", // Dark Magenta
};

// Sort the data based on the order of RESOURCE_COLORS keys
const sortDataByResourceType = (data: DataItem[]): DataItem[] => {
  return data.sort(
    (a, b) =>
      Object.keys(RESOURCE_COLORS).indexOf(a.resource_type) -
      Object.keys(RESOURCE_COLORS).indexOf(b.resource_type)
  );
};

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

const RevenueByResourceTypeChart: React.FC<RevenueByResourceTypeChartProps> = ({
  data,
}) => {
  // Sort and calculate the total revenue
  const sortedData = sortDataByResourceType(data);
  const totalRevenue = sortedData.reduce(
    (acc, entry) => acc + entry.total_resource_revenue,
    0
  );

  return (
    <div className="h-[410px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sortedData}
            dataKey="total_resource_revenue"
            nameKey="resource_type"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label={(props) =>
              renderCustomLabel({ ...props, total: totalRevenue })
            }
            labelLine={{ stroke: "#8884d8", strokeWidth: 1 }}
            style={{ fontSize: "11px", fontWeight: "bold" }}
          >
            {sortedData.map((entry) => (
              <Cell
                key={`cell-${entry.resource_type}`}
                fill={RESOURCE_COLORS[entry.resource_type] || "#000000"} // Fallback color
              />
            ))}
          </Pie>
          <ChartTooltip
            formatter={(value: number) =>
              `₱ ${value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            }
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "11px",
            }}
            payload={Object.keys(RESOURCE_COLORS).map((key, index) => ({
              value: key,
              type: "square",
              color: RESOURCE_COLORS[key],
            }))}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueByResourceTypeChart;
