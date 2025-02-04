"use client"

import { useState, useEffect } from "react"

const messages = [
  "Analyzing your workflow like a detective...",
  "Putting the pieces together...",
  "Writing your documentation (no typos, I promise)...",
  "Making it look good...",
  "Wrapping it up for you...",
]

export default function LoadingSpinner() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length)
        setIsVisible(true)
      }, 1000) // Wait for fade out before changing message
    }, 10000) // Change message every 3 seconds

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-ai-primary"></div>
      <div
        className={`text-ai-primary font-medium text-center transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {messages[currentMessage]}
      </div>
    </div>
  )
}

