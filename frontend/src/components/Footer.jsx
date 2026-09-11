"use client"

import { Link } from "react-router-dom"

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="relative z-10 mt-24 border-t border-[#35257d]/40 bg-[#070e16]/80 backdrop-blur-md">
            <div className="mx-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#8db5de] font-turret-road">
                <span>&copy; {year} TruthSeeker. All rights reserved.</span>
                <div className="flex items-center space-x-6">
                    <Link to="/privacy" className="hover:text-[#7f54cd] transition-colors">
                        Privacy Policy
                    </Link>
                    <Link to="/terms" className="hover:text-[#7f54cd] transition-colors">
                        Terms &amp; Conditions
                    </Link>
                </div>
            </div>
        </footer>
    )
}
