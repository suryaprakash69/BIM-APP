import OpenAI from 'openai';

const LS_KEY = 'bim_openai_key';

export function getStoredApiKey() {
  return localStorage.getItem(LS_KEY) || import.meta.env.VITE_OPENAI_API_KEY || '';
}

export function saveApiKey(key) {
  localStorage.setItem(LS_KEY, key.trim());
}

function makeClient() {
  const key = getStoredApiKey();
  if (!key) throw new Error('No API key. Please enter your OpenAI API key.');
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
}

// ─── Object Detection ──────────────────────────────────────────────────────

export async function detectObjects(imageBase64) {
  const client = makeClient();
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

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
            text: `You are an expert interior design object detector. Analyze this room image carefully and detect ALL visible furniture and decorative objects.

Return ONLY a valid JSON array — no markdown, no explanation, no extra text:
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

Rules:
- bbox values are 0–1 normalized (x, y = top-left corner, width/height = fraction of image dimensions)
- Detect every visible object: Chair, Sofa, Table, Console Table, Coffee Table, Dining Table, Bed, Wardrobe, Cabinet, TV Unit, Bookshelf, Desk, Stool, Bench, Rug, Carpet, Curtains, Window, Door, Wall Panel, Ceiling Light, Pendant Light, Chandelier, Floor Lamp, Plant, Vase, Mirror, Artwork, Clock, Flower Vase, and any other furniture or decoration
- Give each distinct physical object (or identical group) its own entry
- category must be one of: Chair, Sofa, Table, Console Table, Coffee Table, Dining Table, Bed, Wardrobe, Cabinet, TV Unit, Bookshelf, Desk, Stool, Bench, Rug, Carpet, Curtains, Window, Door, Wall Panel, Ceiling Light, Pendant Light, Chandelier, Floor Lamp, Plant, Vase, Mirror, Artwork, Clock, Flower Vase, Other
- Return ONLY the JSON array`,
          },
        ],
      },
    ],
    max_tokens: 2000,
  });

  const text = response.choices[0].message.content.trim();
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

// ─── Object Replacement ────────────────────────────────────────────────────

export async function replaceObjectInImage(imageBase64, objectInfo, replacementName, replacementStyle) {
  const apiKey = getStoredApiKey();
  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

  const prompt = `Replace only the ${objectInfo.name} with a ${replacementName} in ${replacementStyle} style.
Keep everything else completely identical: room layout, perspective, camera angle, floor, walls, ceiling, lighting, shadows, and all other furniture and decorations.
Blend the new piece naturally with photorealistic lighting and shadows that match the scene.
Make the result look seamless and photorealistic.`;

  // 1. Try DALL-E 2 inpainting with bounding-box mask
  try {
    const squareImage = await makeSquarePng(imageBase64);
    const maskBase64 = await createMask(imageBase64, objectInfo.bbox);

    const imageBlob = base64ToBlob(squareImage, 'image/png');
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

    if (res.ok) {
      const data = await res.json();
      return `data:image/png;base64,${data.data[0].b64_json}`;
    }

    const errBody = await res.json().catch(() => ({}));
    console.warn('DALL-E 2 edit failed:', errBody.error?.message);
  } catch (e) {
    console.warn('DALL-E 2 inpainting failed:', e.message);
  }

  // 2. Fallback: gpt-image-1 instruction-based editing
  const client = makeClient();
  const response = await client.images.edit({
    model: 'gpt-image-1',
    image: await base64ToFile(base64Data, 'room.png', 'image/png'),
    prompt: `Replace only the ${objectInfo.category} (currently: ${objectInfo.name}) with a ${replacementName} in ${replacementStyle} style. Keep the entire rest of the room — perspective, lighting, floor, walls, ceiling, every other piece of furniture — exactly the same. Make it photorealistic.`,
    n: 1,
    size: '1024x1024',
  });

  const imgData = response.data[0];
  if (imgData.b64_json) return `data:image/png;base64,${imgData.b64_json}`;
  return imgData.url;
}

// ─── Image helpers ─────────────────────────────────────────────────────────

async function makeSquarePng(imageBase64) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = Math.max(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, (size - img.width) / 2, (size - img.height) / 2);
      resolve(canvas.toDataURL('image/png').split(',')[1]);
    };
    img.src = imageBase64;
  });
}

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
      ctx.clearRect(
        ox + bbox.x * img.width,
        oy + bbox.y * img.height,
        bbox.width * img.width,
        bbox.height * img.height
      );
      resolve(canvas.toDataURL('image/png').split(',')[1]);
    };
    img.src = imageBase64;
  });
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
