'use client'

import { AlertCircle, DollarSign, Percent } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/vcomponents/dashboard-ui/product-components/card'
import { Alert, AlertDescription, AlertTitle } from '@/vcomponents/dashboard-ui/product-components/alert'
import { Progress } from '@/vcomponents/dashboard-ui/product-components/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/vcomponents/dashboard-ui/product-components/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/vcomponents/dashboard-ui/product-components/chart'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts'

// Mock data (replace with actual data fetching logic)
const mockData = {
  totalProductCost: 1000000,
  totalProductRevenue: 1500000,
  averageProductUtilization: 75,
  highCostProductsCount: 3,
  productCostByCategory: [
    { category: 'Category A', cost: 400000 },
    { category: 'Category B', cost: 300000 },
    { category: 'Category C', cost: 200000 },
    { category: 'Category D', cost: 100000 },
  ],
  topCostliestProducts: [
    { name: 'Product 1', cost: 200000 },
    { name: 'Product 2', cost: 180000 },
    { name: 'Product 3', cost: 150000 },
    { name: 'Product 4', cost: 120000 },
    { name: 'Product 5', cost: 100000 },
  ],
  topRevenueProducts: [
    { name: 'Product A', revenue: 300000 },
    { name: 'Product B', revenue: 250000 },
    { name: 'Product C', revenue: 200000 },
    { name: 'Product D', revenue: 180000 },
    { name: 'Product E', revenue: 150000 },
  ],
  revenueVsCost: [
    { name: 'Product 1', cost: 100000, revenue: 150000 },
    { name: 'Product 2', cost: 80000, revenue: 120000 },
    { name: 'Product 3', cost: 120000, revenue: 100000 },
    { name: 'Product 4', cost: 90000, revenue: 130000 },
    { name: 'Product 5', cost: 110000, revenue: 140000 },
  ],
  productUtilizationByCategory: [
    { category: 'Category A', utilization: 80 },
    { category: 'Category B', utilization: 65 },
    { category: 'Category C', utilization: 90 },
    { category: 'Category D', utilization: 70 },
  ],
  underutilizedProducts: [
    { name: 'Product X', utilization: 15 },
    { name: 'Product Y', utilization: 18 },
    { name: 'Product Z', utilization: 10 },
  ],
  utilizationTrends: [
    { date: '2023-01', 'Product A': 70, 'Product B': 65, 'Product C': 80, 'Product D': 75, 'Product E': 60 },
    { date: '2023-02', 'Product A': 75, 'Product B': 68, 'Product C': 82, 'Product D': 73, 'Product E': 62 },
    { date: '2023-03', 'Product A': 72, 'Product B': 70, 'Product C': 85, 'Product D': 78, 'Product E': 65 },
    { date: '2023-04', 'Product A': 78, 'Product B': 72, 'Product C': 83, 'Product D': 80, 'Product E': 68 },
    { date: '2023-05', 'Product A': 80, 'Product B': 75, 'Product C': 88, 'Product D': 82, 'Product E': 70 },
  ],
  serviceAttributedCost: [
    { product: 'Product 1', 'Service A': 50000, 'Service B': 30000, 'Service C': 20000 },
    { product: 'Product 2', 'Service A': 40000, 'Service B': 35000, 'Service C': 25000 },
    { product: 'Product 3', 'Service A': 45000, 'Service B': 40000, 'Service C': 30000 },
    { product: 'Product 4', 'Service A': 35000, 'Service B': 30000, 'Service C': 25000 },
    { product: 'Product 5', 'Service A': 30000, 'Service B': 25000, 'Service C': 20000 },
  ],
  serviceAttributedRevenue: [
    { product: 'Product A', 'Service X': 100000, 'Service Y': 80000, 'Service Z': 60000 },
    { product: 'Product B', 'Service X': 90000, 'Service Y': 70000, 'Service Z': 50000 },
    { product: 'Product C', 'Service X': 80000, 'Service Y': 60000, 'Service Z': 40000 },
    { product: 'Product D', 'Service X': 70000, 'Service Y': 50000, 'Service Z': 30000 },
    { product: 'Product E', 'Service X': 60000, 'Service Y': 40000, 'Service Z': 20000 },
  ],
  costlyServiceConnections: [
    { product: 'Product 1', service: 'Service A', cost: 50000 },
    { product: 'Product 2', service: 'Service B', cost: 45000 },
    { product: 'Product 3', service: 'Service A', cost: 40000 },
    { product: 'Product 4', service: 'Service C', cost: 35000 },
    { product: 'Product 5', service: 'Service B', cost: 30000 },
  ],
  productCostAtRisk: 300000,
  revenueStability: [
    { date: '2023-01', 'Product A': 100000, 'Product B': 90000, 'Product C': 80000, 'Product D': 70000, 'Product E': 60000 },
    { date: '2023-02', 'Product A': 105000, 'Product B': 92000, 'Product C': 82000, 'Product D': 72000, 'Product E': 62000 },
    { date: '2023-03', 'Product A': 102000, 'Product B': 95000, 'Product C': 85000, 'Product D': 75000, 'Product E': 65000 },
    { date: '2023-04', 'Product A': 108000, 'Product B': 98000, 'Product C': 88000, 'Product D': 78000, 'Product E': 68000 },
    { date: '2023-05', 'Product A': 110000, 'Product B': 100000, 'Product C': 90000, 'Product D': 80000, 'Product E': 70000 },
  ],
  obsolescenceImpact: [
    { product: 'Product 1', count: 3 },
    { product: 'Product 2', count: 2 },
    { product: 'Product 3', count: 4 },
    { product: 'Product 4', count: 1 },
    { product: 'Product 5', count: 5 },
  ],
}

export default function ProductLayerDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820] ">Product Layer Dashboard</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Key Product Metrics Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Product Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockData.totalProductCost.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Product Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockData.totalProductRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Product Utilization</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.averageProductUtilization}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High-Cost Products Alert</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.highCostProductsCount}</div>
              <p className="text-xs text-muted-foreground">Products need cost control measures</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Financial Performance</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Cost by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.productCostByCategory} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" />
                    <Bar dataKey="cost" fill="var(--chart-1)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Costliest Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.topCostliestProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.cost.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue-Generating Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.topRevenueProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs. Cost Comparison per Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <XAxis type="number" dataKey="cost" name="Cost" unit="$" />
                    <YAxis type="number" dataKey="revenue" name="Revenue" unit="$" />
                    <Scatter data={mockData.revenueVsCost} fill="var(--chart-1)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Product Utilization Insights</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Utilization by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.productUtilizationByCategory}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Bar dataKey="utilization" fill="var(--chart-1)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Underutilized Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    
                    <TableHead>Product</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.underutilizedProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.utilization}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Product Utilization Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.utilizationTrends}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Line type="monotone" dataKey="Product A" stroke="var(--chart-1)" />
                    <Line type="monotone" dataKey="Product B" stroke="var(--chart-2)" />
                    <Line type="monotone" dataKey="Product C" stroke="var(--chart-3)" />
                    <Line type="monotone" dataKey="Product D" stroke="var(--chart-4)" />
                    <Line type="monotone" dataKey="Product E" stroke="var(--chart-5)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Cost and Revenue Attribution by Service</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Service-Attributed Cost per Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.serviceAttributedCost}>
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Bar dataKey="Service A" stackId="a" fill="var(--chart-1)" />
                    <Bar dataKey="Service B" stackId="a" fill="var(--chart-2)" />
                    <Bar dataKey="Service C" stackId="a" fill="var(--chart-3)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Service-Attributed Revenue per Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.serviceAttributedRevenue}>
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Bar dataKey="Service X" stackId="a" fill="var(--chart-1)" />
                    <Bar dataKey="Service Y" stackId="a" fill="var(--chart-2)" />
                    <Bar dataKey="Service Z" stackId="a" fill="var(--chart-3)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Top 5 Costly Service-Product Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.costlyServiceConnections.map((connection, index) => (
                    <TableRow key={index}>
                      <TableCell>{connection.product}</TableCell>
                      <TableCell>{connection.service}</TableCell>
                      <TableCell>${connection.cost.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Risk and Obsolescence Analysis</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Cost at Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Cost at Risk</p>
                  <p className="text-2xl font-bold">${mockData.productCostAtRisk.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                  <p className="text-2xl font-bold text-yellow-500">Medium</p>
                </div>
              </div>
              <Progress className="mt-4" value={(mockData.productCostAtRisk / mockData.totalProductCost) * 100} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Stability for Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.revenueStability}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Line type="monotone" dataKey="Product A" stroke="var(--chart-1)" />
                    <Line type="monotone" dataKey="Product B" stroke="var(--chart-2)" />
                    <Line type="monotone" dataKey="Product C" stroke="var(--chart-3)" />
                    <Line type="monotone" dataKey="Product D" stroke="var(--chart-4)" />
                    <Line type="monotone" dataKey="Product E" stroke="var(--chart-5)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Obsolescence Impact on Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.obsolescenceImpact}>
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Bar dataKey="count" fill="var(--chart-1)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}