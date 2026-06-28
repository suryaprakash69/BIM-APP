import { getCategoryIcon } from '../utils/categoryIcons';

export default function DetectedObjectsBar({ objects, selectedObject, onSelect, originalImage }) {
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
            >
              {isSelected && (
                <div className="obj-card-check">
                  <svg viewBox="0 0 12 12" fill="none" width={12} height={12}>
                    <circle cx="6" cy="6" r="6" fill="#2563EB" />
                    <path d="M3 6l2 2 4-4" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
                  </svg>
                </div>
              )}
              <div className="obj-card-thumb">
                <span className="obj-card-icon">{getCategoryIcon(obj.category)}</span>
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
