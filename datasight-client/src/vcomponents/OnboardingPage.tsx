// Onboarding.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/vcomponents/onboarding-components/button"
import { Progress } from "@/vcomponents/onboarding-components/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/vcomponents/onboarding-components/card"
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'

import FileUploadModal from './FileUploadModal'

// Define the FileInfo type
interface FileInfo {
  id: string
  name: string
  size: number
  status: "ready" | "uploaded" | "failed" | "uploading"
  file: File
}


export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const totalSteps = 2

  const handleNextStep = async () => {
    if (currentStep < totalSteps) {
      if (currentStep === 2) {
        processCSV()
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const processCSV = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#1050d2] to-[#f47820]">
        Welcome to Data Sight!
      </h1>
      <p className="text-lg text-gray-600 mb-5">
        We’re thrilled to have you on board! At Data Sight, we’re dedicated to helping you make the most of your data.
        Let’s get started and unlock the full potential of your enterprise architecture together!
      </p>

      <Progress value={(currentStep / totalSteps) * 100} className="mb-6" />
      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep} of {totalSteps}</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[250px] flex flex-col items-center justify-center">
          {currentStep === 1 && (
            <div className="text-center w-full flex flex-col items-center">
              <h1 className='text-2xl font-bold'> Upload Your Data Set</h1>
              <p className='mb-6 text-gray-600 w-[95%]'>Click on the Upload Enterprise Architecture Datasets to begin storing your datasets in to our system. </p>
              <FileUploadModal onUploadComplete={(files) => setUploadedFiles(files)} />
              {uploadedFiles.length > 0 && <p className="mt-4 text-sm text-gray-500">Files uploaded successfully!</p>}
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Onboarding Complete!</h2>
              <p className="mb-8">Your dataset has been successfully uploaded and processed into our system.</p>
              <Button onClick={() => router.push('/dashboard/resources')} size="lg">
                View Your Dashboard
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={(currentStep === 1 && uploadedFiles.length === 0) || currentStep === totalSteps}
          >
            {currentStep === totalSteps ? 'Finish' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
