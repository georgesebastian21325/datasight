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

// Done
async function fetchResourceOptimizedRiskStatus() {
    type ResourceHealthStatus = {
        resource_id: string;
        resource_optimized_risk_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getOptimizedResourceRiskStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ResourceHealthStatus) => ({
            ...item
        }));

        console.log('Optimized Risk Resource Health Status', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// On-going
async function fetchServiceOptimizedRiskStatus() {
    type ServiceHealthStatus = {
        service_id: string;
        service_optimized_risk_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getOptimizedServiceRiskStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ServiceHealthStatus) => ({
            ...item
        }));

        console.log('Optimized Risk Service Health Status', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}


// not yet
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

        console.log('Optimized Service Risk Health Status', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}


// not yet
async function fetchProductOptimizedRiskStatus() {
    type ProductHealthStatusItems = {
        product_id: string;
        product_optimized_risk_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getOptimizedProductRiskStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ProductHealthStatusItems) => ({
            ...item
        }));

        console.log('Optimized Product Risk Status ', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}


// not yet
async function fetchOfferingOptimizedRiskStatus() {
    type OfferingRiskHealthStatusItems = {
        offering_id: string;
        offering_optimized_risk_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getOptimizedOfferingRiskStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: OfferingRiskHealthStatusItems) => ({
            ...item
        }));

        console.log('Optimized Offering Risk Health Status', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}


async function fetchResourceOptimizedProfitabilityStatus() {
    type ResourceProfitabilityStatus = {
        resource_id: string;
        resource_optimized_finance_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getOptimizedResourceProfitabilityStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ResourceProfitabilityStatus) => ({
            ...item
        }));

        console.log('Optimized Resource Profitability Health Status', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchServiceOptimizedProfitabilityStatus() {
    type ServiceProfitabilityStatus = {
        service_id: string;
        service_optimized_finance_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getOptimizedServiceProfitabilityStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ServiceProfitabilityStatus) => ({
            ...item
        }));

        console.log('Optimized Service Profitability Health Status', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchProductOptimizedProfitabilityStatus() {
    type ProductProfitabilityStatus = {
        product_id: string;
        product_optimized_finance_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getOptimizedProductProfitabilityStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ProductProfitabilityStatus) => ({
            ...item
        }));

        console.log('Optimized Service Profitability Health Status', formattedData);

        return formattedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchOfferingOptimizedProfitabilityStatus() {
    type ProductProfitabilityStatus = {
        offering_id: string;
        offering_optimized_finance_status: string;
    }

    try {
        const response = await fetch('https://t0ov1orov1.execute-api.ap-southeast-2.amazonaws.com/development/getOptimizedOfferingProfitabilityStatus');
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        const bodyData = JSON.parse(data.body);

        const formattedData = bodyData.map((item: ProductProfitabilityStatus) => ({
            ...item
        }));

        console.log('Optimized Offering Profitability Health Status', formattedData);

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
    fetchOfferingHealthStatus,
    fetchResourceOptimizedRiskStatus,
    fetchServiceOptimizedRiskStatus,
    fetchProductOptimizedRiskStatus,
    fetchOfferingOptimizedRiskStatus,
    fetchResourceOptimizedProfitabilityStatus,
    fetchServiceOptimizedProfitabilityStatus,
    fetchProductOptimizedProfitabilityStatus,
    fetchOfferingOptimizedProfitabilityStatus
};
