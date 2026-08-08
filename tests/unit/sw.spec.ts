import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('public/sw.js', () => {
  const source = readFileSync(join(process.cwd(), 'public/sw.js'), 'utf8');

  it('skips non-http(s) requests so Cache.put never sees chrome-extension', () => {
    expect(source).toMatch(/isCacheableRequest/);
    expect(source).toMatch(/protocol === 'http:' \|\| protocol === 'https:'/);
    expect(source).toMatch(/if \(!isCacheableRequest\(event\.request\)\) return/);
  });

  it('never resolves respondWith with undefined when cache misses', () => {
    expect(source).toMatch(/matchOrNetworkError/);
    expect(source).toMatch(/cached \|\| Response\.error\(\)/);
    expect(source).not.toMatch(/\.catch\(\(\) => caches\.match\(event\.request\)\)/);
  });

  it('bumps CACHE_NAME when fetch/caching semantics change', () => {
    expect(source).toMatch(/cesar-gomez-portfolio-v8/);
  });
});
