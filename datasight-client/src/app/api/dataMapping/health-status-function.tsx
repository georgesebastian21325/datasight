async function fetchResourceHealthStatus() {
    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getResourceHealthStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const dataBody = await response.json();
        const bodyData = JSON.parse(dataBody);
        
        console.log('Resource Health Status', bodyData);

        return bodyData

    } catch (error) {
        console.error(error);    
        return null;
    }
}

export default {
    fetchResourceHealthStatus
}