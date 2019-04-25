import pq from 'p-queue';

export default function rateLimited(concurrency, fn) {
  const q = new pq({ concurrency });

  return (...args) => q.add(() => fn(...args));
}
