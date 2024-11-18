async function fetchResourceHealthStatus() {
    type ResourceHealthStatus = {
        resource_id: string;
        resource_risk_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getResourceHealthStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ResourceHealthStatus) => ({
            ...item
        }));

        console.log('Resource Health Status', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export {
    fetchResourceHealthStatus
};
