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

async function fetchServiceHealthStatus() {
    type ServiceHealthStatusItems = {
        service_id: string;
        service_risk_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getServiceHealthStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ServiceHealthStatusItems) => ({
            ...item
        }));

        console.log('Service Health Status', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}


async function fetchProductHealthStatus() {
    type ProductHealthStatusItems = {
        product_id: string;
        product_risk_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getProductHealthStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ProductHealthStatusItems) => ({
            ...item
        }));

        console.log('Product Health Status', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchOfferingHealthStatus() {
    type OfferingHealthStatusItems = {
        offering_id: string;
        offering_risk_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getOfferingHealthStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: OfferingHealthStatusItems) => ({
            ...item
        }));

        console.log('Offering Health Status', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export {
    fetchResourceHealthStatus, 
    fetchServiceHealthStatus,
    fetchProductHealthStatus,
    fetchOfferingHealthStatus
};
