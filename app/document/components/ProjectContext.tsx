"use client"

import { useState, useEffect } from "react"
import LoadingSpinner from "./LoadingSpinner"
import dynamic from "next/dynamic"

// Dynamically import Confetti with ssr option set to false
const Confetti = dynamic(() => import("react-confetti"), { ssr: false })

export default function ProjectContext({ formData, updateFormData, onGenerateDocumentation }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Set initial window size
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })

    // Update window size on resize
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
  }

  const handleCreateDocumentation = async () => {
    setIsGenerating(true)
    try {
      // Simulate a longer process for demonstration
      await new Promise((resolve) => setTimeout(resolve, 15000))
      await onGenerateDocumentation()
      setShowConfetti(true)
    } catch (error) {
      console.error("Error in handleCreateDocumentation:", error)
      alert(`Failed to create documentation: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  return (
    <div className="ai-card">
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />
      )}
      <h2 className="text-2xl font-bold mb-6 text-ai-primary">Project Context</h2>
      {isGenerating ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <form className="space-y-6">
            <div className="playful-input">
              <input
                type="text"
                id="projectTitle"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                placeholder="Enter project title"
                required
              />
              <label htmlFor="projectTitle"></label>
            </div>
            <div className="playful-input">
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={6}
                placeholder="Add project description and/or any additional context or notes about the project. This will help create a more detailed and rich documentation..."
                className="resize-none"
                required
              />
              <label htmlFor="additionalNotes"></label>
            </div>
          </form>
          <div className="mt-8">
            <button
              onClick={handleCreateDocumentation}
              disabled={!formData.projectTitle.trim()}
              className="ai-button w-full"
            >
              Create Documentation
            </button>
          </div>
        </>
      )}
    </div>
  )
}

