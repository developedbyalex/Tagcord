'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

const PRESET_IMAGES = [
  {
    id: 'gaming',
    url: 'https://placeholder.pics/svg/400x200/5865F2-FFFFFF/Gaming',
    name: 'Gaming',
    description: 'Perfect for gaming communities'
  },
  {
    id: 'community',
    url: 'https://placeholder.pics/svg/400x200/43B581-FFFFFF/Community',
    name: 'Community',
    description: 'Great for general communities'
  },
  {
    id: 'tech',
    url: 'https://placeholder.pics/svg/400x200/FAA61A-FFFFFF/Tech',
    name: 'Tech',
    description: 'For tech and development servers'
  },
  {
    id: 'art',
    url: 'https://placeholder.pics/svg/400x200/F04747-FFFFFF/Art',
    name: 'Art',
    description: 'For creative and art communities'
  },
  {
    id: 'music',
    url: 'https://placeholder.pics/svg/400x200/9B59B6-FFFFFF/Music',
    name: 'Music',
    description: 'For music lovers and creators'
  },
  {
    id: 'anime',
    url: 'https://placeholder.pics/svg/400x200/E91E63-FFFFFF/Anime',
    name: 'Anime',
    description: 'For anime and manga fans'
  },
  {
    id: 'sports',
    url: 'https://placeholder.pics/svg/400x200/FF9800-FFFFFF/Sports',
    name: 'Sports',
    description: 'For sports enthusiasts'
  },
  {
    id: 'study',
    url: 'https://placeholder.pics/svg/400x200/607D8B-FFFFFF/Study',
    name: 'Study',
    description: 'For study groups and education'
  }
]

interface ImageSelectorProps {
  selectedImage: string
  onImageSelect: (imageUrl: string) => void
}

export default function ImageSelector({ selectedImage, onImageSelect }: ImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedImageData = PRESET_IMAGES.find(img => img.url === selectedImage) || PRESET_IMAGES[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
        Tag Image
      </label>
      
      {/* Selected Image Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-[var(--border)] rounded-lg p-3 bg-[var(--secondary)] hover:border-[var(--accent)] transition-colors focus:border-[var(--accent)] focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-16 h-12 rounded-md overflow-hidden bg-[var(--background)]">
            <Image
              src={selectedImageData.url}
              alt={selectedImageData.name}
              width={64}
              height={48}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-[var(--foreground)]">{selectedImageData.name}</p>
            <p className="text-sm text-[var(--text-secondary)]">{selectedImageData.description}</p>
          </div>
          <svg
            className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--secondary)] border border-[var(--border)] rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {PRESET_IMAGES.map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => {
                  onImageSelect(image.url)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--hover)] transition-colors ${
                  selectedImage === image.url ? 'bg-[var(--hover)] ring-2 ring-[var(--accent)]' : ''
                }`}
              >
                <div className="w-16 h-12 rounded-md overflow-hidden bg-[var(--background)] flex-shrink-0">
                  <Image
                    src={image.url}
                    alt={image.name}
                    width={64}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[var(--foreground)]">{image.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{image.description}</p>
                </div>
                {selectedImage === image.url && (
                  <svg
                    className="w-5 h-5 text-[var(--accent)]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 