'use client';

import { useCallback } from 'react';
import { ReactFlow, Controls, Background, MiniMap, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Header from '../components/global/header';
import { OptimizeObsolenceBtn, OptimizeRiskBtn, OptimizeFinanceBtn, OptimizeCapacityBtn, GenerateMapBtn } from '../components/button';

// Define initial nodes with multiple entities for each category
const initialNodes = [
    // Offerings
    { id: '1', type: 'customNode', data: { entityName: 'Offering A', entityHealth: 'Healthy' }, position: { x: 100, y: 50 } },
    { id: '2', type: 'customNode', data: { entityName: 'Offering B', entityHealth: 'Warning' }, position: { x: 100, y: 150 } },
    { id: '3', type: 'customNode', data: { entityName: 'Offering C', entityHealth: 'Critical' }, position: { x: 100, y: 250 } },

    // Products
    { id: '4', type: 'customNode', data: { entityName: 'Product A', entityHealth: 'Healthy' }, position: { x: 300, y: 50 } },
    { id: '5', type: 'customNode', data: { entityName: 'Product B', entityHealth: 'Warning' }, position: { x: 300, y: 150 } },
    { id: '6', type: 'customNode', data: { entityName: 'Product C', entityHealth: 'Critical' }, position: { x: 300, y: 250 } },

    // Services
    { id: '7', type: 'customNode', data: { entityName: 'Service A', entityHealth: 'Healthy' }, position: { x: 500, y: 50 } },
    { id: '8', type: 'customNode', data: { entityName: 'Service B', entityHealth: 'Warning' }, position: { x: 500, y: 150 } },
    { id: '9', type: 'customNode', data: { entityName: 'Service C', entityHealth: 'Critical' }, position: { x: 500, y: 250 } },

    // Resources
    { id: '10', type: 'customNode', data: { entityName: 'Resource A', entityHealth: 'Healthy' }, position: { x: 700, y: 50 } },
    { id: '11', type: 'customNode', data: { entityName: 'Resource B', entityHealth: 'Warning' }, position: { x: 700, y: 150 } },
    { id: '12', type: 'customNode', data: { entityName: 'Resource C', entityHealth: 'Critical' }, position: { x: 700, y: 250 } },
];

const initialEdges = [
    // Offerings to Products
    { id: 'e1-4', source: '1', target: '4', type: 'straight', animated: true },
    { id: 'e2-5', source: '2', target: '5', type: 'straight', animated: true },
    { id: 'e3-6', source: '3', target: '6', type: 'straight', animated: true },

    // Products to Services
    { id: 'e4-7', source: '4', target: '7', type: 'straight', animated: true },
    { id: 'e5-8', source: '5', target: '8', type: 'straight', animated: true },
    { id: 'e6-9', source: '6', target: '9', type: 'straight', animated: true },

    // Services to Resources
    { id: 'e7-10', source: '7', target: '10', type: 'straight', animated: true },
    { id: 'e8-11', source: '8', target: '11', type: 'straight', animated: true },
    { id: 'e9-12', source: '9', target: '12', type: 'straight', animated: true },
];

// Custom Node Component to display entity details with improved UI
const CustomNode = ({ data }) => (
    <div className="p-4 border rounded-lg shadow-md bg-white flex items-center justify-between space-x-4">
        <Handle type="target" position="left" className="!bg-gray-500" />
        <div className="flex items-center space-x-2">
            <span className={`inline-block w-3 h-3 rounded-full ${getHealthDotClass(data.entityHealth)}`} />
            <h3 className="font-bold text-gray-800">{data.entityName}</h3>
        </div>
        <Handle type="source" position="right" className="!bg-gray-500" />
    </div>
);

// Function to return dot color based on entity health status
const getHealthDotClass = (healthStatus) => {
    switch (healthStatus) {
        case 'Healthy':
            return 'bg-green-500';
        case 'Warning':
            return 'bg-yellow-500';
        case 'Critical':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
};

export default function EnterpriseArchitecture() {
    const onNodesChange = useCallback(() => { }, []);
    const onEdgesChange = useCallback(() => { }, []);
    const onConnect = useCallback(() => { }, []);

    return (
        <div className="mt-[3rem]">
            <Header />
            <main className="flex-grow p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex justify-end">
                        <GenerateMapBtn />
                    </div>
                    <div className="w-full border-2 rounded-lg overflow-hidden items-center flex flex-col p-12 text-center justify-center">
                        <h1 className="font-bold text-2xl gradient-text">COMPANY ENTERPRISE ARCHITECTURE</h1>
                        <p className="text-gray-500">Explore and analyze your enterprise architecture.</p>
                    </div>
                    <div className="aspect-[16/9] w-full border-2 rounded-lg overflow-hidden bg-gray-100">
                        {/* ReactFlow component for data mapping */}
                        <ReactFlow
                            nodes={initialNodes}
                            edges={initialEdges}
                            nodeTypes={{ customNode: CustomNode }}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            fitView
                        >
                            <MiniMap />
                            <Controls />
                            <Background />
                        </ReactFlow>
                    </div>
                    <div className="flex gap-x-5 justify-center">
                        <OptimizeObsolenceBtn />
                        <OptimizeRiskBtn />
                        <OptimizeCapacityBtn />
                        <OptimizeFinanceBtn />
                    </div>
                </div>
            </main>
        </div>
    );
}
