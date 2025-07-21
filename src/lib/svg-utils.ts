/**
 * Utility functions for SVG color manipulation
 */

export interface SVGColorOptions {
  primary?: string
  secondary?: string
  accent?: string
  preserveOriginal?: boolean
}

/**
 * Changes the fill color of an SVG string
 */
export function changeSVGColor(svgContent: string, color: string): string {
  return svgContent.replace(/fill="#[0-9a-fA-F]{3,6}"/g, `fill="${color}"`)
}

/**
 * Changes multiple colors in an SVG string
 */
export function changeSVGColors(svgContent: string, colors: SVGColorOptions): string {
  let processedSvg = svgContent

  if (!colors.preserveOriginal) {
    if (colors.primary) {
      processedSvg = processedSvg.replace(/fill="#[0-9a-fA-F]{3,6}"/g, `fill="${colors.primary}"`)
    }
    
    // You can add more sophisticated color replacement logic here
    // For example, replacing specific colors with secondary/accent colors
    if (colors.secondary) {
      // Replace specific patterns or add logic for secondary colors
      // This would require knowing the specific structure of your SVGs
    }
  }

  return processedSvg
}

/**
 * Validates if a string is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexColorRegex.test(color)
}

/**
 * Converts a hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Converts RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * Generates a contrasting color (black or white) for a given background color
 */
export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return '#000000'
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

/**
 * Generates a lighter version of a hex color
 */
export function lightenColor(hexColor: string, percent: number): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return hexColor
  
  const factor = 1 + percent / 100
  const newR = Math.min(255, Math.round(rgb.r * factor))
  const newG = Math.min(255, Math.round(rgb.g * factor))
  const newB = Math.min(255, Math.round(rgb.b * factor))
  
  return rgbToHex(newR, newG, newB)
}

/**
 * Generates a darker version of a hex color
 */
export function darkenColor(hexColor: string, percent: number): string {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return hexColor
  
  const factor = 1 - percent / 100
  const newR = Math.max(0, Math.round(rgb.r * factor))
  const newG = Math.max(0, Math.round(rgb.g * factor))
  const newB = Math.max(0, Math.round(rgb.b * factor))
  
  return rgbToHex(newR, newG, newB)
}

/**
 * Predefined color palettes for common use cases
 */
export const colorPalettes = {
  discord: {
    primary: '#5865F2',
    secondary: '#4752C4',
    accent: '#7289DA'
  },
  github: {
    primary: '#24292E',
    secondary: '#586069',
    accent: '#0366D6'
  },
  twitter: {
    primary: '#1DA1F2',
    secondary: '#0D8BD9',
    accent: '#14171A'
  },
  reddit: {
    primary: '#FF4500',
    secondary: '#FF6B35',
    accent: '#0079D3'
  },
  youtube: {
    primary: '#FF0000',
    secondary: '#CC0000',
    accent: '#282828'
  }
} 