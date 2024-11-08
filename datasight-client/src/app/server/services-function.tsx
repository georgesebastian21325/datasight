
async function fetchTotalServiceCost() {
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

export default fetchTotalServiceCost;