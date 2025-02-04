import { useState } from "react"
import Image from "next/image"

const industries = [
  "Agriculture",
  "Automotive",
  "Banking & Finance",
  "Construction",
  "Education",
  "Energy",
  "Entertainment",
  "Food & Beverage",
  "Healthcare",
  "Hospitality",
  "Information Technology",
  "Manufacturing",
  "Media",
  "Real Estate",
  "Retail",
  "Telecommunications",
  "Transportation & Logistics",
  "Other",
]

export default function AgencyClientDetails({ formData, updateFormData }) {
  const [previewLogo, setPreviewLogo] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      updateFormData({ agencyLogo: file })
      setPreviewLogo(URL.createObjectURL(file))
    }
  }

  return (
    <div className="ai-card">
      <h2 className="text-2xl font-bold mb-6 text-ai-primary">Agency and Client Details</h2>
      <form className="space-y-6">
        <div className="playful-input">
          <input
            type="text"
            id="agencyName"
            name="agencyName"
            value={formData.agencyName}
            onChange={handleInputChange}
            placeholder=" "
            required
          />
          <label htmlFor="agencyName">Agency Name</label>
        </div>
        <div>
          <label htmlFor="agencyLogo" className="block text-sm font-medium text-ai-text mb-2">
            Agency Logo
          </label>
          <input
            type="file"
            id="agencyLogo"
            name="agencyLogo"
            accept="image/*"
            onChange={handleLogoUpload}
            className="ai-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ai-primary file:text-white hover:file:bg-ai-accent"
          />
          {previewLogo && (
            <div className="mt-4">
              <Image
                src={previewLogo || "/placeholder.svg"}
                alt="Agency Logo Preview"
                width={100}
                height={100}
                className="rounded-md"
              />
            </div>
          )}
        </div>
        <div className="playful-input">
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            placeholder=" "
            required
          />
          <label htmlFor="clientName">Client Name</label>
        </div>
        <div className="playful-input">
          <select
            id="clientIndustry"
            name="clientIndustry"
            value={formData.clientIndustry}
            onChange={handleInputChange}
            className="ai-input"
          >
            <option value="">Select Client Industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        <div className="playful-input">
          <textarea
            id="contactDetails"
            name="contactDetails"
            value={formData.contactDetails}
            onChange={handleInputChange}
            rows={3}
            placeholder=" "
            className="ai-input resize-none"
          />
          <label htmlFor="contactDetails">Contact Details (Optional)</label>
        </div>
      </form>
    </div>
  )
}

