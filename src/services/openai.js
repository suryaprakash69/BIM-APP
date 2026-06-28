import OpenAI from 'openai';
import { MOCK_DETECTIONS } from './mockData';

const LS_KEY = 'bim_openai_key';
const DEMO_KEY = 'bim_demo_mode';

export function getStoredApiKey() {
  return localStorage.getItem(LS_KEY) || '';
}

export function saveApiKey(key) {
  if (key === 'DEMO') {
    localStorage.setItem(DEMO_KEY, '1');
    localStorage.removeItem(LS_KEY);
  } else {
    localStorage.setItem(LS_KEY, key.trim());
    localStorage.removeItem(DEMO_KEY);
  }
}

export function isDemoMode() {
  return localStorage.getItem(DEMO_KEY) === '1';
}

export function enableDemoMode() {
  localStorage.setItem(DEMO_KEY, '1');
  localStorage.removeItem(LS_KEY);
}

function makeClient() {
  const key = getStoredApiKey();
  if (!key) throw new Error('No API key set.');
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
}

// ─── Object Detection ──────────────────────────────────────────────────────

export async function detectObjects(imageBase64) {
  if (isDemoMode()) {
    await sleep(1800); // simulate network delay
    return MOCK_DETECTIONS;
  }

  const client = makeClient();
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Data}`, detail: 'high' },
            },
            {
              type: 'text',
              text: `You are an interior design object detector. Analyze this room image and detect ALL visible furniture and decorative objects.

Return a JSON array ONLY (no markdown, no extra text):
[
  {
    "id": "obj_1",
    "name": "Modern Upholstered Chair",
    "category": "Chair",
    "quantity": 2,
    "confidence": 0.95,
    "bbox": {"x": 0.55, "y": 0.45, "width": 0.30, "height": 0.45},
    "style": "Contemporary",
    "material": "Fabric",
    "color": "Beige"
  }
]

bbox: 0–1 normalized (x,y = top-left, width/height = fraction of image).
category must be one of: Chair, Sofa, Table, Console Table, Coffee Table, Dining Table, Bed, Wardrobe, Cabinet, TV Unit, Bookshelf, Desk, Stool, Bench, Rug, Carpet, Curtains, Window, Door, Wall Panel, Ceiling Light, Pendant Light, Chandelier, Floor Lamp, Plant, Vase, Mirror, Artwork, Clock, Flower Vase, Other.
Return ONLY valid JSON array.`,
            },
          ],
        },
      ],
      max_tokens: 2000,
    });

    const text = response.choices[0].message.content.trim();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    if (isQuotaError(err)) {
      enableDemoMode();
      await sleep(800);
      return MOCK_DETECTIONS;
    }
    throw err;
  }
}

// ─── Object Replacement ────────────────────────────────────────────────────

export async function replaceObjectInImage(imageBase64, objectInfo, replacementName, replacementStyle) {
  if (isDemoMode()) {
    return simulateReplacement(imageBase64, objectInfo, replacementName, replacementStyle);
  }

  const apiKey = getStoredApiKey();
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

  const prompt = `Replace only the ${objectInfo.name} with a ${replacementName} (${replacementStyle} style).
Keep everything else identical: room layout, perspective, floor, walls, ceiling, lighting, shadows, all other furniture.
Blend the replacement naturally. Make it photorealistic.`;

  // 1. Try DALL-E 2 inpainting
  try {
    const maskBase64 = await createMask(imageBase64, objectInfo.bbox);
    const imageBlob = base64ToBlob(base64Data, 'image/png');
    const maskBlob = base64ToBlob(maskBase64, 'image/png');

    const formData = new FormData();
    formData.append('image', imageBlob, 'image.png');
    formData.append('mask', maskBlob, 'mask.png');
    formData.append('prompt', prompt);
    formData.append('n', '1');
    formData.append('size', '1024x1024');
    formData.append('response_format', 'b64_json');

    const res = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    if (res.status === 429) {
      enableDemoMode();
      return simulateReplacement(imageBase64, objectInfo, replacementName, replacementStyle);
    }

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'DALL-E edit failed');
    }

    const data = await res.json();
    return `data:image/png;base64,${data.data[0].b64_json}`;
  } catch (err) {
    if (isQuotaError(err)) {
      enableDemoMode();
      return simulateReplacement(imageBase64, objectInfo, replacementName, replacementStyle);
    }
    console.warn('Inpainting failed, trying gpt-image-1:', err.message);
  }

  // 2. Fallback: gpt-image-1 instruction edit
  try {
    const client = makeClient();
    const response = await client.images.edit({
      model: 'gpt-image-1',
      image: await base64ToFile(base64Data, 'room.png', 'image/png'),
      prompt: `Replace only the ${objectInfo.category} (${objectInfo.name}) with a ${replacementName} in ${replacementStyle} style. Keep everything else exactly the same.`,
      n: 1,
      size: '1024x1024',
    });
    const imgData = response.data[0];
    if (imgData.b64_json) return `data:image/png;base64,${imgData.b64_json}`;
    return imgData.url;
  } catch (err) {
    if (isQuotaError(err)) {
      enableDemoMode();
      return simulateReplacement(imageBase64, objectInfo, replacementName, replacementStyle);
    }
    throw err;
  }
}

// ─── Demo / Simulation helpers ─────────────────────────────────────────────

async function simulateReplacement(imageBase64, objectInfo, replacementName, replacementStyle) {
  await sleep(2200);
  // Draw a subtle highlight overlay on the bounding box to indicate replacement
  return applyDemoOverlay(imageBase64, objectInfo.bbox, replacementName);
}

function applyDemoOverlay(imageBase64, bbox, label) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const x = bbox.x * img.width;
      const y = bbox.y * img.height;
      const w = bbox.width * img.width;
      const h = bbox.height * img.height;

      // Soft blue-green tint over the replaced region
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(x, y, w, h);
      ctx.restore();

      // "Replaced" badge
      ctx.save();
      ctx.fillStyle = 'rgba(99,102,241,0.92)';
      const bw = Math.min(w * 0.9, 180);
      const bh = 26;
      const bx = x + (w - bw) / 2;
      const by = y + h / 2 - bh / 2;
      roundRect(ctx, bx, by, bw, bh, 6);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(11, Math.min(14, w * 0.08))}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`✓ ${label}`, bx + bw / 2, by + bh / 2);
      ctx.restore();

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = imageBase64;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Mask creation ─────────────────────────────────────────────────────────

async function createMask(imageBase64, bbox) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = Math.max(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,255)';
      ctx.fillRect(0, 0, size, size);
      const ox = (size - img.width) / 2;
      const oy = (size - img.height) / 2;
      ctx.clearRect(ox + bbox.x * img.width, oy + bbox.y * img.height, bbox.width * img.width, bbox.height * img.height);
      resolve(canvas.toDataURL('image/png').split(',')[1]);
    };
    img.src = imageBase64;
  });
}

// ─── Utility ───────────────────────────────────────────────────────────────

function isQuotaError(err) {
  const msg = err?.message || err?.error?.message || '';
  return err?.status === 429 || msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('exceeded');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function base64ToBlob(base64, mimeType) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

async function base64ToFile(base64, filename, mimeType) {
  return new File([base64ToBlob(base64, mimeType)], filename, { type: mimeType });
}
