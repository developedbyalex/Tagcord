'use client'

import { useState } from 'react'

export const AVAILABLE_CATEGORIES = [
  'Art',
  'Big Community',
  'Business',
  'Coding',
  'Design',
  'Education',
  'Entertainment',
  'Fashion',
  'Fiction',
  'Food',
  'Fun',
  'Fun or Comedy',
  'Gaming',
  'Health',
  'Large Community',
  'Memes',
  'Music',
  'NSFW',
  'Other',
  'Politics',
  'Racing',
  'Religion',
  'Roleplay',
  'Science',
  'Small Community',
  'Social',
  'Sports',
  'Technology',
  'Travel'
] as const

export type Category = typeof AVAILABLE_CATEGORIES[number]

interface CategorySelectorProps {
  selectedCategories: Category[]
  onCategoriesChange: (categories: Category[]) => void
  maxCategories?: number
  disabled?: boolean
}

export default function CategorySelector({ 
  selectedCategories, 
  onCategoriesChange, 
  maxCategories = 3,
  disabled = false 
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCategoryToggle = (category: Category) => {
    if (disabled) return

    const isSelected = selectedCategories.includes(category)
    
    if (isSelected) {
      // Remove category
      onCategoriesChange(selectedCategories.filter(c => c !== category))
    } else {
      // Add category if under limit
      if (selectedCategories.length < maxCategories) {
        onCategoriesChange([...selectedCategories, category])
      }
    }
  }

  const removeCategory = (category: Category) => {
    if (disabled) return
    onCategoriesChange(selectedCategories.filter(c => c !== category))
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[var(--foreground)]">
        Categories (up to {maxCategories})
      </label>
      
      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--accent)]/20 text-[var(--accent)] rounded-full text-sm font-medium"
            >
              {category}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className="ml-1 hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Category Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (disabled) return
            // Allow closing if already open, or opening if under limit
            if (isOpen || selectedCategories.length < maxCategories) {
              setIsOpen(!isOpen)
            }
          }}
          disabled={disabled}
          className={`w-full px-4 py-3 text-left bg-[var(--secondary)] border border-[var(--border)] rounded-lg hover:bg-[var(--secondary)]/80 transition-colors ${
            disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer'
          }`}
        >
          <span className="text-[var(--text-secondary)]">
            {selectedCategories.length >= maxCategories 
              ? isOpen ? 'Click to close' : 'Maximum categories selected'
              : 'Select categories...'
            }
          </span>
          <svg 
            className={`w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-[var(--secondary)] border border-[var(--border)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 space-y-1">
              {AVAILABLE_CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category)
                const isDisabled = !isSelected && selectedCategories.length >= maxCategories
                
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    disabled={isDisabled}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      isSelected 
                        ? 'bg-[var(--accent)]/20 text-[var(--accent)]' 
                        : isDisabled
                        ? 'text-[var(--text-secondary)]/50 cursor-not-allowed'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category}</span>
                      {isSelected && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-[var(--text-secondary)]">
        Choose up to {maxCategories} categories that best describe your Discord server
      </p>
    </div>
  )
} 