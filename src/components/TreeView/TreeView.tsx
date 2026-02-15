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
  pinnedItems: Set<string>
  onToggleFolder: (id: string) => void
  onSelectItem: (id: string) => void
  onTogglePin: (id: string) => void
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
  pinnedItems,
  onToggleFolder,
  onSelectItem,
  onTogglePin,
}: TreeViewProps) {
  const isSearchActive = searchQuery.trim().length > 0

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
            pinnedItems={pinnedItems}
            onToggleFolder={onToggleFolder}
            onSelectItem={onSelectItem}
            onTogglePin={onTogglePin}
          />
        )
      })}
    </div>
  )
}
