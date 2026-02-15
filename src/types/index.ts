export interface TreeItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: string
  modified?: string
  children?: TreeItem[]
}

export interface TreeItemWithMeta extends TreeItem {
  parentId: string | null
  depth: number
  hasChildren: boolean
}

export interface FlatTreeData {
  itemsMap: Map<string, TreeItemWithMeta>
  rootItems: string[]
}
