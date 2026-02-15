import type { TreeItem, TreeItemWithMeta, FlatTreeData } from '../types'

const ICON_EXTENSIONS = new Set(['pdf', 'xlsx', 'svg', 'txt', 'docx', 'ttf', 'yaml', 'png'])

/**
 * Recursively flatten nested tree data into a Map for O(1) lookups.
 */
export function transformTreeData(items: TreeItem[]): FlatTreeData {
  const itemsMap = new Map<string, TreeItemWithMeta>()
  const rootItems: string[] = []

  function walk(item: TreeItem, parentId: string | null, depth: number) {
    const childrenIds: string[] = item.children?.map(c => c.id) ?? []
    const hasChildren = item.type === 'folder' && childrenIds.length > 0

    const meta: TreeItemWithMeta = {
      ...item,
      parentId,
      depth,
      hasChildren,
      childrenIds,
    }

    itemsMap.set(item.id, meta)

    if (item.children) {
      for (const child of item.children) {
        walk(child, item.id, depth + 1)
      }
    }
  }

  for (const item of items) {
    rootItems.push(item.id)
    walk(item, null, 0)
  }

  return { itemsMap, rootItems }
}

/**
 * Extract file extension (lowercase, without dot).
 */
export function getFileExtension(name: string): string {
  const lastDot = name.lastIndexOf('.')
  if (lastDot === -1 || lastDot === 0) return ''
  return name.slice(lastDot + 1).toLowerCase()
}

/**
 * Get the icon path for a tree item based on its type and extension.
 */
export function getIconPath(item: TreeItem): string {
  if (item.type === 'folder') {
    return '/icons/folder.png'
  }

  const ext = getFileExtension(item.name)
  if (ICON_EXTENSIONS.has(ext)) {
    return `/icons/${ext}.png`
  }

  return '/icons/file.png'
}
