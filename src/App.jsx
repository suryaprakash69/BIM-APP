import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Canvas from './components/Canvas';
import DetectedObjectsBar from './components/DetectedObjectsBar';
import ReplacementPanel from './components/ReplacementPanel';
import UploadZone from './components/UploadZone';
import ReplacementHistory from './components/ReplacementHistory';
import ApiKeyModal from './components/ApiKeyModal';
import { detectObjects, replaceObjectInImage, getStoredApiKey } from './services/openai';
import { generateThumbnails } from './utils/cropThumbnail';
import './App.css';

export default function App() {
  const [appState, setAppState] = useState('upload');
  const [currentImage, setCurrentImage] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [showReplacePanel, setShowReplacePanel] = useState(false);
  const [replaceMode, setReplaceMode] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [history, setHistory] = useState([]);
  const [replacementLog, setReplacementLog] = useState([]);
  const [projectTitle] = useState('Interior Design');
  const [sidebarActive, setSidebarActive] = useState('Objects');
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false); // env key used; open via sidebar if needed

  const runDetection = useCallback(async (imageData) => {
    setDetecting(true);
    setError(null);
    try {
      const raw = await detectObjects(imageData);
      const withThumbs = await generateThumbnails(imageData, raw);
      setDetectedObjects(withThumbs);
    } catch (e) {
      console.error('Detection failed:', e);
      const msg = e.message?.toLowerCase().includes('rate limit') || e.message?.includes('429')
        ? 'OpenAI rate limit hit. Please wait a minute and try Detect Again.'
        : e.message;
      setError(msg);
      setDetectedObjects([]);
    } finally {
      setDetecting(false);
    }
  }, []);

  const handleUpload = useCallback(async (imageData) => {
    setCurrentImage(imageData);
    setSelectedObject(null);
    setShowReplacePanel(false);
    setReplaceMode(false);
    setHistory([]);
    setReplacementLog([]);
    setAppState('editor');
    await runDetection(imageData);
  }, [runDetection]);

  const handleDetectAgain = useCallback(async () => {
    if (!currentImage) return;
    setSelectedObject(null);
    setShowReplacePanel(false);
    await runDetection(currentImage);
  }, [currentImage, runDetection]);

  const handleSelectObject = useCallback((obj) => {
    setSelectedObject(obj);
    setShowReplacePanel(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setShowReplacePanel(false);
    setSelectedObject(null);
  }, []);

  const handleApplyReplacement = useCallback(async (suggestion) => {
    if (!selectedObject || !currentImage || isReplacing) return;

    setIsReplacing(true);
    setError(null);
    setHistory((prev) => [...prev, { image: currentImage, objects: detectedObjects }]);

    try {
      const newImage = await replaceObjectInImage(currentImage, selectedObject, suggestion.name, suggestion.style);

      setCurrentImage(newImage);
      setReplacementLog((prev) => [...prev, {
        objectName: selectedObject.name,
        replacementName: suggestion.name,
        style: suggestion.style,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      setDetectedObjects((prev) =>
        prev.map((o) =>
          o.id === selectedObject.id
            ? { ...o, name: suggestion.name, style: suggestion.style, material: suggestion.material, color: suggestion.color }
            : o
        )
      );
      setShowReplacePanel(false);
      setSelectedObject(null);
    } catch (e) {
      console.error('Replacement failed:', e);
      const msg = e.message?.toLowerCase().includes('rate limit') || e.message?.includes('429')
        ? 'OpenAI rate limit hit. Please wait a moment and try again.'
        : 'Replacement failed: ' + e.message;
      setError(msg);
      setHistory((prev) => prev.slice(0, -1));
    } finally {
      setIsReplacing(false);
    }
  }, [selectedObject, currentImage, isReplacing, detectedObjects]);

  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      setCurrentImage(last.image);
      setDetectedObjects(last.objects);
      setSelectedObject(null);
      setShowReplacePanel(false);
      setReplacementLog((log) => log.slice(0, -1));
      return prev.slice(0, -1);
    });
  }, []);

  const handleToggleReplaceMode = useCallback(() => {
    setReplaceMode((v) => {
      if (v) { setSelectedObject(null); setShowReplacePanel(false); }
      return !v;
    });
  }, []);

  if (showApiKeyModal) {
    return (
      <div className="app">
        <ApiKeyModal onSaved={() => setShowApiKeyModal(false)} />
      </div>
    );
  }

  if (appState === 'upload') {
    return (
      <div className="app">
        <UploadZone onUpload={handleUpload} detecting={detecting} />
      </div>
    );
  }

  return (
    <div className="app editor-layout">
      <Sidebar
        active={sidebarActive}
        onSelect={setSidebarActive}
        onUndo={handleUndo}
        canUndo={history.length > 0}
        onApiKey={() => setShowApiKeyModal(true)}
      />

      <div className="main-area">
        <TopBar
          title={projectTitle}
          onDetectAgain={handleDetectAgain}
          replaceMode={replaceMode}
          onToggleReplaceMode={handleToggleReplaceMode}
          detecting={detecting}
        />

        {error && (
          <div className="error-banner" onClick={() => setError(null)}>
            ⚠️ {error} <span className="error-dismiss">(click to dismiss)</span>
          </div>
        )}

        {!replaceMode && detectedObjects.length > 0 && (
          <div className="replace-mode-hint">
            <svg viewBox="0 0 16 16" fill="none" width={14} height={14}>
              <circle cx="8" cy="8" r="7" stroke="#2563EB" strokeWidth={1.5} />
              <path d="M8 7v4M8 5.5V5" stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
            Enable <strong>Replace Mode</strong> to click objects and swap furniture
          </div>
        )}

        <div className="canvas-area">
          {detecting && (
            <div className="detecting-overlay">
              <div className="spinner" />
              <span>Analyzing image with GPT-4o…</span>
            </div>
          )}
          <Canvas
            image={currentImage}
            detectedObjects={detectedObjects}
            selectedObject={selectedObject}
            onSelectObject={handleSelectObject}
            replaceMode={replaceMode}
            isReplacing={isReplacing}
          />
        </div>

        <DetectedObjectsBar
          objects={detectedObjects}
          selectedObject={selectedObject}
          onSelect={(obj) => {
            setSelectedObject(obj);
            if (!replaceMode) setReplaceMode(true);
            setShowReplacePanel(true);
          }}
        />

        {replacementLog.length > 0 && (
          <button className="history-toggle" onClick={() => setShowHistory((v) => !v)}>
            📋 Replacement History ({replacementLog.length})
          </button>
        )}
      </div>

      {showReplacePanel && selectedObject && (
        <ReplacementPanel
          object={selectedObject}
          onClose={handleClosePanel}
          onApply={handleApplyReplacement}
          isReplacing={isReplacing}
        />
      )}

      {showHistory && (
        <ReplacementHistory history={replacementLog} onClose={() => setShowHistory(false)} />
      )}

      {showApiKeyModal && (
        <ApiKeyModal onSaved={() => setShowApiKeyModal(false)} />
      )}
    </div>
  );
}
