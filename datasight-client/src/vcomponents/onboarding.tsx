'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/vcomponents/ui/button"
import { Progress } from "@/vcomponents/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/vcomponents/ui/card"
import { Upload, FileCheck, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const totalSteps = 3

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
    }
  }

  const handleNextStep = async () => {
    if (currentStep < totalSteps) {
      if (currentStep === 1 && file) {
        await uploadFile()
      } else if (currentStep === 2) {
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

  const uploadFile = async () => {
    setUploading(true)
    const formData = new FormData()
    formData.append("files", file as Blob) 

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      console.log(data.status)
    } catch (error) {
      console.error("Upload failed", error)
    } finally {
      setUploading(false)
    }
  }

  const processCSV = () => {
    setIsProcessing(true)
    // Simulating CSV processing
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#f47820] to-[#1050d2]">Welcome to Your Enterprise Architecture Onboarding</h1>
      <p className='mb-6 text-gray-600'>Follow the simple steps below to upload, process, and analyze your architecture data effortlessly. Visualize the current mapping of your enterprise architecture and get ready for actionable insights!</p>
      <Progress value={(currentStep / totalSteps) * 100} className="mb-6" />

      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep} of {totalSteps}</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[400px] flex flex-col items-center justify-center">
          {currentStep === 1 && (
            <div className="text-center w-full">
              <h2 className="text-2xl font-semibold mb-4">Upload Your CSV File</h2>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">CSV file containing your enterprise architecture data</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                </label>
              </div>
              {file && <p className="mt-4 text-sm text-gray-500">Selected file: {file.name}</p>}
              {uploading && <p className="mt-4 text-sm text-gray-500">Uploading...</p>}
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Processing Your Data</h2>
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mb-4"></div>
                  <p>Analyzing your enterprise architecture data...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FileCheck className="w-16 h-16 text-green-500 mb-4" />
                  <p>Your file has been successfully processed!</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Onboarding Complete!</h2>
              <p className="mb-8">Your enterprise architecture data has been successfully uploaded and processed.</p>
              <Button onClick={() => router.push('/enterprise-architecture-view')} size="lg">
                View Your Enterprise Architecture
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
            disabled={(currentStep === 1 && !file) || uploading || currentStep === totalSteps}
          >
            {currentStep === totalSteps ? 'Finish' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
