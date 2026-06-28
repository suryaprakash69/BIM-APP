import { useState } from 'react';
import { saveApiKey } from '../services/openai';

export default function ApiKeyModal({ onSaved }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed.startsWith('sk-')) {
      setError('Key must start with "sk-"');
      return;
    }
    saveApiKey(trimmed);
    onSaved();
  };

  return (
    <div className="apikey-backdrop">
      <div className="apikey-modal">
        <div className="apikey-logo">
          <svg viewBox="0 0 40 40" fill="none" width={40} height={40}>
            <rect width="40" height="40" rx="10" fill="#111827" />
            <path d="M10 27V18a2 2 0 012-2h3l3-5h4l3 5h3a2 2 0 012 2v9a2 2 0 01-2 2H12a2 2 0 01-2-2z" stroke="#fff" strokeWidth={1.5} />
            <circle cx="20" cy="21" r="3.5" stroke="#fff" strokeWidth={1.5} />
          </svg>
          <span className="apikey-brand">BIM Design AI</span>
        </div>

        <h2 className="apikey-title">Enter your OpenAI API Key</h2>
        <p className="apikey-desc">
          Your key is stored only in your browser's localStorage and sent directly to OpenAI — never to any other server.
        </p>

        <input
          className="apikey-input"
          type="password"
          placeholder="sk-proj-..."
          value={key}
          onChange={(e) => { setKey(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />

        {error && <p className="apikey-error">{error}</p>}

        <button className="apikey-btn" onClick={handleSave} disabled={!key.trim()}>
          Save & Start
        </button>

        <p className="apikey-hint">
          Get a key at{' '}
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">
            platform.openai.com/api-keys
          </a>
          {' '}— requires GPT-4o access and billing enabled.
        </p>
      </div>
    </div>
  );
}
