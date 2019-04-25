const THUMB_SIZE = 125;

function toImageCoordinates(image, box) {
  const { Top, Left, Width, Height } = box;
  const { naturalWidth, naturalHeight } = image;

  return rounded({
    x: Left * naturalWidth,
    y: Top * naturalHeight,
    w: Width * naturalWidth,
    h: Height * naturalHeight
  });
}

function toSquare(box) {
  const { x, y, w, h } = box;

  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.sqrt(w * w + h * h) / 2;

  return rounded({
    x: cx - r,
    y: cy - r,
    w: r * 2,
    h: r * 2
  });
}

function rounded(box) {
  const { x, y, w, h } = box;

  return {
    x: Math.round(x),
    y: Math.round(y),
    w: Math.round(w),
    h: Math.round(h),
  }
}

function crop(image, box) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = box.w;
  canvas.height = box.h;

  ctx.drawImage(image, -box.x, -box.y);

  return canvas;
}

function resize(image, width, height) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  return canvas;
}

function getBlob(cnv, type) {
  return new Promise((resolve, reject) => {
    cnv.toBlob(blob => {
      resolve(blob);
    }, type || 'image/jpeg');
  });
}

export async function cropImageToBox(image, box) {
  const bbox = toImageCoordinates(image, box);
  const cropped = crop(image, bbox);
  const blob = await getBlob(cropped);
  return blob;
}

export async function cropImageToNiceSquare(image, box) {
  const bbox = toSquare(toImageCoordinates(image, box));
  const cropped = crop(image, bbox);
  const resized = resize(cropped, THUMB_SIZE, THUMB_SIZE);
  const blob = await getBlob(resized);
  return blob;
}

export async function downsample(image, maxDimension) {
  const s = Math.min(maxDimension / image.width, maxDimension / image.height);
  const resized = resize(image, image.width * s, image.height * s);
  const blob = await getBlob(resized);
  return blob;
}



const shadowed = new WeakMap();

export async function getShadowedImage(image) {
  if (shadowed.has(image)) return shadowed.get(image);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = image.width * 1.1;
  canvas.height = image.height * 1.1;

  const dim = Math.min(image.width, image.height);

  ctx.shadowColor = 'rgba(0, 0, 0, .5)';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.floor(dim / 60);
  ctx.shadowBlur = Math.floor(dim / 20);

  ctx.fillStyle = 'rgba(0, 0, 0, 1)';

  ctx.fillRect(image.width * 0.05, image.height * 0.05, image.width, image.height);

  const blob = await getBlob(canvas, 'image/png');
  shadowed.set(image, blob);
  return blob
}
