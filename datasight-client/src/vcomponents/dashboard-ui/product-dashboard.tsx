'use client'

import { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/vcomponents/dashboard-ui/product-components/card'

import CostByProductChart from '@/app/components/dashboard-charts/products-charts/CostByProductChart.tsx';
import RevenueByProductChart from '@/app/components/dashboard-charts/products-charts/RevenueByProductChart';
import ProductUtilizationTrendChart from '@/app/components/dashboard-charts/products-charts/ProductUtilizationTrendChart';
import ProductRevenueForecastChart from '@/app/components/dashboard-charts/products-charts/ProductRevenueForecastChart';

import { fetchTotalProductCost, fetchTotalProductRevenue, fetchProductCostByCategory, 
          fetchRevenueByProduct, fetchProductRevenueContribution, fetchProductUtilizationRate, 
          fetchProductRevenueForecast, fetchProductUtilizationTrend } from '../../app/api/dashboardFunctions/products-functions'
import { formatCustom } from '@/app/api/dashboardFunctions/global-dashboard-functions'

type ProductCostItem = {
  product_id: string;
  total_product_cost: string;
};

type ProductRevenueItem = {
  product_id: string;
  total_product_revenue: string;
};

type ProductRevenueContributionItems = {
  product_id: string;
  total_revenue: string;
  revenue_percentage: string;
};

type ProductUtilizationRateItems = {
  product_id: string;
  product_utilization_rate: string;
};

type ProductUtilizationTrendItems = {
  month: string;
  product: string;
  monthly_avg_usage_percentage: string;
};

type ProductRevenueForecastItems = {
  product_id: string;
  month_year: string;
  total_product_revenue: string;
  predicted_revenue: string;
  forecast_revenue: string;
}


export default function ProductLayerDashboard() {
  const [loading, setLoading] = useState(true);  // Loading state
  const [totalProductCost, setTotalProductCost] = useState<string | null>(null)
  const [totalProductRevenue, setTotalProductRevenue] = useState<string | null>(null)
  const [costPerProduct, setCostPerProduct] = useState<ProductCostItem[]>([]);
  const [revenuePerProduct, setRevenuePerProduct] = useState<ProductRevenueItem[]>([]);
  const [productUtilizationTrend, setProductUtilizationTrend] = useState <ProductUtilizationTrendItems[]>([]);
  const [productRevenueForecast, setProductRevenueForecast] = useState<ProductRevenueForecastItems[]>([]);


  useEffect(() => {
    async function fetchData() {
      setLoading(true);  // Start loading
      const totalProductCostData = await fetchTotalProductCost();
      const totalProductRevenueData = await fetchTotalProductRevenue();
      const costPerProductData = await fetchProductCostByCategory();
      const revenuePerProductData = await fetchRevenueByProduct();

      const productUtilizationTrendData = await fetchProductUtilizationTrend();
      const productRevenueForecastData = await fetchProductRevenueForecast();

      if (totalProductCostData !== null) {
        setTotalProductCost(formatCustom(totalProductCostData));
      }

      if (totalProductRevenueData !== null) {
        setTotalProductRevenue(formatCustom(totalProductRevenueData));
      }

      setCostPerProduct(costPerProductData);
      setRevenuePerProduct(revenuePerProductData);
      setProductUtilizationTrend(productUtilizationTrendData);
      setProductRevenueForecast(productRevenueForecastData);

      setLoading(false);  // Stop loading after data is fetched
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820]">Product Layer Dashboard</h1>

      <section className="mb-8">
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <Card className={`${loading ? 'skeleton bg-black' : ''} bg-black text-white`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Product Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$ {loading ? '...' : totalProductCost}</div>
            </CardContent>
          </Card>
          <Card className={`${loading ? 'skeleton bg-brand-blue' : ' '} bg-brand-blue text-white` }>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Product Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$ {loading ? '...' : totalProductRevenue}</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <div className="grid gap-4 md:grid-cols-2">
 
            <Card className={`${loading ? 'skeleton animate-pulse' : ''}`}>
              <CardHeader>
                <CardTitle className='text-lg font-bold'>Cost Per Product</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <div className="skeleton animate-pulse"></div> : <CostByProductChart data={costPerProduct} />}
              </CardContent>
            </Card>
            <Card className={`${loading ? 'skeleton animate-pulse' : ''}`}>
              <CardHeader>
                <CardTitle className='text-lg font-bold'>Revenue Per Product</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <div className="skeleton animate-pulse"></div> : <RevenueByProductChart data={revenuePerProduct} />}
              </CardContent>
            </Card>
          </div>
      </section>
      <div className="grid grid-cols-1 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-bold'> Product Revenue Trend </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductRevenueForecastChart data={productRevenueForecast} />
          </CardContent>
        </Card>
      </div>
      <section>
        <div className="grid gap-4 md:grid-cols-1">
          <Card className={`${loading ? 'animate-pulse' : ''}`}>
            <CardHeader>
              <CardTitle className='text-lg font-bold'>Monthly Utilization Trends by Product</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <div className="skeleton animate-pulse"></div> : <ProductUtilizationTrendChart data={productUtilizationTrend} />}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
