import type { TreeItemWithMeta } from '../../types'
import { getIconPath } from '../../utils/dataTransform'

interface PropertiesPanelProps {
  selectedItem: TreeItemWithMeta | null
  isPinned: boolean
  onTogglePin: (id: string) => void
}
 
export default function PropertiesPanel({ selectedItem, isPinned, onTogglePin }: PropertiesPanelProps) {
  if (!selectedItem) {
    return (
      <div className="flex items-center justify-center h-full text-vault-text-secondary text-sm">
        Select a file to view details
      </div>
    )
  }

  const iconPath = getIconPath(selectedItem)

  return (
    <div className="p-6 bg-vault-bg-secondary h-full">
      <h2 className="text-lg font-semibold mb-6 text-vault-accent">Properties</h2>

      <div className="p-6 bg-vault-bg-primary border border-vault-bg-hover rounded-lg">
        {/* Large icon */}
        <div className="flex justify-center mb-5">
          <img
            src={iconPath}
            alt={selectedItem.type}
            className="w-16 h-16"
          />
        </div>

        {/* File name */}
        <h3 className="text-lg font-medium text-center mb-6 break-all">
          {selectedItem.name}
        </h3>

        {/* Details */}
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-vault-bg-hover">
            <span className="text-vault-text-secondary">Type</span>
            <span className="capitalize">{selectedItem.type}</span>
          </div>

          {selectedItem.size && (
            <div className="flex justify-between items-center py-2 border-b border-vault-bg-hover">
              <span className="text-vault-text-secondary">Size</span>
              <span>{selectedItem.size}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pin / Unpin button */}
      <button
        onClick={() => onTogglePin(selectedItem.id)}
        className={`
          w-full mt-4 py-2.5 px-4 rounded-lg text-sm font-medium
          flex items-center justify-center gap-2
          transition-all duration-150 border
          ${isPinned
            ? 'bg-vault-accent/10 border-vault-accent text-vault-accent hover:bg-vault-accent/20'
            : 'bg-vault-bg-hover border-vault-bg-hover text-vault-text-primary hover:border-vault-accent hover:text-vault-accent'
          }
        `}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 17V22" />
          <path d="M5 17H19L17 11V7H7V11L5 17Z" />
          <path d="M15 7V4H9V7" />
        </svg>
        {isPinned ? 'Unpin from Quick Access' : 'Pin to Quick Access'}
      </button>
    </div>
  )
}
