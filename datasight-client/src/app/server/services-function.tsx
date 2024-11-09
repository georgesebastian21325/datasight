
async function fetchTotalServiceCost() {
    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getTotalServiceCost');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);
        const totalServiceCost = parseFloat(bodyData[0].total_service_cost);


        console.log('Total Service Cost:', totalServiceCost);
        return totalServiceCost; // Return the fetched data
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function fetchTotalServiceRevenue() {
    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getTotalServiceRevenue');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);
        const totalServiceRevenue = parseFloat(bodyData[0].total_service_revenue);


        console.log('Total Service Revenue:', totalServiceRevenue);
        return totalServiceRevenue; // Return the fetched data
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function fetchCostPerService() {
    type ServiceCostItem = {
        service_id: string;
        total_service_cost: string;
    };

    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getCostPerService');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: ServiceCostItem) => ({
            ...item,
            total_resource_cost: parseFloat(item.total_service_cost)
        }));

        console.log('Cost By Service Type', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}


async function fetchRevenueGeneratingServices() {
    type ServiceRevenueItems = {
        service_id: string;
        total_service_revenue: string;
        resource_id: string;
        resource_type: string;
    };

    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getRevenueGeneratingServices');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: ServiceRevenueItems) => ({
            ...item,
            total_service_revenue: parseFloat(item.total_service_revenue)
        }));

        console.log('Revenue Per Service Associated with Resources', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

async function compareCostAndRevenue() {
    type CostRevenueServiceItems = {
        service_id: string;
        total_service_cost: string;
        total_service_revenue: string;
    }

    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getRevenuCostServices');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: CostRevenueServiceItems) => ({
            ...item,
            total_service_cost: parseFloat(item.total_service_cost),
            total_service_revenue: parseFloat(item.total_service_revenue)
        }));

        console.log('Cost and Revenue', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return null;
    }

}



function formatCustom(number: number): string {
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


export {
    fetchTotalServiceCost,
    fetchTotalServiceRevenue,
    fetchCostPerService,
    fetchRevenueGeneratingServices,
    compareCostAndRevenue,
    formatCustom
}
