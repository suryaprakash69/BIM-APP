import { useRef, useState, useEffect } from 'react';

export default function Canvas({ image, detectedObjects, selectedObject, onSelectObject, replaceMode, isReplacing }) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [imgDims, setImgDims] = useState({ width: 0, height: 0, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const updateDims = () => {
      if (!imgRef.current || !containerRef.current) return;
      const img = imgRef.current;
      const rect = img.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setImgDims({
        width: rect.width,
        height: rect.height,
        offsetX: rect.left - containerRect.left,
        offsetY: rect.top - containerRect.top,
      });
    };

    const observer = new ResizeObserver(updateDims);
    if (containerRef.current) observer.observe(containerRef.current);
    if (imgRef.current) {
      imgRef.current.addEventListener('load', updateDims);
    }
    updateDims();
    return () => observer.disconnect();
  }, [image]);

  const getBBoxStyle = (bbox) => ({
    left: imgDims.offsetX + bbox.x * imgDims.width,
    top: imgDims.offsetY + bbox.y * imgDims.height,
    width: bbox.width * imgDims.width,
    height: bbox.height * imgDims.height,
  });

  return (
    <div className="canvas-wrapper" ref={containerRef}>
      {image ? (
        <>
          <img
            ref={imgRef}
            src={image}
            alt="Room"
            className="canvas-image"
            draggable={false}
          />

          {isReplacing && (
            <div className="canvas-overlay-loading">
              <div className="canvas-spinner-wrap">
                <div className="spinner" />
                <p>Applying replacement…</p>
                <p className="spinner-sub">AI is blending the new furniture into your scene</p>
              </div>
            </div>
          )}

          {replaceMode && detectedObjects.map((obj) => {
            if (!obj.bbox) return null;
            const isSelected = selectedObject?.id === obj.id;
            const style = getBBoxStyle(obj.bbox);
            return (
              <div
                key={obj.id}
                className={`bbox${isSelected ? ' bbox-selected' : ''}`}
                style={style}
                onClick={() => onSelectObject(obj)}
                title={`Click to replace: ${obj.name}`}
              >
                <span className="bbox-label">{obj.name}</span>
                {isSelected && (
                  <>
                    <div className="bbox-handle bbox-handle-tl" />
                    <div className="bbox-handle bbox-handle-tr" />
                    <div className="bbox-handle bbox-handle-bl" />
                    <div className="bbox-handle bbox-handle-br" />
                    <div className="bbox-handle bbox-handle-tc" />
                    <div className="bbox-handle bbox-handle-bc" />
                    <div className="bbox-handle bbox-handle-ml" />
                    <div className="bbox-handle bbox-handle-mr" />
                  </>
                )}
              </div>
            );
          })}
        </>
      ) : (
        <div className="canvas-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth={1.5} width={64} height={64}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p>Upload an interior image to begin</p>
        </div>
      )}
    </div>
  );
}
