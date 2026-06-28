// Crop the bbox region from the image to use as a thumbnail card
export function cropThumbnail(imageBase64, bbox, size = 80) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Add padding around the crop so the object isn't clipped to the edge
      const pad = 0.05;
      const x = Math.max(0, (bbox.x - pad)) * img.width;
      const y = Math.max(0, (bbox.y - pad)) * img.height;
      const w = Math.min(1, bbox.width + pad * 2) * img.width;
      const h = Math.min(1, bbox.height + pad * 2) * img.height;

      ctx.drawImage(img, x, y, w, h, 0, 0, size, size);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = () => resolve(null);
    img.src = imageBase64;
  });
}

export async function generateThumbnails(imageBase64, objects) {
  const results = await Promise.all(
    objects.map(async (obj) => {
      if (!obj.bbox) return { ...obj, thumbnail: null };
      // Skip thumbnails for full-image objects like Wall Panel
      const area = obj.bbox.width * obj.bbox.height;
      if (area > 0.6) return { ...obj, thumbnail: null };
      const thumbnail = await cropThumbnail(imageBase64, obj.bbox);
      return { ...obj, thumbnail };
    })
  );
  return results;
}
