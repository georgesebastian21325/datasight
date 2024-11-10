'use client'

import { useState, useEffect } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/vcomponents/dashboard-ui/service-components/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/vcomponents/dashboard-ui/service-components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/vcomponents/dashboard-ui/service-components/table"
import { Bar, BarChart, Line, LineChart, Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/vcomponents/dashboard-ui/service-components/chart"
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react"

import { fetchTotalServiceCost, fetchTotalServiceRevenue, fetchCostPerService, 
         fetchRevenueGeneratingServices, compareCostAndRevenue, fetchServiceUtilizationByCategory, 
         fetchServiceUtilizationTrend, formatCustom } from "@/app/server/services-function"

import CostPerServiceChart from "@/app/components/dashboard-charts/services-charts/CostPerServiceChart"
import RevenueGeneratingServicesChart from "@/app/components/dashboard-charts/services-charts/RevenueGeneratingServicesChart"
import CompareRevenueCostServicesChart from "@/app/components/dashboard-charts/services-charts/CompareRevenueCostServicesChart"
import AverageServiceUtilizationChart from "@/app/components/dashboard-charts/services-charts/AverageServiceUtilizationChart"
import ServiceUtilTrendChart from "@/app/components/dashboard-charts/services-charts/ServiceUtilTrendChart"


// Mock data (same as before)
const mockData = {
  serviceUtilizationTrends: [
    { month: "Jan", Service1: 70, Service2: 65, Service3: 60, Service4: 55, Service5: 50 },
    { month: "Feb", Service1: 75, Service2: 68, Service3: 62, Service4: 58, Service5: 52 },
    { month: "Mar", Service1: 72, Service2: 70, Service3: 65, Service4: 60, Service5: 55 },
    { month: "Apr", Service1: 78, Service2: 72, Service3: 68, Service4: 62, Service5: 58 },
    { month: "May", Service1: 80, Service2: 75, Service3: 70, Service4: 65, Service5: 60 },
  ],
  resourceAttributedCost: [
    { service: "Service 1", ResourceA: 100000, ResourceB: 80000, ResourceC: 60000, ResourceD: 40000, ResourceE: 20000 },
    { service: "Service 2", ResourceA: 90000, ResourceB: 70000, ResourceC: 50000, ResourceD: 30000, ResourceE: 10000 },
    { service: "Service 3", ResourceA: 80000, ResourceB: 60000, ResourceC: 40000, ResourceD: 20000, ResourceE: 0 },
    { service: "Service 4", ResourceA: 70000, ResourceB: 50000, ResourceC: 30000, ResourceD: 0, ResourceE: 0 },
    { service: "Service 5", ResourceA: 60000, ResourceB: 40000, ResourceC: 0, ResourceD: 0, ResourceE: 0 },
  ],
  resourceAttributedRevenue: [
    { service: "Service A", ResourceX: 200000, ResourceY: 150000, ResourceZ: 100000, ResourceW: 50000 },
    { service: "Service B", ResourceX: 180000, ResourceY: 120000, ResourceZ: 80000, ResourceW: 20000 },
    { service: "Service C", ResourceX: 160000, ResourceY: 100000, ResourceZ: 60000, ResourceW: 30000 },
    { service: "Service D", ResourceX: 140000, ResourceY: 80000, ResourceZ: 40000, ResourceW: 40000 },
    { service: "Service E", ResourceX: 120000, ResourceY: 60000, ResourceZ: 20000, ResourceW: 50000 },
  ],
  costlyResourceServiceConnections: [
    { service: "Service 1", resource: "Resource A", cost: 100000 },
    { service: "Service 2", resource: "Resource B", cost: 90000 },
    { service: "Service 3", resource: "Resource C", cost: 80000 },
    { service: "Service 4", resource: "Resource D", cost: 70000 },
    { service: "Service 5", resource: "Resource E", cost: 60000 },
  ],
  serviceCostAtRisk: 500000,
  serviceRevenueStability: [
    { month: "Jan", ServiceA: 100000, ServiceB: 90000, ServiceC: 80000, ServiceD: 70000, ServiceE: 60000 },
    { month: "Feb", ServiceA: 110000, ServiceB: 95000, ServiceC: 85000, ServiceD: 75000, ServiceE: 65000 },
    { month: "Mar", ServiceA: 105000, ServiceB: 92000, ServiceC: 82000, ServiceD: 72000, ServiceE: 62000 },
    { month: "Apr", ServiceA: 115000, ServiceB: 98000, ServiceC: 88000, ServiceD: 78000, ServiceE: 68000 },
    { month: "May", ServiceA: 120000, ServiceB: 100000, ServiceC: 90000, ServiceD: 80000, ServiceE: 70000 },
  ],
  obsolescenceImpact: [
    { service: "Service 1", count: 5 },
    { service: "Service 2", count: 4 },
    { service: "Service 3", count: 3 },
    { service: "Service 4", count: 2 },
    { service: "Service 5", count: 1 },
  ],
}


type ServiceCostItem = {
  service_id: string;
  total_service_cost: string;
}

type ServiceRevenueItems = {
  service_id: string;
  total_service_revenue: string;
  resource_id: string;
  resource_type: string;
}

type CostRevenueServiceItems = {
  service_id: string;
  total_service_cost: string;
  total_service_revenue: string;
}

type ServiceUtilizationItems = {
  service_id: string;
  avg_service_utilization: string;
}

type ServiceUtilizationTrendItems = {
  service_id: string;
  date: string;
  avg_daily_service_utilization: string;
}

export default function ServiceDashboardComponent() {
  const [totalServiceCost, setTotalServiceCost] = useState<string | null>(null);
  const [totalServiceRevenue, setTotalServiceRevenue] = useState<string| null>(null);
  const [costPerService, setCostPerService] = useState<ServiceCostItem[]>([]);
  const [revenuePerService, setRevenuePerService] = useState <ServiceRevenueItems []>([]);
  const [costRevenueService, setCostRevenueService] = useState <CostRevenueServiceItems []>([]);
  const [serviceUtilization, setServiceUtilization] = useState <ServiceUtilizationItems []>([]);


  useEffect(() => {
    async function fetchData() {
      const serviceCost = await fetchTotalServiceCost();
      const serviceRevenue = await fetchTotalServiceRevenue();
      const costByServiceData = await fetchCostPerService();
      const revenueByServiceData = await fetchRevenueGeneratingServices();
      const comparedCostRevenueServiceData = await compareCostAndRevenue(); 
      const serviceUtilizationByCategoryData = await fetchServiceUtilizationByCategory();


      if (serviceCost !== null) {
        setTotalServiceCost(formatCustom(serviceCost));
      }

      if (serviceRevenue !== null) {
        setTotalServiceRevenue(formatCustom(serviceRevenue));
      }

      setCostPerService(costByServiceData);
      setRevenuePerService(revenueByServiceData);
      setCostRevenueService(comparedCostRevenueServiceData);
      setServiceUtilization(serviceUtilizationByCategoryData);

    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820] ">Service Layer Dashboard</h1>

      {/* 1. Key Service Metrics Overview */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card className='bg-brand-blue text-white'>
            <CardHeader>
              <CardTitle className='text-sm font-medium'>Total Service Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$ {totalServiceCost}</p>
            </CardContent>
          </Card>
          <Card className='bg-black text-white'>
            <CardHeader>
              <CardTitle className='text-sm font-medium'>Total Service Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$ {totalServiceRevenue}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Financial Performance */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="grid grid-cols-1 gap-4"> 
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-bold'>Service Cost by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <CostPerServiceChart data={costPerService} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-bold'> Revenue vs. Cost Comparison per Service</CardTitle>
              </CardHeader>
              <CompareRevenueCostServicesChart data={costRevenueService} />
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-bold'> Top 5 Revenue-Generating Services with Associated Resources </CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueGeneratingServicesChart data={revenuePerService} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-bold'>Average Service Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <AverageServiceUtilizationChart data={serviceUtilization} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Service Utilization Insights */}
    </div>
  )
}