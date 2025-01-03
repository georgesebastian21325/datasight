
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
            total_product_cost: parseFloat(item.total_product_cost)
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
            total_product_revenue: parseFloat(item.total_product_revenue)
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

async function fetchProductUtilizationRate() {
    type ProductUtilizationRateItems = {
        product_id: string;
        product_utilization_rate: string;
    };

    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getProductUtilizationRate');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: ProductUtilizationRateItems) => ({
            ...item
        }));

        console.log('Product Utilization Rate', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

async function fetchProductUtilizationTrend() {
    type ProductUtilizationTrendItems = {
        month: string;
        product_id: string;
        monthly_avg_usage_percentage: string;
    };

    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getProductUtilizationTrend');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Convert `total_resource_cost` to a number for each item
        const formattedData = bodyData.map((item: ProductUtilizationTrendItems) => ({
            ...item,
            monthly_avg_usage_percentage: parseFloat(item.monthly_avg_usage_percentage)
        }));

        console.log('Product Utilization Trend', formattedData);

        return formattedData;

    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

async function fetchProductRevenueForecast() {
    type ProductRevenueForecastItems = {
        product_id: string;
        month_year: string;
        total_product_revenue: string;
        predicted_revenue: string;
        forecast_revenue: string;
    }

    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getProductRevenueForecast');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        // Ensure the correct field name `average_usage_percentage` is used
        const formattedData = bodyData.map((item: ProductRevenueForecastItems) => ({
            ...item,
            total_product_revenue: parseFloat(item.total_product_revenue),
            predicted_revenue: parseFloat(item.predicted_revenue),
            forecast_revenue: parseFloat(item.forecast_revenue)
        }));

        console.log('Product Revenue Forecast', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchProductCostTableList() {
    type ProductCostTableListItems = {
        product_id: string;
        service_id: string;
        service_contribution_cost: string;
    }

    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getProductCostTableList');

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ProductCostTableListItems) => ({
            ...item,
            service_contribution_cost: parseFloat(item.service_contribution_cost)
        }));

        console.log('Product Cost with Service List', formattedData);

        return formattedData;

    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchProductRevenueTableList() {
    type ProductRevenueTableListItems = {
        product_id: string;
        service_id: string;
        service_contribution_revenue: string;
    }

    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getProductRevenueTableList');

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ProductRevenueTableListItems) => ({
            ...item,
            service_contribution_revenue: parseFloat(item.service_contribution_revenue)
        }));

        console.log('Product Revenue with Service List', formattedData);

        return formattedData;

    } catch (error) {
        console.error(error);
        return null;
    }
}





export  {
    fetchTotalProductCost, 
    fetchTotalProductRevenue, 
    fetchProductCostByCategory,
    fetchRevenueByProduct, 
    fetchProductRevenueContribution,
    fetchProductUtilizationRate, 
    fetchProductUtilizationTrend,
    fetchProductRevenueForecast,
    fetchProductCostTableList,
    fetchProductRevenueTableList
}