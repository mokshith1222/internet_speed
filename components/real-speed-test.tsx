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

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => { abortControllerRef.current?.abort() }
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

  // ─── PING ──────────────────────────────────────────────────────────────
  const measurePing = async () => {
    const pings: number[] = []
    const signal = abortControllerRef.current?.signal

    // Warm-up request to establish TCP + TLS connection
    try {
      await fetch(`/api/ping?_=${Date.now()}`, { cache: 'no-store', signal })
    } catch (_) {}

    for (let i = 0; i < 20; i++) {
      if (signal?.aborted) break
      const t0 = performance.now()
      try {
        const res = await fetch(`/api/ping?_=${Date.now()}-${i}`, {
          cache: 'no-store',
          signal,
        })
        if (res.ok) {
          await res.json()
          const rtt = performance.now() - t0
          pings.push(rtt)
          setLiveSpeed(Math.round(rtt))
        }
      } catch (_) {}
      setProgress(prev => Math.min(prev + 0.75, 15))
    }

    if (pings.length === 0) return { ping: 0, jitter: 0 }

    pings.sort((a, b) => a - b)
    const trimCount = Math.floor(pings.length * 0.2)
    const trimmed = pings.slice(0, pings.length - trimCount)

    const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length
    const jitter = trimmed.length > 1
      ? trimmed.reduce((sum, p) => sum + Math.abs(p - avg), 0) / trimmed.length
      : 0

    return {
      ping: Math.round(avg * 10) / 10,
      jitter: Math.round(jitter * 10) / 10,
    }
  }

  // ─── DOWNLOAD ──────────────────────────────────────────────────────────
  const measureDownload = async (): Promise<number> => {
    const PARALLEL = 6
    const DURATION_MS = 10000  // 10 seconds for stable average
    const CHUNK_BYTES = 5_000_000  // 5MB per request (optimized for edge functions)

    let totalBytes = 0
    let startTime = 0
    let finished = false
    const signal = abortControllerRef.current?.signal

    const downloadStream = async () => {
      while (!finished && !signal?.aborted) {
        try {
          const res = await fetch(`/api/download?size=${CHUNK_BYTES}&_=${Date.now()}-${Math.random()}`, {
            cache: 'no-store',
            signal,
          })
          if (!res.ok || !res.body) break
          const reader = res.body.getReader()
          while (!finished) {
            const { done, value } = await reader.read()
            if (done || !value) break
            totalBytes += value.byteLength
          }
          try { reader.cancel() } catch (_) {}
        } catch (_) {
          if (finished || signal?.aborted) break
          await new Promise(r => setTimeout(r, 200))
        }
      }
    }

    const streams: Promise<void>[] = []
    for (let i = 0; i < PARALLEL; i++) {
      streams.push(downloadStream())
      if (i === 0) {
        await new Promise(r => setTimeout(r, 100))
        startTime = performance.now()
      }
    }

    const interval = setInterval(() => {
      if (startTime > 0) {
        const elapsed = (performance.now() - startTime) / 1000
        if (elapsed > 0.3) {
          const mbps = (totalBytes * 8) / (elapsed * 1_000_000)
          setLiveSpeed(Math.round(mbps * 10) / 10)
        }
      }
      setProgress(prev => Math.min(prev + 1.2, 58))
    }, 200)

    await new Promise(r => setTimeout(r, DURATION_MS))
    finished = true
    clearInterval(interval)
    await Promise.allSettled(streams)

    const elapsed = (performance.now() - startTime) / 1000
    if (elapsed < 0.5 || totalBytes === 0) return 0
    return Math.round((totalBytes * 8) / (elapsed * 1_000_000) * 10) / 10
  }

  // ─── UPLOAD ────────────────────────────────────────────────────────────
  const measureUpload = async (): Promise<number> => {
    const PARALLEL = 4
    const DURATION_MS = 8000  // 8 seconds
    const CHUNK_SIZE = 256 * 1024  // 256KB per POST

    let totalBytes = 0
    const startTime = performance.now()
    let finished = false
    const signal = abortControllerRef.current?.signal

    const reusableChunk = new Uint8Array(CHUNK_SIZE)
    for (let i = 0; i < reusableChunk.length; i += 65536) {
      crypto.getRandomValues(reusableChunk.subarray(i, Math.min(i + 65536, reusableChunk.length)))
    }

    const uploadStream = async () => {
      while (!finished && !signal?.aborted) {
        try {
          const res = await fetch(`/api/upload?_=${Date.now()}-${Math.random()}`, {
            method: 'POST',
            body: reusableChunk,
            cache: 'no-store',
            signal,
          })
          if (res.ok) {
            totalBytes += CHUNK_SIZE
          }
          try { await res.text() } catch (_) {}
        } catch (_) {
          if (finished || signal?.aborted) break
          await new Promise(r => setTimeout(r, 200))
        }
      }
    }

    const streams: Promise<void>[] = []
    for (let i = 0; i < PARALLEL; i++) {
      streams.push(uploadStream())
    }

    const interval = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000
      if (elapsed > 0.3) {
        const mbps = (totalBytes * 8) / (elapsed * 1_000_000)
        setLiveSpeed(Math.round(mbps * 10) / 10)
      }
      setProgress(prev => Math.min(prev + 1.2, 95))
    }, 200)

    await new Promise(r => setTimeout(r, DURATION_MS))
    finished = true
    clearInterval(interval)
    await Promise.allSettled(streams)

    const elapsed = (performance.now() - startTime) / 1000
    if (elapsed < 0.5 || totalBytes === 0) return 0
    return Math.round((totalBytes * 8) / (elapsed * 1_000_000) * 10) / 10
  }

  // ─── MAIN TEST RUNNER ──────────────────────────────────────────────────
  const runSpeedTest = async () => {
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
      setLiveSpeed(0)
      setProgress(15)
      const download = await measureDownload()
      if (abortControllerRef.current.signal.aborted) throw new Error('Aborted')

      setPhase('upload')
      setLiveSpeed(0)
      setProgress(60)
      const upload = await measureUpload()
      if (abortControllerRef.current.signal.aborted) throw new Error('Aborted')

      if (download === 0 && upload === 0 && pingResults.ping === 0) {
        setError('Could not reach test servers. Please check your connection and try again.')
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
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsRunning(false)
      setPhase('idle')
      setLiveSpeed(0)
      setProgress(100)
    }
  }

  const calculateNeedleAngle = (speed: number) => {
    if (speed <= 0 || phase === 'idle') return -90
    const logSpeed = Math.log10(Math.max(speed, 0.1) + 1)
    const logMax = Math.log10(1001)
    return -90 + Math.min(logSpeed / logMax, 1) * 180
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
            <div className="relative w-64 h-36 sm:w-80 sm:h-44 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full drop-shadow-2xl" viewBox="0 0 200 105">
                {/* Background arc */}
                <path d="M 15 95 A 85 85 0 0 1 185 95" fill="none" stroke="currentColor" strokeWidth="14" className="text-muted/20" strokeLinecap="round" />
                {isRunning && (
                  <path
                    d="M 15 95 A 85 85 0 0 1 185 95"
                    fill="none"
                    stroke="url(#speedGradient)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray="266.9"
                    strokeDashoffset={266.9 - (progress / 100) * 266.9}
                    className="transition-all duration-300 ease-out"
                  />
                )}
                <defs>
                  <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                {/* Labels */}
                <text x="15" y="102" fontSize="7" fill="currentColor" className="text-muted-foreground" textAnchor="middle">0</text>
                <text x="48" y="42" fontSize="7" fill="currentColor" className="text-muted-foreground" textAnchor="middle">10</text>
                <text x="100" y="12" fontSize="7" fill="currentColor" className="text-muted-foreground" textAnchor="middle">100</text>
                <text x="152" y="42" fontSize="7" fill="currentColor" className="text-muted-foreground" textAnchor="middle">500</text>
                <text x="185" y="102" fontSize="7" fill="currentColor" className="text-muted-foreground" textAnchor="middle">1K</text>
                {/* Needle */}
                <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '100px 95px', transition: 'transform 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)' }}>
                  <line x1="100" y1="95" x2="100" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="100" cy="95" r="7" fill="currentColor" className="text-primary" />
                  <circle cx="100" cy="95" r="3" fill="white" />
                </g>
                {isRunning && (
                  <text x="100" y="82" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">
                    {liveSpeed.toFixed(1)}
                  </text>
                )}
              </svg>
            </div>
          ) : (
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                {isRunning && (
                  <circle
                    cx="100" cy="100" r="90" fill="none" stroke="url(#ringGradient)" strokeWidth="8"
                    strokeDasharray={`${(progress / 100) * 565.5} 565.5`}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
                  />
                )}
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-black text-foreground tabular-nums tracking-tight">
                  {isRunning ? liveSpeed.toFixed(1) : '—'}
                </div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  {phase === 'idle' ? 'Ready' : phase === 'ping' ? 'ms' : 'Mbps'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phase Indicator */}
        <div className="h-8 mb-6">
          {isRunning && (
            <div className="text-base font-semibold text-primary uppercase tracking-widest animate-pulse">
              {phase === 'ping' ? '⚡ Measuring Latency...' : phase === 'download' ? '⬇ Testing Download...' : phase === 'upload' ? '⬆ Testing Upload...' : ''}
            </div>
          )}
          {!isRunning && !results && !error && (
            <div className="text-lg font-medium text-muted-foreground">Click Start to Begin</div>
          )}
        </div>

        {error && (
          <div className="mb-8 w-full max-w-md flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Start / Results */}
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
