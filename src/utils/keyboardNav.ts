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
      for (const childId of item.childrenIds) {
        walk(childId)
      }
    }
  }

  for (const id of rootItems) {
    walk(id)
  }

  return visible
}
