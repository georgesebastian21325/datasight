"use client"

import { useState } from 'react'
import { Button } from "@/vcomponents/recommendations-components/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/vcomponents/recommendations-components/card"
import { Volume2 } from "lucide-react"

export default function RecommendationsLayout() {
  const [showMapping, setShowMapping] = useState(false)

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Navigation */}
      {/*<nav className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <img
            src="/placeholder.svg?height=40&width=40"
            alt="Info Alchemy logo"
            className="h-10 w-10"
          />
          <span className="font-bold text-xl">INFO ALCHEMY</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost">HOME</Button>
          <Button variant="ghost">SETTINGS</Button>
        </div>
        <Button variant="ghost">SIGN OUT</Button>
  </nav> */}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Recommendations Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Reccomendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Optimize database queries for faster data retrieval</li>
              <li>Implement caching mechanisms to reduce server load</li>
              <li>Use asynchronous processing for time-consuming tasks</li>
              <li>Adopt microservices architecture for better scalability</li>
            </ul>
          </CardContent>
        </Card>

        {/* AI Assistant Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>AI ASSISTANT</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {/* Talking Head */}
            <div className="relative w-64 h-64">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div className="absolute inset-2 rounded-full overflow-hidden bg-white">
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-red-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Audio Button */}
            <Button variant="outline" size="icon" className="rounded-full">
              <Volume2 className="h-6 w-6" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Mapping Container */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Optimized Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 min-h-[200px]">
            {showMapping ? (
              <div className="text-center">
                Architecture mapping content goes here. This could include diagrams, charts, or detailed explanations of the system architecture.
              </div>
            ) : (
              <>
                <p className="text-gray-500 text-center">
                  Click &apos;Generate Mapping&apos; to view the architecture mapping
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}