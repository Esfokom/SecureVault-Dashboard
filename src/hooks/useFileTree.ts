import { useState, useMemo, useCallback } from 'react'
import type { TreeItem, FlatTreeData } from '../types'
import { transformTreeData } from '../utils/dataTransform'
import { filterTreeByQuery, getParentChain } from '../utils/treeUtils'
import { computeVisibleItems } from '../utils/keyboardNav'

const PINNED_STORAGE_KEY = 'securevault-pinned-items'

function loadPinnedItems(): Set<string> {
  const saved = localStorage.getItem(PINNED_STORAGE_KEY)
  if (saved) {
    const arr = JSON.parse(saved)
    if (Array.isArray(arr)) return new Set(arr)
  }
  return new Set()
}

function savePinnedItems(items: Set<string>) {
  localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(Array.from(items)))
}

export function useFileTree(data: TreeItem[]) {
  const flatData: FlatTreeData = useMemo(() => transformTreeData(data), [data])

  const [manualExpandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [pinnedItemsRaw, setPinnedItems] = useState<Set<string>>(loadPinnedItems)

  // Derive valid pinned items (filter out stale IDs not in current data)
  const pinnedItems = useMemo(() => {
    const filtered = new Set<string>()
    for (const id of pinnedItemsRaw) {
      if (flatData.itemsMap.has(id)) {
        filtered.add(id)
      }
    }
    return filtered
  }, [pinnedItemsRaw, flatData.itemsMap])

  const { matchingIds, visibleIds } = useMemo(
    () => filterTreeByQuery(flatData.itemsMap, searchQuery),
    [flatData.itemsMap, searchQuery]
  )

  const isSearchActive = searchQuery.trim().length > 0

  // Derive effective expanded folders:
  // During search, overlay ancestor folders of matches onto the user's manual state
  const expandedFolders = useMemo(() => {
    if (!isSearchActive) return manualExpandedFolders

    const merged = new Set(manualExpandedFolders)
    for (const id of visibleIds) {
      const item = flatData.itemsMap.get(id)
      if (item && item.type === 'folder') {
        merged.add(id)
      }
    }
    return merged
  }, [isSearchActive, manualExpandedFolders, visibleIds, flatData.itemsMap])

  // Single source of truth: ordered visible item IDs (expansion + search)
  const visibleNavIds = useMemo(() => {
    const allVisible = computeVisibleItems(flatData.rootItems, flatData.itemsMap, expandedFolders)
    if (!isSearchActive) return allVisible
    return allVisible.filter(id => visibleIds.has(id))
  }, [flatData.rootItems, flatData.itemsMap, expandedFolders, isSearchActive, visibleIds])

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
    visibleNavIds,
    pinnedItems,
    togglePin,
  }
}
