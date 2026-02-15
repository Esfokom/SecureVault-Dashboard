import type { TreeItemWithMeta } from '../types'

/**
 * Get the chain of parent IDs from root down to (but not including) the given item.
 */
export function getParentChain(
  itemId: string,
  itemsMap: Map<string, TreeItemWithMeta>
): string[] {
  const chain: string[] = []
  let current = itemsMap.get(itemId)

  while (current && current.parentId) {
    chain.unshift(current.parentId)
    current = itemsMap.get(current.parentId)
  }

  return chain
}

/**
 * Filter tree items by a search query (case-insensitive name match).
 * Returns:
 *   - matchingIds: items whose names contain the query
 *   - visibleIds: matchingIds + all their ancestors (so the path is visible)
 */
export function filterTreeByQuery(
  itemsMap: Map<string, TreeItemWithMeta>,
  query: string
): { matchingIds: Set<string>; visibleIds: Set<string> } {
  const matchingIds = new Set<string>()
  const visibleIds = new Set<string>()

  if (!query.trim()) {
    return { matchingIds, visibleIds }
  }

  const lowerQuery = query.toLowerCase()

  for (const [id, item] of itemsMap) {
    if (item.name.toLowerCase().includes(lowerQuery)) {
      matchingIds.add(id)
      visibleIds.add(id)

      // Add all ancestors to visibleIds
      const parents = getParentChain(id, itemsMap)
      for (const parentId of parents) {
        visibleIds.add(parentId)
      }
    }
  }

  return { matchingIds, visibleIds }
}
