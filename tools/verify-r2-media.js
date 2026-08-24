const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const projectRoot = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(projectRoot, 'r2-media-manifest.json'), 'utf8'));
const baseUrl = (process.env.VITE_MEDIA_BASE_URL || '').trim().replace(/\/+$/, '');
const concurrency = 4;
const cacheControl = 'public, max-age=31536000, immutable';
const contentTypes = new Map([
  ['.avif', 'image/avif'],
  ['.gif', 'image/gif'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp']
]);

if (!/^https:\/\//i.test(baseUrl)) {
  console.error('VITE_MEDIA_BASE_URL must be an HTTPS R2 custom domain.');
  process.exit(1);
}
try {
  const hostname = new URL(baseUrl).hostname;
  if (hostname.endsWith('.r2.cloudflarestorage.com')) {
    throw new Error('VITE_MEDIA_BASE_URL cannot use the private R2 S3 endpoint.');
  }
  if (hostname.endsWith('.r2.dev')) {
    console.warn('R2 integrity verification may proceed for staging, but a custom domain is still required before final production deployment.');
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const pending = manifest.assets.filter(asset => asset.uploadRequired);
const failures = [];
let nextIndex = 0;

function hasImmutableCachePolicy(value) {
  const directives = new Set(String(value || '').toLowerCase().split(',').map(part => part.trim()));
  return directives.has('public') && directives.has('max-age=31536000') && directives.has('immutable');
}

async function worker() {
  while (nextIndex < pending.length) {
    const asset = pending[nextIndex++];
    const url = `${baseUrl}/${asset.objectKey}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept-Encoding': 'identity' },
        redirect: 'error',
        signal: AbortSignal.timeout(120_000)
      });
      const actualContentType = String(response.headers.get('content-type') || '').split(';', 1)[0].trim().toLowerCase();
      const expectedContentType = contentTypes.get(path.extname(asset.objectKey).toLowerCase());
      const reasons = [];
      if (!response.ok) reasons.push(`HTTP ${response.status}`);
      if (actualContentType !== expectedContentType) reasons.push(`content-type ${actualContentType || 'missing'} (expected ${expectedContentType})`);
      if (response.headers.get('content-length') !== String(asset.sourceBytes)) reasons.push('content-length mismatch');
      if (!hasImmutableCachePolicy(response.headers.get('cache-control'))) reasons.push(`cache-control mismatch (expected ${cacheControl})`);
      if (response.ok && response.body) {
        const digest = crypto.createHash('sha256');
        let receivedBytes = 0;
        for await (const chunk of response.body) {
          receivedBytes += chunk.length;
          digest.update(chunk);
        }
        if (receivedBytes !== asset.sourceBytes) reasons.push('downloaded byte count mismatch');
        if (digest.digest('hex') !== asset.sha256) reasons.push('sha256 mismatch');
      } else if (response.ok) {
        reasons.push('response body missing');
      }
      if (reasons.length) failures.push({ objectKey: asset.objectKey, reasons });
    } catch (error) {
      failures.push({ objectKey: asset.objectKey, error: error instanceof Error ? error.message : String(error) });
    }
  }
}

Promise.all(Array.from({ length: concurrency }, worker)).then(() => {
  if (failures.length) {
    console.error(JSON.stringify({ checked: pending.length, failures }, null, 2));
    process.exitCode = 1;
    return;
  }
  let manifestChanged = false;
  for (const asset of pending) {
    if (asset.migrationStatus !== 'verified-r2') {
      asset.migrationStatus = 'verified-r2';
      manifestChanged = true;
    }
  }
  const verifiedCount = pending.length;
  if (manifest.localAssetsRetainedUntilVerified !== false) {
    manifest.localAssetsRetainedUntilVerified = false;
    manifestChanged = true;
  }
  if (manifest.summary.pendingUploadCount !== 0 || manifest.summary.verifiedCount !== verifiedCount) {
    manifest.summary.pendingUploadCount = 0;
    manifest.summary.verifiedCount = verifiedCount;
    manifestChanged = true;
  }
  if (manifestChanged) fs.writeFileSync(path.join(projectRoot, 'r2-media-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Verified ${pending.length}/${pending.length} R2 media URLs with valid content type, length, and immutable cache metadata at ${baseUrl}.`);
});
