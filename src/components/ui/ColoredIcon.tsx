'use client'

import { useState, useEffect } from 'react'
import { changeSVGColor, isValidHexColor } from '@/lib/svg-utils'

interface ColoredIconProps {
  iconName: 'file' | 'globe' | 'window' | 'next' | 'vercel'
  color?: string
  className?: string
  size?: number
}

export default function ColoredIcon({ 
  iconName, 
  color = '#666', 
  className = '', 
  size = 16 
}: ColoredIconProps) {
  const [svgContent, setSvgContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(`/${iconName}.svg`)
        const svgText = await response.text()
        
        // Validate the color and apply it to the SVG
        const validColor = isValidHexColor(color) ? color : '#666'
        const coloredSvg = changeSVGColor(svgText, validColor)
        
        setSvgContent(coloredSvg)
      } catch (error) {
        console.error(`Failed to load ${iconName}.svg:`, error)
        // Fallback to a simple colored div
        const validColor = isValidHexColor(color) ? color : '#666'
        setSvgContent(`<div style="width: ${size}px; height: ${size}px; background-color: ${validColor}; border-radius: 2px;"></div>`)
      } finally {
        setLoading(false)
      }
    }

    loadSvg()
  }, [iconName, color, size])

  if (loading) {
    return (
      <div 
        className={`animate-pulse bg-gray-300 rounded ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div 
      className={className}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
} 