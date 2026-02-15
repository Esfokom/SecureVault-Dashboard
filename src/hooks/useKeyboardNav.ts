import { useState, useEffect, useCallback } from 'react'
import type { TreeItemWithMeta } from '../types'

interface UseKeyboardNavOptions {
  visibleItems: string[]
  itemsMap: Map<string, TreeItemWithMeta>
  expandedFolders: Set<string>
  onToggleFolder: (id: string) => void
  onSelectItem: (id: string) => void
}

export function useKeyboardNav({
  visibleItems,
  itemsMap,
  expandedFolders,
  onToggleFolder,
  onSelectItem,
}: UseKeyboardNavOptions) {
  const [focusIndex, setFocusIndex] = useState(0)

  // Clamp focus index when visible items change (e.g. folder collapsed)
  useEffect(() => {
    if (visibleItems.length === 0) {
      setFocusIndex(0)
    } else {
      setFocusIndex(prev => Math.min(prev, visibleItems.length - 1))
    }
  }, [visibleItems.length])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (visibleItems.length === 0) return

      const focusedId = visibleItems[focusIndex]
      const item = focusedId ? itemsMap.get(focusedId) : null

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusIndex(prev =>
            prev >= visibleItems.length - 1 ? 0 : prev + 1
          )
          break

        case 'ArrowUp':
          e.preventDefault()
          setFocusIndex(prev =>
            prev <= 0 ? visibleItems.length - 1 : prev - 1
          )
          break

        case 'ArrowRight':
          e.preventDefault()
          if (item && item.type === 'folder' && !expandedFolders.has(focusedId)) {
            onToggleFolder(focusedId)
          }
          break

        case 'ArrowLeft':
          e.preventDefault()
          if (item && item.type === 'folder' && expandedFolders.has(focusedId)) {
            onToggleFolder(focusedId)
          }
          break

        case 'Enter':
          e.preventDefault()
          if (focusedId) {
            onSelectItem(focusedId)
          }
          break
      }
    },
    [visibleItems, focusIndex, itemsMap, expandedFolders, onToggleFolder, onSelectItem]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const focusedItemId = visibleItems.length > 0 ? visibleItems[focusIndex] ?? null : null

  return { focusedItemId }
}
