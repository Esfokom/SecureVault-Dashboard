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
  const [rawFocusIndex, setFocusIndex] = useState(0)

  // Derive clamped index — no effect needed
  const focusIndex = visibleItems.length === 0
    ? 0
    : Math.min(rawFocusIndex, visibleItems.length - 1)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (visibleItems.length === 0) return

      const focusedId = visibleItems[focusIndex]
      const item = focusedId ? itemsMap.get(focusedId) : null

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusIndex(
            focusIndex >= visibleItems.length - 1 ? 0 : focusIndex + 1
          )
          break

        case 'ArrowUp':
          e.preventDefault()
          setFocusIndex(
            focusIndex <= 0 ? visibleItems.length - 1 : focusIndex - 1
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

  const setFocusToItem = useCallback((id: string) => {
    const idx = visibleItems.indexOf(id)
    if (idx !== -1) {
      setFocusIndex(idx)
    }
  }, [visibleItems])

  return { focusedItemId, setFocusToItem } 
}
