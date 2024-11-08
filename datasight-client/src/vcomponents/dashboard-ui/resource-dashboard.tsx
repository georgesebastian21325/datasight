"use client"

import { useState, useEffect } from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/vcomponents/dashboard-ui/resource-components/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart"

import { fetchTotalResourceCost, fetchTotalResourceRevenue, fetchCostByResourceType, fetchTopCostliestResources, fetchTopRevenueGeneratingResources, formatCustom, fetchAverageUtilizationResource } from '../../app/server/resource-functions'

import CostByResourceTypeChart from './resource-components/charts/CostByResourceTypeChart'
import CostliestResourceChart from './resource-components/charts/CostliestResourceChart'
import RevenueResourceChart from './resource-components/charts/RevenueResourceChart'
import AverageUtilizationChart from './resource-components/charts/AverageUtilizationChart';


const resourceData = {
  highestUtilizedResources: [
    { resource_id: 'SRV001', total_usage_percentage: 95, resource_type: 'Servers' },
    { resource_id: 'CLD002', total_usage_percentage: 92, resource_type: 'Cloud Infrastructure' },
    { resource_id: 'NET003', total_usage_percentage: 88, resource_type: 'Network Equipment' },
    { resource_id: 'SRV004', total_usage_percentage: 87, resource_type: 'Servers' },
    { resource_id: 'CMP005', total_usage_percentage: 85, resource_type: 'Computers' },
  ],
  lowestUtilizedResources: [
    { resource_id: 'STR001', total_usage_percentage: 30, resource_type: 'Storage Devices' },
    { resource_id: 'CMP002', total_usage_percentage: 35, resource_type: 'Computers' },
    { resource_id: 'NET003', total_usage_percentage: 40, resource_type: 'Network Equipment' },
    { resource_id: 'SRV004', total_usage_percentage: 45, resource_type: 'Servers' },
    { resource_id: 'CLD005', total_usage_percentage: 50, resource_type: 'Cloud Infrastructure' },
  ],
  overCapacityResources: 8,
  averageMaintenanceCost: 25000,
  obsolescenceRisk: [
    { resource_type: 'Computers', count: 5 },
    { resource_type: 'Servers', count: 3 },
    { resource_type: 'Network Equipment', count: 2 },
    { resource_type: 'Storage Devices', count: 1 },
    { resource_type: 'Cloud Infrastructure', count: 1 },
  ],
  ageVsMaintenance: [
    { age: 1, total_maintenance_cost: 5000 },
    { age: 2, total_maintenance_cost: 10000 },
    { age: 3, total_maintenance_cost: 15000 },
    { age: 4, total_maintenance_cost: 25000 },
    { age: 5, total_maintenance_cost: 40000 },
  ],
  riskWeightedCost: 3000000,
  resourcePerformanceIndex: 1.5,
  topRiskResources: [
    { resource_id: 'SRV001', risk_score: 0.9, resource_type: 'Servers' },
    { resource_id: 'NET002', risk_score: 0.85, resource_type: 'Network Equipment' },
    { resource_id: 'CMP003', risk_score: 0.8, resource_type: 'Computers' },
    { resource_id: 'STR004', risk_score: 0.75, resource_type: 'Storage Devices' },
    { resource_id: 'CLD005', risk_score: 0.7, resource_type: 'Cloud Infrastructure' },
  ],
}

type ResourceCostItem = {
  resource_id: string;
  resource_type: string;
  total_resource_cost: string;
};

type CostliestItem = {
  resource_id: string;
  resource_type: string;
  total_resource_cost: string;
}

type RevenueItem = {
  resource_id: string;
  total_resource_revenue: string;
}

type AverageUtilizationItems = {
  resource_type: string;
  average_usage_percentage: string;
}


export default function ResourceDashboardComponent() {
  const [totalResourceCost, setTotalResourceCost] = useState<string | null>(null)
  const [totalResourceRevenue, setTotalResourceRevenue] = useState<string | null>(null)
  const [costByResourceType, setCostByResourceType] = useState<ResourceCostItem[]>([]);
  const [costliestResource, setCostliestResource] = useState<CostliestItem[]>([]);
  const [revenueResource, setRevenueResource] = useState<RevenueItem[]>([]);
  const [averageUtilization, setAverageUtilization] = useState<AverageUtilizationItems []> ([]);

  useEffect(() => {
    async function fetchData() {
      const cost = await fetchTotalResourceCost();
      const revenue = await fetchTotalResourceRevenue();
      const costByResourceType = await fetchCostByResourceType();
      const costliestResource = await fetchTopCostliestResources();
      const revenueResource = await fetchTopRevenueGeneratingResources();
      const aveUtilizationResource = await fetchAverageUtilizationResource();

      if (cost !== null) {
        setTotalResourceCost(formatCustom(cost));
      }

      if (revenue !== null) {
        setTotalResourceRevenue(formatCustom(revenue));
      }

      setCostByResourceType(costByResourceType);
      setCostliestResource(costliestResource);
      setRevenueResource(revenueResource);
      setAverageUtilization(aveUtilizationResource);

    }

    fetchData();
  }, []);


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820]  ">Resource Layer Dashboard</h1>
      {/* 1. Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Card className='bg-brand-blue text-white'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium ">Total Resource Cost</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path className='text-white' d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent className='text-white'>
            <div className="text-2xl font-bold">$ {totalResourceCost}</div>
          </CardContent>
        </Card>
        <Card className='bg-black text-white '>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue from Resources</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path className='text-white' d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$ {totalResourceRevenue}</div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Performance and Financial Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Cost by Resource Type</CardTitle>
          </CardHeader>
          <CardContent>
            <CostByResourceTypeChart data={costByResourceType} />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Costliest Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <CostliestResourceChart data={costliestResource} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Revenue-Generating Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueResourceChart data={revenueResource} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Capacity and Utilization Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className='bg-gray-50'>
          <CardHeader>
            <CardTitle>Average Utilization by Resource Type</CardTitle>
          </CardHeader>
          <CardContent>
            <AverageUtilizationChart data={averageUtilization} />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Highest Utilized Resources</CardTitle>
            </CardHeader>
            <CardContent>

            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lowest Utilized Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resourceData.lowestUtilizedResources.map((resource, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{resource.resource_id} ({resource.resource_type})</span>
                    <span className="font-semibold">{resource.total_usage_percentage}%</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

