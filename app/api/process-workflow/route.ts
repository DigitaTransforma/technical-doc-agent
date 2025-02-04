import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = ""
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
})

const generationConfig = {
  temperature: 0.1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
}

export async function POST(request: Request) {
  try {
    const { blueprint, agencyName, clientName, clientIndustry, additionalNotes, projectTitle } = await request.json()

    if (!blueprint || !projectTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const now = new Date().toISOString()

    const prompt = `You are a professional workflow documentation expert. Your task is to analyze the provided JSON workflow blueprint and create a detailed, well-structured document explaining the workflow process. Use the following information to customize the document:

Blueprint:
${JSON.stringify(blueprint, null, 2)}

IMPORTANT: Use this example template below to always create the documentation. 

Example Template:

# ${projectTitle}

### Technical Documentation
- Agency: ${agencyName}
- Client: ${clientName}

Please structure the document as follows:

1. ## Project Goal: A concise clearly written goal of the automation.
2. ## Introduction: Briefly introduce the workflow and its purpose.
3. ## Overview: Provide a high-level summary of the entire workflow in bullet points.
4. ## Detailed Steps: Break down each step of the workflow, explaining its purpose, inputs, and outputs. Inputs & outputs should be in bullet point.
5. ## Tools/Technologies: List all tools or technologies used in bullet point including what it was used for in the project.
6. ## Potential ROI: Write potential ROI(s) impact that the automation can have on the client business.
7. ## Key Considerations: Highlight any important factors or potential issues to be aware of.
8. ## Conclusion: Summarize the benefits of implementing this workflow.

IMPORTANT INSTRUCTIONS (MUST ADHERE):

- In steps, Never include module names in the blueprint in the documentation.
- Use clear, professional language and format the document in Markdown.
- Never deviate from the Example Template. Always stick to the structure & instructions.
- Never hallucinate, assume or make things up. You're always truthful.
- Ensure that the agency and client details are displayed on separate paragraphs.`

    const result = await model.generateContent(prompt)
    const generatedDocument = result.response.text()

    if (!generatedDocument) {
      throw new Error("Failed to generate document content")
    }

    return NextResponse.json({ generatedDocument })
  } catch (error) {
    console.error("Error processing workflow:", error)
    return NextResponse.json({ error: error.message || "Failed to process workflow" }, { status: 500 })
  }
}

