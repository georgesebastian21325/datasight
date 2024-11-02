'use client'

import { Button } from "@/vcomponents/home-page-components/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820]">Welcome to Data Sight</h1>
            <p className="text-xl text-center mb-12 text-gray-600">
              Transform your insights and empower the future with our comprehensive enterprise solutions.
            </p>
            <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto justify-center text-center ">
              <Button className="w-full" size="lg">
                Resource
              </Button>
              <Button className="w-full" size="lg">
                Product
              </Button>
              <Button className="w-full" size="lg">
                Service
              </Button>
              <Button className="w-full" size="lg">
                Offering
              </Button>
              <Button className="w-full mt-5 bg-brand-blue" size="lg">
                Enterprise Architecture
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}