import type { TreeItemWithMeta } from '../../types'
import TreeNode from '../TreeNode/TreeNode'

interface TreeViewProps {
  rootItems: string[]
  itemsMap: Map<string, TreeItemWithMeta>
  expandedFolders: Set<string>
  selectedItemId: string | null
  focusedItemId: string | null
  onToggleFolder: (id: string) => void
  onSelectItem: (id: string) => void
}

export default function TreeView({
  rootItems,
  itemsMap,
  expandedFolders,
  selectedItemId,
  focusedItemId,
  onToggleFolder,
  onSelectItem,
}: TreeViewProps) {
  return (
    <div className="py-2">
      {rootItems.map(id => {
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
            onToggleFolder={onToggleFolder}
            onSelectItem={onSelectItem}
          />
        )
      })}
    </div>
  )
}
