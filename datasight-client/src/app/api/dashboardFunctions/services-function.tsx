
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


        console.log('Total Service Cost:', totalServiceRevenue);
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

    // Custom formatting function to format the number as 000,000,000
    function formatCustom(value: number): string {
        return value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getCostPerService');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_service_cost` to a formatted string for each item
        const formattedData = bodyData.map((item: ServiceCostItem) => ({
            ...item,
            total_service_cost: item.total_service_cost
        }));

        console.log('Cost By Service Type', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}



async function fetchRevenuePerService() {
    type ServiceRevenueItems = {
        service_id: string;
        total_service_revenue: string;
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

        console.log('Revenue Per Service', formattedData);

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


async function fetchServiceUtilizationByCategory () {
    type ServiceUtilizationItems = {
        service_id: string;
        avg_service_utilization: string;
    }

    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getServiceUtilizationByCategory');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ServiceUtilizationItems) => ({
            ...item,
            total_service_cost: parseFloat(item.avg_service_utilization)
        }));

        console.log('Service Utilization By Category', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return null;
    }

}

async function fetchServiceUtilizationTrend() {
    type ServiceUtilizationTrendItems = {
        service_id: string;
        date: string;
        avg_daily_service_utilization: string;
    }

    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getServiceUtilizationTrend');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData
            .map((item: ServiceUtilizationTrendItems) => ({
                ...item,
                date: new Date(item.date).toISOString().split("T")[0], // Format date as "YYYY-MM-DD"
                avg_daily_service_utilization: parseFloat(item.avg_daily_service_utilization)
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date in ascending order

        console.log('Service Utilization Trend', formattedData);

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
    fetchRevenuePerService,
    compareCostAndRevenue,
    fetchServiceUtilizationByCategory,
    fetchServiceUtilizationTrend,
    formatCustom
}
