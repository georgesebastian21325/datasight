'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Upload, UserCheck, UserPlus } from 'lucide-react'
import FileUploadModal from '../../vcomponents/FileUploadModal'

interface FileInfo {
  id: string
  name: string
  size: number
  status: "ready" | "uploaded" | "failed" | "uploading"
  file: File
}

const steps = [
  { title: 'Create Account', icon: UserPlus, completed: true },
  { title: 'Log In', icon: UserCheck, completed: true },
  { title: 'Upload Datasets', icon: Upload, completed: false }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(2) // Start at Upload Datasets step
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([])

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      if (currentStep === 2) {
        steps[2].completed = true // Mark Upload Datasets as completed
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <motion.h1
            className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Welcome to Data Sight!
          </motion.h1>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
              <motion.div
                className="absolute left-0 h-full bg-gradient-to-r from-[#1050d2] to-[#f47820]"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                    ease: "easeOut",
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed
                      ? 'bg-blue-900 text-white'
                      : index === currentStep
                        ? 'bg-[#f47820] text-white'
                        : 'bg-gray-200 text-muted-foreground'
                      }`}
                  >
                    {React.createElement(step.icon, { className: 'w-6 h-6' })}
                  </div>
                  <span className="font-medium text-sm text-center">{step.title}</span>
                </motion.div>
              ))}
            </div>

            {/* File Upload Section */}
            <motion.div
              className="mt-12 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <FileUploadModal onUploadComplete={(files) => setUploadedFiles(files)} />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
