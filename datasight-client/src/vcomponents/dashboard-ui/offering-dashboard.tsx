'use client'

import { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/vcomponents/dashboard-ui/offering-components/card'

import { fetchTotalOfferingCost, fetchTotalOfferingRevenue, fetchOfferingProductionCostContribution, fetchOfferingProductRevenueContribution, fetchOfferingRevenueStability } from '@/app/api/dashboardFunctions/offerings-functions'
import { formatCustom } from '@/app/api/dashboardFunctions/global-dashboard-functions'

import OfferingProductCostContributionChart from '@/app/components/dashboard-charts/offerings-charts/OfferingProductCostContributionChart'
import OfferingProductRevenuetContributionChart from '@/app/components/dashboard-charts/offerings-charts/OfferingProductRevenueContribution'
import OfferingRevenueStabiityChart from '@/app/components/dashboard-charts/offerings-charts/OfferingRevenueStabilityChart'

type OfferingCostItems = {
  offering_id: string;
  total_offering_cost: string;
}

type OfferingRevenueItems = {
  offering_id: string;
  total_offering_revenue: string;
}

type OfferingProductContributionCostItems = {
  offering_id: string;
  product_id: string;
  product_contribution_to_offering_cost: string;
};

type OfferingProductContributionRevenueItems = {
  offering_id: string;
  product_id: string;
  product_contribution_to_offering_revenue: string;
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
  const [offeringProdCostContribution, setOfferingProdCostContribution] = useState<OfferingProductContributionCostItems[]>([]);
  const [offeringProdRevenueContribution, setOfferingProdRevenueContribution] = useState<OfferingProductContributionRevenueItems[]>([]);
  const [offeringRevenueStability, setOfferingRevenueStability] = useState<OfferingRevenueStabilityItems[]>([]);



  useEffect(() => {
    async function fetchData() {
      const offeringCostData = await fetchTotalOfferingCost();
      const offeringRevenueData = await fetchTotalOfferingRevenue();
      const offeringProdCostContributionData = await fetchOfferingProductionCostContribution();
      const offeringProdRevenueContributionData = await fetchOfferingProductRevenueContribution();
      const offeringRevenueStabilityData = await fetchOfferingRevenueStability();

      if (offeringCostData !== null) {
        setOfferingCost(formatCustom(offeringCostData));

      }

      if (offeringRevenueData !== null) {
        setOfferingRevenue(formatCustom(offeringRevenueData));

      }

      setOfferingProdCostContribution(offeringProdCostContributionData);
      setOfferingProdRevenueContribution(offeringProdRevenueContributionData);
      setOfferingRevenueStability(offeringRevenueStabilityData)

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
            <CardTitle className="text-sm font-medium">Total Service Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : `$ ${offeringCost}`}</div>
          </CardContent>
        </Card>
        <Card className={`${loading ? 'skeleton bg-black' : 'bg-black '} text-white`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Service Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : `$ ${offeringRevenue}`}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"> 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Product-Attributed Cost Per Offering</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <OfferingProductCostContributionChart data={offeringProdCostContribution} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Product-Attributed Revenue Per Offering</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <OfferingProductRevenuetContributionChart data={offeringProdRevenueContribution} />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4"> 
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Daily Revenue Trend for Offering</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <OfferingRevenueStabiityChart data={offeringRevenueStability} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}