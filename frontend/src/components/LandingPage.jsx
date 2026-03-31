import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Clock,
  FileText,
  Loader2,
  Shield,
  Eye,
  Zap,
  Brain,
  Target,
  Sparkles,
  ChevronDown,
  ArrowDown,
} from "lucide-react"
import BlobVideoBackground from "./BlobVideoBackground"
import ParticleBackground from "./ui/ParticleBackground"

export default function LandingPage() {
  const [claim, setClaim] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please log in to verify claims')
      setLoading(false)
      return
    }

    try {
      const res = await fetch("http://localhost:3000/api/verify-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ claim }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Unknown error")
      }
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const parseVerification = (verification) => {
    if (!verification) return null
    try {
      return JSON.parse(verification)
    } catch {
      return { result: "Unknown", reasoning: verification }
    }
  }

  const getVerificationIcon = (result) => {
    switch (result?.toLowerCase()) {
      case "true":
      case "verified":
        return <CheckCircle className="h-6 w-6 text-[#8db5de]" />
      case "false":
      case "false claim":
        return <XCircle className="h-6 w-6 text-[#7f54cd]" />
      default:
        return <AlertTriangle className="h-6 w-6 text-[#35257d]" />
    }
  }

  const getVerificationColor = (result) => {
    switch (result?.toLowerCase()) {
      case "true":
      case "verified":
        return "bg-[#8db5de]/15 border-[#8db5de]/50 text-[#8db5de] shadow-[#8db5de]/40"
      case "false":
      case "false claim":
        return "bg-[#7f54cd]/15 border-[#7f54cd]/50 text-[#7f54cd] shadow-[#7f54cd]/40"
      default:
        return "bg-[#35257d]/15 border-[#35257d]/50 text-[#35257d] shadow-[#35257d]/40"
    }
  }

  return (
    <div className="relative overflow-x-hidden">

      {/* Section 1: Landing Page */}
      <section id="landing" className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Animated Blob Video Background */}
        {/* <BlobVideoBackground zIndex={0} /> */}
        {/* Navigation Bar and gradient line are now in App.jsx */}
        <div className="relative z-10 max-w-7xl mx-auto p-6 text-center w-full">
          {/* Hero Content */}
          <div className="space-y-16 animate-fade-in pt-20">
            {/* Title with Icons */}
            <div className="flex items-center justify-center space-x-8">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-6xl lg:text-5xl bg-gradient-to-r from-[#35257d] via-[#8db5de] to-[#7f54cd] bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl font-black w-fit mx-auto"
              >
                AI-POWERED FACT CHECKING
              </motion.h1>
            </div>
            {/* New Color Palette Line */}
            <div className="w-full max-w-4xl mx-auto mt-3 h-[3px] rounded-full overflow-hidden group">
              <div className="h-full w-full bg-gradient-to-r from-[#e0e9f6] via-[#8db5de] via-[#35257d] to-[#7f54cd] transition-all duration-300 group-hover:brightness-125" />
            </div>
            {/* Subtitle */}
            <p className="text-2xl lg:text-3xl text-[#e0e9f6] max-w-6xl mx-auto leading-relaxed font-medium">
              Next-generation AI-powered fact-checking with{" "}
              <span className="text-[#8db5de] font-bold glow-text">quantum-speed analysis</span> and{" "}
              <span className="text-[#7f54cd] font-bold glow-text">neural verification</span>
            </p>
            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16 text-xl text-[#e0e9f6]/80">
              <div className="flex items-center space-x-4 group hover:scale-125 transition-all duration-500 cursor-pointer">
                <Zap className="h-8 w-8 text-[#8db5de] group-hover:animate-bounce group-hover:text-[#e0e9f6]" />
                <span className="group-hover:text-[#8db5de] transition-colors duration-300 font-semibold">
                  Quantum Fast
                </span>
              </div>
              <div className="flex items-center space-x-4 group hover:scale-125 transition-all duration-500 cursor-pointer">
                <Target className="h-8 w-8 text-[#7f54cd] group-hover:animate-bounce group-hover:text-[#e0e9f6]" />
                <span className="group-hover:text-[#7f54cd] transition-colors duration-300 font-semibold">
                  99.9% Precision
                </span>
              </div>
              <div className="flex items-center space-x-4 group hover:scale-125 transition-all duration-500 cursor-pointer">
                <Sparkles className="h-8 w-8 text-[#35257d] group-hover:animate-bounce group-hover:text-[#e0e9f6]" />
                <span className="group-hover:text-[#35257d] transition-colors duration-300 font-semibold">
                  Neural AI
                </span>
              </div>
            </div>
            {/* CTA Button */}
            <div className="pt-12">
              <Button
                onClick={() => scrollToSection("claim-form")}
                className="group relative px-12 py-6 text-2xl font-black rounded-full bg-gradient-to-r from-[#8db5de] to-[#7f54cd] hover:from-[#8db5de] hover:via-[#7f54cd] hover:to-[#e0e9f6] text-white transition-all duration-700 transform hover:scale-110 hover:shadow-2xl hover:shadow-[#8db5de]/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#7f54cd]/30 to-[#e0e9f6]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="relative z-10 flex items-center space-x-4">
                  <span>START VERIFICATION</span>
                  <ArrowDown className="h-6 w-6 group-hover:animate-bounce" />
                </div>
              </Button>
            </div>
            {/* Scroll Indicator */}
            <div className="pt-16 animate-bounce">
              <ChevronDown
                className="h-12 w-12 text-[#8db5de]/60 mx-auto cursor-pointer hover:text-[#8db5de] transition-colors duration-300"
                onClick={() => scrollToSection("claim-form")}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Section 2: Claim Form */}
      <section id="claim-form" className="min-h-screen relative overflow-hidden py-12">
        <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-12">
          {/* Input Form */}
          <Card className="max-w-5xl mx-auto bg-[#070e16]/60 border-[#35257d]/40 backdrop-blur-2xl shadow-2xl shadow-[#35257d]/30 animate-slide-up hover:shadow-[#8db5de]/40 hover:border-[#8db5de]/60 transition-all duration-700 group relative overflow-hidden">
            <div className="absolute mt-16 inset-0 bg-gradient-to-r from-[#35257d]/5 via-[#8db5de]/5 to-[#7f54cd]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <CardHeader className="border-b border-[#35257d]/30 relative z-10 ">
              <CardTitle className="flex items-center space-x-5 text-3xl ">
                <div className="relative">
                  <Search className="h-10 w-10 text-[#8db5de] group-hover:text-[#7f54cd] transition-colors duration-500" />
                </div>
                <span className="bg-gradient-to-r from-[#35257d] via-[#8db5de] to-[#7f54cd] bg-clip-text text-transparent">
                  Enter Your Claim
                </span>
              </CardTitle>
              <CardDescription className="text-[#e0e9f6]/80 text-xl font-small opacity-70 py-3">
                Submit any claim for comprehensive neural network analysis and verification
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12 pt-5 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="relative group">
                  <Textarea
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)}
                    placeholder="Enter your claim here... (e.g., 'There was an earthquake in California yesterday')"
                    rows={7}
                    className="h-42 bg-[#070e16]/70 border-[#35257d]/50 text-[#e0e9f6] placeholder-[#e0e9f6]/50 resize-none transition-all duration-500 focus:border-[#8db5de]/70 focus:ring-4 focus:ring-[#8db5de]/20 focus:bg-[#070e16]/90 text-2xl leading-relaxed hover:border-[#8db5de]/60 font-medium"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#35257d]/10 via-[#8db5de]/10 to-[#7f54cd]/10 rounded-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                <Button
                  type="submit"
                  disabled={loading || !claim.trim()}
                  className="w-full rounded-full h-2 bg-gradient-to-r from-[#35257d] via-[#8db5de] to-[#7f54cd] hover:from-[#8db5de] hover:via-[#7f54cd] hover:to-[#e0e9f6] text-white font-black py-8 text-2xl transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#8db5de]/50 disabled:transform-none disabled:opacity-50 group relative overflow-hidden"
                >
                  <div className="absolute rounded-full h-16 inset-0 bg-gradient-to-r from-[#7f54cd]/30 to-[#e0e9f6]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute rounded-full h-16 inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {loading ? (
                    <>
                      <Loader2 className="mr-5 h-8 w-8 animate-spin" />
                      <span className="relative z-10">Analyzing Claim...</span>
                    </>
                  ) : (
                    <>
                      <Eye className="mr-5 h-8 w-8 scale-200 group-hover:animate-bounce relative z-10" />
                      <span className="relative z-10">VERIFY CLAIM</span>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          {/* Error Display */}
          {error && (
            <Alert className="max-w-5xl mx-auto bg-[#7f54cd]/15 border-[#7f54cd]/50 backdrop-blur-sm animate-shake shadow-lg shadow-[#7f54cd]/20">
              <XCircle className="h-7 w-7 text-[#7f54cd]" />
              <AlertDescription className="text-[#7f54cd] text-2xl font-semibold">
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Login Prompt */}
          {error === 'Please log in to verify claims' && (
            <Card className="max-w-5xl mx-auto bg-[#070e16]/60 border-[#8db5de]/40 backdrop-blur-2xl shadow-2xl shadow-[#8db5de]/30 animate-slide-up">
              <CardContent className="p-12 text-center">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <Shield className="h-16 w-16 text-[#8db5de]" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#e0e9f6]">
                    Authentication Required
                  </h3>
                  <p className="text-xl text-[#8db5de]">
                    Please log in or create an account to verify claims and view your verification history.
                  </p>
                  <div className="flex justify-center space-x-6 pt-4">
                    <Button
                      onClick={() => window.location.href = '/login'}
                      className="bg-gradient-to-r from-[#35257d] to-[#7f54cd] hover:from-[#4a2f9e] hover:to-[#8f64dd] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/signup'}
                      className="bg-gradient-to-r from-[#8db5de] to-[#7f54cd] hover:from-[#9dc5ee] hover:to-[#8f64dd] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Results */}
          {result && (
            <div className="space-y-12 animate-fade-in-up">
              {/* Claim Summary */}
              <Card className="bg-[#070e16]/50 border-[#8db5de]/40 backdrop-blur-2xl shadow-xl shadow-[#8db5de]/25 hover:shadow-[#e0e9f6]/30 hover:border-[#e0e9f6]/60 transition-all duration-700 group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8db5de]/5 to-[#e0e9f6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg" />
                <CardHeader className="border-b border-[#8db5de]/30 relative z-10">
                  <CardTitle className="flex items-center space-x-5 text-3xl">
                    <FileText className="h-8 w-8 text-[#8db5de]" />
                    <span className="text-[#e0e9f6]">Analyzed Claim</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 relative z-10">
                  <div className="relative p-10 bg-gradient-to-r from-[#070e16]/70 to-[#35257d]/10 rounded-2xl border-l-4 border-[#8db5de] hover:border-[#e0e9f6] transition-colors duration-500">
                    <p className="text-[#e0e9f6] leading-relaxed text-2xl font-medium">{result.claim}</p>
                    <div className="absolute top-6 right-6">
                      <Sparkles className="h-8 w-8 text-[#8db5de]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Extraction Details */}
              {result.extraction && (
                <Card className="bg-[#070e16]/50 border-[#35257d]/40 backdrop-blur-2xl shadow-xl shadow-[#35257d]/25 hover:shadow-[#8db5de]/30 hover:border-[#8db5de]/60 transition-all duration-700">
                  <CardHeader className="border-b border-[#35257d]/30">
                    <CardTitle className="text-3xl text-[#e0e9f6]">Neural Extraction Results</CardTitle>
                    <CardDescription className="text-[#8db5de] text-2xl font-medium">
                      AI-identified critical data points from your claim
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-10">
                    <div className="grid md:grid-cols-3 gap-10">
                      <div className="group relative p-10 bg-gradient-to-br from-[#35257d]/25 to-[#070e16]/50 rounded-3xl border border-[#35257d]/50 hover:border-[#8db5de]/70 hover:shadow-2xl hover:shadow-[#35257d]/40 transition-all duration-500 hover:scale-110">
                        <div className="flex items-center space-x-5 mb-6">
                          <FileText className="h-8 w-8 text-[#35257d]" />
                          <span className="font-black text-[#35257d] text-2xl">Event</span>
                        </div>
                        <p className="text-[#e0e9f6] text-xl font-medium">
                          {result.extraction.event || "Not specified"}
                        </p>
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="w-4 h-4 bg-[#35257d] rounded-full" />
                        </div>
                      </div>
                      <div className="group relative p-10 bg-gradient-to-br from-[#8db5de]/25 to-[#070e16]/50 rounded-3xl border border-[#8db5de]/50 hover:border-[#7f54cd]/70 hover:shadow-2xl hover:shadow-[#8db5de]/40 transition-all duration-500 hover:scale-110">
                        <div className="flex items-center space-x-5 mb-6">
                          <MapPin className="h-8 w-8 text-[#8db5de]" />
                          <span className="font-black text-[#8db5de] text-2xl">Location</span>
                        </div>
                        <p className="text-[#e0e9f6] text-xl font-medium">
                          {result.extraction.location || "Not specified"}
                        </p>
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="w-4 h-4 bg-[#8db5de] rounded-full" />
                        </div>
                      </div>
                      <div className="group relative p-10 bg-gradient-to-br from-[#7f54cd]/25 to-[#070e16]/50 rounded-3xl border border-[#7f54cd]/50 hover:border-[#e0e9f6]/70 hover:shadow-2xl hover:shadow-[#7f54cd]/40 transition-all duration-500 hover:scale-110">
                        <div className="flex items-center space-x-5 mb-6">
                          <Clock className="h-8 w-8 text-[#7f54cd]" />
                          <span className="font-black text-[#7f54cd] text-2xl">Time</span>
                        </div>
                        <p className="text-[#e0e9f6] text-xl font-medium">
                          {result.extraction.time || "Not specified"}
                        </p>
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="w-4 h-4 bg-[#7f54cd] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Evidence */}
              <Card className="bg-[#070e16]/50 border-[#8db5de]/40 backdrop-blur-2xl shadow-xl shadow-[#8db5de]/25 hover:shadow-[#7f54cd]/30 hover:border-[#7f54cd]/60 transition-all duration-700">
                <CardHeader className="border-b border-[#8db5de]/30">
                  <CardTitle className="text-3xl text-[#e0e9f6]">Evidence Analysis</CardTitle>
                  <CardDescription className="text-[#8db5de] text-2xl font-medium">
                    Verified sources and comprehensive information analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  {Array.isArray(result.evidence) && result.evidence.length > 0 ? (
                    <div className="space-y-8">
                      {result.evidence.map((ev, idx) => {
                        let domain = ev.link
                        try {
                          domain = new URL(ev.link).hostname.replace("www.", "")
                        } catch {
                          // Fallback to full link
                        }
                        return (
                          <div
                            key={idx}
                            className="group relative p-10 bg-gradient-to-r from-[#070e16]/70 to-[#35257d]/15 rounded-3xl border border-[#35257d]/40 hover:border-[#8db5de]/70 hover:shadow-2xl hover:shadow-[#8db57d]/40 transition-all duration-500 hover:scale-[1.03]"
                          >
                            <div className="flex items-start justify-between mb-8">
                              <Badge className="bg-gradient-to-r from-[#35257d]/40 to-[#8db5de]/40 text-[#e0e9f6] border-[#35257d]/50 hover:border-[#8db5de]/70 transition-colors duration-500 text-xl px-6 py-3 font-bold">
                                Source {idx + 1}
                              </Badge>
                              <a
                                href={ev.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-4 text-[#8db5de] hover:text-[#7f54cd] transition-all duration-500 group-hover:scale-125"
                              >
                                <span className="font-bold text-2xl">{domain}</span>
                                <ExternalLink className="h-6 w-6 group-hover:animate-bounce" />
                              </a>
                            </div>
                            <p className="text-[#e0e9f6] leading-relaxed text-xl font-medium">{ev.snippet}</p>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#35257d]/10 via-[#8db5de]/10 to-[#7f54cd]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-[#8db5de]/70">
                      <Search className="h-24 w-24 mx-auto mb-8 opacity-50" />
                      <p className="text-2xl font-medium">No evidence sources found for this claim.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Verification Result */}
              <Card className="bg-[#070e16]/50 border-[#8db5de]/40 backdrop-blur-2xl shadow-2xl shadow-[#8db5de]/30 hover:shadow-[#e0e9f6]/40 hover:border-[#e0e9f6]/70 transition-all duration-700">
                <CardHeader className="border-b border-[#8db5de]/30">
                  <CardTitle className="text-3xl text-[#e0e9f6]">Neural Verification Result</CardTitle>
                  <CardDescription className="text-[#8db5de] text-2xl font-medium">
                    Advanced AI analysis and final conclusion
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  {(() => {
                    const verification = parseVerification(result.verification)
                    return verification ? (
                      <div className="space-y-10">
                        <div
                          className={`relative p-12 rounded-3xl border-2 ${getVerificationColor(verification.result)} transition-all duration-700 hover:scale-[1.02] group overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
                          <div className="relative z-10">
                            <div className="flex items-center space-x-8 mb-10">
                              <div className="relative">{getVerificationIcon(verification.result)}</div>
                              <span className="font-black text-4xl">{verification.result || "Unknown"}</span>
                            </div>
                            <Separator className="my-10 opacity-30" />
                            <div>
                              <h4 className="font-black mb-8 text-3xl flex items-center space-x-4">
                                <Brain className="h-9 w-9" />
                                <span>Neural Analysis:</span>
                              </h4>
                              <p className="leading-relaxed text-2xl font-medium">
                                {verification.reasoning || "No detailed reasoning provided."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-20 text-[#8db5de]/70">
                        <AlertTriangle className="h-24 w-24 mx-auto mb-8 opacity-50" />
                        <p className="text-2xl font-medium">Verification analysis not available.</p>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 