const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const crypto = require('node:crypto');

const projectRoot = path.resolve(__dirname, '..');
const publicAssetsRoot = path.join(projectRoot, 'frontend', 'public', 'assets');
const manifestPath = path.join(projectRoot, 'r2-media-manifest.json');
const cacheControl = 'public, max-age=31536000, immutable';
const emptyPayloadHash = crypto.createHash('sha256').update('').digest('hex');
const requiredEnvironmentVariables = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'R2_ENDPOINT',
  'R2_BUCKET',
  'VITE_MEDIA_BASE_URL'
];
const contentTypes = new Map([
  ['.avif', 'image/avif'],
  ['.gif', 'image/gif'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp']
]);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readConfiguration() {
  const missing = requiredEnvironmentVariables.filter(name => !String(process.env[name] || '').trim());
  if (missing.length) {
    fail(`Missing required environment variables: ${missing.join(', ')}`);
  }

  let endpoint;
  let mediaBaseUrl;
  try {
    endpoint = new URL(process.env.R2_ENDPOINT.trim());
    mediaBaseUrl = new URL(process.env.VITE_MEDIA_BASE_URL.trim());
  } catch {
    fail('R2_ENDPOINT and VITE_MEDIA_BASE_URL must be valid URLs.');
  }

  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) {
    fail('R2_ENDPOINT must be a credential-free HTTPS URL without query parameters or fragments.');
  }
  if (!endpoint.hostname.endsWith('.r2.cloudflarestorage.com') || !['', '/'].includes(endpoint.pathname)) {
    fail('R2_ENDPOINT must be a Cloudflare R2 S3 endpoint with no path.');
  }
  if (mediaBaseUrl.protocol !== 'https:' || mediaBaseUrl.username || mediaBaseUrl.password || mediaBaseUrl.search || mediaBaseUrl.hash) {
    fail('VITE_MEDIA_BASE_URL must be a credential-free HTTPS custom-domain URL.');
  }
  if (mediaBaseUrl.hostname.endsWith('.r2.cloudflarestorage.com')) {
    fail('VITE_MEDIA_BASE_URL cannot use the private R2 S3 endpoint.');
  }
  if (mediaBaseUrl.hostname.endsWith('.r2.dev')) {
    console.warn('Using r2.dev for staging/UAT; an official R2 Custom Domain is still required before public production.');
  }

  const bucket = process.env.R2_BUCKET.trim();
  if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket)) {
    fail('R2_BUCKET must be a 3-63 character lowercase bucket name using letters, numbers, or hyphens.');
  }

  const concurrencyValue = Number(process.env.R2_UPLOAD_CONCURRENCY || 3);
  if (!Number.isInteger(concurrencyValue) || concurrencyValue < 1 || concurrencyValue > 8) {
    fail('R2_UPLOAD_CONCURRENCY must be an integer from 1 to 8.');
  }

  return Object.freeze({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: String(process.env.AWS_SESSION_TOKEN || '').trim(),
    endpoint,
    bucket,
    concurrency: concurrencyValue,
    allowReplace: process.env.R2_UPLOAD_ALLOW_REPLACE === '1'
  });
}

function isSafeObjectKey(value) {
  return typeof value === 'string'
    && !value.startsWith('/')
    && !value.includes('\\')
    && /^[A-Za-z0-9_./-]+$/.test(value)
    && value.split('/').every(segment => segment && segment !== '.' && segment !== '..');
}

function readManifest() {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    fail(`Cannot read r2-media-manifest.json: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.assets)) {
    fail('Unsupported or invalid R2 media manifest.');
  }

  const runtimeAssets = manifest.assets.filter(asset => asset.uploadRequired);
  const objectKeys = new Set();
  for (const asset of runtimeAssets) {
    if (!isSafeObjectKey(asset.objectKey)
      || typeof asset.sourcePath !== 'string'
      || !/^[a-f0-9]{64}$/.test(asset.sha256)
      || !Number.isSafeInteger(asset.sourceBytes)
      || asset.sourceBytes < 0) {
      fail(`Invalid upload manifest entry: ${String(asset.objectKey || asset.sourcePath || 'unknown')}`);
    }
    if (objectKeys.has(asset.objectKey)) fail(`Duplicate R2 object key: ${asset.objectKey}`);
    objectKeys.add(asset.objectKey);

    const expectedContentType = contentTypes.get(path.extname(asset.objectKey).toLowerCase());
    if (!expectedContentType) fail(`Unsupported media type: ${asset.objectKey}`);
  }

  const assets = runtimeAssets.filter(asset => asset.migrationStatus !== 'verified-r2');
  for (const asset of assets) {
    const sourcePath = path.resolve(projectRoot, asset.sourcePath);
    const relativeSourcePath = path.relative(publicAssetsRoot, sourcePath);
    if (path.isAbsolute(asset.sourcePath) || relativeSourcePath.startsWith('..') || path.isAbsolute(relativeSourcePath)) {
      fail(`Manifest source path escapes frontend/public/assets: ${asset.sourcePath}`);
    }
    if (asset.sourcePresent === false || !fs.existsSync(sourcePath)) {
      fail(`Pending upload has no local source: ${asset.sourcePath}`);
    }
  }
  return assets;
}

function encodePathSegment(value) {
  return encodeURIComponent(value).replace(/[!'()*]/g, character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
}

function canonicalObjectPath(endpoint, bucket, objectKey) {
  const prefix = endpoint.pathname.split('/').filter(Boolean);
  const segments = [...prefix, bucket, ...objectKey.split('/')];
  return `/${segments.map(encodePathSegment).join('/')}`;
}

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function hmac(key, value, encoding) {
  return crypto.createHmac('sha256', key).update(value).digest(encoding);
}

function signingHeaders(configuration, method, requestPath, payloadHash, additionalHeaders = {}) {
  const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = timestamp.slice(0, 8);
  const defaultPort = configuration.endpoint.port || '443';
  const host = defaultPort === '443' ? configuration.endpoint.hostname : `${configuration.endpoint.hostname}:${defaultPort}`;
  const headers = {
    host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': timestamp,
    ...additionalHeaders
  };
  if (configuration.sessionToken) headers['x-amz-security-token'] = configuration.sessionToken;

  const headerNames = Object.keys(headers).sort();
  const canonicalHeaders = headerNames
    .map(name => `${name}:${String(headers[name]).trim().replace(/\s+/g, ' ')}\n`)
    .join('');
  const signedHeaderNames = headerNames.join(';');
  const canonicalRequest = [method, requestPath, '', canonicalHeaders, signedHeaderNames, payloadHash].join('\n');
  const scope = `${date}/auto/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', timestamp, scope, hash(canonicalRequest)].join('\n');
  const dateKey = hmac(`AWS4${configuration.secretAccessKey}`, date);
  const regionKey = hmac(dateKey, 'auto');
  const serviceKey = hmac(regionKey, 's3');
  const signingKey = hmac(serviceKey, 'aws4_request');
  const signature = hmac(signingKey, stringToSign, 'hex');

  return {
    ...headers,
    authorization: `AWS4-HMAC-SHA256 Credential=${configuration.accessKeyId}/${scope}, SignedHeaders=${signedHeaderNames}, Signature=${signature}`
  };
}

function request(configuration, method, asset, attempt) {
  const requestPath = canonicalObjectPath(configuration.endpoint, configuration.bucket, asset.objectKey);
  const expectedContentType = contentTypes.get(path.extname(asset.objectKey).toLowerCase());
  const additionalHeaders = method === 'PUT' ? {
    'cache-control': cacheControl,
    'content-type': expectedContentType,
    'x-amz-meta-sha256': asset.sha256,
    'x-amz-meta-source-bytes': String(asset.sourceBytes)
  } : {};
  const payloadHash = method === 'PUT' ? asset.sha256 : emptyPayloadHash;
  const headers = signingHeaders(configuration, method, requestPath, payloadHash, additionalHeaders);
  if (method === 'PUT') headers['content-length'] = String(asset.sourceBytes);

  return new Promise((resolve, reject) => {
    const outgoing = https.request({
      protocol: 'https:',
      hostname: configuration.endpoint.hostname,
      port: configuration.endpoint.port || 443,
      method,
      path: requestPath,
      headers,
      timeout: 120_000
    }, response => {
      const chunks = [];
      let receivedBytes = 0;
      response.on('data', chunk => {
        receivedBytes += chunk.length;
        if (receivedBytes <= 16_384) chunks.push(chunk);
      });
      response.on('end', () => resolve({
        statusCode: response.statusCode || 0,
        headers: response.headers,
        body: Buffer.concat(chunks).toString('utf8').trim().slice(0, 2000)
      }));
    });
    outgoing.on('timeout', () => outgoing.destroy(new Error(`R2 ${method} timed out`)));
    outgoing.on('error', reject);

    if (method === 'PUT') {
      const sourcePath = path.resolve(projectRoot, asset.sourcePath);
      const source = fs.createReadStream(sourcePath);
      source.on('error', reject);
      source.pipe(outgoing);
      return;
    }
    outgoing.end();
  }).catch(error => {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${method} ${asset.objectKey} attempt ${attempt} failed: ${message}`);
  });
}

function shouldRetry(statusCode) {
  return statusCode === 408 || statusCode === 429 || statusCode >= 500;
}

async function withRetry(operation, label) {
  const delays = [0, 500, 1500, 3500];
  let lastError;
  for (let attempt = 1; attempt <= delays.length; attempt += 1) {
    if (delays[attempt - 1]) await new Promise(resolve => setTimeout(resolve, delays[attempt - 1]));
    try {
      const result = await operation(attempt);
      if (!shouldRetry(result.statusCode) || attempt === delays.length) return result;
      lastError = new Error(`${label} returned HTTP ${result.statusCode}`);
    } catch (error) {
      lastError = error;
      if (attempt === delays.length) throw error;
    }
  }
  throw lastError;
}

async function hashFile(filePath) {
  const digest = crypto.createHash('sha256');
  const source = fs.createReadStream(filePath);
  for await (const chunk of source) digest.update(chunk);
  return digest.digest('hex');
}

function matchesExpectedObject(response, asset) {
  const contentType = String(response.headers['content-type'] || '').split(';', 1)[0].trim().toLowerCase();
  const expectedContentType = contentTypes.get(path.extname(asset.objectKey).toLowerCase());
  return response.statusCode === 200
    && response.headers['x-amz-meta-sha256'] === asset.sha256
    && response.headers['x-amz-meta-source-bytes'] === String(asset.sourceBytes)
    && response.headers['content-length'] === String(asset.sourceBytes)
    && String(response.headers['cache-control'] || '').trim() === cacheControl
    && contentType === expectedContentType;
}

function responseError(label, response) {
  return new Error(`${label} returned HTTP ${response.statusCode}`);
}

async function uploadAsset(configuration, asset) {
  const sourcePath = path.resolve(projectRoot, asset.sourcePath);
  let stat;
  try {
    stat = fs.statSync(sourcePath);
  } catch {
    throw new Error(`Local source is missing: ${asset.sourcePath}`);
  }
  if (!stat.isFile() || stat.size !== asset.sourceBytes) {
    throw new Error(`Local source size differs from manifest: ${asset.sourcePath}`);
  }
  const actualHash = await hashFile(sourcePath);
  if (actualHash !== asset.sha256) {
    throw new Error(`Local source hash differs from manifest; run npm run media:manifest: ${asset.sourcePath}`);
  }

  const current = await withRetry(
    attempt => request(configuration, 'HEAD', asset, attempt),
    `HEAD ${asset.objectKey}`
  );
  if (matchesExpectedObject(current, asset)) return 'skipped';
  if (current.statusCode === 200 && !configuration.allowReplace) {
    throw new Error(`R2 object already exists but does not match verified metadata: ${asset.objectKey}. Inspect it first or set R2_UPLOAD_ALLOW_REPLACE=1 explicitly.`);
  }
  if (current.statusCode !== 404 && current.statusCode !== 200) {
    throw responseError(`HEAD ${asset.objectKey}`, current);
  }

  const uploaded = await withRetry(
    attempt => request(configuration, 'PUT', asset, attempt),
    `PUT ${asset.objectKey}`
  );
  if (![200, 201].includes(uploaded.statusCode)) throw responseError(`PUT ${asset.objectKey}`, uploaded);

  const verified = await withRetry(
    attempt => request(configuration, 'HEAD', asset, attempt),
    `HEAD ${asset.objectKey}`
  );
  if (!matchesExpectedObject(verified, asset)) {
    throw new Error(`Uploaded object metadata verification failed: ${asset.objectKey}`);
  }
  return 'uploaded';
}

async function main() {
  const configuration = readConfiguration();
  const assets = readManifest();
  if (!assets.length) {
    console.log('R2 upload complete: no pending local media.');
    return;
  }

  let nextIndex = 0;
  let completed = 0;
  let uploaded = 0;
  let skipped = 0;
  const failures = [];

  async function worker() {
    while (nextIndex < assets.length && failures.length === 0) {
      const asset = assets[nextIndex++];
      try {
        const result = await uploadAsset(configuration, asset);
        if (result === 'uploaded') uploaded += 1;
        else skipped += 1;
        completed += 1;
        console.log(`[${completed}/${assets.length}] ${result.toUpperCase()} ${asset.objectKey}`);
      } catch (error) {
        failures.push(error instanceof Error ? error.message : String(error));
      }
    }
  }

  await Promise.all(Array.from({ length: configuration.concurrency }, worker));
  if (failures.length) fail(`R2 upload stopped safely: ${failures[0]}`);
  console.log(`R2 upload complete: ${uploaded} uploaded, ${skipped} already verified, ${assets.length} total.`);
}

main().catch(error => fail(error instanceof Error ? error.message : String(error)));
