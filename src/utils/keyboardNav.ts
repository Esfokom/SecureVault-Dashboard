import type { TreeItemWithMeta } from '../types'

/**
 * Compute the ordered list of visible item IDs by traversing the tree
 * and only descending into expanded folders.
 */
export function computeVisibleItems(
  rootItems: string[],
  itemsMap: Map<string, TreeItemWithMeta>,
  expandedFolders: Set<string>
): string[] {
  const visible: string[] = []

  function walk(id: string) {
    const item = itemsMap.get(id)
    if (!item) return

    visible.push(id)

    if (item.type === 'folder' && expandedFolders.has(id)) {
      // Get children in their original order
      const children = Array.from(itemsMap.values()).filter(i => i.parentId === id)
      for (const child of children) {
        walk(child.id)
      }
    }
  }

  for (const id of rootItems) {
    walk(id)
  }

  return visible
}
