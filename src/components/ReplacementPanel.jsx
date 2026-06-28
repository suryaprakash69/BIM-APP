import { useState } from 'react';
import { getSuggestionsForCategory, styleFilters } from '../data/furnitureSuggestions';

export default function ReplacementPanel({ object, onClose, onApply, isReplacing }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [imgErrors, setImgErrors] = useState({});

  const allSuggestions = getSuggestionsForCategory(object.category);
  const suggestions = activeFilter === 'All'
    ? allSuggestions
    : allSuggestions.filter((s) => s.style.toLowerCase().includes(activeFilter.toLowerCase()));

  const handleApply = () => {
    if (!selectedSuggestion || isReplacing) return;
    onApply(selectedSuggestion);
  };

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <aside className="replace-panel">
      <div className="replace-panel-header">
        <h2 className="replace-panel-title">Replace {object.category}</h2>
        <button className="replace-panel-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="replace-panel-body">
        {/* Selected object */}
        <section className="rp-section">
          <h3 className="rp-section-title">Selected Object</h3>
          <div className="rp-selected-card">
            <div className="rp-selected-thumb">
              <span style={{ fontSize: 32 }}>🪑</span>
            </div>
            <div className="rp-selected-info">
              <div className="rp-selected-label">Current {object.category}</div>
              <div className="rp-selected-name">{object.name}</div>
              {object.material && <div className="rp-selected-meta">{object.material} · {object.color}</div>}
            </div>
            <button className="btn-change" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
                <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              Change
            </button>
          </div>
        </section>

        {/* Style filters */}
        <section className="rp-section">
          <h3 className="rp-section-title">Choose Replacement</h3>
          <div className="rp-filters">
            {styleFilters.map((f) => (
              <button
                key={f}
                className={`filter-chip${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {suggestions.length === 0 ? (
            <div className="rp-empty">No {activeFilter} options available</div>
          ) : (
            <div className="suggestions-grid">
              {suggestions.map((s) => {
                const isChosen = selectedSuggestion?.id === s.id;
                return (
                  <button
                    key={s.id}
                    className={`suggestion-card${isChosen ? ' chosen' : ''}`}
                    onClick={() => setSelectedSuggestion(s)}
                  >
                    {isChosen && (
                      <div className="suggestion-check">
                        <svg viewBox="0 0 14 14" fill="none" width={14} height={14}>
                          <circle cx="7" cy="7" r="7" fill="#2563EB" />
                          <path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                    <div className="suggestion-img-wrap">
                      {imgErrors[s.id] ? (
                        <div className="suggestion-img-fallback">
                          <span>{getFallbackEmoji(s.style)}</span>
                          <span className="fallback-style">{s.style}</span>
                        </div>
                      ) : (
                        <img
                          src={s.image}
                          alt={s.name}
                          className="suggestion-img"
                          onError={() => handleImgError(s.id)}
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="suggestion-name">{s.name}</div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <div className="replace-panel-footer">
        <button
          className={`btn-apply${!selectedSuggestion || isReplacing ? ' disabled' : ''}`}
          onClick={handleApply}
          disabled={!selectedSuggestion || isReplacing}
        >
          {isReplacing ? (
            <>
              <span className="btn-spinner" />
              Applying…
            </>
          ) : (
            'Apply Replacement'
          )}
        </button>
        {selectedSuggestion && (
          <div className="rp-tip">
            <svg viewBox="0 0 16 16" fill="none" width={12} height={12}>
              <circle cx="8" cy="8" r="7" stroke="#999" strokeWidth={1.5} />
              <path d="M8 7v4M8 5.5V5" stroke="#999" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
            Tip: You can adjust position, scale and rotation after replacing.
          </div>
        )}
      </div>
    </aside>
  );
}

function getFallbackEmoji(style) {
  const map = { Modern: '🪑', Classic: '🛋️', Minimal: '⬜', Luxury: '✨', Scandinavian: '🌿', Bohemian: '🪴', Industrial: '🔩' };
  return map[style] || '🪑';
}
