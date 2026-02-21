'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RefreshButton() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    router.refresh()

    // Reset button state after a short delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      style={{
        background: 'transparent',
        border: '1px solid var(--accent)',
        color: 'var(--accent)',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: isRefreshing ? 'not-allowed' : 'pointer',
        fontSize: '0.875rem',
        fontWeight: '600',
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s',
        opacity: isRefreshing ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isRefreshing) {
          e.target.style.background = 'var(--accent-dim)'
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'transparent'
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
        }}
      >
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
      </svg>
      {isRefreshing ? 'Refreshing' : 'Refresh'}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  )
}
