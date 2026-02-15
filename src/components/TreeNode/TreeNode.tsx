import React from 'react'
import type { TreeItemWithMeta } from '../../types'
import { getIconPath } from '../../utils/dataTransform'

interface TreeNodeProps {
  item: TreeItemWithMeta
  itemsMap: Map<string, TreeItemWithMeta>
  expandedFolders: Set<string>
  selectedItemId: string | null
  focusedItemId: string | null
  onToggleFolder: (id: string) => void
  onSelectItem: (id: string) => void
}

const TreeNode: React.FC<TreeNodeProps> = React.memo(({
  item,
  itemsMap,
  expandedFolders,
  selectedItemId,
  focusedItemId,
  onToggleFolder,
  onSelectItem,
}) => {
  const isFolder = item.type === 'folder'
  const isExpanded = expandedFolders.has(item.id)
  const isSelected = selectedItemId === item.id
  const isFocused = focusedItemId === item.id
  const iconPath = getIconPath(item)

  const childIds = isFolder && isExpanded
    ? Array.from(itemsMap.values()).filter(i => i.parentId === item.id)
    : []

  const handleClick = () => {
    onSelectItem(item.id)
    if (isFolder) {
      onToggleFolder(item.id)
    }
  }

  return (
    <div>
      <div
        className={`
          flex items-center gap-2 py-1 px-2 cursor-pointer
          transition-all duration-150 rounded-md mx-1
          ${isSelected ? 'bg-vault-accent/20 border-l-2 border-vault-accent' : 'hover:bg-vault-bg-hover border-l-2 border-transparent'}
          ${isFocused ? 'outline outline-2 outline-vault-accent outline-offset-0' : ''}
        `}
        style={{ paddingLeft: `${item.depth * 24 + 8}px` }}
        onClick={handleClick}
      >
        {/* Chevron */}
        <span
          className={`
            inline-flex items-center justify-center w-4 h-4 text-xs
            text-vault-text-secondary transition-transform duration-150
            ${isFolder ? 'visible' : 'invisible'}
            ${isExpanded ? 'rotate-90' : 'rotate-0'}
          `}
        >
          ▶
        </span>

        {/* Icon */}
        <img
          src={iconPath}
          alt=""
          className="w-4 h-4 shrink-0"
        />

        {/* Name */}
        <span className="truncate text-sm select-none">
          {item.name}
        </span>

        {/* Size (files only) */}
        {item.size && (
          <span className="ml-auto text-xs text-vault-text-secondary shrink-0">
            {item.size}
          </span>
        )}
      </div>

      {/* Recursive children */}
      {isFolder && isExpanded && childIds.length > 0 && (
        <div>
          {childIds.map(child => (
            <TreeNode
              key={child.id}
              item={child}
              itemsMap={itemsMap}
              expandedFolders={expandedFolders}
              selectedItemId={selectedItemId}
              focusedItemId={focusedItemId}
              onToggleFolder={onToggleFolder}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      )}
    </div>
  )
})

TreeNode.displayName = 'TreeNode'

export default TreeNode
