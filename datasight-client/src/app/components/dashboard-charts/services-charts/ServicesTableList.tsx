"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/vcomponents/file-upload-components/table";
import { Button } from "@/vcomponents/file-upload-components/button";

const mockData = Array.from({ length: 50 }, (_, i) => ({
    service_id: `SRV${String(Math.floor(i / 5) + 1).padStart(3, '0')}`,
    resource_id: `RES${String(i + 1).padStart(3, '0')}`,
    resource_type: ['Server', 'Database', 'Storage', 'Network'][Math.floor(Math.random() * 4)],
    revenue_generated_based_on_resource_id: Math.floor(Math.random() * 10000)
}));

export default function ServicesTableList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedServiceId, setSelectedServiceId] = useState('All');
    const itemsPerPage = 5;

    const serviceIds = ['All', ...new Set(mockData.map(item => item.service_id))];

    const filteredData = selectedServiceId === 'All'
        ? mockData
        : mockData.filter(item => item.service_id === selectedServiceId);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Resource ID</TableHead>
                        <TableHead>Resource Type</TableHead>
                        <TableHead className="text-right">Revenue Generated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((item) => (
                        <TableRow key={item.resource_id}>
                            <TableCell>{item.resource_id}</TableCell>
                            <TableCell>{item.resource_type}</TableCell>
                            <TableCell className="text-right">${item.revenue_generated_based_on_resource_id.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
                <div>
                    Page {currentPage} of {totalPages}
                </div>
                <div className="space-x-2">
                    <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div> 
    );
}
