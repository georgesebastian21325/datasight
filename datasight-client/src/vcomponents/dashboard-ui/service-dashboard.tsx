'use client'

import { useState, useEffect } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/vcomponents/dashboard-ui/service-components/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/vcomponents/dashboard-ui/service-components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/vcomponents/dashboard-ui/service-components/table"
import { Bar, BarChart, Line, LineChart, Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/vcomponents/dashboard-ui/service-components/chart"
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react"

import LoadingPage from "../LoadingPage"

// Mock data (same as before)
const mockData = {
  totalServiceCost: 1250000,
  totalServiceRevenue: 2000000,
  averageServiceUtilization: 75,
  highCostServices: 3,
  serviceCostByCategory: [
    { category: "Category A", cost: 500000 },
    { category: "Category B", cost: 350000 },
    { category: "Category C", cost: 250000 },
    { category: "Category D", cost: 150000 },
  ],
  topCostliestServices: [
    { name: "Service 1", cost: 300000 },
    { name: "Service 2", cost: 250000 },
    { name: "Service 3", cost: 200000 },
    { name: "Service 4", cost: 150000 },
    { name: "Service 5", cost: 100000 },
  ],
  topRevenueServices: [
    { name: "Service A", revenue: 500000, resources: "Resource X, Resource Y" },
    { name: "Service B", revenue: 400000, resources: "Resource Z" },
    { name: "Service C", revenue: 350000, resources: "Resource W, Resource V" },
    { name: "Service D", revenue: 300000, resources: "Resource U" },
    { name: "Service E", revenue: 250000, resources: "Resource T, Resource S" },
  ],
  revenueVsCost: [
    { name: "Service 1", cost: 300000, revenue: 500000 },
    { name: "Service 2", cost: 250000, revenue: 400000 },
    { name: "Service 3", cost: 200000, revenue: 350000 },
    { name: "Service 4", cost: 150000, revenue: 300000 },
    { name: "Service 5", cost: 100000, revenue: 250000 },
  ],
  serviceUtilizationByCategory: [
    { category: "Category A", utilization: 85 },
    { category: "Category B", utilization: 70 },
    { category: "Category C", utilization: 60 },
    { category: "Category D", utilization: 50 },
  ],
  underutilizedServices: [
    { name: "Service X", utilization: 15 },
    { name: "Service Y", utilization: 18 },
    { name: "Service Z", utilization: 19 },
  ],
  serviceUtilizationTrends: [
    { month: "Jan", Service1: 70, Service2: 65, Service3: 60, Service4: 55, Service5: 50 },
    { month: "Feb", Service1: 75, Service2: 68, Service3: 62, Service4: 58, Service5: 52 },
    { month: "Mar", Service1: 72, Service2: 70, Service3: 65, Service4: 60, Service5: 55 },
    { month: "Apr", Service1: 78, Service2: 72, Service3: 68, Service4: 62, Service5: 58 },
    { month: "May", Service1: 80, Service2: 75, Service3: 70, Service4: 65, Service5: 60 },
  ],
  resourceAttributedCost: [
    { service: "Service 1", ResourceA: 100000, ResourceB: 80000, ResourceC: 60000, ResourceD: 40000, ResourceE: 20000 },
    { service: "Service 2", ResourceA: 90000, ResourceB: 70000, ResourceC: 50000, ResourceD: 30000, ResourceE: 10000 },
    { service: "Service 3", ResourceA: 80000, ResourceB: 60000, ResourceC: 40000, ResourceD: 20000, ResourceE: 0 },
    { service: "Service 4", ResourceA: 70000, ResourceB: 50000, ResourceC: 30000, ResourceD: 0, ResourceE: 0 },
    { service: "Service 5", ResourceA: 60000, ResourceB: 40000, ResourceC: 0, ResourceD: 0, ResourceE: 0 },
  ],
  resourceAttributedRevenue: [
    { service: "Service A", ResourceX: 200000, ResourceY: 150000, ResourceZ: 100000, ResourceW: 50000 },
    { service: "Service B", ResourceX: 180000, ResourceY: 120000, ResourceZ: 80000, ResourceW: 20000 },
    { service: "Service C", ResourceX: 160000, ResourceY: 100000, ResourceZ: 60000, ResourceW: 30000 },
    { service: "Service D", ResourceX: 140000, ResourceY: 80000, ResourceZ: 40000, ResourceW: 40000 },
    { service: "Service E", ResourceX: 120000, ResourceY: 60000, ResourceZ: 20000, ResourceW: 50000 },
  ],
  costlyResourceServiceConnections: [
    { service: "Service 1", resource: "Resource A", cost: 100000 },
    { service: "Service 2", resource: "Resource B", cost: 90000 },
    { service: "Service 3", resource: "Resource C", cost: 80000 },
    { service: "Service 4", resource: "Resource D", cost: 70000 },
    { service: "Service 5", resource: "Resource E", cost: 60000 },
  ],
  serviceCostAtRisk: 500000,
  serviceRevenueStability: [
    { month: "Jan", ServiceA: 100000, ServiceB: 90000, ServiceC: 80000, ServiceD: 70000, ServiceE: 60000 },
    { month: "Feb", ServiceA: 110000, ServiceB: 95000, ServiceC: 85000, ServiceD: 75000, ServiceE: 65000 },
    { month: "Mar", ServiceA: 105000, ServiceB: 92000, ServiceC: 82000, ServiceD: 72000, ServiceE: 62000 },
    { month: "Apr", ServiceA: 115000, ServiceB: 98000, ServiceC: 88000, ServiceD: 78000, ServiceE: 68000 },
    { month: "May", ServiceA: 120000, ServiceB: 100000, ServiceC: 90000, ServiceD: 80000, ServiceE: 70000 },
  ],
  obsolescenceImpact: [
    { service: "Service 1", count: 5 },
    { service: "Service 2", count: 4 },
    { service: "Service 3", count: 3 },
    { service: "Service 4", count: 2 },
    { service: "Service 5", count: 1 },
  ],
}

export default function ServiceDashboardComponent() {


  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820] ">Service Layer Dashboard</h1>

      {/* 1. Key Service Metrics Overview */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Key Service Metrics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Service Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${mockData.totalServiceCost.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Service Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${mockData.totalServiceRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Service Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockData.averageServiceUtilization}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>High-Cost Services</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  {mockData.highCostServices} services with unusually high costs detected.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Financial Performance */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Financial Performance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Cost by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                cost: {
                  label: "Cost",
                  color: "hsl(var(--chart-1))",
                },
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.serviceCostByCategory} layout="vertical">
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
              <CardTitle>Top 5 Costliest Services</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.topCostliestServices.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>${service.cost.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue-Generating Services</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Resources</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.topRevenueServices.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>${service.revenue.toLocaleString()}</TableCell>
                      <TableCell>{service.resources}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs. Cost Comparison per Service</CardTitle>
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
                    <Scatter name="Services" data={mockData.revenueVsCost} fill="var(--color-cost)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Service Utilization Insights */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Service Utilization Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Utilization by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                utilization: {
                  label: "Utilization",
                  color: "hsl(var(--chart-1))",
                },
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.serviceUtilizationByCategory}>
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
              <CardTitle>Underutilized Services</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <TrendingDown className="h-4 w-4" />
                <AlertTitle>Low Utilization</AlertTitle>
                <AlertDescription>
                  The following services have utilization  rates below 20%:
                </AlertDescription>
              </Alert>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.underutilizedServices.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.utilization}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Service Utilization Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                Service1: {
                  label: "Service 1",
                  color: "hsl(var(--chart-1))",
                },
                Service2: {
                  label: "Service 2",
                  color: "hsl(var(--chart-2))",
                },
                Service3: {
                  label: "Service 3",
                  color: "hsl(var(--chart-3))",
                },
                Service4: {
                  label: "Service 4",
                  color: "hsl(var(--chart-4))",
                },
                Service5: {
                  label: "Service 5",
                  color: "hsl(var(--chart-5))",
                },
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.serviceUtilizationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="Service1" stroke="var(--color-Service1)" />
                    <Line type="monotone" dataKey="Service2" stroke="var(--color-Service2)" />
                    <Line type="monotone" dataKey="Service3" stroke="var(--color-Service3)" />
                    <Line type="monotone" dataKey="Service4" stroke="var(--color-Service4)" />
                    <Line type="monotone" dataKey="Service5" stroke="var(--color-Service5)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Cost and Revenue Attribution by Resource */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Cost and Revenue Attribution by Resource</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource-Attributed Cost per Service</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                ResourceA: {
                  label: "Resource A",
                  color: "hsl(var(--chart-1))",
                },
                ResourceB: {
                  label: "Resource B",
                  color: "hsl(var(--chart-2))",
                },
                ResourceC: {
                  label: "Resource C",
                  color: "hsl(var(--chart-3))",
                },
                ResourceD: {
                  label: "Resource D",
                  color: "hsl(var(--chart-4))",
                },
                ResourceE: {
                  label: "Resource E",
                  color: "hsl(var(--chart-5))",
                },
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.resourceAttributedCost}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="ResourceA" stackId="a" fill="var(--color-ResourceA)" />
                    <Bar dataKey="ResourceB" stackId="a" fill="var(--color-ResourceB)" />
                    <Bar dataKey="ResourceC" stackId="a" fill="var(--color-ResourceC)" />
                    <Bar dataKey="ResourceD" stackId="a" fill="var(--color-ResourceD)" />
                    <Bar dataKey="ResourceE" stackId="a" fill="var(--color-ResourceE)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resource-Attributed Revenue per Service</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                ResourceX: {
                  label: "Resource X",
                  color: "hsl(var(--chart-1))",
                },
                ResourceY: {
                  label: "Resource Y",
                  color: "hsl(var(--chart-2))",
                },
                ResourceZ: {
                  label: "Resource Z",
                  color: "hsl(var(--chart-3))",
                },
                ResourceW: {
                  label: "Resource W",
                  color: "hsl(var(--chart-4))",
                },
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.resourceAttributedRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="ResourceX" stackId="a" fill="var(--color-ResourceX)" />
                    <Bar dataKey="ResourceY" stackId="a" fill="var(--color-ResourceY)" />
                    <Bar dataKey="ResourceZ" stackId="a" fill="var(--color-ResourceZ)" />
                    <Bar dataKey="ResourceW" stackId="a" fill="var(--color-ResourceW)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top 5 Costly Resource-Service Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.costlyResourceServiceConnections.map((connection, index) => (
                    <TableRow key={index}>
                      <TableCell>{connection.service}</TableCell>
                      <TableCell>{connection.resource}</TableCell>
                      <TableCell>${connection.cost.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Risk and Obsolescence Analysis */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Risk and Obsolescence Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Cost at Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>High Risk</AlertTitle>
                <AlertDescription>
                  Total service cost at risk: ${mockData.serviceCostAtRisk.toLocaleString()}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Service Revenue Stability</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                ServiceA: {
                  label: "Service A",
                  color: "hsl(var(--chart-1))",
                },
                ServiceB: {
                  label: "Service B",
                  color: "hsl(var(--chart-2))",
                },
                ServiceC: {
                  label: "Service C",
                  color: "hsl(var(--chart-3))",
                },
                ServiceD: {
                  label: "Service D",
                  color: "hsl(var(--chart-4))",
                },
                ServiceE: {
                  label: "Service E",
                  color: "hsl(var(--chart-5))",
                },
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.serviceRevenueStability}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="ServiceA" stroke="var(--color-ServiceA)" />
                    <Line type="monotone" dataKey="ServiceB" stroke="var(--color-ServiceB)" />
                    <Line type="monotone" dataKey="ServiceC" stroke="var(--color-ServiceC)" />
                    <Line type="monotone" dataKey="ServiceD" stroke="var(--color-ServiceD)" />
                    <Line type="monotone" dataKey="ServiceE" stroke="var(--color-ServiceE)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Obsolescence Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-1))",
                },
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.obsolescenceImpact}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" />
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