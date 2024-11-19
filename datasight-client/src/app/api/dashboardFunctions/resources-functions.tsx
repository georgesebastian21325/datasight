
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

async function fetchTopRevenueGeneratingResources() {
    type ResourceRevenueItem = {
        resource_id: string;
        total_resource_revenue: string;
    };

    try {
        const response = await fetch('https://81lsv00jqf.execute-api.ap-southeast-2.amazonaws.com/development/getRevenueGeneratingResources');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: ResourceRevenueItem) => ({
            ...item,
            total_resource_revenue: parseFloat(item.total_resource_revenue)
        }));

        console.log('Top Resource Generating Revenue', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

async function fetchAverageUtilizationResource() {
    type AverageUtilizationItems = {
        resource_id: string;
        month: string;
        average_daily_utilization_percentage: string;
    };

    try {
        const response = await fetch('https://81lsv00jqf.execute-api.ap-southeast-2.amazonaws.com/development/getAverageUtilizationResources');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Ensure the correct field name `average_usage_percentage` is used
        const formattedData = bodyData.map((item: AverageUtilizationItems) => ({
            ...item
        }));


        console.log('Average Utilization Per Resource:', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
    }
}

async function fetchHighestUtilizedResources() {
    type HighestUtilizedItems = {
        resource_type: string;
        average_usage_percentage: string;
    };

    try {
        const response = await fetch('https://81lsv00jqf.execute-api.ap-southeast-2.amazonaws.com/development/getHighestUtilizedResources');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Ensure the correct field name `average_usage_percentage` is used
        const formattedData = bodyData.map((item: HighestUtilizedItems) => ({
            ...item,
            average_usage_percentage: parseFloat(item.average_usage_percentage)
        }));

        console.log('Highest Utilized Resources', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
    }
}

async function fetchLowestUtilizedResources() {
    type HighestUtilizedItems = {
        resource_type: string;
        average_usage_percentage: string;
    };

    try {
        const response = await fetch('https://81lsv00jqf.execute-api.ap-southeast-2.amazonaws.com/development/getLowestUtilizedResources');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Ensure the correct field name `average_usage_percentage` is used
        const formattedData = bodyData.map((item: HighestUtilizedItems) => ({
            ...item,
            average_usage_percentage: parseFloat(item.average_usage_percentage)
        }));

        console.log('Lowest Utilized Resources', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
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
    fetchTopRevenueGeneratingResources,
    fetchAverageUtilizationResource,
    fetchHighestUtilizedResources,
    fetchLowestUtilizedResources,
    formatCustom
}
