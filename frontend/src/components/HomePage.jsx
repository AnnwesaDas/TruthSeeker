"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Search,
    CheckCircle,
    Shield,
    Zap,
    Brain,
    Target,
    Database,
    Activity,
    Star,
    ArrowRight,
    Rocket,
    ChevronUp,
    ChevronDown,
} from "lucide-react"
import ParticleBackground from "./ui/ParticleBackground"
import Logo from "../assets/logo.png"
import { Link } from "react-router-dom"
import MeshGradientBackground from "./MeshGradientBackground"
import BlobVideoBackground from "./BlobVideoBackground"
import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import useDocumentTitle from "../hooks/useDocumentTitle"

export default function HomePage() {
    useDocumentTitle("TruthSeeker - AI-Powered Claim Verification")

    const sectionsRef = useRef ([])
    const pageRef = useRef(0)
    const coolTimeRef = useRef(true)

    const features = [
        {
            icon: Brain,
            title: "Neural AI Analysis",
            description: "Advanced neural networks analyze claims with human-like reasoning and context understanding.",
            color: "from-[#35257d] to-[#8db5de]",
            bgColor: "bg-gradient-to-br from-[#35257d]/20 to-[#8db5de]/20",
            borderColor: "border-[#35257d]/50",
            shadow: "hover:shadow-[#8db5de]/40 shadow-[#35257d]/30",
        },
        {
            icon: Zap,
            title: "Quantum Speed Processing",
            description: "Lightning-fast verification with real-time data analysis and instant results delivery.",
            color: "from-[#8db5de] to-[#7f54cd]",
            bgColor: "bg-gradient-to-br from-[#8db5de]/20 to-[#7f54cd]/20",
            borderColor: "border-[#8db5de]/50",
            shadow: "hover:shadow-[#7f54cd]/40 shadow-[#8db5de]/30",
        },
        {
            icon: Target,
            title: "Precision Verification",
            description: "99.9% accuracy rate with comprehensive source validation and fact-checking algorithms.",
            color: "from-[#7f54cd] to-[#e0e9f6]",
            bgColor: "bg-gradient-to-br from-[#7f54cd]/20 to-[#e0e9f6]/20",
            borderColor: "border-[#7f54cd]/50",
            shadow: "hover:shadow-[#e0e9f6]/40 shadow-[#7f54cd]/30",
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Enterprise-grade security with end-to-end encryption and privacy protection.",
            color: "from-[#e0e9f6] to-[#35257d]",
            bgColor: "bg-gradient-to-br from-[#e0e9f6]/20 to-[#35257d]/20",
            borderColor: "border-[#e0e9f6]/50",
            shadow: "hover:shadow-[#35257d]/40 shadow-[#e0e9f6]/30",
        },
        {
            icon: Database,
            title: "Global Knowledge Base",
            description: "Access to billions of verified sources and real-time information databases.",
            color: "from-[#35257d] to-[#7f54cd]",
            bgColor: "bg-gradient-to-br from-[#35257d]/20 to-[#7f54cd]/20",
            borderColor: "border-[#35257d]/50",
            shadow: "hover:shadow-[#7f54cd]/40 shadow-[#35257d]/30",
        },
        {
            icon: Activity,
            title: "Real-time Updates",
            description: "Live monitoring and instant updates as new information becomes available.",
            color: "from-[#8db5de] to-[#e0e9f6]",
            bgColor: "bg-gradient-to-br from-[#8db5de]/20 to-[#e0e9f6]/20",
            borderColor: "border-[#8db5de]/50",
            shadow: "hover:shadow-[#e0e9f6]/40 shadow-[#8db5de]/30",
        },
    ]

    const testimonials = [
        {
            name: "Dr. Sarah Chen",
            role: "Research Director",
            organization: "Global Fact-Checking Institute",
            content:
                "This platform has revolutionized how we approach fact verification. The neural AI analysis is incredibly accurate.",
            rating: 5,
        },
        {
            name: "Marcus Rodriguez",
            role: "News Editor",
            organization: "Digital Media Network",
            content:
                "The speed and accuracy of this verification system have transformed our editorial workflow. Highly recommended.",
            rating: 5,
        },
        {
            name: "Dr. Emily Watson",
            role: "Data Scientist",
            organization: "Tech Research Labs",
            content:
                "The quantum-speed processing and neural analysis capabilities are truly groundbreaking for misinformation detection.",
            rating: 5,
        },
    ]

    const [showMesh, setShowMesh] = useState(false)
    const section2Ref = useRef(null)

    useEffect(() => {
        const handleScroll = () => {
            if (!section2Ref.current) return
            const rect = section2Ref.current.getBoundingClientRect()
            // If section 2 top is at or above the top of the viewport, show mesh
            console.log(rect.top)
            setShowMesh(rect.top <= 200)
        }
        window.addEventListener("scroll", handleScroll)
        handleScroll() 
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="relative overflow-x-hidden">
            {/* Only show BlobVideoBackground for intro, fade in MeshGradientBackground for section 2+ */}
            {/* <BlobVideoBackground zIndex={0} style={{ opacity: showMesh ? 0 : 1, transition: 'opacity 0.7s' }} /> */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showMesh ? 1 : 0 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                style={{ pointerEvents: 'none' }}
            >
                <MeshGradientBackground zIndex={1} />
            </motion.div>
            {/* Section 1: Hero Landing */}
            <section className="section-page min-h-screen flex items-center justify-center relative">
                <div className="max-w-7xl mx-auto p-6 w-full">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-8">
                            <div className="space-y-6">
                                <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                                    AI-Powered Claim Verification
                                </h1>
                                <p className="text-xl lg:text-2xl text-[#e0e9f6]/80 leading-relaxed max-w-2xl">
                                    Advanced fact-checking with high-speed AI reasoning and trusted source validation.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-3 h-3 bg-[#8db5de] rounded-full"></div>
                                    <span className="text-lg lg:text-xl text-[#e0e9f6] font-semibold">Fast & Accurate</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-3 h-3 bg-[#7f54cd] rounded-full"></div>
                                    <span className="text-lg lg:text-xl text-[#e0e9f6] font-semibold">99.9% Verified Precision</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-3 h-3 bg-[#35257d] rounded-full"></div>
                                    <span className="text-lg lg:text-xl text-[#e0e9f6] font-semibold">
                                        Powered by Neural Intelligence
                                    </span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="pt-8 flex flex-row gap-x-4">
                                <a href="#features"> 
                                    <button
                                    onClick={() => setPage(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-[#35257d] via-[#8db5de] to-[#7f54cd] hover:from-[#8db5de] hover:via-[#7f54cd] hover:to-[#e0e9f6] text-white font-bold text-lg rounded-full transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#8db5de]/50">
                                    Get Started
                                </button>
                                </a>
                                <Link
                                    to="/verify"
                                    className="px-8 py-4 bg-white text-[#35257d] font-bold text-lg rounded-full border-2 border-[#8db5de] hover:bg-[#8db5de] hover:text-white transition-all duration-500 transform hover:scale-105"
                                >
                                    Verify
                                </Link>
                            </div>
                        </div>
                        {/* Right: Space for Animation/Image was here, now removed */}
                    </div>
                </div>
            </section>

            {/* Section 2: Features */}
            <section ref={section2Ref} id="features" className="z-10 py-20 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-white mb-6">
                            Advanced Features
                        </h2>
                        <p className="text-2xl text-[#e0e9f6]/80 max-w-4xl mx-auto">
                            Cutting-edge technology designed to combat misinformation with unprecedented accuracy and speed
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative p-8 rounded-3xl border ${feature.borderColor} bg-[#070e16]/60 ${feature.shadow} shadow-md transition-all duration-500 hover:scale-105`}
                            >
                                <div
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r from-[#35257d] to-[#7f54cd] flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-500`}
                                >
                                    <feature.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-[#e0e9f6] mb-4">{feature.title}</h3>
                                <p className="text-[#e0e9f6]/80 text-lg leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: How It Works */}
            <section id="how-it-works" className="z-10 py-20 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-white mb-6">
                            How It Works
                        </h2>
                        <p className="text-2xl text-[#e0e9f6]/80 max-w-4xl mx-auto">
                            Our advanced AI system processes claims through multiple layers of verification
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="relative p-8 bg-gradient-to-br from-[#070e16]/50 to-[#35257d]/20 rounded-3xl border border-[#35257d]/30 hover:border-[#8db5de]/60 transition-all duration-500">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#35257d] to-[#8db5de] flex items-center justify-center mx-auto mb-6 group-hover:scale-125 transition-transform duration-500">
                                    <Search className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-[#e0e9f6] mb-4">1. Claim Analysis</h3>
                                <p className="text-[#e0e9f6]/80 text-lg">
                                    Neural AI extracts key information and identifies verification points
                                </p>
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="relative p-8 bg-gradient-to-br from-[#070e16]/50 to-[#8db5de]/20 rounded-3xl border border-[#8db5de]/30 hover:border-[#7f54cd]/60 transition-all duration-500">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#8db5de] to-[#7f54cd] flex items-center justify-center mx-auto mb-6 group-hover:scale-125 transition-transform duration-500">
                                    <Database className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-[#e0e9f6] mb-4">2. Source Verification</h3>
                                <p className="text-[#e0e9f6]/80 text-lg">
                                    Cross-references with billions of verified sources and databases
                                </p>
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="relative p-8 bg-gradient-to-br from-[#070e16]/50 to-[#7f54cd]/20 rounded-3xl border border-[#7f54cd]/30 hover:border-[#e0e9f6]/60 transition-all duration-500">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#7f54cd] to-[#e0e9f6] flex items-center justify-center mx-auto mb-6 group-hover:scale-125 transition-transform duration-500">
                                    <CheckCircle className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-[#e0e9f6] mb-4">3. Result Delivery</h3>
                                <p className="text-[#e0e9f6]/80 text-lg">
                                    Provides comprehensive analysis with evidence and confidence scores
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: CTA */}
            <section id="cta" className="z-10 py-20 relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div
                        className="relative p-12 bg-gradient-to-br from-[#070e16]/50 to-[#35257d]/20 rounded-3xl border border-[#35257d]/30 hover:border-[#8db5de]/60 transition-all duration-500"
                    >
                        <h2 className="text-4xl font-black text-white mb-6">
                            Ready to Verify Claims?
                        </h2>
                        <p className="text-xl text-[#e0e9f6]/80 mb-8 max-w-2xl mx-auto">
                            Join thousands of users who trust our AI-powered verification system for accurate, reliable fact-checking
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button
                                onClick={() => (window.location.href = "/verify")}
                                className="group relative w-72 px-12 py-6 text-md font-black rounded-full bg-gradient-to-r from-[#8db5de] to-[#7f54cd] hover:from-[#8db5de] hover:via-[#7f54cd] hover:to-[#e0e9f6] text-white transition-all duration-700 transform hover:scale-110 hover:shadow-2xl hover:shadow-[#8db5de]/50"
                            >
                                <span>START VERIFYING NOW</span>
                                <ArrowRight className="h-6 w-6 group-hover:animate-bounce ml-2" />
                            </Button>
                            <Button
                                onClick={() => (window.location.href = "/signup")}
                                className="group relative w-72 px-12 py-6 text-md font-black rounded-full bg-transparent border-2 border-[#8db5de] text-[#8db5de] hover:bg-[#8db5de] hover:text-white transition-all duration-700 transform hover:scale-110"
                            >
                                <span>CREATE ACCOUNT</span>
                                <Rocket className="h-6 w-6 group-hover:animate-bounce ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
