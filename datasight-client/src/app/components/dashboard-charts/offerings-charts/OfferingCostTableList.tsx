"use client";

import { useState, useEffect } from "react";
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
interface OfferingCostData {
    offering_id: string;
    product_id: string;
    product_contribution_cost: number | string;
}

// Define the component props
interface OfferingCostTableListProps {
    data: OfferingCostData[];
}

const OfferingCostTableList: React.FC<OfferingCostTableListProps> = ({ data }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedOfferingId, setSelectedOfferingId] = useState<string>("All");
    const itemsPerPage: number = 5;

    // Ensure data is defined and is an array
    const tableData: OfferingCostData[] = Array.isArray(data) ? data : [];

    // Get unique offering IDs for the dropdown
    const offeringIds: string[] = ["All", ...Array.from(new Set<string>(tableData.map((item) => item.offering_id)))];

    // Filter data based on selected offering ID
    const filteredData: OfferingCostData[] =
        selectedOfferingId === "All"
            ? tableData
            : tableData.filter((item) => item.offering_id === selectedOfferingId);

    // Debug: Log filtered data
    useEffect(() => {
        console.log("Filtered Data:", filteredData);
    }, [filteredData]);

    // Pagination logic
    const totalPages: number = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const paginatedData: OfferingCostData[] = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Handle loading state
    if (!data || data.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* Filter by Offering ID */}
            <div className="mb-4 flex items-center">
                <h1 className="font-bold mr-2">Select Offering:</h1>
                <select
                    id="offeringIdFilter"
                    value={selectedOfferingId}
                    onChange={(e) => {
                        setSelectedOfferingId(e.target.value);
                        setCurrentPage(1); // Reset to first page when filter changes
                    }}
                    className="p-1 border border-gray-300 rounded"
                >
                    {offeringIds.map((offeringId) => (
                        <option key={offeringId} value={offeringId}>
                            {offeringId}
                        </option>
                    ))}
                </select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Offering ID</TableHead>
                        <TableHead>Product ID</TableHead>
                        <TableHead className="text-right">Product Contribution Cost</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item) => (
                            <TableRow key={`${item.offering_id}-${item.product_id}`}>
                                <TableCell>{item.offering_id}</TableCell>
                                <TableCell>{item.product_id}</TableCell>
                                <TableCell className="text-right">
                                        ₱{parseFloat(item.product_contribution_cost as string).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No records found for the selected offering.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
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

export default OfferingCostTableList;
