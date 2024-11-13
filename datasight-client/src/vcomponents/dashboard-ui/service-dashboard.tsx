'use client'

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/vcomponents/dashboard-ui/service-components/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/vcomponents/dashboard-ui/service-components/card"

import {
  fetchTotalServiceCost, fetchTotalServiceRevenue, fetchCostPerService,
  fetchRevenueGeneratingServices, compareCostAndRevenue, fetchServiceUtilizationByCategory,
  fetchServiceUtilizationTrend, formatCustom
} from "../../app/api/dashboard-functions/services-function"

import CostPerServiceChart from "@/app/components/dashboard-charts/services-charts/CostPerServiceChart"
import ServiceRevenueChart from "@/app/components/dashboard-charts/services-charts/ServiceRevenueChart"
import ServiceCostChart from "@/app/components/dashboard-charts/services-charts/ServiceCostChart"
import RevenueGeneratingServicesChart from "@/app/components/dashboard-charts/services-charts/RevenueGeneratingServicesChart"
import CompareRevenueCostServicesChart from "@/app/components/dashboard-charts/services-charts/CompareRevenueCostServicesChart"
import AverageServiceUtilizationChart from "@/app/components/dashboard-charts/services-charts/AverageServiceUtilizationChart"
import ServiceUtilTrendChart from "@/app/components/dashboard-charts/services-charts/ServiceUtilTrendChart"

type TotalServiceRevenueItems = {
  service_id: string;
  total_service_revenue: string;
}

type TotalServiceCostItems = {
  service_id: string;
  total_service_cost: string;
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
  const [loading, setLoading] = useState(true);  // Loading state
  const [totalServiceCost, setTotalServiceCost] = useState<TotalServiceCostItems []>([]);
  const [totalServiceRevenue, setTotalServiceRevenue] = useState<TotalServiceRevenueItems[]>([]);
  const [costPerService, setCostPerService] = useState<ServiceCostItem[]>([]);
  const [revenuePerService, setRevenuePerService] = useState<ServiceRevenueItems[]>([]);
  const [costRevenueService, setCostRevenueService] = useState<CostRevenueServiceItems[]>([]);
  const [serviceUtilization, setServiceUtilization] = useState<ServiceUtilizationItems[]>([]);
  const [serviceUtilizationTrend, setServiceUtilizationTrend] = useState<ServiceUtilizationTrendItems[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);  // Start loading
      const serviceCost = await fetchTotalServiceCost();
      const serviceRevenue = await fetchTotalServiceRevenue();
      const costByServiceData = await fetchCostPerService();
      const revenueByServiceData = await fetchRevenueGeneratingServices();
      const comparedCostRevenueServiceData = await compareCostAndRevenue();
      const serviceUtilizationByCategoryData = await fetchServiceUtilizationByCategory();
      const serviceUtilizationTrendData = await fetchServiceUtilizationTrend();

      setTotalServiceCost(serviceCost);


      setTotalServiceRevenue(serviceRevenue);

      setCostPerService(costByServiceData);
      setRevenuePerService(revenueByServiceData);
      setCostRevenueService(comparedCostRevenueServiceData);
      setServiceUtilization(serviceUtilizationByCategoryData);
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
          <Card className={`${loading ? 'animate-pulse ' : ''} `}>
            <CardHeader>
              <CardTitle className='text-sm font-medium'>Total Service Cost</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-48"></div> : <ServiceCostChart data={totalServiceCost} />}
            </CardContent>
          </Card>
          <Card className={`${loading ? 'skeleton ' : ''} text-black`}>
            <CardHeader>
              <CardTitle className='text-sm font-medium'>Total Service Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-48"></div> : <ServiceRevenueChart data={totalServiceRevenue} />}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Financial Performance */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="grid grid-cols-1 gap-4">
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
                <CardTitle className='text-lg font-bold'>Revenue vs. Cost Comparison per Service</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <div className="h-48"></div> : <CompareRevenueCostServicesChart data={costRevenueService} />}
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Card className={`${loading ? 'animate-pulse' : ''}`}>
              <CardHeader>
                <CardTitle className='text-lg font-bold'>Top 5 Revenue-Generating Services with Associated Resources</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <div className="h-48"></div> : <RevenueGeneratingServicesChart data={revenuePerService} />}
              </CardContent>
            </Card>
            <Card className={`${loading ? 'animate-pulse' : ''}`}>
              <CardHeader>
                <CardTitle className='text-lg font-bold'>Average Service Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <div className="h-48"></div> : <AverageServiceUtilizationChart data={serviceUtilization} />}
              </CardContent>
            </Card>
          </div>
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
