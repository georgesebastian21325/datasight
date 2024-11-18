"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/vcomponents/file-upload-components/table";
import { Button } from "@/vcomponents/file-upload-components/button";


export default function ServiceCostTableList({ data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedServiceId, setSelectedServiceId] = useState("All");
    const itemsPerPage = 5;

    // Ensure data is defined and is an array
    const tableData = Array.isArray(data) ? data : [];

    // Get unique service IDs for the dropdown
    const serviceIds = ["All", ...new Set(tableData.map((item) => item.service_id))];

    // Filter data based on selected service ID
    const filteredData =
        selectedServiceId === "All"
            ? tableData
            : tableData.filter((item) => item.service_id === selectedServiceId);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Handle loading state
    if (!data || data.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Filter by Service ID */}
            <div className="mb-4 flex items-center">
                <h1> Select Service: </h1>
                <select
                    id="serviceIdFilter"
                    value={selectedServiceId}
                    onChange={(e) => {
                        setSelectedServiceId(e.target.value);
                        setCurrentPage(1); // Reset to first page when filter changes
                    }}
                    className="ml-2 p-1 border border-gray-300 rounded px-5"
                >
                    {serviceIds.map((serviceId) => (
                        <option key={serviceId} value={serviceId}>
                            {serviceId}
                        </option>
                    ))}
                </select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Service ID</TableHead>
                        <TableHead>Resource ID</TableHead>
                        <TableHead>Resource Type</TableHead>
                        <TableHead className="text-right">Revenue Generated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item) => (
                            <TableRow key={item.resource_id}>
                                <TableCell>{item.service_id}</TableCell>
                                <TableCell>{item.resource_id}</TableCell>
                                <TableCell>{item.resource_type}</TableCell>
                                <TableCell className="text-right">
                                    ${parseFloat(item.revenue_generated_based_on_resource_id).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No records found for the selected service.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
                <div className='font-bold'>
                    Page {currentPage} of {totalPages}
                </div>
                <div className="space-x-2">
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
