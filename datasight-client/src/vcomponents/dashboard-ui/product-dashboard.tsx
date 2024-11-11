'use client'

import { useState, useEffect } from 'react'

import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/vcomponents/dashboard-ui/product-components/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/vcomponents/dashboard-ui/product-components/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/vcomponents/dashboard-ui/product-components/chart'
import { Bar, BarChart, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts'

import { fetchTotalProductCost, fetchTotalProductRevenue, fetchProductCostByCategory, fetchRevenueByProduct, fetchProductRevenueContribution } from '../../app/api/dashboard-functions/products-functions'
import { formatCustom } from '@/app/api/dashboard-functions/global-dashboard-functions'

import CostByProductChart from '@/app/components/dashboard-charts/products-charts/CostByProductChart.tsx';
import RevenueByProductChart from '@/app/components/dashboard-charts/products-charts/RevenueByProductChart';
import ProductRevenueContributionChart from '@/app/components/dashboard-charts/products-charts/ProductRevenueContributionChart'

  

type ProductCostItem = {
  product_id: string;
  total_product_cost: string;
};

type ProductRevenueItem = {
  product_id: string;
  total_product_revenue: string;
}

type ProductRevenueContributionItems = {
  product_id: string;
  total_revenue: string;
  revenue_percentage: string;
};

export default function ProductLayerDashboard() {
  const [totalProductCost, setTotalProductCost] = useState<string | null>(null)
  const [totalProductRevenue, setTotalProductRevenue] = useState<string | null>(null)
  const [costPerProduct, setCostPerProduct] = useState<ProductCostItem[]>([]);
  const [revenuePerProduct, setRevenuePerProduct] = useState < ProductRevenueItem []>([]);
  const [productContribution, setProductContribution] = useState < ProductRevenueContributionItems []>([]);


  useEffect(() => {
    async function fetchData() {
      const totalProductCostData = await fetchTotalProductCost();
      const totalProductRevenueData = await fetchTotalProductRevenue();
      const costPerProductData = await fetchProductCostByCategory();
      const revenuePerProductData = await fetchRevenueByProduct();
      const productContributionData = await fetchProductRevenueContribution();

      if (totalProductCostData !== null) {
        setTotalProductCost(formatCustom(totalProductCostData));
      }

      if(totalProductRevenueData !== null) {
        setTotalProductRevenue(formatCustom(totalProductRevenueData));
      }

      setCostPerProduct(costPerProductData);
      setRevenuePerProduct(revenuePerProductData);
      setProductContribution(productContributionData);

    }

    fetchData();
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820] ">Product Layer Dashboard</h1>

      <section className="mb-8">
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <Card className='bg-black text-white'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Product Cost</CardTitle>
              <DollarSign className="h-4 w-4  text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$ {totalProductCost}</div>
            </CardContent>
          </Card>
          <Card className='bg-brand-blue text-white'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Product Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$ {totalProductRevenue}</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-bold'>Cost Per Product</CardTitle>
            </CardHeader>
            <CardContent>
              <CostByProductChart data={costPerProduct} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-bold'>Revenue Per Product</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueByProductChart data={revenuePerProduct} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-bold'> Product Revenue Contribution to Total Revenue </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductRevenueContributionChart data={productContribution} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}