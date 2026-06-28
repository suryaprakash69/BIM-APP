import { getCategoryIcon } from '../utils/categoryIcons';

export default function DetectedObjectsBar({ objects, selectedObject, onSelect }) {
  if (!objects.length) return null;

  return (
    <div className="objects-bar">
      <div className="objects-bar-header">
        <span className="objects-bar-title">Detected Objects ({objects.length})</span>
      </div>
      <div className="objects-bar-scroll">
        {objects.map((obj) => {
          const isSelected = selectedObject?.id === obj.id;
          return (
            <button
              key={obj.id}
              className={`obj-card${isSelected ? ' obj-card-selected' : ''}`}
              onClick={() => onSelect(obj)}
              title={`Click to replace: ${obj.name}`}
            >
              {isSelected && (
                <div className="obj-card-check">
                  <svg viewBox="0 0 14 14" fill="none" width={14} height={14}>
                    <circle cx="7" cy="7" r="7" fill="#2563EB" />
                    <path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              <div className="obj-card-thumb">
                {obj.thumbnail ? (
                  <img src={obj.thumbnail} alt={obj.name} className="obj-card-thumb-img" />
                ) : (
                  <span className="obj-card-icon">{getCategoryIcon(obj.category)}</span>
                )}
              </div>

              <div className="obj-card-info">
                <span className="obj-card-name">{obj.name}</span>
                {obj.quantity > 1 && <span className="obj-card-qty">×{obj.quantity}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
