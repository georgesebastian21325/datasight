


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

async function fetchOfferingRevenue() {
    type OfferingRevenueItems = {
        offering_id: string;
        total_offering_revenue: string;
    };

    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingRevenues');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: OfferingRevenueItems) => ({
            ...item,
            total_resource_cost: parseFloat(item.total_offering_revenue)
        }));

        console.log('Total Offering Revenue', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

async function fetchOfferingProductionCostContribution() {
    type OfferingProductContributionCostItems = {
        offering_id: string;
        product_id: string;
        product_contribution_to_offering_cost: string;
    };

    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingProductContribution');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: OfferingProductContributionCostItems) => ({
            ...item,
            product_contribution_to_offering_cost: parseFloat(item.product_contribution_to_offering_cost)
        }));

        console.log('Offering & Product Cost Contribution', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}


async function fetchOfferingProductRevenueContribution() {
    type OfferingProductContributionCostItems = {
        offering_id: string;
        product_id: string;
        product_contribution_to_offering_revenue: string;
    };

    try {
        const response = await fetch('https://u4cav55e95.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingProductRevenueContribution');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: OfferingProductContributionCostItems) => ({
            ...item,
            product_contribution_to_offering_revenue: parseFloat(item.product_contribution_to_offering_revenue)
        }));

        console.log('Offering & Product Revenue Contribution', formattedData);

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

export {
    fetchOfferingCost,
    fetchOfferingRevenue,
    fetchOfferingProductionCostContribution,
    fetchOfferingProductRevenueContribution,
    fetchOfferingRevenueStability
}