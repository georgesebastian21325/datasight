async function fetchTotalOfferingCost() {
    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingCost');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);
        const totalOfferingCost = parseFloat(bodyData[0].total_offering_cost);


        console.log('Total Resource Cost:', totalOfferingCost);
        return totalOfferingCost; // Return the fetched data
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function fetchTotalOfferingRevenue() {
    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingRevenues');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);
        const totalOfferingRevenue = parseFloat(bodyData[0].total_offering_revenue);


        console.log('Total Resource Cost:', totalOfferingRevenue);
        return totalOfferingRevenue; // Return the fetched data
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function fetchCostByOffering() {
    type CostByOfferingItems = {
        offering_id: string;
        total_offering_cost: string;
    };

    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingProductContribution');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: CostByOfferingItems) => ({
            ...item,
            total_offering_cost: parseFloat(item.total_offering_cost)
        }));

        console.log('Cost By Offering', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}


async function fetchRevenueByOffering() {
    type RevenueByOfferingItems = {
        offering_id: string;
        total_offering_revenue:string;
    };

    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingProductRevenueContribution');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: RevenueByOfferingItems) => ({
            ...item,
            total_offering_revenue: parseFloat(item.total_offering_revenue)
        }));

        console.log('Revenue By Offering', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

async function fetchOfferingRevenueStability() {
    type OfferingRevenueStabilityItems = {
        date: string;
        offering_id: string;
        daily_offering_revenue: string;
    };

    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingRevenueStability');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: OfferingRevenueStabilityItems) => ({
            ...item,
            product_contribution_to_offering_revenue: parseFloat(item.daily_offering_revenue)
        }));

        console.log('Offering Revenue Stability', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

async function fetchOfferingRevenueForecast() {
    type OfferingRevenueForecastItems = {
        offering_id: string;
        month_year: string;
        offering_revenue: string;
        predicted_revenue: string;
        forecast_revenue: string;
    }

    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingRevenueForecast');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Ensure the correct field name `average_usage_percentage` is used
        const formattedData = bodyData.map((item: OfferingRevenueForecastItems) => ({
            ...item,
            offering_revenue: parseFloat(item.offering_revenue),
            predicted_revenue: parseFloat(item.predicted_revenue),
            forecast_revenue: parseFloat(item.forecast_revenue)
        }));

        console.log('Offering Revenue Forecast', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchOfferingCostTableList() {
    type OfferingCostTableListItems = {
        offering_id: string;
        product_id: string;
        product_contribution_cost: string;
    }

    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingCostTableList');

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: OfferingCostTableListItems) => ({
            ...item,
            product_contribution_cost: parseFloat(item.product_contribution_cost)
        }));

        console.log('Offering Cost with Product List', formattedData);

        return formattedData;

    } catch (error) {
        console.error(error);
        return null;
    }
}


async function fetchOfferingRevenueTableList() {
    type OfferingCostTableListItems = {
        offering_id: string;
        product_id: string;
        product_contribution_revenue: string;
    }

    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingRevenueTableList');

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: OfferingCostTableListItems) => ({
            ...item,
            product_contribution_revenue: parseFloat(item.product_contribution_revenue)
        }));

        console.log('Offering Revenue with Product List', formattedData);

        return formattedData;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export {
    fetchTotalOfferingCost,
    fetchTotalOfferingRevenue,
    fetchCostByOffering,
    fetchRevenueByOffering,
    fetchOfferingRevenueStability,
    fetchOfferingRevenueForecast,
    fetchOfferingCostTableList,
    fetchOfferingRevenueTableList
}