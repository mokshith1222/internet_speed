'use client'

import { useState } from 'react'
import { Play, AlertCircle, Activity, Gauge as GaugeIcon } from 'lucide-react'

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
      const start = performance.now()
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 10000)
        const response = await fetch('/api/ping', {
          cache: 'no-store',
          signal: controller.signal,
        })
        clearTimeout(timeout)
        if (response.ok) {
          const end = performance.now()
          const pingTime = Math.max(1, end - start)
          pings.push(pingTime)
          setLiveSpeed(pingTime) // Show ping on live speed temporarily
        }
      } catch (err) {
        // Continue with next ping
      }
      setProgress(prev => Math.min(prev + 1.5, 12))
    }

    if (pings.length === 0) {
      return { ping: 0, jitter: 0 }
    }

    const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length
    const jitter = pings.length > 1
      ? Math.sqrt(pings.reduce((sum, p) => sum + Math.pow(p - avgPing, 2), 0) / pings.length)
      : 0

    return { ping: Math.round(avgPing * 10) / 10, jitter: Math.round(jitter * 10) / 10 }
  }

  const measureDownload = async () => {
    try {
      const testSizes = [1048576, 2097152, 5242880] // 1MB, 2MB, 5MB
      const speeds: number[] = []

      for (const size of testSizes) {
        const start = performance.now()
        try {
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 45000)
          const response = await fetch(`/api/download?size=${size}`, {
            cache: 'no-store',
            signal: controller.signal,
          })
          clearTimeout(timeout)

          if (response.ok) {
            const ttfb = performance.now()
            await response.blob()
            const end = performance.now()
            const timeSec = Math.max(0.01, (end - ttfb) / 1000)
            const sizeMb = size / (1024 * 1024)
            const speedMbps = (sizeMb / timeSec) * 8
            const recordedSpeed = Math.max(0.1, speedMbps)
            speeds.push(recordedSpeed)
            setLiveSpeed(recordedSpeed)
          }
        } catch (err) {
          // Continue with next size
        }
        setProgress(prev => Math.min(prev + 15, 50))
      }

      if (speeds.length === 0) {
        return 0
      }

      const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length
      return Math.round(avgSpeed * 10) / 10
    } catch (err) {
      return 0
    }
  }

  const measureUpload = async () => {
    try {
      const testSizes = [524288, 1048576, 2097152] // 512KB, 1MB, 2MB
      const speeds: number[] = []

      for (const size of testSizes) {
        const data = new Uint8Array(size)
        if (typeof crypto !== 'undefined') {
          crypto.getRandomValues(data)
        }

        const start = performance.now()
        try {
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 45000)
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: data,
            cache: 'no-store',
            signal: controller.signal,
          })
          clearTimeout(timeout)

          if (response.ok) {
            const end = performance.now()
            const timeSec = Math.max(0.01, (end - start) / 1000)
            const sizeMb = size / (1024 * 1024)
            const speedMbps = (sizeMb / timeSec) * 8
            const recordedSpeed = Math.max(0.1, speedMbps)
            speeds.push(recordedSpeed)
            setLiveSpeed(recordedSpeed)
          }
        } catch (err) {
          // Continue with next size
        }
        setProgress(prev => Math.min(prev + 15, 85))
      }

      if (speeds.length === 0) {
        return 0
      }

      const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length
      return Math.round(avgSpeed * 10) / 10
    } catch (err) {
      return 0
    }
  }

  const runSpeedTest = async () => {
    setIsRunning(true)
    setProgress(0)
    setLiveSpeed(0)
    setResults(null)
    setError('')

    try {
      setPhase('ping')
      const pingResults = await measurePing()

      setPhase('download')
      const download = await measureDownload()

      setPhase('upload')
      const upload = await measureUpload()

      if (download === 0 && upload === 0 && pingResults.ping === 0) {
        setError('Unable to complete speed test. Please check your internet connection and try again.')
        setIsRunning(false)
        setPhase('idle')
        setLiveSpeed(0)
        return
      }

      const finalResults: SpeedResults = {
        download: download || 0,
        upload: upload || 0,
        ping: pingResults.ping || 0,
        jitter: pingResults.jitter || 0,
        timestamp: new Date().toLocaleString(),
      }

      setResults(finalResults)
      setProgress(100)
    } catch (err) {
      setError('Speed test encountered an error. Please try again.')
    } finally {
      setIsRunning(false)
      setPhase('idle')
      setLiveSpeed(0)
    }
  }

  // Convert speed to angle for analog meter (-120deg to 120deg)
  const speedToAngle = (speed: number) => {
    if (speed === 0 || phase === 'idle') return -120
    const maxSpeed = 1000 // Scale up to 1000 Mbps
    const logSpeed = Math.log10(speed + 1)
    const logMax = Math.log10(maxSpeed + 1)
    const ratio = Math.min(1, logSpeed / logMax)
    return -120 + (ratio * 240)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* View Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-secondary/20 p-1 rounded-full inline-flex border border-border">
          <button
            onClick={() => setViewMode('analog')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'analog' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <GaugeIcon className="w-4 h-4" /> Analog
          </button>
          <button
            onClick={() => setViewMode('digital')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'digital' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="w-4 h-4" /> Digital
          </button>
        </div>
      </div>

      {!results ? (
        <div className="flex flex-col items-center gap-6 py-6 sm:py-12">
          
          {/* Main Visual Component */}
          {viewMode === 'digital' ? (
            // Digital View
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              {isRunning && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/30" />
                  <circle
                    cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8"
                    strokeDasharray={`${(progress / 100) * 565.5} 565.5`}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-300"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
                  />
                </svg>
              )}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="text-4xl sm:text-6xl font-bold text-foreground transition-all">
                  {isRunning ? Math.round(liveSpeed) : '0'}
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {phase === 'idle' ? 'Ready' : (phase === 'ping' ? 'Ping (ms)' : 'Mbps')}
                </div>
              </div>
            </div>
          ) : (
            // Analog View
            <div className="relative w-64 h-40 sm:w-80 sm:h-48 overflow-hidden flex flex-col items-center justify-end pb-4">
              <svg className="absolute inset-0 w-full h-full drop-shadow-xl" viewBox="0 0 200 120">
                {/* Gauge Background Track */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted/30" strokeLinecap="round" />
                {/* Gauge Active Track (animated based on progress when running) */}
                {isRunning && (
                  <path 
                    d="M 20 100 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="12" 
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (progress / 100) * 251.2}
                    className="transition-all duration-300"
                  />
                )}
                
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* Markings */}
                <text x="20" y="115" fontSize="8" fill="currentColor" className="text-muted-foreground" textAnchor="middle">0</text>
                <text x="60" y="45" fontSize="8" fill="currentColor" className="text-muted-foreground" textAnchor="middle">10</text>
                <text x="100" y="15" fontSize="8" fill="currentColor" className="text-muted-foreground" textAnchor="middle">100</text>
                <text x="140" y="45" fontSize="8" fill="currentColor" className="text-muted-foreground" textAnchor="middle">500</text>
                <text x="180" y="115" fontSize="8" fill="currentColor" className="text-muted-foreground" textAnchor="middle">1K</text>

                {/* Needle */}
                <g 
                  style={{ transform: `rotate(${speedToAngle(liveSpeed)}deg)`, transformOrigin: '100px 100px', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                  <path d="M 96 100 L 100 20 L 104 100 Z" fill="currentColor" className="text-foreground drop-shadow-md" />
                  <circle cx="100" cy="100" r="6" fill="currentColor" className="text-primary" />
                </g>
              </svg>

              <div className="relative z-10 flex flex-col items-center mt-2">
                <div className="text-3xl font-bold text-foreground">
                  {isRunning ? Math.round(liveSpeed) : '0'}
                </div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {phase === 'idle' ? 'Mbps' : (phase === 'ping' ? 'Ping (ms)' : 'Mbps')}
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Speed Test</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              {isRunning ? `Measuring ${phase}...` : 'Click to test your real internet speed now'}
            </p>
          </div>

          {error && (
            <div className="w-full flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={runSpeedTest}
            disabled={isRunning}
            className="relative mt-2 inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary to-orange-600 hover:from-primary/90 hover:to-orange-700 disabled:from-muted disabled:to-muted-foreground text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-75 disabled:scale-100"
          >
            <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-current" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 sm:gap-8 py-8 sm:py-12">
          {/* Results Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Download */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 dark:border-blue-500/30 rounded-2xl p-4 sm:p-6 text-center shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1 sm:mb-2 uppercase tracking-wider">
                Download
              </div>
              <div className={`text-3xl sm:text-4xl font-bold mb-1 ${getSpeedColor(results.download, 'download')}`}>
                {results.download.toFixed(1)}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">Mbps</div>
            </div>

            {/* Upload */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 dark:border-purple-500/30 rounded-2xl p-4 sm:p-6 text-center shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1 sm:mb-2 uppercase tracking-wider">
                Upload
              </div>
              <div className={`text-3xl sm:text-4xl font-bold mb-1 ${getSpeedColor(results.upload, 'upload')}`}>
                {results.upload.toFixed(1)}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">Mbps</div>
            </div>

            {/* Ping */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl p-4 sm:p-6 text-center shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1 sm:mb-2 uppercase tracking-wider">
                Ping
              </div>
              <div className={`text-3xl sm:text-4xl font-bold mb-1 ${getPingColor(results.ping)}`}>
                {results.ping.toFixed(1)}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">ms</div>
            </div>

            {/* Jitter */}
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 dark:border-amber-500/30 rounded-2xl p-4 sm:p-6 text-center shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1 sm:mb-2 uppercase tracking-wider">
                Jitter
              </div>
              <div className="text-3xl sm:text-4xl font-bold mb-1 text-amber-500">
                {results.jitter.toFixed(1)}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground font-medium">ms</div>
            </div>
          </div>

          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            Test completed at: {results.timestamp}
          </div>

          <button
            onClick={() => {
              setResults(null)
              setProgress(0)
              setLiveSpeed(0)
              runSpeedTest()
            }}
            className="w-full py-4 px-6 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-700 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg mt-2"
          >
            <Play className="w-5 h-5 fill-current" />
            Run Another Test
          </button>
        </div>
      )}
    </div>
  )
}
