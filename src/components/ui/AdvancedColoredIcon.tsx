'use client'

import { useState, useEffect } from 'react'

interface AdvancedColoredIconProps {
  iconName: 'file' | 'globe' | 'window' | 'next' | 'vercel'
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
  }
  className?: string
  size?: number
  preserveOriginalColors?: boolean
}

export default function AdvancedColoredIcon({ 
  iconName, 
  colors = {}, 
  className = '', 
  size = 16,
  preserveOriginalColors = false
}: AdvancedColoredIconProps) {
  const [svgContent, setSvgContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(`/${iconName}.svg`)
        const svgText = await response.text()
        
        let processedSvg = svgText

        if (!preserveOriginalColors) {
          // Replace all fill colors with the primary color
          if (colors.primary) {
            processedSvg = processedSvg.replace(/fill="#[0-9a-fA-F]{3,6}"/g, `fill="${colors.primary}"`)
          }

          // For icons that might have multiple colors, we can add more sophisticated logic
          // This is a basic implementation - you can extend it based on your needs
          if (colors.secondary) {
            // Replace specific patterns or add logic for secondary colors
            // For now, we'll just use the primary color
          }
        }
        
        setSvgContent(processedSvg)
      } catch (error) {
        console.error(`Failed to load ${iconName}.svg:`, error)
        // Fallback to a simple colored div
        const fallbackColor = colors.primary || '#666'
        setSvgContent(`<div style="width: ${size}px; height: ${size}px; background-color: ${fallbackColor}; border-radius: 2px;"></div>`)
      } finally {
        setLoading(false)
      }
    }

    loadSvg()
  }, [iconName, colors, size, preserveOriginalColors])

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