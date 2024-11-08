
// Total Resource Cost

async function fetchTotalResourceCost() {
    try {
        const response = await fetch('https://81lsv00jqf.execute-api.ap-southeast-2.amazonaws.com/development/getTotalResourceCost');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body); 
        const totalResourceCost = parseFloat(bodyData[0].total_resource_cost); 
        

        console.log('Total Resource Cost:', totalResourceCost);
        return totalResourceCost; // Return the fetched data
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

// Total Resource Revenue

async function fetchTotalResourceRevenue() {
    try {
        const response = await fetch('https://81lsv00jqf.execute-api.ap-southeast-2.amazonaws.com/development/getTotalResourceRevenue');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);
        const totalResourceRevenue = parseFloat(bodyData[0].total_resource_revenue);

        console.log('Total Resource Revenue:', totalResourceRevenue);
        return totalResourceRevenue; // Return the fetched data
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}


// Cost By Resource Type

async function fetchCostByResourceType() {
    type ResourceCostItem = {
        resource_id: string;
        resource_type: string;
        total_resource_cost: string;
    };

    try {
        const response = await fetch('https://81lsv00jqf.execute-api.ap-southeast-2.amazonaws.com/development/getCostByResourceType');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: ResourceCostItem )=> ({
            ...item,
            total_resource_cost: parseFloat(item.total_resource_cost)
        }));

        console.log('Cost By Resource Type', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

async function fetchTopCostliestResources() {
    type ResourceCostItem = {
        resource_id: string;
        resource_type: string;
        total_resource_cost: string;
    };

    try {
        const response = await fetch('https://81lsv00jqf.execute-api.ap-southeast-2.amazonaws.com/development/getTopCostliestResources');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: ResourceCostItem) => ({
            ...item,
            total_resource_cost: parseFloat(item.total_resource_cost)
        }));

        console.log('Costliest Resources', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}




function formatCustom(number: number): string {
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export {
    fetchTotalResourceCost,
    fetchTotalResourceRevenue,
    fetchCostByResourceType,
    fetchTopCostliestResources,
    formatCustom
}
