
async function fetchTotalServiceCost() {
    try {
        const response = await fetch('https://ugdwdejp73.execute-api.ap-southeast-2.amazonaws.com/development/getTotalServiceCost');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);
        const totalServiceCost = parseFloat(bodyData[0].total_service_cost);


        console.log('Total Resource Cost:', totalServiceCost);
        return totalServiceCost; // Return the fetched data
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

function formatCustom(number: number): string {
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


export {
    fetchTotalServiceCost,
    formatCustom
}
