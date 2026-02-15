import { useMemo } from 'react'
import type { TreeItem } from '../../types'
import { useFileTree } from '../../hooks/useFileTree'
import { useKeyboardNav } from '../../hooks/useKeyboardNav'
import { computeVisibleItems } from '../../utils/keyboardNav'
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
  } = useFileTree(data)

  const visibleItems = useMemo(
    () => computeVisibleItems(rootItems, itemsMap, expandedFolders),
    [rootItems, itemsMap, expandedFolders]
  )

  const { focusedItemId } = useKeyboardNav({
    visibleItems,
    itemsMap,
    expandedFolders,
    onToggleFolder: toggleFolder,
    onSelectItem: selectItem,
  })

  const selectedItem = selectedItemId ? itemsMap.get(selectedItemId) ?? null : null

  return (
    <div className="flex h-full overflow-hidden">
      {/* Tree Panel */}
      <div className="w-3/5 border-r border-vault-bg-hover overflow-y-auto">
        <TreeView
          rootItems={rootItems}
          itemsMap={itemsMap}
          expandedFolders={expandedFolders}
          selectedItemId={selectedItemId}
          focusedItemId={focusedItemId}
          onToggleFolder={toggleFolder}
          onSelectItem={selectItem}
        />
      </div>

      {/* Properties Panel */}
      <div className="w-2/5 overflow-y-auto">
        <PropertiesPanel selectedItem={selectedItem} />
      </div>
    </div>
  )
}
