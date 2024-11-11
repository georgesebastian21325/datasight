async function fetchOfferingCost() {
    type OfferingCostItems = {
        offering_id: string;
        total_offering_cost: string;
    };

    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingCost');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: OfferingCostItems) => ({
            ...item,
            total_resource_cost: parseFloat(item.total_offering_cost)
        }));

        console.log('Total Offering Costs', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

export {
    fetchOfferingCost
}