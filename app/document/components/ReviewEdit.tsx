"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Edit2 } from "lucide-react"
import Image from "next/image"

export default function ReviewEdit({ formData, updateFormData }) {
  const [editableDocument, setEditableDocument] = useState(formData.generatedDocument || "")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setEditableDocument(formData.generatedDocument || "")
  }, [formData.generatedDocument])

  const handleDocumentChange = (e) => {
    setEditableDocument(e.target.value)
    updateFormData({ generatedDocument: e.target.value })
  }

  const toggleEditing = () => {
    setIsEditing(!isEditing)
  }

  const formatDate = (date) => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const removeModuleNames = (text) => {
    return text.replace(/$$Module: [^)]+$$/g, "")
  }

  const processedDocument = removeModuleNames(editableDocument)

  return (
    <div className="ai-card">
      <div className="flex justify-end mb-4">
        <button onClick={toggleEditing} className="text-ai-primary hover:text-ai-accent transition-colors">
          <Edit2 size={20} />
        </button>
      </div>
      {formData.agencyLogo && (
        <div className="mb-4">
          <Image
            src={URL.createObjectURL(formData.agencyLogo) || "/placeholder.svg"}
            alt="Agency Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </div>
      )}
      {isEditing ? (
        <textarea
          value={editableDocument}
          onChange={handleDocumentChange}
          className="w-full h-96 p-4 border-2 border-ai-secondary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ai-primary focus:border-transparent transition duration-300 ease-in-out"
        />
      ) : (
        <div className="prose max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4 text-black" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-6 mb-3 text-black" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-medium mt-4 mb-2 text-black" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 text-black" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 text-black" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 text-black" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1 text-black" {...props} />,
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full divide-y divide-ai-secondary text-black" {...props} />
                </div>
              ),
              td: ({ node, ...props }) => <td className="px-3 py-2 whitespace-nowrap text-black" {...props} />,
              th: ({ node, ...props }) => <th className="px-3 py-2 text-left font-bold text-black" {...props} />,
            }}
          >
            {processedDocument}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

