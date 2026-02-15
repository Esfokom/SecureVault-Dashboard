import { useMemo, useCallback } from 'react'
import type { TreeItem } from '../../types'
import { useFileTree } from '../../hooks/useFileTree'
import { useKeyboardNav } from '../../hooks/useKeyboardNav'
import SearchBar from '../SearchBar/SearchBar'
import QuickAccess from '../QuickAccess/QuickAccess'
import TreeView from '../TreeView/TreeView'
import PropertiesPanel from '../PropertiesPanel/PropertiesPanel'

interface FileExplorerProps {
  data: TreeItem[]
}

export default function FileExplorer({ data }: FileExplorerProps) {
  const {
    itemsMap,
    rootItems,
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
  } = useFileTree(data)

  // Pinned item IDs (filtered to valid items)
  const pinnedItemIds = useMemo(
    () => Array.from(pinnedItems).filter(id => itemsMap.has(id)),
    [pinnedItems, itemsMap]
  )

  // Keyboard nav: pinned items first, then tree items (deduplicated)
  const navItems = useMemo(() => {
    const pinnedSet = new Set(pinnedItemIds)
    const deduped = visibleNavIds.filter(id => !pinnedSet.has(id))
    return [...pinnedItemIds, ...deduped]
  }, [visibleNavIds, pinnedItemIds])

  const { focusedItemId, setFocusToItem } = useKeyboardNav({
    visibleItems: navItems,
    itemsMap,
    expandedFolders,
    onToggleFolder: toggleFolder,
    onSelectItem: selectItem,
  })

  // Wrap select handlers to also sync keyboard focus
  const handleSelectItem = useCallback((id: string) => {
    selectItem(id)
    setFocusToItem(id)
  }, [selectItem, setFocusToItem])

  const handleSelectAndReveal = useCallback((id: string) => {
    selectAndRevealItem(id)
    setFocusToItem(id)
  }, [selectAndRevealItem, setFocusToItem])

  const selectedItem = selectedItemId ? itemsMap.get(selectedItemId) ?? null : null
  const isSelectedPinned = selectedItemId ? pinnedItems.has(selectedItemId) : false

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header: Title + Search Bar on same row */}
      <div className="h-16 bg-vault-bg-secondary border-b border-vault-bg-hover px-6 flex items-center shrink-0 gap-4">
        <h1 className="text-xl font-bold flex items-center gap-2 shrink-0">
          <img src="/sv-logo.png" alt="SecureVault" className="w-7 h-7" /> SecureVault
        </h1>
        <div className="flex-1 max-w-md ml-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {/* Content: Tree + Properties */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tree Panel */}
        <div className="w-3/5 border-r border-vault-bg-hover overflow-y-auto">
          {/* Quick Access */}
          <QuickAccess
            pinnedItemIds={pinnedItemIds}
            itemsMap={itemsMap}
            selectedItemId={selectedItemId}
            focusedItemId={focusedItemId}
            onSelectItem={handleSelectAndReveal}
            onTogglePin={togglePin}
          />

          {isSearchActive && matchingIds.size === 0 ? (
            <div className="flex items-center justify-center h-32 text-vault-text-secondary text-sm">
              No results found for "{searchQuery}"
            </div>
          ) : (
            <TreeView
              rootItems={rootItems}
              itemsMap={itemsMap}
              expandedFolders={expandedFolders}
              selectedItemId={selectedItemId}
              focusedItemId={focusedItemId}
              searchQuery={searchQuery}
              matchingIds={matchingIds}
              visibleIds={visibleIds}
              pinnedItems={pinnedItems}
              onToggleFolder={toggleFolder}
              onSelectItem={handleSelectItem}
              onTogglePin={togglePin}
            />
          )}
        </div>

        {/* Properties Panel */}
        <div className="w-2/5 overflow-y-auto">
          <PropertiesPanel
            selectedItem={selectedItem}
            isPinned={isSelectedPinned}
            onTogglePin={togglePin}
          />
        </div>
      </div>
    </div>
  )
}
