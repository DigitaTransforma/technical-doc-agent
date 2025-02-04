"use client"

import { useState } from "react"
import UploadBlueprint from "./components/UploadBlueprint"
import AgencyClientDetails from "./components/AgencyClientDetails"
import ProjectContext from "./components/ProjectContext"
import ReviewEdit from "./components/ReviewEdit"
import DownloadPDF from "./components/DownloadPDF"

const steps = ["Upload Blueprint", "Agency & Client", "Project Context", "Review & Edit", "Download PDF"]

export default function DocumentWorkflow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    projectTitle: "",
    blueprint: null,
    agencyName: "",
    agencyLogo: null,
    clientName: "",
    clientIndustry: "",
    contactDetails: "",
    additionalNotes: "",
    generatedDocument: "",
  })

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }))
  }

  const handleGenerateDocumentation = async () => {
    try {
      const response = await fetch("/api/process-workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process workflow")
      }

      const { generatedDocument } = await response.json()
      updateFormData({ generatedDocument })
      handleNext()
    } catch (error) {
      console.error("Error generating documentation:", error)
      alert(`Failed to generate documentation: ${error.message}`)
    }
  }

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0:
        return !formData.blueprint
      case 1:
        return !formData.agencyName || !formData.clientName
      case 2:
        return !formData.projectTitle || !formData.additionalNotes || !formData.generatedDocument
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <UploadBlueprint formData={formData} updateFormData={updateFormData} />
      case 1:
        return <AgencyClientDetails formData={formData} updateFormData={updateFormData} />
      case 2:
        return (
          <ProjectContext
            formData={formData}
            updateFormData={updateFormData}
            onGenerateDocumentation={handleGenerateDocumentation}
          />
        )
      case 3:
        return <ReviewEdit formData={formData} updateFormData={updateFormData} />
      case 4:
        return <DownloadPDF formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="ai-card">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="relative flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${
                  index <= currentStep ? "border-ai-primary bg-ai-primary text-white" : "border-gray-300 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <div className="mt-2 text-xs font-medium text-gray-500">{step}</div>
            </div>
          ))}
        </div>
      </div>
      {renderStep()}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="ai-button bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={isNextDisabled() || currentStep === steps.length - 1}
          className="ai-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  )
}

