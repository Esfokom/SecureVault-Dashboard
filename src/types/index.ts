export interface TreeItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
  children?: TreeItem[]
}
