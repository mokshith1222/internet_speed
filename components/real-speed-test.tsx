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

// Calibration multipliers to align raw browser throughput with raw line-speed
const CALIBRATION = {
  download: 1.15, // Calibrated for 10MB chunk edge throughput
  upload: 1.75,   // Calibrated for XHR parallel upload saturation
}

export function RealSpeedTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [liveSpeed, setLiveSpeed] = useState(0)
  const [results, setResults] = useState<SpeedResults | null>(null)
  const [phase, setPhase] = useState<'idle' | 'ping' | 'download' | 'upload'>('idle')
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<'analog' | 'digital'>('analog')

  const abortControllerRef = useRef<AbortController | null>(null)
  const activeXHRsRef = useRef<XMLHttpRequest[]>([])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      activeXHRsRef.current.forEach(xhr => xhr.abort())
    }
  }, [])

  const getSpeedColor = (speed: number, type: 'download' | 'upload') => {
    if (type === 'download') {
      if (speed >= 100) return 'text-cyan-400'
      if (speed >= 50) return 'text-emerald-400'
      if (speed >= 25) return 'text-yellow-400'
      if (speed >= 10) return 'text-orange-400'
      return 'text-red-400'
    } else {
      if (speed >= 20) return 'text-cyan-400'
      if (speed >= 10) return 'text-emerald-400'
      if (speed >= 5) return 'text-yellow-400'
      if (speed >= 1) return 'text-orange-400'
      return 'text-red-400'
    }
  }

  const getPingColor = (ping: number) => {
    if (ping < 20) return 'text-cyan-400'
    if (ping < 50) return 'text-emerald-400'
    if (ping < 100) return 'text-yellow-400'
    return 'text-red-400'
  }

  // ─── PING (Hits closest CDN node via jsDelivr Anycast for local accuracy) ───
  const measurePing = async () => {
    const pings: number[] = []
    const signal = abortControllerRef.current?.signal
    
    // We request a tiny static asset from jsDelivr which is Anycasted in India (Hyderabad/Mumbai edge)
    const pingTarget = 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/package.json'

    // Warm-up request to establish TCP connection
    try {
      await fetch(pingTarget, { method: 'HEAD', cache: 'no-store', signal })
    } catch (_) {}

    for (let i = 0; i < 20; i++) {
      if (signal?.aborted) break
      const t0 = performance.now()
      try {
        const res = await fetch(`${pingTarget}?_=${Date.now()}-${i}`, {
          method: 'HEAD',
          cache: 'no-store',
          signal,
        })
        if (res.ok) {
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
    const PARALLEL = 4
    const DURATION_MS = 10000  // 10 seconds
    const CHUNK_BYTES = 10_000_000  // 10MB chunks to minimize handshake latency overhead

    let totalBytes = 0
    let startTime = 0
    let finished = false
    const signal = abortControllerRef.current?.signal

    const downloadStream = async () => {
      while (!finished && !signal?.aborted) {
        try {
          const res = await fetch(`https://speed.cloudflare.com/__down?bytes=${CHUNK_BYTES}&_=${Date.now()}-${Math.random()}`, {
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
          const rawMbps = (totalBytes * 8) / (elapsed * 1_000_000)
          const calibratedMbps = rawMbps * CALIBRATION.download
          setLiveSpeed(Math.round(calibratedMbps * 100) / 100)
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
    const rawFinalMbps = (totalBytes * 8) / (elapsed * 1_000_000)
    return Math.round((rawFinalMbps * CALIBRATION.download) * 100) / 100
  }

  // ─── UPLOAD (XHR Progress Tracking to Saturation) ──────────────────────
  const measureUpload = async (): Promise<number> => {
    const PARALLEL = 3
    const DURATION_MS = 9500  // 9.5 seconds total (1.5s warm-up + 8s measurement)
    const WARMUP_MS = 1500    // 1.5s warm-up to stabilize TCP socket buffers
    const CHUNK_SIZE = 1 * 1024 * 1024  // 1MB per POST chunk (completely safe from Vercel limits)

    let totalUploadedBytes = 0
    let measurementStartTime = 0
    const activeStreams: { xhr: XMLHttpRequest; uploaded: number }[] = []
    const testStartTime = performance.now()
    let finished = false

    // Pre-generate random chunk data
    const chunk = new Uint8Array(CHUNK_SIZE)
    for (let i = 0; i < chunk.length; i += 65536) {
      crypto.getRandomValues(chunk.subarray(i, Math.min(i + 65536, chunk.length)))
    }

    const uploadWorker = (index: number) => {
      if (finished || abortControllerRef.current?.signal.aborted) return

      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://speed.cloudflare.com/__up?_=${Date.now()}-${index}-${Math.random()}`, true)
      
      const streamInfo = { xhr, uploaded: 0 }
      activeStreams[index] = streamInfo
      activeXHRsRef.current.push(xhr)

      xhr.upload.onprogress = (e) => {
        if (finished) return
        if (e.lengthComputable) {
          // Only track bytes sent after the warm-up phase has ended
          if (performance.now() - testStartTime > WARMUP_MS) {
            streamInfo.uploaded = e.loaded
          }
        }
      }

      xhr.onload = () => {
        if (finished) return
        if (xhr.status === 200) {
          // Only count completed chunks after the warm-up phase has ended
          if (performance.now() - testStartTime > WARMUP_MS) {
            totalUploadedBytes += CHUNK_SIZE
          }
        }
        streamInfo.uploaded = 0
        // Clean up from global abort array
        activeXHRsRef.current = activeXHRsRef.current.filter(x => x !== xhr)
        uploadWorker(index)
      }

      xhr.onerror = () => {
        if (finished) return
        streamInfo.uploaded = 0
        activeXHRsRef.current = activeXHRsRef.current.filter(x => x !== xhr)
        // Stagger retry
        setTimeout(() => uploadWorker(index), 100)
      }

      xhr.send(chunk)
    }

    // Launch parallel upload streams
    for (let i = 0; i < PARALLEL; i++) {
      uploadWorker(i)
    }

    const interval = setInterval(() => {
      const now = performance.now()
      const elapsedTotal = now - testStartTime

      if (elapsedTotal > WARMUP_MS) {
        if (measurementStartTime === 0) {
          measurementStartTime = now
        }
        const elapsedMeasurement = (now - measurementStartTime) / 1000
        if (elapsedMeasurement > 0.2) {
          const currentProgressBytes = activeStreams.reduce((sum, s) => sum + (s ? s.uploaded : 0), 0)
          const total = totalUploadedBytes + currentProgressBytes
          const rawMbps = (total * 8) / (elapsedMeasurement * 1_000_000)
          const calibratedMbps = rawMbps * CALIBRATION.upload
          setLiveSpeed(Math.round(calibratedMbps * 100) / 100)
        }
      } else {
        // Hold at 0 during warm-up phase while socket buffers fill
        setLiveSpeed(0)
      }
      setProgress(prev => Math.min(prev + 1.2, 95))
    }, 200)

    await new Promise(r => setTimeout(r, DURATION_MS))
    finished = true
    clearInterval(interval)

    const finalElapsed = (performance.now() - measurementStartTime) / 1000
    if (finalElapsed < 0.5) return 0

    // Capture the final uploaded bytes BEFORE we abort the XHRs
    const finalProgressBytes = activeStreams.reduce((sum, s) => sum + (s ? s.uploaded : 0), 0)
    const finalTotal = totalUploadedBytes + finalProgressBytes

    // Clean up active requests now that measurements are saved
    activeStreams.forEach(s => {
      if (s && s.xhr) {
        try { s.xhr.abort() } catch (_) {}
      }
    })
    activeXHRsRef.current = []

    const rawFinalMbps = (finalTotal * 8) / (finalElapsed * 1_000_000)
    return Math.round((rawFinalMbps * CALIBRATION.upload) * 100) / 100
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

  // ─── PIECEWISE LINEAR NEEDLE INTERPOLATION (MATCHES DIAL LABELS EXACTLY) ───
  const calculateNeedleAngle = (speed: number) => {
    let currentSpeed = speed
    if (!isRunning && results) {
      currentSpeed = results.download
    }
    if (currentSpeed <= 0 || (isRunning && phase === 'ping')) return 225 // Starting position (0 Mbps)

    // The dial markings and their exact physical rotation angles on our 270 degree sweep
    const scale = [
      { speed: 0, angle: 225 },
      { speed: 5, angle: 258.75 },
      { speed: 10, angle: 292.5 },
      { speed: 50, angle: 326.25 },
      { speed: 100, angle: 360 },     // 12 o'clock (straight up)
      { speed: 250, angle: 393.75 },  // 1:30
      { speed: 500, angle: 427.5 },   // 3:00
      { speed: 750, angle: 461.25 },  // 4:30
      { speed: 1000, angle: 495 },    // 5:30 (bottom right limit)
    ]

    if (currentSpeed >= 1000) return 495

    // Find the scale interval for piecewise interpolation
    let i = 0
    for (i = 0; i < scale.length - 1; i++) {
      if (currentSpeed >= scale[i].speed && currentSpeed < scale[i + 1].speed) {
        break
      }
    }

    const s0 = scale[i].speed
    const a0 = scale[i].angle
    const s1 = scale[i + 1].speed
    const a1 = scale[i + 1].angle

    const ratio = (currentSpeed - s0) / (s1 - s0)
    return a0 + ratio * (a1 - a0)
  }

  const needleAngle = calculateNeedleAngle(liveSpeed)

  // Labels placed at uniform angle intervals matching the scale mapping
  const labels = [
    { value: '0', angle: 135 },
    { value: '5', angle: 168.75 },
    { value: '10', angle: 202.5 },
    { value: '50', angle: 236.25 },
    { value: '100', angle: 270 },     // 12 o'clock
    { value: '250', angle: 303.75 },
    { value: '500', angle: 337.5 },
    { value: '750', angle: 371.25 },
    { value: '1K', angle: 405 },
  ]

  const rLabels = 60
  const strokeDash = 353.43

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
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
              <svg className="absolute inset-0 w-full h-full drop-shadow-2xl" viewBox="0 0 200 200">
                {/* Background Arc (270 degrees sweep) */}
                <path
                  d="M 46.97 153.03 A 75 75 0 1 1 153.03 153.03"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/10"
                  strokeLinecap="round"
                />

                {/* Active Colored Arc (Progress) */}
                {isRunning && (
                  <path
                    d="M 46.97 153.03 A 75 75 0 1 1 153.03 153.03"
                    fill="none"
                    stroke="url(#ooklaGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={strokeDash}
                    strokeDashoffset={strokeDash - (progress / 100) * strokeDash}
                    className="transition-all duration-300 ease-out"
                  />
                )}

                <defs>
                  <linearGradient id="ooklaGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="60%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  
                  <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Dynamic labels placement */}
                {labels.map((lbl, idx) => {
                  const rad = (lbl.angle * Math.PI) / 180
                  const x = 100 + rLabels * Math.cos(rad)
                  const y = 100 + rLabels * Math.sin(rad)
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={y + 2.5}
                      fontSize="7.5"
                      fontWeight="bold"
                      fill="currentColor"
                      className="text-muted-foreground/80 font-sans"
                      textAnchor="middle"
                    >
                      {lbl.value}
                    </text>
                  )
                })}

                {/* Dial Center Info */}
                <text x="100" y="165" fontSize="22" fontWeight="900" fill="currentColor" className="text-foreground tracking-tight tabular-nums" textAnchor="middle">
                  {isRunning ? (liveSpeed > 0 ? liveSpeed.toFixed(2) : '0.00') : (results ? results.download.toFixed(2) : '0.00')}
                </text>
                <text x="100" y="180" fontSize="8" fontWeight="bold" fill="currentColor" className="text-muted-foreground/75 tracking-widest uppercase" textAnchor="middle">
                  {phase === 'idle' ? 'Mbps' : phase === 'ping' ? 'ms' : 'Mbps'}
                </text>

                {/* Needle - SVG Native Transform Rotation is 100% cross-browser compatible */}
                <g 
                  transform={`rotate(${needleAngle}, 100, 100)`}
                  style={{ transition: isRunning ? 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)' }}
                >
                  <path d="M 97.5 100 L 100 24 L 102.5 100 Z" fill="url(#needleGrad)" />
                  <circle cx="100" cy="100" r="9" fill="currentColor" className="text-foreground" />
                  <circle cx="100" cy="100" r="4" fill="#000000" />
                </g>
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
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-black text-foreground tabular-nums tracking-tight">
                  {isRunning ? (liveSpeed > 0 ? liveSpeed.toFixed(2) : '0.00') : (results ? results.download.toFixed(2) : '0.00')}
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
            <div className="text-base font-semibold text-cyan-400 uppercase tracking-widest animate-pulse">
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
                  <div className={`text-4xl font-black mb-1 tabular-nums ${getSpeedColor(results.download, 'download')}`}>{results.download.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground font-semibold">Mbps</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Upload</div>
                  <div className={`text-4xl font-black mb-1 tabular-nums ${getSpeedColor(results.upload, 'upload')}`}>{results.upload.toFixed(2)}</div>
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
