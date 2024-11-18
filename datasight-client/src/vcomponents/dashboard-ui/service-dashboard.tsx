'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/vcomponents/dashboard-ui/service-components/card"

import {
  fetchTotalServiceCost, fetchTotalServiceRevenue, fetchCostPerService,
  fetchRevenuePerService, compareCostAndRevenue, fetchServiceResourceList,
  fetchServiceUtilizationTrend, formatCustom
} from "../../app/api/dashboardFunctions/services-function"

import CostPerServiceChart from "@/app/components/dashboard-charts/services-charts/CostPerServiceChart"
import RevenuePerServiceChart from "@/app/components/dashboard-charts/services-charts/RevenuePerServiceChart"
import CompareRevenueCostServicesChart from "@/app/components/dashboard-charts/services-charts/CompareRevenueCostServicesChart"
import ServicesTableList from "@/app/components/dashboard-charts/services-charts/ServicesRevenueTableList"
import ServiceUtilTrendChart from "@/app/components/dashboard-charts/services-charts/ServiceUtilTrendChart"

type TotalServiceRevenueItems = {
  service_id: string;
  total_service_revenue: string;
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

type ServiceResourceListItems = {
  service_id: string;
  resource_id: string;
  resource_type: string;
  revenue_generated_based_on_resource_id: string;
}

type ServiceUtilizationTrendItems = {
  service_id: string;
  date: string;
  avg_daily_service_utilization: string;
}

export default function ServiceDashboardComponent() {
  const [loading, setLoading] = useState(true);  // Loading state

  const [totalServiceCost, setTotalServiceCost] = useState<string | null>(null)
  const [totalServiceRevenue, setTotalServiceRevenue] = useState<string | null>(null)
  const [costPerService, setCostPerService] = useState<ServiceCostItem[]>([]);
  const [revenuePerService, setRevenuePerService] = useState<ServiceRevenueItems[]>([]);
  const [costRevenueService, setCostRevenueService] = useState<CostRevenueServiceItems[]>([]);
  const [serviceUtilizationTrend, setServiceUtilizationTrend] = useState<ServiceUtilizationTrendItems[]>([]);
  const [serviceResourceList, setServiceResourceList] = useState<ServiceResourceListItems[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);  // Start loading
      const serviceCost = await fetchTotalServiceCost();
      const serviceRevenue = await fetchTotalServiceRevenue();
      const costByServiceData = await fetchCostPerService();
      const revenueByServiceData = await fetchRevenuePerService();
      const comparedCostRevenueServiceData = await compareCostAndRevenue();
      const serviceResourceListData = await fetchServiceResourceList();
      const serviceUtilizationTrendData = await fetchServiceUtilizationTrend();


      if (serviceCost !== null) {
        setTotalServiceCost(formatCustom(serviceCost));
      }

      if (serviceRevenue !== null) {
        setTotalServiceRevenue(formatCustom(serviceRevenue));
      }


      setCostPerService(costByServiceData);
      setRevenuePerService(revenueByServiceData);
      setCostRevenueService(comparedCostRevenueServiceData);
      setServiceResourceList(serviceResourceListData);
      setServiceUtilizationTrend(serviceUtilizationTrendData);
      setLoading(false);  // Stop loading after data is fetched
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820]">Service Layer Dashboard</h1>

      {/* 1. Key Service Metrics Overview */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card className={`${loading ? 'skeleton bg-blue-950' : 'bg-brand-blue '} text-white`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Service Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : `$ ${totalServiceCost}`}</div>
            </CardContent>
          </Card>
          <Card className={`${loading ? 'skeleton bg-black' : 'bg-black'} text-white`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Service Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : `$ ${totalServiceRevenue}`}</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Financial Performance */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
          <Card className={`${loading ? 'animate-pulse' : ''}`}>
            <CardHeader>
              <CardTitle className='text-lg font-bold'>Service Cost by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-48"></div> : <CostPerServiceChart data={costPerService} />}
            </CardContent>
          </Card>
          <Card className={`${loading ? 'animate-pulse' : ''}`}>
            <CardHeader>
              <CardTitle className='text-lg font-bold'>Service Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-48"></div> : <RevenuePerServiceChart data={revenuePerService} />}
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className={`${loading ? 'animate-pulse' : ''}`}>
            <CardHeader>
              <CardTitle className='text-lg font-bold'>Revenue vs. Cost Comparison per Service</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-48"></div> : <CompareRevenueCostServicesChart data={costRevenueService} />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-bold'> Associated Services Per Resources (Revenue) </CardTitle>
              <CardDescription> List of resources associated for each service by revenue. </CardDescription>
            </CardHeader>

            <CardContent>
              <ServicesTableList data={serviceResourceList} />
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-bold'> Service Utilization Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceUtilTrendChart data={serviceUtilizationTrend} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
