const urls = new WeakMap();

export default function getUrlForBlob(blob) {
  if (urls.has(blob)) return urls.get(blob);

  const url = URL.createObjectURL(blob);
  urls.set(blob, url);
  return url;
}
