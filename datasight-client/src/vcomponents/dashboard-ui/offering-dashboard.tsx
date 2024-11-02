'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts'
import { AlertCircle, ArrowDown, ArrowUp, DollarSign, Percent } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/vcomponents/dashboard-ui/offering-components/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/vcomponents/dashboard-ui/offering-components/table'
import { Alert, AlertDescription, AlertTitle } from '@/vcomponents/dashboard-ui/offering-components/alert'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/vcomponents/dashboard-ui/offering-components/chart'

// Mock data - replace with actual data fetching logic
const mockData = {
  totalOfferingCost: 1000000,
  totalOfferingRevenue: 1500000,
  averageUtilization: 75,
  highCostOfferingsCount: 3,
  offeringCostByCategory: [
    { category: 'Category A', cost: 400000 },
    { category: 'Category B', cost: 300000 },
    { category: 'Category C', cost: 200000 },
    { category: 'Category D', cost: 100000 },
  ],
  topCostliestOfferings: [
    { name: 'Offering 1', cost: 250000 },
    { name: 'Offering 2', cost: 200000 },
    { name: 'Offering 3', cost: 150000 },
    { name: 'Offering 4', cost: 100000 },
    { name: 'Offering 5', cost: 75000 },
  ],
  topRevenueGeneratingOfferings: [
    { name: 'Offering A', revenue: 400000 },
    { name: 'Offering B', revenue: 350000 },
    { name: 'Offering C', revenue: 300000 },
    { name: 'Offering D', revenue: 250000 },
    { name: 'Offering E', revenue: 200000 },
  ],
  revenueVsCost: [
    { name: 'Offering 1', cost: 250000, revenue: 400000 },
    { name: 'Offering 2', cost: 200000, revenue: 350000 },
    { name: 'Offering 3', cost: 150000, revenue: 300000 },
    { name: 'Offering 4', cost: 100000, revenue: 250000 },
    { name: 'Offering 5', cost: 75000, revenue: 200000 },
  ],
  utilizationByCategory: [
    { category: 'Category A', utilization: 85 },
    { category: 'Category B', utilization: 70 },
    { category: 'Category C', utilization: 60 },
    { category: 'Category D', utilization: 50 },
  ],
  underutilizedOfferings: [
    { name: 'Offering X', utilization: 15 },
    { name: 'Offering Y', utilization: 18 },
    { name: 'Offering Z', utilization: 19 },
  ],
  utilizationTrends: [
    { month: 'Jan', 'Offering 1': 70, 'Offering 2': 65, 'Offering 3': 60, 'Offering 4': 55, 'Offering 5': 50 },
    { month: 'Feb', 'Offering 1': 75, 'Offering 2': 70, 'Offering 3': 65, 'Offering 4': 60, 'Offering 5': 55 },
    { month: 'Mar', 'Offering 1': 80, 'Offering 2': 75, 'Offering 3': 70, 'Offering 4': 65, 'Offering 5': 60 },
    { month: 'Apr', 'Offering 1': 85, 'Offering 2': 80, 'Offering 3': 75, 'Offering 4': 70, 'Offering 5': 65 },
    { month: 'May', 'Offering 1': 90, 'Offering 2': 85, 'Offering 3': 80, 'Offering 4': 75, 'Offering 5': 70 },
  ],
  productAttributedCost: [
    { offering: 'Offering 1', 'Product A': 100000, 'Product B': 80000, 'Product C': 70000 },
    { offering: 'Offering 2', 'Product A': 90000, 'Product B': 70000, 'Product C': 40000 },
    { offering: 'Offering 3', 'Product A': 80000, 'Product B': 50000, 'Product C': 20000 },
    { offering: 'Offering 4', 'Product A': 70000, 'Product B': 20000, 'Product C': 10000 },
    { offering: 'Offering 5', 'Product A': 50000, 'Product B': 15000, 'Product C': 10000 },
  ],
  productAttributedRevenue: [
    { offering: 'Offering A', 'Product X': 200000, 'Product Y': 150000, 'Product Z': 50000 },
    { offering: 'Offering B', 'Product X': 180000, 'Product Y': 120000, 'Product Z': 50000 },
    { offering: 'Offering C', 'Product X': 150000, 'Product Y': 100000, 'Product Z': 50000 },
    { offering: 'Offering D', 'Product X': 120000, 'Product Y': 80000, 'Product Z': 50000 },
    { offering: 'Offering E', 'Product X': 100000, 'Product Y': 70000, 'Product Z': 30000 },
  ],
  topCostlyConnections: [
    { offering: 'Offering 1', product: 'Product A', cost: 100000 },
    { offering: 'Offering 2', product: 'Product A', cost: 90000 },
    { offering: 'Offering 1', product: 'Product B', cost: 80000 },
    { offering: 'Offering 3', product: 'Product A', cost: 80000 },
    { offering: 'Offering 2', product: 'Product B', cost: 70000 },
  ],
}

export default function OfferingDashboardComponent() {
  const [selectedOffering, setSelectedOffering] = useState('Offering 1')

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820] ">Offering Layer Dashboard</h1>

      {/* Key Offering Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offering Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockData.totalOfferingCost.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offering Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockData.totalOfferingRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Offering Utilization</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.averageUtilization}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Cost Offerings Alert</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.highCostOfferingsCount}</div>
            <p className="text-xs text-muted-foreground">Offerings requiring cost review</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Offering Cost by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              cost: {
                label: "Cost",
                color: "hsl(var(--chart-1))",
              },
            }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.offeringCostByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="cost" fill="var(--color-cost)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs. Cost Comparison per Offering</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              cost: {
                label: "Cost",
                color: "hsl(var(--chart-1))",
              },
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-2))",
              },
            }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="cost" name="Cost" unit="$" />
                  <YAxis type="number" dataKey="revenue" name="Revenue" unit="$" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter name="Offerings" data={mockData.revenueVsCost} fill="var(--color-cost)" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Costliest Offerings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offering</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.topCostliestOfferings.map((offering) => (
                  <TableRow key={offering.name}>
                    <TableCell>{offering.name}</TableCell>
                    <TableCell>${offering.cost.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Revenue-Generating Offerings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offering</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.topRevenueGeneratingOfferings.map((offering) => (
                  <TableRow key={offering.name}>
                    <TableCell>{offering.name}</TableCell>
                    <TableCell>${offering.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Offering Utilization Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Offering Utilization by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              utilization: {
                label: "Utilization",
                color: "hsl(var(--chart-1))",
              },
            }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.utilizationByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="utilization" fill="var(--color-utilization)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Offering Utilization Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              'Offering 1': {
                label: "Offering 1",
                color: "hsl(var(--chart-1))",
              },
              'Offering 2': {
                label: "Offering 2",
                color: "hsl(var(--chart-2))",
              },
              'Offering 3': {
                label: "Offering 3",
                color: "hsl(var(--chart-3))",
              },
              'Offering 4': {
                label: "Offering 4",
                color: "hsl(var(--chart-4))",
              },
              'Offering 5': {
                label: "Offering 5",
                color: "hsl(var(--chart-5))",
              },
            }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.utilizationTrends}>
                  <CartesianGrid strokeDasharray="3 3"   />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="Offering 1" stroke="var(--color-Offering 1)" />
                  <Line type="monotone" dataKey="Offering 2" stroke="var(--color-Offering 2)" />
                  <Line type="monotone" dataKey="Offering 3" stroke="var(--color-Offering 3)" />
                  <Line type="monotone" dataKey="Offering 4" stroke="var(--color-Offering 4)" />
                  <Line type="monotone" dataKey="Offering 5" stroke="var(--color-Offering 5)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Underutilized Offerings</AlertTitle>
        <AlertDescription>
          The following offerings have utilization rates below 20%:
          <ul className="list-disc list-inside mt-2">
            {mockData.underutilizedOfferings.map((offering) => (
              <li key={offering.name}>{offering.name} ({offering.utilization}%)</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>

      {/* Cost and Revenue Attribution by Product */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product-Attributed Cost per Offering</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              'Product A': {
                label: "Product A",
                color: "hsl(var(--chart-1))",
              },
              'Product B': {
                label: "Product B",
                color: "hsl(var(--chart-2))",
              },
              'Product C': {
                label: "Product C",
                color: "hsl(var(--chart-3))",
              },
            }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.productAttributedCost}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="offering" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="Product A" stackId="a" fill="var(--color-Product A)" />
                  <Bar dataKey="Product B" stackId="a" fill="var(--color-Product B)" />
                  <Bar dataKey="Product C" stackId="a" fill="var(--color-Product C)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Product-Attributed Revenue per Offering</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              'Product X': {
                label: "Product X",
                color: "hsl(var(--chart-1))",
              },
              'Product Y': {
                label: "Product Y",
                color: "hsl(var(--chart-2))",
              },
              'Product Z': {
                label: "Product Z",
                color: "hsl(var(--chart-3))",
              },
            }} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.productAttributedRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="offering" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="Product X" stackId="a" fill="var(--color-Product X)" />
                  <Bar dataKey="Product Y" stackId="a" fill="var(--color-Product Y)" />
                  <Bar dataKey="Product Z" stackId="a" fill="var(--color-Product Z)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Costly Product-Offering Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offering</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.topCostlyConnections.map((connection, index) => (
                <TableRow key={index}>
                  <TableCell>{connection.offering}</TableCell>
                  <TableCell>{connection.product}</TableCell>
                  <TableCell>${connection.cost.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}