import { useState } from "react"
import { useDropzone } from "react-dropzone"

export default function UploadBlueprint({ formData, updateFormData }) {
  const [error, setError] = useState("")
  const [fileName, setFileName] = useState("")

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      if (file.type === "application/json") {
        const reader = new FileReader()
        reader.onload = async (event) => {
          try {
            const jsonContent = JSON.parse(event.target.result)
            updateFormData({ blueprint: jsonContent })
            setFileName(file.name)
            setError("")
          } catch (error) {
            setError("Invalid JSON file. Please upload a valid JSON workflow blueprint.")
          }
        }
        reader.readAsText(file)
      } else {
        setError("Please upload a valid JSON file.")
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/json": [".json"] },
    multiple: false,
  })

  return (
    <div className="ai-card">
      <h2 className="text-2xl font-bold mb-6 text-ai-primary">Upload Workflow Blueprint</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-in-out ${
          isDragActive ? "border-ai-primary bg-ai-secondary bg-opacity-10" : "border-ai-secondary"
        }`}
      >
        <input {...getInputProps()} />
        {fileName ? (
          <p className="text-ai-primary">"{fileName}" has been uploaded successfully</p>
        ) : (
          <p className="text-ai-text">Drag and drop a JSON file here, or click to select a file</p>
        )}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <p className="mt-4 text-sm text-ai-text/70">Please upload a JSON file containing your workflow blueprint.</p>
    </div>
  )
}

