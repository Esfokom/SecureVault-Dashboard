import { useState, useMemo, useCallback } from 'react'
import type { TreeItem, FlatTreeData } from '../types'
import { transformTreeData } from '../utils/dataTransform'

export function useFileTree(data: TreeItem[]) {
  const flatData: FlatTreeData = useMemo(() => transformTreeData(data), [data])

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const toggleFolder = useCallback((id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectItem = useCallback((id: string) => {
    setSelectedItemId(id)
  }, [])

  return {
    itemsMap: flatData.itemsMap,
    rootItems: flatData.rootItems,
    expandedFolders,
    selectedItemId,
    toggleFolder,
    selectItem,
  }
}
