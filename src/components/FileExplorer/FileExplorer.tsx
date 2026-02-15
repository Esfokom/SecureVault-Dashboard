import { useMemo } from 'react'
import type { TreeItem } from '../../types'
import { useFileTree } from '../../hooks/useFileTree'
import { useKeyboardNav } from '../../hooks/useKeyboardNav'
import { computeVisibleItems } from '../../utils/keyboardNav'
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
    pinnedItems,
    togglePin,
  } = useFileTree(data)

  const visibleItemsList = useMemo(
    () => computeVisibleItems(rootItems, itemsMap, expandedFolders),
    [rootItems, itemsMap, expandedFolders]
  )

  // Pinned item IDs (filtered to valid items)
  const pinnedItemIds = useMemo(
    () => Array.from(pinnedItems).filter(id => itemsMap.has(id)),
    [pinnedItems, itemsMap]
  )

  // Keyboard nav: pinned items first, then tree items (deduplicated)
  const navItems = useMemo(() => {
    const treeItems = isSearchActive
      ? visibleItemsList.filter(id => visibleIds.has(id))
      : visibleItemsList

    // Prepend pinned items, then add tree items excluding already-pinned
    const pinnedSet = new Set(pinnedItemIds)
    const deduped = treeItems.filter(id => !pinnedSet.has(id))
    return [...pinnedItemIds, ...deduped]
  }, [isSearchActive, visibleItemsList, visibleIds, pinnedItemIds])

  const { focusedItemId } = useKeyboardNav({
    visibleItems: navItems,
    itemsMap,
    expandedFolders,
    onToggleFolder: toggleFolder,
    onSelectItem: selectItem,
  })

  const selectedItem = selectedItemId ? itemsMap.get(selectedItemId) ?? null : null
  const isSelectedPinned = selectedItemId ? pinnedItems.has(selectedItemId) : false

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search Bar - full width */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

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
            onSelectItem={selectAndRevealItem}
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
              onSelectItem={selectItem}
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
