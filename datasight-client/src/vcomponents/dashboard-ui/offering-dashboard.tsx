'use client'

import { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/vcomponents/dashboard-ui/offering-components/card'

import { fetchOfferingCost, fetchOfferingRevenue } from '@/app/api/dashboard-functions/offerings-functions'

import OfferingCostChart from '@/app/components/dashboard-charts/offerings-charts/OfferingsCostChart'
import OfferingRevenueChart from '@/app/components/dashboard-charts/offerings-charts/OfferingRevenueChart'



type OfferingCostItems = {
  offering_id: string;
  total_offering_cost: string;
}

type OfferingRevenueItems = {
  offering_id: string;
  total_offering_revenue: string;
}

export default function OfferingDashboardComponent() {
  const [offeringCost, setOfferingCost] = useState<OfferingCostItems[]>([]);
  const [offeringRevenue, setOfferingRevenue] = useState<OfferingRevenueItems[]>([]);

  useEffect(() => {
    async function fetchData() {
      const offeringCostData = await fetchOfferingCost();
      const offeringRevenueData = await fetchOfferingRevenue();
      setOfferingCost(offeringCostData);
      setOfferingRevenue(offeringRevenueData);
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
    </div>
  )
}