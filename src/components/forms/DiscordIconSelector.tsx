'use client'

import { useState } from 'react'

interface DiscordIconSelectorProps {
  selectedIconId: number
  onIconSelect: (iconId: number) => void
}

// Available Discord guild icon IDs (excluding 1)
const DISCORD_ICON_IDS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]

export default function DiscordIconSelector({ selectedIconId, onIconSelect }: DiscordIconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
        Discord Icon *
      </label>
      
      {/* Selected Icon Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full p-3 bg-[var(--secondary)] border-2 border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all duration-200"
      >
        <img
          src={`https://discordresources.com/img/guilds/${selectedIconId}.svg`}
          alt={`Discord Icon ${selectedIconId}`}
          className="w-8 h-8 flex-shrink-0"
        />
        <span className="text-[var(--foreground)] flex-1 text-left">
          Select an icon
        </span>
        <svg 
          className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Icon Grid */}
      {isOpen && (
        <div className="mt-3 p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl">
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
            {DISCORD_ICON_IDS.map((iconId) => (
              <button
                key={iconId}
                type="button"
                onClick={() => {
                  onIconSelect(iconId)
                  setIsOpen(false)
                }}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  selectedIconId === iconId
                    ? 'bg-[var(--accent)] ring-2 ring-[var(--accent)] ring-opacity-50'
                    : 'bg-[#47474c] hover:bg-[#5a5a5f]'
                }`}
                title={`Discord Icon ${iconId}`}
              >
                <img
                  src={`https://discordresources.com/img/guilds/${iconId}.svg`}
                  alt={`Discord Icon ${iconId}`}
                  className="w-8 h-8"
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-3 text-center">
            Choose an icon that represents your Discord server
          </p>
        </div>
      )}
    </div>
  )
} 