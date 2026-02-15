import type { TreeItemWithMeta } from '../../types'
import TreeNode from '../TreeNode/TreeNode'

interface TreeViewProps {
  rootItems: string[]
  itemsMap: Map<string, TreeItemWithMeta>
  expandedFolders: Set<string>
  selectedItemId: string | null
  focusedItemId: string | null
  searchQuery: string
  matchingIds: Set<string>
  visibleIds: Set<string>
  onToggleFolder: (id: string) => void
  onSelectItem: (id: string) => void
}

export default function TreeView({
  rootItems,
  itemsMap,
  expandedFolders,
  selectedItemId,
  focusedItemId,
  searchQuery,
  matchingIds,
  visibleIds,
  onToggleFolder,
  onSelectItem,
}: TreeViewProps) {
  const isSearchActive = searchQuery.trim().length > 0

  // During search, only show root items that are in visibleIds
  const displayedRootItems = isSearchActive
    ? rootItems.filter(id => visibleIds.has(id))
    : rootItems

  return (
    <div className="py-2">
      {displayedRootItems.map(id => {
        const item = itemsMap.get(id)
        if (!item) return null
        return (
          <TreeNode
            key={id}
            item={item}
            itemsMap={itemsMap}
            expandedFolders={expandedFolders}
            selectedItemId={selectedItemId}
            focusedItemId={focusedItemId}
            searchQuery={searchQuery}
            matchingIds={matchingIds}
            visibleIds={visibleIds}
            onToggleFolder={onToggleFolder}
            onSelectItem={onSelectItem}
          />
        )
      })}
    </div>
  )
}
