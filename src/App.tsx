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

  if (!data) return <div className="h-screen flex items-center justify-center text-vault-text-secondary">Loading...</div>

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 bg-vault-bg-secondary border-b border-vault-bg-hover px-6 flex items-center shrink-0">
        <h1 className="text-xl font-bold flex items-center gap-2"><img src="/sv-logo.png" alt="SecureVault" className="w-7 h-7" /> SecureVault</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <FileExplorer data={data} />
      </main>
    </div>
  )
}

export default App
