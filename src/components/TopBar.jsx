export default function TopBar({ title, onTitleChange, onDetectAgain, replaceMode, onToggleReplaceMode, detecting }) {
  return (
    <header className="topbar">
      <button className="topbar-back" title="Back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="topbar-title-group">
        <span className="topbar-title">{title}</span>
        <button className="topbar-edit-icon" title="Rename">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      <div className="topbar-actions">
        <button
          className="btn btn-outline"
          onClick={onDetectAgain}
          disabled={detecting}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          {detecting ? 'Detecting…' : 'Detect Again'}
        </button>

        <button
          className={`btn ${replaceMode ? 'btn-primary-active' : 'btn-primary'}`}
          onClick={onToggleReplaceMode}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
          Replace Mode
        </button>
      </div>
    </header>
  );
}
