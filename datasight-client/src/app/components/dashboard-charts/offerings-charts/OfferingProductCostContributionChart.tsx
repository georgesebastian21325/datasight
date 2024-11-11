import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function OfferingProductCostContribution({ data }) {
    // Prepare the data in a format suitable for stacked bar chart
    const formattedData = data.reduce((acc, { offering_id, product_id, product_contribution_to_offering_cost }) => {
        const existingOffering = acc.find(item => item.offering_id === offering_id);
        if (existingOffering) {
            existingOffering[product_id] = product_contribution_to_offering_cost;
        } else {
            acc.push({ offering_id, [product_id]: product_contribution_to_offering_cost });
        }
        return acc;
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="offering_id" style={{ fontSize: '9px', fontWeight: 'bold', fill: 'black' }} />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} 
                style={{ fontSize: '10px', fontWeight: 'bold', fill: 'black' }}
                />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
                <Legend />

                {/* Add a <Bar> component for each product to stack */}
                <Bar dataKey="P0001" stackId="a" fill="#8B4513" name="P0001" />  {/* SaddleBrown */}
                <Bar dataKey="P0002" stackId="a" fill="#4682B4" name="P0002" />  {/* SteelBlue */}
                <Bar dataKey="P0003" stackId="a" fill="#3CB371" name="P0003" />  {/* MediumSeaGreen */}
                <Bar dataKey="P0004" stackId="a" fill="#DAA520" name="P0004" />  {/* GoldenRod */}
                <Bar dataKey="P0005" stackId="a" fill="#BA55D3" name="P0005" />  {/* MediumOrchid */}
            </BarChart>
        </ResponsiveContainer>
    );
}
