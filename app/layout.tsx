import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Workflow Documentation Tool",
  description: "Document your workflows with AI assistance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-ai-primary">AI Workflow Docs</span>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        <footer className="bg-white shadow-sm mt-8">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © 2025 AI Sam. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

