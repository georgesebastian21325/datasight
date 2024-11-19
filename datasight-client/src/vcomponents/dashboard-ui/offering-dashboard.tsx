'use client'

import { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/vcomponents/dashboard-ui/offering-components/card'

import { fetchTotalOfferingCost, fetchTotalOfferingRevenue, fetchCostByOffering, fetchRevenueByOffering, fetchOfferingRevenueStability, fetchOfferingRevenueForecast } from '@/app/api/dashboardFunctions/offerings-functions'
import { formatCustom } from '@/app/api/dashboardFunctions/global-dashboard-functions'

import CostByOfferingChart from '@/app/components/dashboard-charts/offerings-charts/CostByOfferingChart'
import RevenueByOfferingChart from '@/app/components/dashboard-charts/offerings-charts/RevenueByOfferingChart'
import OfferingRevenueStabiityChart from '@/app/components/dashboard-charts/offerings-charts/OfferingRevenueStabilityChart'
import OfferingRevenueForecastChart from '@/app/components/dashboard-charts/offerings-charts/OfferingRevenueForecast'

type OfferingCostItems = {
  offering_id: string;
  total_offering_cost: string;
};

type OfferingRevenueItems = {
  offering_id: string;
  total_offering_revenue: string;
}

type OfferingRevenueForecastItems = {
  offering_id: string;
  month_year: string;
  offering_revenue: string;
  predicted_revenue: string;
  forecast_revenue: string;
}

type OfferingRevenueStabilityItems = {
  date: string;
  offering_id: string;
  daily_offering_revenue: string;
};


export default function OfferingDashboardComponent() {
  const [loading, setLoading] = useState(true);  // Loading state

  const [offeringCost, setOfferingCost] = useState<string | null>(null)
  const [offeringRevenue, setOfferingRevenue] = useState<string | null>(null)
  const [costByOffering, setCostByOffering] = useState<OfferingCostItems[]>([]);
  const [revenueByOffering, setRevenueByOffering] = useState<OfferingRevenueItems[]>([]);
  const [offeringRevenueStability, setOfferingRevenueStability] = useState<OfferingRevenueStabilityItems[]>([]);
  const [offeringRevenueForecast, setOfferingRevenueForecast] = useState<OfferingRevenueForecastItems[]>([]);



  useEffect(() => {
    async function fetchData() {
      const offeringCostData = await fetchTotalOfferingCost();
      const offeringRevenueData = await fetchTotalOfferingRevenue();
      const costByOfferingData = await fetchCostByOffering();
      const revenueByOfferingData = await fetchRevenueByOffering();
      const offeringRevenueStabilityData = await fetchOfferingRevenueStability();
      const offeringRevenueForecast = await fetchOfferingRevenueForecast();

      if (offeringCostData !== null) {
        setOfferingCost(formatCustom(offeringCostData));

      }

      if (offeringRevenueData !== null) {
        setOfferingRevenue(formatCustom(offeringRevenueData));

      }

      setCostByOffering(costByOfferingData);
      setRevenueByOffering(revenueByOfferingData);
      setOfferingRevenueStability(offeringRevenueStabilityData)
      setOfferingRevenueForecast(offeringRevenueForecast)

      setLoading(false);  // Stop loading after data is fetched
    }

    fetchData();
  }, [])


  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820] ">Offering Layer Dashboard</h1>
      {/* Key Offering Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card className={`${loading ? 'skeleton bg-blue-950' : 'bg-brand-blue '} text-white`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offering Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : `$ ${offeringCost}`}</div>
          </CardContent>
        </Card>
        <Card className={`${loading ? 'skeleton bg-black' : 'bg-black '} text-white`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offering Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : `$ ${offeringRevenue}`}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"> 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Cost By Offering </CardTitle>
          </CardHeader>
          <CardContent>
            <CostByOfferingChart data={costByOffering} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Revenue By Offering</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueByOfferingChart data={revenueByOffering} />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4"> 
        <Card> 
          <CardHeader>
            <CardTitle> Offering Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent>
              <OfferingRevenueForecastChart data={offeringRevenueForecast} />
          </CardContent>
        </Card>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4"> 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Daily Revenue Trend for Offering</CardTitle>
          </CardHeader>
          <CardContent>
            <OfferingRevenueStabiityChart data={offeringRevenueStability} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}