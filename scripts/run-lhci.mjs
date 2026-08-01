/**
 * Generate (if needed), start the SSG+CSP server, run Lighthouse CI, then stop.
 *
 * Usage: pnpm test:perf
 * Env: PORT (default 4173), SKIP_GENERATE=1 to reuse existing .output/public
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const port = Number(process.env.PORT || 4173);
const baseUrl = `http://127.0.0.1:${port}`;
const publicDir = join(process.cwd(), process.env.NUXT_OUTPUT_DIR || '.output', 'public');

/** @param {string} cmd @param {string[]} args */
function run(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true, ...options });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`));
    });
  });
}

/** @param {import('node:child_process').ChildProcess} server */
async function waitForServer(server, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    if (server.exitCode !== null) {
      throw new Error('[run-lhci] SSG server exited before becoming ready');
    }
    try {
      const res = await fetch(`${baseUrl}/`);
      if (res.ok) return;
    } catch {
      // retry
    }
    await sleep(500);
  }
  throw new Error(`[run-lhci] Timed out waiting for ${baseUrl}`);
}

if (!process.env.SKIP_GENERATE && !existsSync(publicDir)) {
  console.log('[run-lhci] No artifact — running pnpm generate:netlify');
  await run('pnpm', ['run', 'generate:netlify'], {
    env: { ...process.env, NUXT_PUBLIC_CONTACT_PROVIDER: 'netlify' },
  });
}

const server = spawn('node', ['scripts/serve-ssg-with-csp.mjs'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: String(port) },
});

try {
  await waitForServer(server);
  console.log(`[run-lhci] Server ready at ${baseUrl}`);
  await run('pnpm', ['exec', 'lhci', 'autorun'], {
    env: { ...process.env, LHCI_BASE_URL: baseUrl },
  });
} finally {
  if (server.exitCode === null) {
    server.kill('SIGTERM');
  }
}
