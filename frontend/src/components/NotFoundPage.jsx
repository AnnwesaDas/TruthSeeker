"use client"

import { Link } from "react-router-dom"
import useDocumentTitle from "../hooks/useDocumentTitle"

export default function NotFoundPage() {
    useDocumentTitle("Page Not Found - TruthSeeker")

    return (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 font-turret-road">
            <span className="text-7xl font-black text-[#8db5de]">404</span>
            <h1 className="mt-4 text-3xl font-bold text-white">Page not found</h1>
            <p className="mt-3 max-w-md text-[#e0e9f6]/80">
                The page you're looking for doesn't exist or may have been moved.
            </p>
            <Link
                to="/"
                className="mt-8 inline-block rounded-full border-2 border-[#8db5de] px-6 py-2 text-lg font-bold text-white hover:text-[#7f54cd] hover:border-[#7f54cd] transition-colors"
            >
                Back to Home
            </Link>
        </div>
    )
}
