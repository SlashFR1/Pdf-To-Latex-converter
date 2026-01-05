"use client"

import type React from "react"

import { useState } from "react"
import { FileUp, Languages, FileText, Download, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ConversionStage = "idle" | "extracting" | "translating" | "generating" | "complete" | "error"

export default function PDFConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [enableTranslation, setEnableTranslation] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [stage, setStage] = useState<ConversionStage>("idle")
  const [isDragging, setIsDragging] = useState(false)
  const [latexContent, setLatexContent] = useState<string>("")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleConvert = async () => {
    if (!file) return

    // Simulate conversion stages
    setStage("extracting")
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (enableTranslation) {
      setStage("translating")
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    setStage("generating")
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const sampleLatex = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{graphicx}

\\title{${file.name.replace(".pdf", "")}}
\\author{Converted from PDF}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
This document was converted from the PDF file: ${file.name}
${enableTranslation ? `\\nTranslated to: ${targetLanguage}` : ""}

\\section{Content}
Your extracted content would appear here.

\\end{document}`

    setLatexContent(sampleLatex)
    setStage("complete")
  }

  const handleDownloadTex = () => {
    if (!latexContent) return

    const blob = new Blob([latexContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${file?.name.replace(".pdf", "") || "document"}.tex`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadPdf = () => {
    // For now, we'll download the original PDF as a demo
    if (!file) return

    const url = URL.createObjectURL(file)
    const link = document.createElement("a")
    link.href = url
    link.download = `${file.name.replace(".pdf", "")}_converted.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const stages = [
    { id: "extracting", label: "Extracting Text", icon: FileText },
    { id: "translating", label: "Translating", icon: Languages },
    { id: "generating", label: "Generating LaTeX", icon: FileUp },
  ]

  return (
    <main className="min-h-screen bg-[#000000] text-white relative overflow-hidden">
      {/* Ambient background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF]/5 via-transparent to-[#007AFF]/10" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-balance">PDF to LaTeX</h1>
          <p className="text-lg md:text-xl text-[#8E8E93] max-w-2xl mx-auto text-pretty">
            Transform your PDF documents into clean, editable LaTeX with AI-powered extraction and translation
          </p>
        </div>

        {/* Main conversion area */}
        <div className="space-y-6">
          {/* Drop zone */}
          <Card
            className={`relative overflow-hidden border-2 transition-all duration-300 ${
              isDragging
                ? "border-[#007AFF] bg-[#007AFF]/5 shadow-[0_0_50px_rgba(0,122,255,0.2)]"
                : file
                  ? "border-[#30D158]/50 bg-[#1C1C1E]/80"
                  : "border-[#3A3A3C] bg-[#1C1C1E]/80 hover:border-[#007AFF]/50"
            } backdrop-blur-xl`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="p-12">
              <input type="file" id="file-upload" className="hidden" accept=".pdf" onChange={handleFileSelect} />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer space-y-4"
              >
                <div
                  className={`p-6 rounded-3xl ${file ? "bg-[#30D158]/10" : "bg-[#007AFF]/10"} transition-colors duration-300`}
                >
                  {file ? (
                    <CheckCircle2 className="w-12 h-12 text-[#30D158]" />
                  ) : (
                    <FileUp className="w-12 h-12 text-[#007AFF]" />
                  )}
                </div>
                <div className="text-center space-y-2">
                  {file ? (
                    <>
                      <p className="text-xl font-medium text-white">{file.name}</p>
                      <p className="text-sm text-[#8E8E93]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-medium text-white">Drop your PDF here or click to browse</p>
                      <p className="text-sm text-[#8E8E93]">Supports single PDF files up to 50MB</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </Card>

          {/* Settings grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Translation toggle */}
            <Card className="p-6 bg-[#1C1C1E]/80 border-[#3A3A3C] backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-base font-medium flex items-center gap-2">
                    <Languages className="w-5 h-5 text-[#007AFF]" />
                    Translation
                  </label>
                  <p className="text-sm text-[#8E8E93]">Translate document before conversion</p>
                </div>
                <Switch
                  checked={enableTranslation}
                  onCheckedChange={setEnableTranslation}
                  className="data-[state=checked]:bg-[#007AFF]"
                />
              </div>

              {enableTranslation && (
                <div className="pt-2 animate-in fade-in-50 slide-in-from-top-2">
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="bg-[#2C2C2E] border-[#3A3A3C] text-white">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2C2C2E] border-[#3A3A3C]">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </Card>

            {/* Convert button card */}
            <Card className="p-6 bg-gradient-to-br from-[#007AFF]/10 to-[#007AFF]/5 border-[#007AFF]/30 backdrop-blur-xl flex items-center justify-center">
              <Button
                size="lg"
                disabled={!file || (stage !== "idle" && stage !== "complete")}
                onClick={handleConvert}
                className="w-full h-16 bg-[#007AFF] hover:bg-[#0051D5] text-white font-medium text-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {stage === "idle" || stage === "complete" ? (
                  <>
                    <span className="relative z-10">Convert to LaTeX</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </span>
                )}
              </Button>
            </Card>
          </div>

          {/* Progress stages */}
          {stage !== "idle" && stage !== "complete" && (
            <Card className="p-8 bg-[#1C1C1E]/80 border-[#3A3A3C] backdrop-blur-xl animate-in fade-in-50 slide-in-from-bottom-4">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-center text-white">Processing your document</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {stages.map((s, index) => {
                    const Icon = s.icon
                    const isActive = stage === s.id
                    const isComplete = stages.findIndex((st) => st.id === stage) > index
                    const shouldShow = enableTranslation || s.id !== "translating"

                    if (!shouldShow) return null

                    return (
                      <div
                        key={s.id}
                        className={`p-4 rounded-2xl border transition-all duration-300 ${
                          isActive
                            ? "bg-[#007AFF]/10 border-[#007AFF]"
                            : isComplete
                              ? "bg-[#30D158]/10 border-[#30D158]"
                              : "bg-[#2C2C2E] border-[#3A3A3C]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isActive ? (
                            <Loader2 className="w-5 h-5 text-[#007AFF] animate-spin" />
                          ) : isComplete ? (
                            <CheckCircle2 className="w-5 h-5 text-[#30D158]" />
                          ) : (
                            <Icon className="w-5 h-5 text-[#8E8E93]" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              isActive ? "text-[#007AFF]" : isComplete ? "text-[#30D158]" : "text-[#8E8E93]"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* Results */}
          {stage === "complete" && (
            <div className="grid md:grid-cols-2 gap-6 animate-in fade-in-50 slide-in-from-bottom-4">
              <Card className="p-8 bg-gradient-to-br from-[#1C1C1E]/80 to-[#2C2C2E]/80 border-[#3A3A3C] backdrop-blur-xl group hover:border-[#007AFF]/50 transition-all duration-300">
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#007AFF]/10 w-fit">
                    <FileText className="w-8 h-8 text-[#007AFF]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">LaTeX Source</h3>
                    <p className="text-sm text-[#8E8E93]">Editable .tex file ready for compilation</p>
                  </div>
                  <Button
                    onClick={handleDownloadTex}
                    variant="outline"
                    className="w-full bg-[#2C2C2E] border-[#3A3A3C] text-white hover:bg-[#3A3A3C] hover:border-[#007AFF]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download .tex
                  </Button>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-[#1C1C1E]/80 to-[#2C2C2E]/80 border-[#3A3A3C] backdrop-blur-xl group hover:border-[#007AFF]/50 transition-all duration-300">
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#30D158]/10 w-fit">
                    <FileText className="w-8 h-8 text-[#30D158]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Compiled PDF</h3>
                    <p className="text-sm text-[#8E8E93]">Final rendered document</p>
                  </div>
                  <Button
                    onClick={handleDownloadPdf}
                    variant="outline"
                    className="w-full bg-[#2C2C2E] border-[#3A3A3C] text-white hover:bg-[#3A3A3C] hover:border-[#30D158]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download .pdf
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center">
          <p className="text-sm text-[#8E8E93]">Powered by PyMuPDF and Pandoc • Open source backend available</p>
        </div>
      </div>
    </main>
  )
}
