import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import type { TreeItem, FlatTreeData } from '../types'
import { transformTreeData } from '../utils/dataTransform'
import { filterTreeByQuery } from '../utils/treeUtils'

export function useFileTree(data: TreeItem[]) {
  const flatData: FlatTreeData = useMemo(() => transformTreeData(data), [data])

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Save pre-search expanded state so we can restore on clear
  const preSearchExpanded = useRef<Set<string> | null>(null)

  const { matchingIds, visibleIds } = useMemo(
    () => filterTreeByQuery(flatData.itemsMap, searchQuery),
    [flatData.itemsMap, searchQuery]
  )

  const isSearchActive = searchQuery.trim().length > 0

  // Auto-expand parent folders when search is active
  useEffect(() => {
    if (isSearchActive) {
      // Save current expanded state before first search modification
      if (preSearchExpanded.current === null) {
        preSearchExpanded.current = new Set(expandedFolders)
      }

      // Expand all folders that are in visibleIds (ancestors of matches)
      setExpandedFolders(prev => {
        const next = new Set(prev)
        for (const id of visibleIds) {
          const item = flatData.itemsMap.get(id)
          if (item && item.type === 'folder') {
            next.add(id)
          }
        }
        return next
      })
    } else {
      // Restore pre-search expanded state on clear
      if (preSearchExpanded.current !== null) {
        setExpandedFolders(preSearchExpanded.current)
        preSearchExpanded.current = null
      }
    }
  }, [isSearchActive, visibleIds, flatData.itemsMap])

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
    searchQuery,
    setSearchQuery,
    isSearchActive,
    matchingIds,
    visibleIds,
  }
}
