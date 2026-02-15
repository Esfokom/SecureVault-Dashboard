import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import type { TreeItem, FlatTreeData } from '../types'
import { transformTreeData } from '../utils/dataTransform'
import { filterTreeByQuery, getParentChain } from '../utils/treeUtils'

const PINNED_STORAGE_KEY = 'securevault-pinned-items'

function loadPinnedItems(): Set<string> {
  try {
    const saved = localStorage.getItem(PINNED_STORAGE_KEY)
    if (saved) {
      const arr = JSON.parse(saved)
      if (Array.isArray(arr)) return new Set(arr)
    }
  } catch {
    // graceful degradation
  }
  return new Set()
}

function savePinnedItems(items: Set<string>) {
  try {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(Array.from(items)))
  } catch {
    // localStorage full or disabled
  }
}

export function useFileTree(data: TreeItem[]) {
  const flatData: FlatTreeData = useMemo(() => transformTreeData(data), [data])

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(() => {
    // Load from localStorage, filter out IDs not in data
    const saved = loadPinnedItems()
    return saved
  })

  // Filter out stale pinned IDs when data loads
  useEffect(() => {
    setPinnedItems(prev => {
      const filtered = new Set<string>()
      for (const id of prev) {
        if (flatData.itemsMap.has(id)) {
          filtered.add(id)
        }
      }
      if (filtered.size !== prev.size) {
        savePinnedItems(filtered)
        return filtered
      }
      return prev
    })
  }, [flatData.itemsMap])

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
      if (preSearchExpanded.current === null) {
        preSearchExpanded.current = new Set(expandedFolders)
      }
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

  // Select an item AND expand all its parent folders to reveal it in the tree
  const selectAndRevealItem = useCallback((id: string) => {
    const parents = getParentChain(id, flatData.itemsMap)
    if (parents.length > 0) {
      setExpandedFolders(prev => {
        const next = new Set(prev)
        for (const parentId of parents) {
          next.add(parentId)
        }
        return next
      })
    }
    setSelectedItemId(id)
  }, [flatData.itemsMap])

  const togglePin = useCallback((id: string) => {
    setPinnedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      savePinnedItems(next)
      return next
    })
  }, [])

  return {
    itemsMap: flatData.itemsMap,
    rootItems: flatData.rootItems,
    expandedFolders,
    selectedItemId,
    toggleFolder,
    selectItem,
    selectAndRevealItem,
    searchQuery,
    setSearchQuery,
    isSearchActive,
    matchingIds,
    visibleIds,
    pinnedItems,
    togglePin,
  }
}
