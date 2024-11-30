'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/vcomponents/dashboard-ui/service-components/card"

import {
  fetchTotalServiceCost, fetchTotalServiceRevenue, fetchCostPerService,
  fetchRevenuePerService, compareCostAndRevenue, fetchServiceResourceList, fetchServiceCostTableList,
  fetchServiceUtilizationTrend, fetchServiceRevenueForecast, formatCustom
} from "../../app/api/dashboardFunctions/services-function"

import CostPerServiceChart from "@/app/components/dashboard-charts/services-charts/CostPerServiceChart"
import RevenuePerServiceChart from "@/app/components/dashboard-charts/services-charts/RevenuePerServiceChart"
import ServicesTableList from "@/app/components/dashboard-charts/services-charts/ServicesRevenueTableList"
import ServiceCostTableList from "@/app/components/dashboard-charts/services-charts/ServiceCostTableList"
import ServiceUtilTrendChart from "@/app/components/dashboard-charts/services-charts/ServiceUtilTrendChart"
import ServiceRevenueForecastChart from "@/app/components/dashboard-charts/services-charts/ServiceRevenueForecastChart"

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

type ServiceCostTableListItems = {
  service_id: string;
  resource_id: string;
  resource_type: string;
  cost_generated_based_on_resource_id: number;
}

type ServiceUtilizationTrendItems = {
  service_id: string;
  date: string;
  avg_daily_service_utilization: number;
}

type ServiceRevenueForecastItems = {
  service_id: string;
  month_year: string;
  total_service_revenue: string;
  predicted_revenue: string;
  forecast_revenue: string;
}

export default function ServiceDashboardComponent() {
  const [loading, setLoading] = useState(true);  // Loading state

  const [totalServiceCost, setTotalServiceCost] = useState<string | null>(null)
  const [totalServiceRevenue, setTotalServiceRevenue] = useState<string | null>(null)
  const [costPerService, setCostPerService] = useState<ServiceCostItem[]>([]);
  const [revenuePerService, setRevenuePerService] = useState<ServiceRevenueItems[]>([]);
  const [serviceUtilizationTrend, setServiceUtilizationTrend] = useState<ServiceUtilizationTrendItems[]>([]);
  const [serviceCostList, setServiceCostList] = useState<ServiceCostTableListItems[]>([]);
  const [serviceResourceList, setServiceResourceList] = useState<ServiceResourceListItems[]>([]);
  const [serviceRevenueForecast, setServiceRevenueForecast] = useState<ServiceRevenueForecastItems[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);  // Start loading
      const serviceCost = await fetchTotalServiceCost();
      const serviceRevenue = await fetchTotalServiceRevenue();
      const costByServiceData = await fetchCostPerService();
      const revenueByServiceData = await fetchRevenuePerService();
      const serviceResourceListData = await fetchServiceResourceList();
      const serviceCostListData = await fetchServiceCostTableList();
      const serviceUtilizationTrendData = await fetchServiceUtilizationTrend();
      const serviceRevenueForecastData = await fetchServiceRevenueForecast();


      if (serviceCost !== null) {
        setTotalServiceCost(formatCustom(serviceCost));
      }

      if (serviceRevenue !== null) {
        setTotalServiceRevenue(formatCustom(serviceRevenue));
      }


      setCostPerService(costByServiceData);
      setRevenuePerService(revenueByServiceData);
      setServiceCostList(serviceCostListData);
      setServiceResourceList(serviceResourceListData);
      setServiceUtilizationTrend(serviceUtilizationTrendData);
      // setServiceRevenueForecast(serviceRevenueForecastData);
      setLoading(false);  // Stop loading after data is fetched
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="mb-6 flex items-center text-center justify-center">
        <h1 className="text-3xl text-center mt-5 font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820]">
          SERVICE LAYER
        </h1>
      </Card>
      {/* 1. Key Service Metrics Overview */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card className={`${loading ? 'skeleton bg-blue-950' : 'bg-brand-blue '} text-white`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Service Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : `₱ ${totalServiceCost}`}</div>
            </CardContent>
          </Card>
          <Card className={`${loading ? 'skeleton bg-black' : 'bg-black'} text-white`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Service Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : `₱ ${totalServiceRevenue}`}</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Financial Performance */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
          <Card className={`${loading ? 'animate-pulse' : ''}`}>
            <CardHeader>
              <CardTitle className='text-lg font-bold'>Service Cost By ID</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-48"></div> : <CostPerServiceChart data={costPerService} />}
            </CardContent>
          </Card>
          <Card className={`${loading ? 'animate-pulse' : ''}`}>
            <CardHeader>
              <CardTitle className='text-lg font-bold'>Service Revenue By ID</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-48"></div> : <RevenuePerServiceChart data={revenuePerService} />}
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-bold'> Associated Services Per Resources (Cost) </CardTitle>
              <CardDescription> List of resources associated for each service by cost. </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceCostTableList data={serviceCostList} />
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
        {/*
          <div className="grid grid-cols-1 mb-8">
            <Card className={`${loading ? 'animate-pulse' : ''}`}>
              <CardHeader>
                <CardTitle className='text-lg font-bold'>Service Forecast Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <div className="h-48"></div> : <ServiceRevenueForecastChart data={serviceRevenueForecast} />}
              </CardContent>
            </Card>
          </div>
        */}
        {/*
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
        */}
      </section>
    </div>
  )
}
