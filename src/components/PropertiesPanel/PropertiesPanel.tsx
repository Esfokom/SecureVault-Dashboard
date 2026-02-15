import type { TreeItemWithMeta } from '../../types'
import { getIconPath } from '../../utils/dataTransform'

interface PropertiesPanelProps {
  selectedItem: TreeItemWithMeta | null
}

export default function PropertiesPanel({ selectedItem }: PropertiesPanelProps) {
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

          <div className="flex justify-between items-center py-2 border-b border-vault-bg-hover">
            <span className="text-vault-text-secondary">Path depth</span>
            <span>{selectedItem.depth}</span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-vault-text-secondary">ID</span>
            <span className="text-vault-text-secondary/70 font-mono text-xs">{selectedItem.id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
