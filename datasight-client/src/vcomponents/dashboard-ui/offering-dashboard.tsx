'use client'

import { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/vcomponents/dashboard-ui/offering-components/card'

import { fetchOfferingCost, fetchOfferingRevenue, fetchOfferingProductionCostContribution, fetchOfferingProductRevenueContribution, fetchOfferingRevenueStability } from '@/app/api/dashboard-functions/offerings-functions'

import OfferingCostChart from '@/app/components/dashboard-charts/offerings-charts/OfferingsCostChart'
import OfferingRevenueChart from '@/app/components/dashboard-charts/offerings-charts/OfferingRevenueChart'
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
  const [offeringCost, setOfferingCost] = useState<OfferingCostItems[]>([]);
  const [offeringRevenue, setOfferingRevenue] = useState<OfferingRevenueItems[]>([]);
  const [offeringProdCostContribution, setOfferingProdCostContribution] = useState<OfferingProductContributionCostItems[]>([]);
  const [offeringProdRevenueContribution, setOfferingProdRevenueContribution] = useState<OfferingProductContributionRevenueItems[]>([]);
  const [offeringRevenueStability, setOfferingRevenueStability] = useState<OfferingRevenueStabilityItems[]>([]);



  useEffect(() => {
    async function fetchData() {
      const offeringCostData = await fetchOfferingCost();
      const offeringRevenueData = await fetchOfferingRevenue();
      const offeringProdCostContributionData = await fetchOfferingProductionCostContribution();
      const offeringProdRevenueContributionData = await fetchOfferingProductRevenueContribution();
      const offeringRevenueStabilityData = await fetchOfferingRevenueStability();

      setOfferingCost(offeringCostData);
      setOfferingRevenue(offeringRevenueData);
      setOfferingProdCostContribution(offeringProdCostContributionData);
      setOfferingProdRevenueContribution(offeringProdRevenueContributionData);
      setOfferingRevenueStability(offeringRevenueStabilityData)
    }

    fetchData();
  }, [])


  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820] ">Offering Layer Dashboard</h1>
      {/* Key Offering Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Total Offering Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <OfferingCostChart data={offeringCost} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Total Offering Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <OfferingRevenueChart data={offeringRevenue} />
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