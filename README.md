<h1><img src="public/sv-logo.png" alt="SecureVault Logo" width="36" style="vertical-align: middle;" /> SecureVault Dashboard</h1>

A high-performance file explorer interface built for law firms and financial institutions managing complex, deeply-nested file hierarchies. Built with React 19, TypeScript, Tailwind CSS v4, and Vite.

**🌐 Live Demo:** [secure-vault-dashboard.vercel.app](https://secure-vault-dashboard.vercel.app/)

**🎨 Design File:** [Figma — SecureVault](https://www.figma.com/design/ceR78WiNCyKB5J1OaYvOIx/SecureVault?node-id=0-1&t=qYstR6weXKH91eMJ-1)

### Screenshots

![Closed folders view](screenshots/closed.png)

![Expanded tree view](screenshots/open.png)

![Search and filter](screenshots/search.png)

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and pnpm

### Installation

```bash
git clone https://github.com/Esfokom/SecureVault-Dashboard.git
cd SecureVault-Dashboard
pnpm install
pnpm run dev
```

The application opens at `http://localhost:5173`

### Build for Production

```bash
pnpm run build
pnpm run preview
```

---

## 🌳 Recursive Strategy

### The Problem

The JSON data arrives as a deeply nested tree. Rendering it directly would require recursive traversal for every lookup (finding an item, checking parents, computing depth), making operations O(n) per item.

### Data Transformation: Nest → Flat Map

On load, `transformTreeData()` walks the nested JSON once and produces a flat `Map<string, TreeItemWithMeta>`. Each entry is enriched with precomputed metadata: `parentId`, `depth`, `hasChildren`, and `childrenIds`.

This gives O(1) lookups for any item by ID, and eliminates repeated tree traversals during rendering, search, and keyboard navigation.

### Recursive Rendering

The `TreeNode` component renders itself for each child — depth is tracked implicitly through the recursion. When a folder is expanded, it maps over its precomputed `childrenIds`, retrieves each child from the flat map, and renders a `TreeNode` for each. `React.memo` wraps the component so only the toggled subtree re-renders.

### State Design

All tree state is managed in a single `useFileTree` custom hook using `Set<string>` for `expandedFolders` and `pinnedItems` (O(1) membership checks), and the flat `Map` for item lookups. No external state libraries are used.

---

## ⭐ Wildcard Feature: Quick Access Pinning

### Problem

Law firms work with 5–10 active cases out of years of archived files. Navigating 4–5 folder levels to reach the same discovery document dozens of times per day wastes time and breaks focus.

### Solution

A persistent "Quick Access" section at the top of the sidebar. Users pin files or folders via:

- **Hover pin icon** in the tree (appears on mouseover)
- **"Pin to Quick Access" button** in the Properties Panel

Clicking a pinned item in Quick Access auto-expands its parent folders in the main tree, scrolling the user directly to the file's location.

### Why It Matters

- **4–5 clicks → 1 click** for frequently accessed items
- **Zero learning curve** — familiar "favorites" pattern from native file systems
- **Session persistence** — pins survive page refreshes via localStorage
- **Keyboard accessible** — pinned items are included in the arrow-key navigation flow

---

## 📁 Project Structure

```
src/
├── components/
│   ├── FileExplorer/       # Main layout container
│   ├── TreeView/           # Maps root items to TreeNode
│   ├── TreeNode/           # Recursive component (core algorithm)
│   ├── PropertiesPanel/    # Selected item metadata + pin button
│   ├── QuickAccess/        # Pinned items shortcut list
│   └── SearchBar/          # Search input with clear button
├── hooks/
│   ├── useFileTree.ts      # All tree state: expand, select, search, pin
│   └── useKeyboardNav.ts   # Arrow key + Enter handling
├── utils/
│   ├── dataTransform.ts    # Flatten nested tree → Map
│   ├── treeUtils.ts        # getParentChain, filterTreeByQuery
│   └── keyboardNav.ts      # computeVisibleItems
├── types/
│   └── index.ts            # TypeScript interfaces
└── App.tsx                 # Entry point
```

---

## 📄 License

MIT License
