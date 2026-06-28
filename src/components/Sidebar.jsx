const icons = {
  Objects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Materials: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3C8 7 8 17 12 21M12 3C16 7 16 17 12 21M3 12h18" />
    </svg>
  ),
  Textures: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z" />
    </svg>
  ),
  Lighting: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  'AI Suggest': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Undo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 7h12a6 6 0 010 12H9" />
      <polyline points="7 3 3 7 7 11" />
    </svg>
  ),
};

export default function Sidebar({ active, onSelect, onUndo, canUndo }) {
  const navItems = ['Objects', 'Materials', 'Textures', 'Lighting', 'AI Suggest'];

  return (
    <aside className="sidebar">
      {navItems.map((item) => (
        <button
          key={item}
          className={`sidebar-btn${active === item ? ' active' : ''}`}
          onClick={() => onSelect(item)}
          title={item}
        >
          <span className="sidebar-icon">{icons[item]}</span>
          <span className="sidebar-label">{item}</span>
        </button>
      ))}
      <div className="sidebar-spacer" />
      <button
        className={`sidebar-btn${!canUndo ? ' disabled' : ''}`}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
      >
        <span className="sidebar-icon">{icons.Undo}</span>
        <span className="sidebar-label">Undo</span>
      </button>
    </aside>
  );
}
