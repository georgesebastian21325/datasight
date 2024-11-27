"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/vcomponents/dashboard-ui/resource-components/card";
import {
  fetchTotalResourceCost,
  fetchTotalResourceRevenue,
  fetchCostByResourceType,
  fetchTopRevenueGeneratingResources,
  formatCustom,
  fetchAverageUtilizationResource,
  fetchResourceRevenueForecast, fetchGrossProfitVsPredictedCost
} from "../../app/api/dashboardFunctions/resources-functions";

import CostByResourceTypeChart from "../../app/components/dashboard-charts/resources-charts/CostByResourceTypeChart";
import RevenueByResourceTypeChart from "../../app/components/dashboard-charts/resources-charts/RevenueByResourceType";
import AverageUtilizationChart from "../../app/components/dashboard-charts/resources-charts/AverageUtilizationChart";
import ResourceRevenueForecastChart from "@/app/components/dashboard-charts/resources-charts/ResourceRevenueForecastChart";
import CurrentGrossVsPredictedCostCard from '../../app/components/dashboard-charts/resources-charts/CurrentGrossVsPredCostCard';



type ResourceCostItem = {
  resource_type: string;
  total_resource_cost: number;
};

type ResourceRevenueItem = {
  resource_type: string;
  total_resource_revenue: number;
};

type AverageUtilizationItems = {
  resource_id: string;
  resource_type: string;
  month: string;
  year: string;
  avg_monthly_resource_utilization: number;
};

type ResourceRevenueForecastItems = {
  resource_id: string;
  month_year: string;
  total_resource_revenue: string;
  predicted_revenue: string;
  forecast_revenue: string;
};

type GrossProfitVsPredictedCost = {
  period: string;
  resource_id: string;
  current_gross: string;
  predicted_gross: string;
};

export default function ResourceDashboardComponent() {
  const [loading, setLoading] = useState(true); // Loading state
  const [totalResourceCost, setTotalResourceCost] = useState<string | null>(null);
  const [totalResourceRevenue, setTotalResourceRevenue] = useState<string | null>(null);
  const [costByResourceType, setCostByResourceType] = useState<ResourceCostItem[]>([]);
  const [revenueByResourceType, setRevenueResource] = useState<ResourceRevenueItem[]>([]);
  const [resourceRevenueForecast, setResourceRevenueForecast] = useState<ResourceRevenueForecastItems[]>([]);
  const [averageUtilization, setAverageUtilization] = useState<AverageUtilizationItems[]>([]);
  const [grossProfitVsPredCost, setGrossProfitVsPredCost] = useState<GrossProfitVsPredictedCost[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true); // Start loading
      const resourceCost = await fetchTotalResourceCost();
      const resourceRevenue = await fetchTotalResourceRevenue();
      const costByResourceType = await fetchCostByResourceType();
      const revenueByResourceTypeData = await fetchTopRevenueGeneratingResources();
      const aveUtilizationResource = await fetchAverageUtilizationResource();
      const resourceRevenueForecastData = await fetchResourceRevenueForecast();
      const grossProfitVsPredCostData = await fetchGrossProfitVsPredictedCost();

      if (resourceCost !== null) {
        setTotalResourceCost(formatCustom(resourceCost));
      }

      if (resourceRevenue !== null) {
        setTotalResourceRevenue(formatCustom(resourceRevenue));
      }

      setCostByResourceType(costByResourceType);
      setRevenueResource(revenueByResourceTypeData);
      setAverageUtilization(aveUtilizationResource);
      setResourceRevenueForecast(resourceRevenueForecastData);
      setGrossProfitVsPredCost(grossProfitVsPredCostData);

      setLoading(false); // Stop loading after data is fetched
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820]">
        Resource Layer Dashboard
      </h1>

      {/* 1. Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-8 ">
        <Card
          className={`${loading ? "skeleton bg-blue-950" : "bg-brand-blue "
            } text-white`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Resource Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `₱ ${totalResourceCost}`}
            </div>
          </CardContent>
        </Card>

        <Card className={`${loading ? "skeleton" : ""} bg-black text-white`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue from Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `₱ ${totalResourceRevenue}`}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <CurrentGrossVsPredictedCostCard />
      </div>

      {/* 2. Performance and Financial Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className={`${loading ? "animate-pulse" : ""}`}>
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Cost Per Resource Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48"></div>
            ) : (
              <CostByResourceTypeChart data={costByResourceType} />
            )}
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-4">
          <Card className={`${loading ? "animate-pulse" : ""}`}>
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Revenue Per Resource Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-48"></div>
              ) : (
                <RevenueByResourceTypeChart data={revenueByResourceType} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 mb-8">
        <Card className={`${loading ? "animate-pulse" : ""}`}>
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Resource Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48"></div>
            ) : (
              <ResourceRevenueForecastChart data={resourceRevenueForecast} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. Capacity and Utilization Insights */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <Card className={`${loading ? "animate-pulse" : ""}`}>
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {" "}
              Resource Utilization Trend{" "}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48"></div>
            ) : (
              <AverageUtilizationChart data={averageUtilization} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
