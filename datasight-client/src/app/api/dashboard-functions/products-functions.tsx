
async function fetchTotalProductCost() {
    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getTotalProductCost');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);
        const totalProductCost = parseFloat(bodyData[0].total_product_cost);


        console.log('Total Resource Cost:', totalProductCost);
        return totalProductCost; // Return the fetched data
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function fetchTotalProductRevenue() {
    try {
        const response = await fetch('https://ud2luybs5l.execute-api.ap-southeast-2.amazonaws.com/development/getTotalProductCost');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);
        const totalProductCost = parseFloat(bodyData[0].total_product_cost);


        console.log('Total Resource Cost:', totalProductCost);
        return totalProductCost; // Return the fetched data
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

export  {
    fetchTotalProductCost, 
    fetchTotalProductRevenue
}