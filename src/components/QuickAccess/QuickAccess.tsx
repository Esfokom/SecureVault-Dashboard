import type { TreeItemWithMeta } from '../../types'
import { getIconPath } from '../../utils/dataTransform'

interface QuickAccessProps {
  pinnedItemIds: string[]
  itemsMap: Map<string, TreeItemWithMeta>
  selectedItemId: string | null
  focusedItemId: string | null
  onSelectItem: (id: string) => void
  onTogglePin: (id: string) => void
}

export default function QuickAccess({
  pinnedItemIds,
  itemsMap,
  selectedItemId,
  focusedItemId,
  onSelectItem,
  onTogglePin,
}: QuickAccessProps) {
  if (pinnedItemIds.length === 0) {
    return (
      <div className="px-4 py-3 border-b border-vault-bg-hover">
        <h3 className="text-xs uppercase tracking-wider text-vault-text-secondary mb-2 font-semibold">
          Quick Access
        </h3>
        <p className="text-xs text-vault-text-secondary/50 italic">
          Pin items for quick access
        </p>
      </div>
    )
  }

  return (
    <div className="border-b border-vault-bg-hover">
      <div className="px-4 pt-3 pb-1">
        <h3 className="text-xs uppercase tracking-wider text-vault-text-secondary font-semibold">
          Quick Access
        </h3>
      </div>
      <div className="py-1">
        {pinnedItemIds.map(id => {
          const item = itemsMap.get(id)
          if (!item) return null
          const isSelected = selectedItemId === id
          const isFocused = focusedItemId === id

          return (
            <div
              key={`pinned-${id}`}
              className={`
                group flex items-center gap-2 py-1.5 px-4 cursor-pointer
                transition-all duration-150 mx-1 rounded-md
                ${isSelected ? 'bg-vault-accent/20 border-l-2 border-vault-accent' : 'hover:bg-vault-bg-hover border-l-2 border-transparent'}
                ${isFocused ? 'outline outline-2 outline-vault-accent outline-offset-0' : ''}
              `}
              onClick={() => onSelectItem(id)}
            >
              <img
                src={getIconPath(item)}
                alt=""
                className="w-4 h-4 shrink-0"
              />
              <span className="truncate text-sm select-none">{item.name}</span>

              {/* Unpin button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTogglePin(id)
                }}
                className="ml-auto opacity-0 group-hover:opacity-100
                  text-vault-text-secondary hover:text-red-400
                  transition-all duration-150 shrink-0"
                title="Unpin"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
