'use strict';

async function processBatch(items, fn, options) {
  options = options || {};
  const size = options.batchSize || 100;
  const delay = options.delayMs || 0;
  const results = [];
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    if (delay && i + size < items.length) {
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  return results;
}

module.exports = processBatch;
