import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart";

import { formatCustom } from '../../../api/dashboard-functions/services-function';

const SERVICE_COLORS = {
    "SVC0001": "#FF5733", // Bright orange-red
    "SVC0002": "#337AFF", // Bright blue
    "SVC0003": "#33FF57", // Bright green
    "SVC0004": "#FF33A8", // Bright pink
    "SVC0005": "#FFD633"  // Bright yellow
};


export default function CompareRevenueCostServicesChart({ data }) {
    const formattedData = data.map(item => ({
        ...item,
        displayLabel: `${item.service_id} ${formatCustom(item.total_service_cost)}`
    }));

    return (
        <ChartContainer config={{ cost: { label: "Total Resource Cost", color: "hsl(var(--chart-1))" } }} className="h-[500px] w-[600px] py-4 ">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{ top: 5, left: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="total_service_cost"
                        name="Total Service Cost"
                        tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <YAxis
                        type="number"
                        dataKey="total_service_revenue"
                        name="Total Service Revenue"
                        tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <ChartTooltip
                        formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    />
                    <Legend
                        verticalAlign="bottom"
                        content={() => (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                                {Object.keys(SERVICE_COLORS).map(serviceId => (
                                    <div key={serviceId} style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
                                        <div style={{
                                            width: 12,
                                            height: 12,
                                            backgroundColor: SERVICE_COLORS[serviceId],
                                            borderRadius: '50%',
                                            marginRight: 5
                                        }} />
                                        <span>{serviceId}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                    <Scatter
                        name="Services"
                        data={formattedData}
                        shape="circle"
                    >
                        {formattedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SERVICE_COLORS[entry.service_id]} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
