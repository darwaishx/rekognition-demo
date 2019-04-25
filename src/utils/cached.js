const CAN_CACHE = ('caches' in window);

export default function cached(cacheName, fn) {
  if (!CAN_CACHE) return fn;

  const cacheProm = caches.open(cacheName);

  return async (...args) => {
    const cache = await cacheProm;
    const cacheUrl = args.join('/');

    const match = await cache.match(cacheUrl);
    if (match) {
      return await match.blob();
    }

    const respBlob = await fn(...args);

    await cache.put(cacheUrl, new Response(respBlob));
    return respBlob;
  }
}

cached.clearAll = async function() {
  if (!CAN_CACHE) return;

  const cacheKeys = await caches.keys();

  for (const cacheName of cacheKeys) {
    await caches.delete(cacheName);
  }
}