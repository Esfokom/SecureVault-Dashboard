import { useEffect, useState } from 'react'
import type { TreeItem } from './types'

function App() {
  const [data, setData] = useState<TreeItem[] | null>(null)

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 bg-vault-bg-secondary border-b border-vault-bg-hover px-6 flex items-center">
        <h1 className="text-xl font-bold">🔒 SecureVault</h1>
      </header>
      <main className="flex-1">
        {/* FileExplorer will go here */}
      </main>
    </div>
  )
}

export default App
