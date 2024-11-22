
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

async function fetchServiceResourceList() {
    type ServiceResourceListItems = {
        service_id: string;
        resource_id: string;
        resource_type: string;
        revenue_generated_based_on_resource_id: string;
    }

    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getServiceResourceList');

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ServiceResourceListItems) => ({
            ...item,
            revenue_generated_based_on_resource_id: parseFloat(item.revenue_generated_based_on_resource_id)
        }));

        console.log('Service Revenue with Resource List', formattedData);

        return formattedData;

    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchServiceCostTableList() {
    type ServiceCostTableListItems = {
        service_id: string;
        resource_id: string;
        resource_type: string;
        cost_generated_based_on_resource_id: string;
    }

    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getServiceCostTableList');

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ServiceCostTableListItems) => ({
            ...item,
            cost_generated_based_on_resource_id: parseFloat(item.cost_generated_based_on_resource_id)
        }));

        console.log('Service Cost with Resource List', formattedData);

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
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date in ascending order

        console.log('Service Utilization Trend', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchServiceRevenueForecast() {
    type ServiceRevenueForecastItems = {
        service_id: string;
        month_year: string;
        total_service_revenue: string;
        predicted_revenue: string;
        forecast_revenue: string;
    }

    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getServiceRevenueForecast');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Ensure the correct field name `average_usage_percentage` is used
        const formattedData = bodyData.map((item: ServiceRevenueForecastItems) => ({
            ...item,
            total_service_revenue: parseFloat(item.total_service_revenue),
            predicted_revenue: parseFloat(item.predicted_revenue),
            forecast_revenue: parseFloat(item.forecast_revenue)
        }));

        console.log('Service Revenue Forecast', formattedData);

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
    fetchServiceCostTableList,
    fetchServiceResourceList,
    fetchServiceUtilizationTrend,
    fetchServiceRevenueForecast,
    formatCustom
}
