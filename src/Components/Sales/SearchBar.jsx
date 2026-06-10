import { LuSearch } from 'react-icons/lu'

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="input-group shadow-sm rounded-3">
      <span className="input-group-text bg-white border-0 text-muted rounded-start-3">
        <LuSearch size={18} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-control border-0 rounded-end-3"
        type="search"
      />
    </div>
  )
}
