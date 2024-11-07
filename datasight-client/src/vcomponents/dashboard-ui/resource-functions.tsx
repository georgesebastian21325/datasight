
interface ResourceTotalCost {
    total_resource_cost: string;

}


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



function formatCustom(number: number): string {
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export {
    fetchTotalResourceCost,
    fetchTotalResourceRevenue,
    formatCustom
}
