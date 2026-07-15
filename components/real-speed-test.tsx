'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Activity, Gauge as GaugeIcon, AlertCircle } from 'lucide-react'

interface SpeedResults {
  download: number
  upload: number
  ping: number
  jitter: number
  timestamp: string
}

export function RealSpeedTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [liveSpeed, setLiveSpeed] = useState(0)
  const [results, setResults] = useState<SpeedResults | null>(null)
  const [phase, setPhase] = useState<'idle' | 'ping' | 'download' | 'upload'>('idle')
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<'digital' | 'analog'>('analog')

  // Ref to track component unmount and abort fetch requests
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const getSpeedColor = (speed: number, type: 'download' | 'upload') => {
    if (type === 'download') {
      if (speed >= 100) return 'text-green-500'
      if (speed >= 50) return 'text-emerald-500'
      if (speed >= 25) return 'text-yellow-500'
      if (speed >= 10) return 'text-orange-500'
      return 'text-red-500'
    } else {
      if (speed >= 20) return 'text-green-500'
      if (speed >= 10) return 'text-emerald-500'
      if (speed >= 5) return 'text-yellow-500'
      if (speed >= 1) return 'text-orange-500'
      return 'text-red-500'
    }
  }

  const getPingColor = (ping: number) => {
    if (ping < 20) return 'text-green-500'
    if (ping < 50) return 'text-emerald-500'
    if (ping < 100) return 'text-yellow-500'
    return 'text-red-500'
  }

  const measurePing = async () => {
    const pings: number[] = []
    const iterations = 10

    for (let i = 0; i < iterations; i++) {
      if (abortControllerRef.current?.signal.aborted) break
      
      const start = performance.now()
      try {
        const timeoutId = setTimeout(() => abortControllerRef.current?.abort(), 5000)
        const response = await fetch('/api/ping', {
          cache: 'no-store',
          signal: abortControllerRef.current?.signal,
        })
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const end = performance.now()
          const pingTime = Math.max(1, end - start)
          pings.push(pingTime)
          setLiveSpeed(Math.round(pingTime))
        }
      } catch (err) {
        // Silently continue
      }
      setProgress(prev => Math.min(prev + 1.5, 15))
    }

    if (pings.length === 0) return { ping: 0, jitter: 0 }

    const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length
    const jitter = pings.length > 1
      ? Math.sqrt(pings.reduce((sum, p) => sum + Math.pow(p - avgPing, 2), 0) / pings.length)
      : 0

    return { ping: Math.round(avgPing * 10) / 10, jitter: Math.round(jitter * 10) / 10 }
  }

  const measureDownload = async () => {
    try {
      const testSizes = [1048576, 2097152, 5242880] // 1MB, 2MB, 5MB
      let totalSpeed = 0
      let validTests = 0

      for (const size of testSizes) {
        if (abortControllerRef.current?.signal.aborted) break

        const start = performance.now()
        try {
          const timeoutId = setTimeout(() => abortControllerRef.current?.abort(), 15000)
          const response = await fetch(`/api/download?size=${size}`, {
            cache: 'no-store',
            signal: abortControllerRef.current?.signal,
          })
          clearTimeout(timeoutId)

          if (response.ok) {
            const ttfb = performance.now()
            await response.blob()
            const end = performance.now()
            
            // Subtract TTFB to get raw throughput time
            let timeSec = (end - ttfb) / 1000
            if (timeSec < 0.001) timeSec = 0.01 // Prevent division by zero
            
            const sizeMb = size / (1024 * 1024)
            const speedMbps = (sizeMb / timeSec) * 8
            
            if (!isNaN(speedMbps) && speedMbps > 0 && speedMbps < 10000) {
              totalSpeed += speedMbps
              validTests++
              setLiveSpeed(Math.round(speedMbps * 10) / 10)
            }
          }
        } catch (err) {
          // Silently continue
        }
        setProgress(prev => Math.min(prev + 15, 55))
      }

      if (validTests === 0) return 0
      return Math.round((totalSpeed / validTests) * 10) / 10
    } catch (err) {
      return 0
    }
  }

  const measureUpload = async () => {
    try {
      const testSizes = [131072, 262144, 524288] // 128KB, 256KB, 512KB
      let totalSpeed = 0
      let validTests = 0

      for (const size of testSizes) {
        if (abortControllerRef.current?.signal.aborted) break

        const data = new Uint8Array(size)
        if (typeof crypto !== 'undefined') {
          for (let i = 0; i < data.length; i += 65536) {
            crypto.getRandomValues(data.subarray(i, Math.min(i + 65536, data.length)))
          }
        }

        const start = performance.now()
        try {
          const timeoutId = setTimeout(() => abortControllerRef.current?.abort(), 15000)
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: data,
            cache: 'no-store',
            signal: abortControllerRef.current?.signal,
          })
          clearTimeout(timeoutId)

          if (response.ok) {
            const end = performance.now()
            let timeSec = (end - start) / 1000
            if (timeSec < 0.001) timeSec = 0.01

            const sizeMb = size / (1024 * 1024)
            const speedMbps = (sizeMb / timeSec) * 8
            
            if (!isNaN(speedMbps) && speedMbps > 0 && speedMbps < 10000) {
              totalSpeed += speedMbps
              validTests++
              setLiveSpeed(Math.round(speedMbps * 10) / 10)
            }
          }
        } catch (err) {
          // Silently continue
        }
        setProgress(prev => Math.min(prev + 15, 95))
      }

      if (validTests === 0) return 0
      return Math.round((totalSpeed / validTests) * 10) / 10
    } catch (err) {
      return 0
    }
  }

  const runSpeedTest = async () => {
    // Reset state
    abortControllerRef.current = new AbortController()
    setIsRunning(true)
    setProgress(0)
    setLiveSpeed(0)
    setResults(null)
    setError('')

    try {
      setPhase('ping')
      const pingResults = await measurePing()
      if (abortControllerRef.current.signal.aborted) throw new Error('Aborted')

      setPhase('download')
      const download = await measureDownload()
      if (abortControllerRef.current.signal.aborted) throw new Error('Aborted')

      setPhase('upload')
      const upload = await measureUpload()
      if (abortControllerRef.current.signal.aborted) throw new Error('Aborted')

      if (download === 0 && upload === 0 && pingResults.ping === 0) {
        setError('Network Error: Unable to reach the testing servers. Please try again.')
      } else {
        setResults({
          download,
          upload,
          ping: pingResults.ping,
          jitter: pingResults.jitter,
          timestamp: new Date().toLocaleString(),
        })
      }
    } catch (err) {
      if ((err as Error).message !== 'Aborted') {
        setError('An unexpected error occurred during the test.')
      }
    } finally {
      setIsRunning(false)
      setPhase('idle')
      setLiveSpeed(0)
      setProgress(100)
    }
  }

  // Smooth analog gauge calculation mapping 0-1000 Mbps to a -90 to +90 degree angle.
  const calculateNeedleAngle = (speed: number) => {
    if (speed <= 0 || phase === 'idle') return -90
    const maxSpeed = 1000 
    const logSpeed = Math.log10(speed + 1)
    const logMax = Math.log10(maxSpeed + 1)
    let ratio = logSpeed / logMax
    if (ratio > 1) ratio = 1
    return -90 + (ratio * 180) // 180 degree semi-circle
  }

  const needleAngle = calculateNeedleAngle(liveSpeed)

  return (
    <div className="w-full max-w-3xl mx-auto my-12 px-4">
      
      {/* View Mode Toggle */}
      <div className="flex justify-center mb-10">
        <div className="bg-secondary/40 p-1.5 rounded-full inline-flex border border-border shadow-sm">
          <button
            onClick={() => setViewMode('analog')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              viewMode === 'analog' ? 'bg-primary text-primary-foreground shadow-md scale-105' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <GaugeIcon className="w-4 h-4" /> Analog
          </button>
          <button
            onClick={() => setViewMode('digital')}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              viewMode === 'digital' ? 'bg-primary text-primary-foreground shadow-md scale-105' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="w-4 h-4" /> Digital
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Visual Gauge */}
        <div className="mb-12 w-full flex justify-center">
          {viewMode === 'analog' ? (
            <div className="relative w-64 h-32 sm:w-80 sm:h-40 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full drop-shadow-2xl" viewBox="0 0 200 100">
                {/* Background Track */}
                <path d="M 10 90 A 80 80 0 0 1 190 90" fill="none" stroke="currentColor" strokeWidth="16" className="text-muted/20" strokeLinecap="round" />
                
                {/* Active Track */}
                {isRunning && (
                  <path 
                    d="M 10 90 A 80 80 0 0 1 190 90" 
                    fill="none" 
                    stroke="url(#speedGradient)" 
                    strokeWidth="16" 
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (progress / 100) * 251.2}
                    className="transition-all duration-300 ease-out"
                  />
                )}
                
                <defs>
                  <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* Markers */}
                <text x="10" y="98" fontSize="6" fill="currentColor" className="text-muted-foreground" textAnchor="start">0</text>
                <text x="50" y="30" fontSize="6" fill="currentColor" className="text-muted-foreground" textAnchor="middle">10</text>
                <text x="100" y="8" fontSize="6" fill="currentColor" className="text-muted-foreground" textAnchor="middle">100</text>
                <text x="150" y="30" fontSize="6" fill="currentColor" className="text-muted-foreground" textAnchor="middle">500</text>
                <text x="190" y="98" fontSize="6" fill="currentColor" className="text-muted-foreground" textAnchor="end">1000+</text>

                {/* Needle */}
                <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '100px 90px', transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                  <path d="M 96 90 L 100 15 L 104 90 Z" fill="currentColor" className="text-foreground drop-shadow-lg" />
                  <circle cx="100" cy="90" r="8" fill="currentColor" className="text-primary shadow-lg" />
                </g>
              </svg>
            </div>
          ) : (
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                {isRunning && (
                  <circle
                    cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8"
                    strokeDasharray={`${(progress / 100) * 565.5} 565.5`}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-300 ease-out"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <div className="text-6xl font-black text-foreground tabular-nums tracking-tight transition-all">
                  {isRunning ? liveSpeed : '0'}
                </div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  {phase === 'idle' ? 'Ready' : (phase === 'ping' ? 'ms' : 'Mbps')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phase Indicator */}
        <div className="h-8 mb-6">
          {isRunning && (
            <div className="text-lg font-semibold text-primary uppercase tracking-widest animate-pulse">
              Measuring {phase}...
            </div>
          )}
          {!isRunning && !results && !error && (
            <div className="text-lg font-medium text-muted-foreground">
              Click Start to Begin
            </div>
          )}
        </div>

        {error && (
          <div className="mb-8 w-full max-w-md flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Action Button */}
        {!isRunning && !results ? (
          <button
            onClick={runSpeedTest}
            className="group relative inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-12 h-12 ml-2 fill-current group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 scale-110 group-hover:scale-125 transition-transform duration-500 opacity-50" />
          </button>
        ) : (
          results && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Download</div>
                  <div className={`text-4xl font-black mb-1 tabular-nums ${getSpeedColor(results.download, 'download')}`}>{results.download.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground font-semibold">Mbps</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Upload</div>
                  <div className={`text-4xl font-black mb-1 tabular-nums ${getSpeedColor(results.upload, 'upload')}`}>{results.upload.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground font-semibold">Mbps</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Ping</div>
                  <div className={`text-4xl font-black mb-1 tabular-nums ${getPingColor(results.ping)}`}>{results.ping.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground font-semibold">ms</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Jitter</div>
                  <div className="text-4xl font-black mb-1 tabular-nums text-amber-500">{results.jitter.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground font-semibold">ms</div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={runSpeedTest}
                  className="py-3 px-8 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Test Again
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
