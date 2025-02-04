import { useState, useRef } from "react"
import Image from "next/image"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

export default function DownloadPDF({ formData }) {
  const [includeLogos, setIncludeLogos] = useState(true)
  const contentRef = useRef(null)

  const handleDownload = async () => {
    if (!contentRef.current) return

    const content = contentRef.current
    const pdf = new jsPDF({
      unit: "px",
      format: "a4",
      orientation: "portrait",
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const margin = { top: 40, right: 30, bottom: 40, left: 30 }

    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: pdfWidth * 2,
      windowHeight: pdfHeight * 2,
    })

    const imgData = canvas.toDataURL("image/png")
    const imgWidth = pdfWidth - (margin.left + margin.right)
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = margin.top

    pdf.addImage(imgData, "PNG", margin.left, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight - (margin.top + margin.bottom)

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", margin.left, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight - (margin.top + margin.bottom)
    }

    pdf.save(`${formData.projectTitle || "workflow"}_documentation.pdf`)
  }

  return (
    <div className="ai-card">
      <div className="text-xl font-semibold mb-6 text-ai-primary">Your documentation is ready for download!</div>
      <div
        ref={contentRef}
        className="mb-6 pdf-content"
        style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}
      >
        {includeLogos && formData.agencyLogo && (
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
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }} {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2
                style={{ fontSize: "20px", fontWeight: "semibold", marginTop: "24px", marginBottom: "12px" }}
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                style={{ fontSize: "18px", fontWeight: "medium", marginTop: "16px", marginBottom: "8px" }}
                {...props}
              />
            ),
            p: ({ node, ...props }) => <p style={{ marginBottom: "16px", lineHeight: "1.6" }} {...props} />,
            ul: ({ node, ...props }) => <ul style={{ marginBottom: "16px", paddingLeft: "20px" }} {...props} />,
            ol: ({ node, ...props }) => <ol style={{ marginBottom: "16px", paddingLeft: "20px" }} {...props} />,
            li: ({ node, ...props }) => <li style={{ marginBottom: "4px" }} {...props} />,
            table: ({ node, ...props }) => (
              <div style={{ overflowX: "auto", marginBottom: "16px" }}>
                <table style={{ minWidth: "100%", borderCollapse: "collapse" }} {...props} />
              </div>
            ),
            td: ({ node, ...props }) => <td style={{ padding: "8px", border: "1px solid #e2e8f0" }} {...props} />,
            th: ({ node, ...props }) => (
              <th
                style={{ padding: "8px", border: "1px solid #e2e8f0", fontWeight: "bold", textAlign: "left" }}
                {...props}
              />
            ),
          }}
        >
          {formData.generatedDocument}
        </ReactMarkdown>
      </div>
      <div className="mb-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeLogos}
            onChange={(e) => setIncludeLogos(e.target.checked)}
            className="form-checkbox h-5 w-5 text-ai-primary rounded focus:ring-ai-primary"
          />
          <span className="text-ai-text">Include logos in header/footer</span>
        </label>
      </div>
      <button onClick={handleDownload} className="ai-button w-full">
        Download
      </button>
    </div>
  )
}

