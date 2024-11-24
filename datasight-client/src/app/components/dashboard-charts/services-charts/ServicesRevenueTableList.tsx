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

// Define the structure of a single data item
interface DataItem {
    service_id: string;
    resource_id: string;
    resource_type: string;
    revenue_generated_based_on_resource_id: number | string;
}

// Define the component props
interface ServicesTableListProps {
    data: DataItem[]; // Array of DataItem objects
}

const ServicesTableList: React.FC<ServicesTableListProps> = ({ data }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedServiceId, setSelectedServiceId] = useState<string>("All");
    const itemsPerPage: number = 5;

    // Ensure data is defined and is an array
    const tableData: DataItem[] = Array.isArray(data) ? data : [];

    // Get unique service IDs for the dropdown
    const serviceIds: string[] = ["All", ...Array.from(new Set(tableData.map((item) => item.service_id)))];

    // Filter data based on selected service ID
    const filteredData: DataItem[] =
        selectedServiceId === "All"
            ? tableData
            : tableData.filter((item) => item.service_id === selectedServiceId);

    // Pagination logic
    const totalPages: number = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const paginatedData: DataItem[] = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Handle loading state
    if (!data || data.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Filter by Service ID */}
            <div className="mb-4 flex items-center">
                <h1>Select Service:</h1>
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
                            <TableRow key={`${item.service_id}-${item.resource_id}`}>
                                <TableCell>{item.service_id}</TableCell>
                                <TableCell>{item.resource_id}</TableCell>
                                <TableCell>{item.resource_type}</TableCell>
                                <TableCell className="text-right">
                                    ₱{parseFloat(item.revenue_generated_based_on_resource_id as string).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                No records found for the selected service.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
                <div className="font-bold">
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
};

export default ServicesTableList;
