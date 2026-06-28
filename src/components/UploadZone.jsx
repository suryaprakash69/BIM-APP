import { useRef, useState } from 'react';

export default function UploadZone({ onUpload, detecting }) {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onUpload(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleChange = (e) => {
    processFile(e.target.files[0]);
  };

  return (
    <div className="upload-page">
      <div className="upload-hero">
        <div className="upload-logo">
          <svg viewBox="0 0 48 48" fill="none" width={48} height={48}>
            <rect width="48" height="48" rx="12" fill="#1a1a1a" />
            <path d="M12 32V22a2 2 0 012-2h4l4-6h4l4 6h4a2 2 0 012 2v10a2 2 0 01-2 2H14a2 2 0 01-2-2z" stroke="#fff" strokeWidth={1.5} />
            <circle cx="24" cy="26" r="4" stroke="#fff" strokeWidth={1.5} />
          </svg>
          <span className="upload-logo-text">BIM Design AI</span>
        </div>
        <h1 className="upload-title">AI Interior Design Assistant</h1>
        <p className="upload-subtitle">Upload your room image to detect furniture, explore replacements, and visualize design changes instantly using AI.</p>
      </div>

      <div
        className={`upload-dropzone${dragging ? ' dragging' : ''}${detecting ? ' detecting' : ''}`}
        onClick={() => !detecting && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleChange}
        />
        {detecting ? (
          <div className="upload-detecting">
            <div className="spinner large" />
            <p className="upload-detecting-text">Analyzing your room with AI…</p>
            <p className="upload-detecting-sub">Detecting furniture and objects</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              <svg viewBox="0 0 64 64" fill="none" width={64} height={64}>
                <rect x="8" y="16" width="48" height="36" rx="4" stroke="#d1d5db" strokeWidth={2} />
                <circle cx="22" cy="28" r="4" stroke="#d1d5db" strokeWidth={2} />
                <path d="M8 44l14-10 8 6 8-8 14 12" stroke="#d1d5db" strokeWidth={2} strokeLinecap="round" />
                <path d="M32 8v20M24 14l8-8 8 8" stroke="#2563EB" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="upload-drop-text">
              <strong>Drop your room image here</strong>
            </p>
            <p className="upload-drop-sub">or click to browse — JPG, PNG, WEBP supported</p>
            <button className="btn btn-primary upload-btn" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
              Choose Image
            </button>
          </>
        )}
      </div>

      <div className="upload-features">
        {[
          { icon: '🔍', title: 'Smart Detection', desc: 'GPT-4o Vision detects every piece of furniture and décor' },
          { icon: '🪑', title: 'Browse Replacements', desc: 'Explore curated furniture options across multiple styles' },
          { icon: '✨', title: 'AI Replacement', desc: 'Seamlessly swap furniture with photorealistic AI rendering' },
        ].map((f) => (
          <div key={f.title} className="upload-feature-card">
            <span className="upload-feature-icon">{f.icon}</span>
            <strong>{f.title}</strong>
            <span>{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
