'use client'

import React, { useEffect, useRef } from 'react'

interface Point {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    color: string
}

export default function InteractiveGridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const sparksRef = useRef<Point[]>([])
    const gridRef = useRef<{ x: number, y: number, active: number }[]>([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let width = window.innerWidth
        let height = window.innerHeight

        const resize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
            initGrid()
        }

        const initGrid = () => {
            gridRef.current = []
            const spacing = 40
            for (let x = 0; x < width; x += spacing) {
                for (let y = 0; y < height; y += spacing) {
                    gridRef.current.push({ x, y, active: 0 })
                }
            }
        }

        const createSpark = (x: number, y: number) => {
            const colors = ['#60A5FA', '#A78BFA', '#F472B6', '#34D399'] // Blue, Purple, Pink, Green
            const color = colors[Math.floor(Math.random() * colors.length)]
            sparksRef.current.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0,
                color
            })
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }

            // Create sparks on move
            for (let i = 0; i < 2; i++) {
                createSpark(mouseRef.current.x, mouseRef.current.y)
            }
        }

        const draw = () => {
            ctx.fillStyle = '#050505' // Match background color
            ctx.fillRect(0, 0, width, height)

            // Draw Grid
            gridRef.current.forEach(point => {
                const dx = point.x - mouseRef.current.x
                const dy = point.y - mouseRef.current.y
                const dist = Math.sqrt(dx * dx + dy * dy)

                // Activate points near mouse
                if (dist < 150) {
                    point.active = Math.min(point.active + 0.1, 1)
                } else {
                    point.active = Math.max(point.active - 0.02, 0)
                }

                if (point.active > 0) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${point.active * 0.3})`
                    ctx.beginPath()
                    ctx.arc(point.x, point.y, 1 + point.active, 0, Math.PI * 2)
                    ctx.fill()
                } else {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
                    ctx.beginPath()
                    ctx.arc(point.x, point.y, 1, 0, Math.PI * 2)
                    ctx.fill()
                }
            })

            // Draw Sparks
            sparksRef.current.forEach((spark, index) => {
                spark.x += spark.vx
                spark.y += spark.vy
                spark.life -= 0.02
                spark.vx *= 0.95
                spark.vy *= 0.95

                if (spark.life <= 0) {
                    sparksRef.current.splice(index, 1)
                    return
                }

                ctx.fillStyle = spark.color
                ctx.globalAlpha = spark.life
                ctx.beginPath()
                ctx.arc(spark.x, spark.y, 2 * spark.life, 0, Math.PI * 2)
                ctx.fill()
                ctx.globalAlpha = 1.0
            })

            animationFrameId = requestAnimationFrame(draw)
        }

        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', handleMouseMove)

        resize()
        draw()

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ width: '100%', height: '100%' }}
        />
    )
}
