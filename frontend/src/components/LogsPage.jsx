import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, AlertTriangle, CheckCircle, XCircle, ExternalLink } from "lucide-react"

export default function LogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLog, setSelectedLog] = useState(null)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      setError(null)

      // Check if user is authenticated
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please log in to view your logs')
        setLoading(false)
        return
      }

      try {
        const res = await fetch("http://localhost:3000/api/verify-event/logs", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Failed to fetch logs")
        }
        const data = await res.json()
        console.log(data)
        setLogs(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const getVerificationIcon = (result) => {
    switch (result?.toLowerCase()) {
      case "true":
      case "verified":
      case "occurred":
        return <CheckCircle className="h-6 w-6 text-[#8db5de]" />
      case "false":
      case "false claim":
        return <XCircle className="h-6 w-6 text-[#7f54cd]" />
      default:
        return <AlertTriangle className="h-6 w-6 text-[#35257d]" />
    }
  }

  // Helper to parse JSON fields if needed
  const parseIfString = (val) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val) } catch { return val }
    }
    return val
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start  py-16 z-10">
      <Card className="max-w-4xl w-full mx-auto bg-[#070e16]/70 border-[#35257d]/40 backdrop-blur-2xl shadow-2xl shadow-[#35257d]/30 mb-10">
        <CardHeader>
          <CardTitle className="text-3xl text-[#8db5de]">Verification Logs</CardTitle>
          <CardDescription className="text-[#e0e9f6]/80 text-xl">All submitted claims and their verification results</CardDescription>
        </CardHeader>
      </Card>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-16 w-16 text-[#8db5de] animate-spin mb-6" />
          <div className="text-2xl text-[#8db5de]">Loading logs...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle className="h-16 w-16 text-[#7f54cd] mb-6" />
          <div className="text-2xl text-[#7f54cd] mb-4">{error}</div>
          {error === 'Please log in to view your logs' && (
            <div className="text-center space-y-4">
              <p className="text-lg text-[#8db5de]">
                Please log in to view your verification history.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="bg-gradient-to-r from-[#35257d] to-[#7f54cd] hover:from-[#4a2f9e] hover:to-[#8f64dd] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="bg-gradient-to-r from-[#8db5de] to-[#7f54cd] hover:from-[#9dc5ee] hover:to-[#8f64dd] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle className="h-16 w-16 text-[#8db5de] mb-6" />
          <div className="text-2xl text-[#8db5de]">No logs found.</div>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-8">
          {logs.map((log) => {
            const extraction = parseIfString(log.extraction)
            const verification = parseIfString(log.verification)
            return (
              <Card key={log._id} className="bg-[#070e16]/80 border-[#8db5de]/30 hover:border-[#7f54cd]/60 transition-all duration-300 cursor-pointer" onClick={() => setSelectedLog(log)}>
                <CardContent className="py-8 px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      {getVerificationIcon(verification?.result)}
                      <span className="font-bold text-2xl text-[#e0e9f6] truncate">{log.claim}</span>
                    </div>
                    <div className="text-[#8db5de] text-lg mb-1">
                      {extraction?.event && <span>Event: {extraction.event} </span>}
                      {extraction?.location && <span> | Location: {extraction.location} </span>}
                      {extraction?.time && <span> | Time: {extraction.time}</span>}
                    </div>
                    <div className="text-[#e0e9f6]/60 text-base">
                      {verification?.reasoning ? verification.reasoning.slice(0, 120) + (verification.reasoning.length > 120 ? '...' : '') : 'No reasoning.'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end min-w-[120px]">
                    <span className="text-[#8db5de] text-sm font-mono">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal Popup for log details */}
      {selectedLog && (() => {
        const extraction = parseIfString(selectedLog.extraction)
        const verification = parseIfString(selectedLog.verification)
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 ">
            <div
              className="bg-[#070e16] rounded-2xl shadow-2xl border-2 border-[#8db5de]/40 max-w-2xl w-full p-8 relative animate-fade-in-up scrollbar-thin scrollbar-thumb-[#8db5de] scrollbar-track-[#35257d]/30 hover:scrollbar-thumb-[#7f54cd]"
              style={{ maxHeight: '80vh', overflowY: 'auto', scrollbarColor: '#8db5de #35257d', scrollbarWidth: 'thin' }}
            >
              <style>{`
                .scrollbar-thin::-webkit-scrollbar {
                  width: 8px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                  background: linear-gradient(135deg, #8db5de 0%, #7f54cd 100%);
                  border-radius: 8px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                  background: #35257d33;
                  border-radius: 8px;
                }
              `}</style>
              <button
                className="absolute top-4 right-4 text-[#8db5de] text-2xl font-bold hover:text-[#7f54cd] transition-colors"
                onClick={() => setSelectedLog(null)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="mb-6 flex items-center gap-4">
                {getVerificationIcon(verification?.result)}
                <span className="font-black text-2xl text-[#e0e9f6]">{selectedLog.claim}</span>
              </div>
              <div className="mb-4 text-[#8db5de] text-lg">
                <div>Event: {extraction?.event || <span className="text-[#e0e9f6]/40">Not specified</span>}</div>
                <div>Location: {extraction?.location || <span className="text-[#e0e9f6]/40">Not specified</span>}</div>
                <div>Time: {extraction?.time || <span className="text-[#e0e9f6]/40">Not specified</span>}</div>
              </div>
              <div className="mb-4">
                <div className="font-bold text-[#8db5de] mb-2">Verification Result:</div>
                <div className="text-[#e0e9f6] text-lg mb-2">{verification?.result || 'Unknown'}</div>
                <div className="text-[#e0e9f6]/80 text-base">{verification?.reasoning || 'No reasoning provided.'}</div>
              </div>
              <div className="mb-4">
                <div className="font-bold text-[#8db5de] mb-2">Evidence:</div>
                {Array.isArray(selectedLog.evidence) && selectedLog.evidence.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedLog.evidence.map((ev, idx) => (
                      <li key={idx} className="bg-[#35257d]/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <a href={ev.link} target="_blank" rel="noopener noreferrer" className="text-[#8db5de] hover:text-[#7f54cd] font-bold flex items-center gap-1">
                            {ev.link}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        <div className="text-[#e0e9f6]/80 text-base">
                          {ev.snippet && ev.snippet !== '' && ev.snippet !== 'Failed to scrape content.' ? ev.snippet : <span className="text-[#e0e9f6]/40">No snippet available.</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-[#e0e9f6]/40">No evidence found.</div>
                )}
              </div>
              <div className="text-[#8db5de] text-sm font-mono mt-6">Created at: {new Date(selectedLog.createdAt).toLocaleString()}</div>
            </div>
          </div>
        )
      })()}
    </div>
  )
} 