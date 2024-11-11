
async function fetchTotalProductCost() {
    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getTotalProductCost');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);
        const totalProductCost = parseFloat(bodyData[0].total_product_cost);


        console.log('Total Product Cost:', totalProductCost);
        return totalProductCost; // Return the fetched data
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function fetchTotalProductRevenue() {
    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getTotalProductRevenue');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);
        const totalProductRevenue = parseFloat(bodyData[0].total_product_revenue);


        console.log('Total Product Revenue:', totalProductRevenue);
        return totalProductRevenue; // Return the fetched data
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function fetchProductCostByCategory() {
    type ProductCostItem = {
        product_id: string;
        total_product_cost: string;
    };

    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getProductCostByCategory');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: ProductCostItem) => ({
            ...item,
            total_resource_cost: parseFloat(item.total_product_cost)
        }));

        console.log('Cost By Product Type', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

async function fetchRevenueByProduct() {
    type ProductRevenueItem = {
        product_id: string;
        total_product_revenue: string;
    };

    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getProductRevenueByCategory');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: ProductRevenueItem) => ({
            ...item,
            total_resource_cost: parseFloat(item.total_product_revenue)
        }));

        console.log('Revenue By Product Type', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

async function fetchProductRevenueContribution() {
    type ProductRevenueContributionItems = {
        product_id: string;
        total_revenue: string;
        revenue_percentage: string;
    };

    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getProductRevenueContribution');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: ProductRevenueContributionItems) => ({
            ...item
        }));

        console.log('Revenue Contribution Per Product', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

export  {
    fetchTotalProductCost, 
    fetchTotalProductRevenue, 
    fetchProductCostByCategory,
    fetchRevenueByProduct, 
    fetchProductRevenueContribution
}