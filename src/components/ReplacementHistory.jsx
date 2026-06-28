export default function ReplacementHistory({ history, onClose }) {
  if (!history.length) return null;

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>Replacement History</h3>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="history-list">
        {history.map((item, i) => (
          <div key={i} className="history-item">
            <span className="history-num">{i + 1}</span>
            <div className="history-info">
              <strong>{item.objectName}</strong>
              <span>→ {item.replacementName}</span>
            </div>
            <span className="history-style">{item.style}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
