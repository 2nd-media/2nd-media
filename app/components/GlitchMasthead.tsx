'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const TEXT = '2ND'
const FONT = '700 72px "Space Grotesk", sans-serif'
const TOTAL_FRAMES = 22
const PAD_X = 40
const PAD_Y = 24
const RED = '#ff003c'
const CYAN = '#00d4ff'

export default function GlitchMasthead() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)
  const tmpRef = useRef<HTMLCanvasElement | null>(null)
  const dimsRef = useRef({ width: 220, height: 100 })
  const dprRef = useRef(1)
  const runningRef = useRef(false)
  const rafRef = useRef<number | null>(null)
  const navigateAfterRef = useRef(false)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    const setup = async () => {
      try {
        await Promise.all([
          document.fonts.ready,
          document.fonts.load(FONT),
        ])
      } catch {
        // fonts API unsupported or load failed — fall back to default font metrics
      }
      if (cancelled) return

      const canvas = canvasRef.current
      if (!canvas) return

      const measureCtx = document.createElement('canvas').getContext('2d')
      let textWidth = 180
      if (measureCtx) {
        measureCtx.font = FONT
        textWidth = measureCtx.measureText(TEXT).width
      }

      const width = Math.ceil(textWidth) + PAD_X * 2
      const height = 72 + PAD_Y * 2
      dimsRef.current = { width, height }

      const dpr = window.devicePixelRatio || 1
      dprRef.current = dpr

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.scale(dpr, dpr)

      const offscreen = document.createElement('canvas')
      offscreen.width = width * dpr
      offscreen.height = height * dpr
      const offCtx = offscreen.getContext('2d')
      if (offCtx) {
        offCtx.scale(dpr, dpr)
        offCtx.clearRect(0, 0, width, height)
        offCtx.fillStyle = '#0a0a0a'
        offCtx.font = FONT
        offCtx.textBaseline = 'middle'
        offCtx.textAlign = 'left'
        offCtx.fillText(TEXT, PAD_X, height / 2)
      }
      offscreenRef.current = offscreen
      tmpRef.current = document.createElement('canvas')

      drawClean()
    }

    setup()

    return () => {
      cancelled = true
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  function drawClean() {
    const canvas = canvasRef.current
    const off = offscreenRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !off || !ctx) return
    const { width, height } = dimsRef.current
    const dpr = dprRef.current
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(off, 0, 0, width * dpr, height * dpr, 0, 0, width, height)
  }

  function drawTintedSlice(
    ctx: CanvasRenderingContext2D,
    off: HTMLCanvasElement,
    sy: number,
    sliceHeight: number,
    xShift: number,
    color: string
  ) {
    const tmp = tmpRef.current
    if (!tmp) return
    const { width } = dimsRef.current
    const dpr = dprRef.current
    const h = Math.max(1, Math.ceil(sliceHeight))
    tmp.width = width
    tmp.height = h
    const tctx = tmp.getContext('2d')
    if (!tctx) return
    tctx.clearRect(0, 0, width, h)
    tctx.drawImage(off, 0, sy * dpr, width * dpr, sliceHeight * dpr, 0, 0, width, h)
    tctx.globalCompositeOperation = 'source-in'
    tctx.fillStyle = color
    tctx.fillRect(0, 0, width, h)
    ctx.drawImage(tmp, xShift, sy)
  }

  function drawGlitchFrame(intensity: number) {
    const canvas = canvasRef.current
    const off = offscreenRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !off || !ctx) return
    const { width, height } = dimsRef.current
    const dpr = dprRef.current

    ctx.clearRect(0, 0, width, height)

    const numSlices = 8 + Math.floor(Math.random() * 6)
    const sliceHeight = height / numSlices

    for (let i = 0; i < numSlices; i++) {
      const sy = i * sliceHeight
      const shift = (Math.random() - 0.5) * 2 * intensity * 18

      ctx.save()
      ctx.beginPath()
      ctx.rect(0, sy, width, sliceHeight + 1)
      ctx.clip()

      ctx.drawImage(
        off,
        0, sy * dpr, width * dpr, sliceHeight * dpr,
        shift, sy, width, sliceHeight
      )

      if (Math.random() < 0.6) {
        const tear = intensity * 5
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = 0.65

        drawTintedSlice(ctx, off, sy, sliceHeight, shift + tear, RED)
        drawTintedSlice(ctx, off, sy, sliceHeight, shift - tear, CYAN)

        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
      }

      ctx.restore()
    }

    const numTears = 1 + Math.floor(intensity * 3)
    for (let t = 0; t < numTears; t++) {
      const ty = Math.random() * height
      const th = 2 + Math.random() * 6
      const tShift = (Math.random() - 0.5) * 2 * intensity * 30

      ctx.clearRect(0, ty, width, th)
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, ty, width, th)
      ctx.clip()
      ctx.drawImage(
        off,
        0, ty * dpr, width * dpr, th * dpr,
        tShift, ty, width, th
      )
      ctx.restore()
    }
  }

  function intensityForFrame(frame: number) {
    const rampUpEnd = TOTAL_FRAMES * 0.3
    const rampDownStart = TOTAL_FRAMES * 0.7
    if (frame < rampUpEnd) return frame / rampUpEnd
    if (frame < rampDownStart) return 1
    return Math.max(0, (TOTAL_FRAMES - frame) / (TOTAL_FRAMES - rampDownStart))
  }

  function startGlitch() {
    if (runningRef.current || !offscreenRef.current) return
    runningRef.current = true

    let frame = 0
    const step = () => {
      if (frame >= TOTAL_FRAMES) {
        runningRef.current = false
        drawClean()
        if (navigateAfterRef.current) {
          navigateAfterRef.current = false
          router.push('/')
        }
        return
      }
      drawGlitchFrame(intensityForFrame(frame))
      frame += 1
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!runningRef.current && Math.random() < 0.2) {
        startGlitch()
      }
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  function handleClick() {
    navigateAfterRef.current = true
    startGlitch()
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseEnter={startGlitch}
      onClick={handleClick}
      style={{ display: 'block', cursor: 'pointer' }}
      aria-label="2ND"
      role="img"
    />
  )
}
