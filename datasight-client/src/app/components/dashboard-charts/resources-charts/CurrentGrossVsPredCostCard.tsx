"use client";

import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/vcomponents/dashboard-ui/resource-components/current-gross-pred-cost-components/card";
import { Progress } from "@/vcomponents/dashboard-ui/resource-components/current-gross-pred-cost-components/progress";

// Define the DataItem type
interface DataItem {
  period: string;
  resource_id: string;
  current_gross_profit: number;
  predicted_gross_profit: number;
}

// Define the component props
interface CurrentGrossVsPredCostCardProps {
  data: DataItem[];
}

export default function CurrentGrossVsPredCostCard({ data }: CurrentGrossVsPredCostCardProps) {
  // Extract unique values for filters from the data
  const resourceIds = Array.from(new Set(data.map(item => item.resource_id)));
  const startDates = Array.from(new Set(data.map(item => item.period.split(' ')[0])));
  const endDates = Array.from(new Set(data.map(item => item.period.split(' ')[0])));

  // Set the default filter values to the first data entries
  const [resourceIdFilter, setResourceIdFilter] = useState<string>(resourceIds[0]);
  const [startDateFilter, setStartDateFilter] = useState<string>(startDates[0]);
  const [endDateFilter, setEndDateFilter] = useState<string>(endDates[0]);

  // State for the filtered data
  const [filteredData, setFilteredData] = useState<DataItem[]>(data);  // Initially show all data

  // Handle invalid date selection and reset the filters
  useEffect(() => {
    let filtered = data;

    // Check if selected dates are valid before applying filters
    const validStartDate = new Date(startDateFilter);
    const validEndDate = new Date(endDateFilter);

    if (validStartDate > validEndDate) {
      // If start date is later than end date, reset filters to default values
      setStartDateFilter(startDates[0]);
      setEndDateFilter(endDates[0]);
      return; // Avoid filtering data in this case
    }

    // Apply filters only if valid dates are selected
    if (resourceIdFilter) {
      filtered = filtered.filter(item => item.resource_id === resourceIdFilter);
    }

    filtered = filtered.filter(item => new Date(item.period) >= validStartDate && new Date(item.period) <= validEndDate);

    setFilteredData(filtered);
  }, [data, resourceIdFilter, startDateFilter, endDateFilter, startDates, endDates]);

  // Set the current data to display (use the first item from filtered data)
  const [currentData, setCurrentData] = useState<DataItem | null>(null);

  useEffect(() => {
    if (filteredData.length > 0) {
      setCurrentData(filteredData[0]);
    } else {
      setCurrentData(null); // If no data matches the filter, reset
    }
  }, [filteredData]);

  const difference = currentData ? currentData.current_gross_profit - currentData.predicted_gross_profit : 0;
  const isPositive = difference > 0;
  const percentDifference = (difference / (currentData?.predicted_gross_profit || 1)) * 100;
  const progressPercentage = (currentData ? currentData.current_gross_profit / (currentData.current_gross_profit + currentData.predicted_gross_profit) : 0) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Recalculate valid start dates whenever the end date filter changes
  const validStartDates = startDates.filter((date) => new Date(date) <= new Date(endDateFilter));

  return (
    <CardContent className="space-y-4">
      {/* Filters Section */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Resource ID</label>
          <select
            value={resourceIdFilter}
            onChange={(e) => setResourceIdFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            {resourceIds.map((resourceId) => (
              <option key={resourceId} value={resourceId}>
                {resourceId}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium">Start Date</label>
          <select
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            {validStartDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium">End Date</label>
          <select
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            {endDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Displaying financial comparison */}
      {currentData ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Gross Profit</p>
              <p className="text-2xl font-bold">{formatCurrency(currentData.current_gross_profit)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Predicted Gross Profit</p>
              <p className="text-2xl font-bold">{formatCurrency(currentData.predicted_gross_profit)}</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Difference</p>
            <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
              <span className="text-lg font-bold">{formatCurrency(Math.abs(difference))}</span>
              <span className="ml-1 text-sm">({percentDifference.toFixed(1)}%)</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">No data matches the selected filters</div>
      )}
    </CardContent>
  );
}
