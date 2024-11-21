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

export default function ProductRevenueTableList({ data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProductId, setSelectedProductId] = useState("All");
    const itemsPerPage = 5;

    // Ensure data is defined and is an array
    const tableData = Array.isArray(data) ? data : [];


    // Get unique product IDs for the dropdown
    const productIds = ["All", ...new Set(tableData.map((item) => item.product_id))];

    // Filter data based on selected product ID
    const filteredData =
        selectedProductId === "All"
            ? tableData
            : tableData.filter((item) => item.product_id === selectedProductId);

    // Debug: Log filtered data
    useEffect(() => {
        console.log("Filtered Data:", filteredData);
    }, [filteredData]);

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
            {/* Filter by Product ID */}
            <div className="mb-4 flex items-center">
                <h1 className="font-bold mr-2">Select Product:</h1>
                <select
                    id="productIdFilter"
                    value={selectedProductId}
                    onChange={(e) => {
                        setSelectedProductId(e.target.value);
                        setCurrentPage(1); // Reset to first page when filter changes
                    }}
                    className="p-1 border border-gray-300 rounded"
                >
                    {productIds.map((productId) => (
                        <option key={productId} value={productId}>
                            {productId}
                        </option>
                    ))}
                </select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Service ID</TableHead>
                        <TableHead className="text-right">Service Contribution Cost</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item) => (
                            <TableRow key={`${item.product_id}-${item.service_id}`}>
                                <TableCell>{item.product_id}</TableCell>
                                <TableCell>{item.service_id}</TableCell>
                                <TableCell className="text-right">
                                    ${parseFloat(item.service_contribution_revenue).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No records found for the selected product.
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
}
