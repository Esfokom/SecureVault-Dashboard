import type { TreeItem } from '../../types'
import { useFileTree } from '../../hooks/useFileTree'
import TreeView from '../TreeView/TreeView'

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
  } = useFileTree(data)

  const selectedItem = selectedItemId ? itemsMap.get(selectedItemId) : null

  return (
    <div className="flex h-full overflow-hidden">
      {/* Tree Panel */}
      <div className="w-3/5 border-r border-vault-bg-hover overflow-y-auto">
        <TreeView
          rootItems={rootItems}
          itemsMap={itemsMap}
          expandedFolders={expandedFolders}
          selectedItemId={selectedItemId}
          onToggleFolder={toggleFolder}
          onSelectItem={selectItem}
        />
      </div>

      {/* Properties Panel (placeholder) */}
      <div className="w-2/5 p-6 overflow-y-auto">
        {selectedItem ? (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-vault-accent">Properties</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-vault-text-secondary">Name: </span>
                <span>{selectedItem.name}</span>
              </div>
              <div>
                <span className="text-vault-text-secondary">Type: </span>
                <span className="capitalize">{selectedItem.type}</span>
              </div>
              {selectedItem.size && (
                <div>
                  <span className="text-vault-text-secondary">Size: </span>
                  <span>{selectedItem.size}</span>
                </div>
              )}
              <div>
                <span className="text-vault-text-secondary">ID: </span>
                <span className="text-vault-text-secondary/70 font-mono text-xs">{selectedItem.id}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-vault-text-secondary text-sm">
            Select an item to view properties
          </div>
        )}
      </div>
    </div>
  )
}
