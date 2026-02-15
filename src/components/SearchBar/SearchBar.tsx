interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="p-4 border-b border-vault-bg-hover">
      <div className="relative">
        {/* Search icon */}
        <img src="/icons/search.png" alt="" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none opacity-100" />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search files and folders..."
          className="w-full pl-9 pr-8 py-2 text-sm rounded-md
            bg-vault-bg-secondary border border-vault-bg-hover
            text-vault-text-primary placeholder:text-vault-text-secondary/50
            focus:outline-none focus:ring-2 focus:ring-vault-accent focus:border-transparent
            transition-all duration-150"
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2
              text-vault-text-secondary hover:text-vault-text-primary
              text-sm w-5 h-5 flex items-center justify-center rounded-full
              hover:bg-vault-bg-hover transition-colors duration-150"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
