import { useEffect, useState } from 'react'
import type { TreeItem } from './types'
import FileExplorer from './components/FileExplorer/FileExplorer'

function App() {
  const [data, setData] = useState<TreeItem[] | null>(null)

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return (
    <div className="h-screen flex flex-col items-center justify-center bg-vault-bg-primary gap-6">
      {/* Pulsing logo */}
      <div className="relative">
        <img
          src="/sv-logo.png"
          alt="SecureVault"
          className="w-16 h-16 animate-pulse"
        />
        {/* Spinner ring */}
        <div
          className="absolute -inset-3 rounded-full border-2 border-vault-bg-hover border-t-vault-accent"
          style={{ animation: 'spin 1s linear infinite' }}
        />
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-vault-text-primary mb-1">SecureVault</h2>
        <p className="text-sm text-vault-text-secondary">Loading your vault…</p>
      </div>
 
      {/* Skeleton shimmer bars */}
      <div className="w-64 space-y-2.5 mt-2">
        <div className="h-2.5 rounded-full bg-vault-bg-hover overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-vault-accent/10 to-transparent" style={{ animation: 'shimmer 1.5s infinite' }} />
        </div>
        <div className="h-2.5 rounded-full bg-vault-bg-hover overflow-hidden w-4/5">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-vault-accent/10 to-transparent" style={{ animation: 'shimmer 1.5s infinite 0.2s' }} />
        </div>
        <div className="h-2.5 rounded-full bg-vault-bg-hover overflow-hidden w-3/5">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-vault-accent/10 to-transparent" style={{ animation: 'shimmer 1.5s infinite 0.4s' }} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col">
      <main className="flex-1 overflow-hidden">
        <FileExplorer data={data} />
      </main>
    </div>
  )
}

export default App
