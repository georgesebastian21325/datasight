'use client'

import { useState, useEffect } from 'react';

const ResourceMappingPage = () => {
    const [resourceServiceMapping, setResourceServiceMapping] = useState([]);
    const [serviceProductMapping, setServiceProductMapping] = useState([]);
    const [productOfferingMapping, setProductOfferingMapping] = useState([]);

    useEffect(() => {
        // Fetch Resource to Service Mapping
        fetch('https://ps11pluldf.execute-api.ap-southeast-2.amazonaws.com/development/getResourceServiceMapping')
            .then((response) => response.json())
            .then((data) => {
                console.log('Resource to Service Mapping Data:', data); // Debugging
                const parsedData = JSON.parse(data.body); // Parse the stringified JSON
                setResourceServiceMapping(parsedData);
            })
            .catch((error) => console.error('Error fetching resource-service mapping:', error));

        // Fetch Service to Product Mapping
        fetch('https://ps11pluldf.execute-api.ap-southeast-2.amazonaws.com/development/getServiceProductMapping')
            .then((response) => response.json())
            .then((data) => {
                console.log('Service to Product Mapping Data:', data); // Debugging
                const parsedData = JSON.parse(data.body); // Parse the stringified JSON
                setServiceProductMapping(parsedData);
            })
            .catch((error) => console.error('Error fetching service-product mapping:', error));

        // Fetch Product to Offering Mapping
        fetch('https://ps11pluldf.execute-api.ap-southeast-2.amazonaws.com/development/getProductOfferingMapping')
            .then((response) => response.json())
            .then((data) => {
                console.log('Product to Offering Mapping Data:', data); // Debugging
                const parsedData = JSON.parse(data.body); // Parse the stringified JSON
                setProductOfferingMapping(parsedData);
            })
            .catch((error) => console.error('Error fetching product-offering mapping:', error));
    }, []);

    // Extract unique service, resource, product, and offering IDs
    const uniqueServiceIds = [...new Set([...resourceServiceMapping.map(item => item.service_id), ...serviceProductMapping.map(item => item.service_id)])];
    const uniqueResourceIds = [...new Set(resourceServiceMapping.map(item => item.resource_id))];
    const uniqueProductIds = [...new Set([...serviceProductMapping.map(item => item.product_id), ...productOfferingMapping.map(item => item.product_id)])];
    const uniqueOfferingIds = [...new Set(productOfferingMapping.map(item => item.offering_id))];

    return (
        <div>
            <h1>Unique IDs</h1>
            <h2>Unique Service IDs</h2>
            <ul>
                {uniqueServiceIds.map((id, index) => (
                    <li key={index}>{id}</li>
                ))}
            </ul>

            <h2>Unique Resource IDs</h2>
            <ul>
                {uniqueResourceIds.map((id, index) => (
                    <li key={index}>{id}</li>
                ))}
            </ul>

            <h2>Unique Product IDs</h2>
            <ul>
                {uniqueProductIds.map((id, index) => (
                    <li key={index}>{id}</li>
                ))}
            </ul>

            <h2>Unique Offering IDs</h2>
            <ul>
                {uniqueOfferingIds.map((id, index) => (
                    <li key={index}>{id}</li>
                ))}
            </ul>

            <h1>Resource to Service Mapping</h1>
            {resourceServiceMapping.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Service ID</th>
                            <th>Resource ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resourceServiceMapping.map((item, index) => (
                            <tr key={index}>
                                <td>{item.service_id}</td>
                                <td>{item.resource_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available for Resource to Service Mapping</p>
            )}

            <h1>Service to Product Mapping</h1>
            {serviceProductMapping.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Service ID</th>
                            <th>Product ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serviceProductMapping.map((item, index) => (
                            <tr key={index}>
                                <td>{item.service_id}</td>
                                <td>{item.product_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available for Service to Product Mapping</p>
            )}

            <h1>Product to Offering Mapping</h1>
            {productOfferingMapping.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Offering ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productOfferingMapping.map((item, index) => (
                            <tr key={index}>
                                <td>{item.product_id}</td>
                                <td>{item.offering_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available for Product to Offering Mapping</p>
            )}
        </div>
    );
};

export default ResourceMappingPage;
