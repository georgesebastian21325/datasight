"use client"

import { useState, useEffect } from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/vcomponents/dashboard-ui/resource-components/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/vcomponents/dashboard-ui/resource-components/chart"

import { fetchTotalResourceCost, fetchTotalResourceRevenue, fetchCostByResourceType, fetchTopCostliestResources, 
         fetchTopRevenueGeneratingResources, formatCustom, fetchAverageUtilizationResource, 
         fetchHighestUtilizedResources, fetchLowestUtilizedResources 
        } from '../../app/server/resources-functions'

import CostByResourceTypeChart from '../../app/components/dashboard-charts/resources-charts/CostByResourceTypeChart'
import CostliestResourceChart from '../../app/components/dashboard-charts/resources-charts/CostliestResourceChart'
import RevenueResourceChart from '../../app/components/dashboard-charts/resources-charts/RevenueResourceChart'
import AverageUtilizationChart from '../../app/components/dashboard-charts/resources-charts/AverageUtilizationChart';
import HighestUtilizedResourcesChart from '../../app/components/dashboard-charts/resources-charts/HighestUtilizedResourcesChart'
import LowestUtlizedResourcesChart from '../../app/components/dashboard-charts/resources-charts/LowestUtilizedResourcesChart'


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

type HighestUtilizedItems = {
  resource_type: string;
  average_usage_percentage: string;
}

type LowestUtilizedItems = {
  resource_id: string;
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
  const [highestUtilization, setHighestUtilization] = useState<HighestUtilizedItems []> ([]);
  const [lowestUtilization, setLowestUtilization] = useState <LowestUtilizedItems []> ([]);

  useEffect(() => {
    async function fetchData() {
      const cost = await fetchTotalResourceCost();
      const revenue = await fetchTotalResourceRevenue();
      const costByResourceType = await fetchCostByResourceType();
      const costliestResource = await fetchTopCostliestResources();
      const revenueResource = await fetchTopRevenueGeneratingResources();
      const aveUtilizationResource = await fetchAverageUtilizationResource();
      const highestUtilizedResources = await fetchHighestUtilizedResources();
      const lowestUtilizedResources = await fetchLowestUtilizedResources();

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
      setHighestUtilization(highestUtilizedResources)
      setLowestUtilization(lowestUtilizedResources)

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
        <Card>
          <CardHeader>
            <CardTitle>Average Utilization by Resource Type</CardTitle>
          </CardHeader>
          <CardContent>
            <AverageUtilizationChart data={averageUtilization} />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-4">
          <Card >
            <CardHeader>
              <CardTitle>Highest Utilized Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <HighestUtilizedResourcesChart data={highestUtilization} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lowest Utilized Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <LowestUtlizedResourcesChart data={lowestUtilization} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

