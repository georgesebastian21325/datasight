"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/vcomponents/dashboard-ui/resource-components/current-gross-pred-cost-components/card"
import { Progress } from "@/vcomponents/dashboard-ui/resource-components/current-gross-pred-cost-components/progress"
import { Button } from "@/vcomponents/dashboard-ui/resource-components/current-gross-pred-cost-components/button"

interface FinancialData {
  grossProfit: number
  predictedCost: number
}

export default function CurrentGrossVsPredCostCard() {
  const [data, setData] = useState<FinancialData>({
    grossProfit: 150000,
    predictedCost: 100000,
  })

  const difference = data.grossProfit - data.predictedCost
  const isPositive = difference > 0
  const percentDifference = (difference / data.predictedCost) * 100
  const progressPercentage = (data.grossProfit / (data.grossProfit + data.predictedCost)) * 100

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const updateData = () => {
    setData({
      grossProfit: Math.floor(Math.random() * 200000) + 100000,
      predictedCost: Math.floor(Math.random() * 150000) + 50000,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Financial Comparison</CardTitle>
        <CardDescription>Current gross profit vs predicted cost</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Gross Profit</p>
            <p className="text-2xl font-bold">{formatCurrency(data.grossProfit)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Predicted Cost</p>
            <p className="text-2xl font-bold">{formatCurrency(data.predictedCost)}</p>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-3" />
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">Difference</p>
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
            <span className="text-lg font-bold">{formatCurrency(Math.abs(difference))}</span>
            <span className="ml-1 text-sm">({percentDifference.toFixed(1)}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

