"use client"

import useDocumentTitle from "../hooks/useDocumentTitle"

export default function PrivacyPolicy() {
    useDocumentTitle("Privacy Policy - TruthSeeker")

    return (
        <div className="relative z-10 min-h-screen px-6 md:px-20 py-32 font-turret-road text-[#e0e9f6]">
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
                <p className="text-sm text-[#8db5de]">Last updated: {new Date().toLocaleDateString()}</p>

                <p>
                    TruthSeeker is a student project built to explore AI-assisted claim verification. This
                    page explains what data is collected and how it's used. It is not a substitute for
                    formal legal advice.
                </p>

                <h2 className="text-2xl font-bold text-white pt-4">What we collect</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Your name, email address, and a securely hashed password (never stored in plain text) when you sign up.</li>
                    <li>The text of any claim you submit for verification, along with the resulting analysis and evidence, linked to your account.</li>
                </ul>

                <h2 className="text-2xl font-bold text-white pt-4">How it's used</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Your login credentials authenticate you and keep your verification history private to your account only.</li>
                    <li>Submitted claims are sent to Google's Gemini API and Google's Fact Check Tools API to retrieve evidence and generate an analysis, and to a fine-tuned classification model hosted on Hugging Face.</li>
                    <li>We do not sell your data or share it with advertisers.</li>
                </ul>

                <h2 className="text-2xl font-bold text-white pt-4">Where it's stored</h2>
                <p>
                    Data is stored in MongoDB Atlas. You can request deletion of your account and associated
                    data at any time by contacting us below.
                </p>

                <h2 className="text-2xl font-bold text-white pt-4">Contact</h2>
                <p>Questions about this policy can be sent to dmunmun260@gmail.com.</p>
            </div>
        </div>
    )
}
