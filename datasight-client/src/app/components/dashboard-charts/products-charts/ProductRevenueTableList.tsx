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

// Define types for the data structure
interface ProductRevenueData {
    product_id: string;
    service_id: string;
    service_contribution_revenue: number;
}

interface ProductRevenueTableListProps {
    data: ProductRevenueData[]; // Array of data with defined structure
}

const ProductRevenueTableList: React.FC<ProductRevenueTableListProps> = ({
    data,
}) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedProductId, setSelectedProductId] = useState<string>("All");
    const itemsPerPage: number = 5;

    // Ensure data is defined and is an array
    const tableData: ProductRevenueData[] = Array.isArray(data) ? data : [];

    // Get unique product IDs for the dropdown
    const productIds: string[] = [
        "All",
        ...Array.from(new Set(tableData.map((item) => item.product_id))),
    ];

    // Filter data based on selected product ID
    const filteredData: ProductRevenueData[] =
        selectedProductId === "All"
            ? tableData
            : tableData.filter((item) => item.product_id === selectedProductId);

    // Debug: Log filtered data
    useEffect(() => {
        console.log("Filtered Data:", filteredData);
    }, [filteredData]);

    // Pagination logic
    const totalPages: number = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const paginatedData: ProductRevenueData[] = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

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
                        <TableHead className="text-right">
                            Service Contribution Revenue
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item) => (
                            <TableRow key={`${item.product_id}-${item.service_id}`}>
                                <TableCell>{item.product_id}</TableCell>
                                <TableCell>{item.service_id}</TableCell>
                                <TableCell className="text-right">
                                    ₱
                                    {item.service_contribution_revenue.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
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
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductRevenueTableList;
