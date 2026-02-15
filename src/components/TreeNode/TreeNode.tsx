import React from 'react'
import type { TreeItemWithMeta } from '../../types'
import { getIconPath } from '../../utils/dataTransform'

interface TreeNodeProps {
  item: TreeItemWithMeta
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

/**
 * Highlight matching substring in the item name.
 */
function HighlightedName({ name, query }: { name: string; query: string }) {
  if (!query) return <>{name}</>

  const lowerName = name.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const idx = lowerName.indexOf(lowerQuery)

  if (idx === -1) return <>{name}</>

  const before = name.slice(0, idx)
  const match = name.slice(idx, idx + query.length)
  const after = name.slice(idx + query.length)

  return (
    <>
      {before}
      <span className="text-vault-accent font-medium">{match}</span>
      {after}
    </>
  )
}

/** Inline SVG pin icon */
function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 17V22" />
      <path d="M5 17H19L17 11V7H7V11L5 17Z" />
      <path d="M15 7V4H9V7" />
    </svg>
  )
}
 
const TreeNode: React.FC<TreeNodeProps> = React.memo(({
  item,
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
}) => {
  const isFolder = item.type === 'folder'
  const isExpanded = expandedFolders.has(item.id)
  const isSelected = selectedItemId === item.id
  const isFocused = focusedItemId === item.id
  const isPinned = pinnedItems.has(item.id)
  const iconPath = getIconPath(item)
  const isSearchActive = searchQuery.trim().length > 0
  const isMatch = matchingIds.has(item.id)

  // Get children: during search, only show children in visibleIds
  const children = isFolder && isExpanded
    ? Array.from(itemsMap.values()).filter(i => {
        if (i.parentId !== item.id) return false
        if (isSearchActive && !visibleIds.has(i.id)) return false
        return true
      })
    : []

  const handleClick = () => {
    onSelectItem(item.id)
    if (isFolder) {
      onToggleFolder(item.id)
    }
  }

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onTogglePin(item.id)
  }

  return (
    <div>
      <div
        className={`
          group flex items-center gap-2 py-1 px-2 cursor-pointer
          transition-all duration-150 rounded-md mx-1 relative
          ${isSelected ? 'bg-vault-accent/20 border-l-2 border-vault-accent' : 'hover:bg-vault-bg-hover border-l-2 border-transparent'}
          ${isFocused ? 'outline outline-2 outline-vault-accent outline-offset-0' : ''}
          ${isSearchActive && !isMatch ? 'opacity-50' : ''}
        `}
        style={{ paddingLeft: `${item.depth * 24 + 8}px` }}
        onClick={handleClick}
      >
        {/* Chevron */}
        <img
          src="/right-arrow.png"
          alt=""
          className={`
            w-4 h-4 shrink-0 transition-transform duration-150
            ${isFolder ? 'visible' : 'invisible'}
            ${isExpanded ? 'rotate-90' : 'rotate-0'}
          `}
        />

        {/* Icon */}
        <img
          src={iconPath}
          alt=""
          className="w-4 h-4 shrink-0"
        />


        {/* Name */}
        <span className="truncate text-sm select-none">
          <HighlightedName name={item.name} query={searchQuery} />
        </span>

        {/* Size (files only) */}
        {item.size && (
          <span className="ml-auto text-xs text-vault-text-secondary shrink-0 mr-5">
            {item.size}
          </span>
        )}

        {/* Pin button (on hover) */}
        <button
          onClick={handlePinClick}
          className={`
            absolute right-2 top-1/2 -translate-y-1/2
            transition-all duration-150 shrink-0
            ${isPinned
              ? 'opacity-60 hover:opacity-100'
              : 'opacity-0 group-hover:opacity-60 hover:!opacity-100'
            }
          `}
          title={isPinned ? 'Unpin' : 'Pin to Quick Access'}
        >
          <img src="/office-push-pin.png" alt="" className="w-4 h-4" />
        </button>
      </div>

      {/* Recursive children */}
      {isFolder && isExpanded && children.length > 0 && (
        <div>
          {children.map(child => (
            <TreeNode
              key={child.id}
              item={child}
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
          ))}
        </div>
      )}
    </div>
  )
})

TreeNode.displayName = 'TreeNode'

export default TreeNode
