import { useMemo } from 'react'
import type { TreeItem } from '../../types'
import { useFileTree } from '../../hooks/useFileTree'
import { useKeyboardNav } from '../../hooks/useKeyboardNav'
import { computeVisibleItems } from '../../utils/keyboardNav'
import SearchBar from '../SearchBar/SearchBar'
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
    searchQuery,
    setSearchQuery,
    isSearchActive,
    matchingIds,
    visibleIds,
  } = useFileTree(data)

  const visibleItemsList = useMemo(
    () => computeVisibleItems(rootItems, itemsMap, expandedFolders),
    [rootItems, itemsMap, expandedFolders]
  )

  // During search, filter keyboard nav visible items to only those in visibleIds
  const navItems = useMemo(
    () => isSearchActive
      ? visibleItemsList.filter(id => visibleIds.has(id))
      : visibleItemsList,
    [isSearchActive, visibleItemsList, visibleIds]
  )

  const { focusedItemId } = useKeyboardNav({
    visibleItems: navItems,
    itemsMap,
    expandedFolders,
    onToggleFolder: toggleFolder,
    onSelectItem: selectItem,
  })

  const selectedItem = selectedItemId ? itemsMap.get(selectedItemId) ?? null : null

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search Bar - full width */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Content: Tree + Properties */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tree Panel */}
        <div className="w-3/5 border-r border-vault-bg-hover overflow-y-auto">
          {isSearchActive && matchingIds.size === 0 ? (
            <div className="flex items-center justify-center h-full text-vault-text-secondary text-sm">
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
              onToggleFolder={toggleFolder}
              onSelectItem={selectItem}
            />
          )}
        </div>

        {/* Properties Panel */}
        <div className="w-2/5 overflow-y-auto">
          <PropertiesPanel selectedItem={selectedItem} />
        </div>
      </div>
    </div>
  )
}
