const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const projectRoot = path.resolve(__dirname, '..');
const publicAssetsRoot = path.join(projectRoot, 'frontend', 'public', 'assets');
const manifestPath = path.join(projectRoot, 'r2-media-manifest.json');
const generatedMapPath = path.join(projectRoot, 'frontend', 'src', 'config', 'mediaObjects.js');
const scanRoots = [
  path.join(projectRoot, 'backend', 'data'),
  path.join(projectRoot, 'backend', 'server.js'),
  path.join(projectRoot, 'frontend', 'index.html'),
  path.join(projectRoot, 'frontend', 'src')
];
const sourceExtensions = new Set(['.css', '.html', '.js', '.jsx', '.json', '.ts', '.tsx']);
const mediaExtensions = new Set(['.avif', '.gif', '.jpg', '.jpeg', '.png', '.svg', '.webp']);
const mediaReferencePattern = /(?:\/assets\/)?((?:clubs|intro|lien-chi|map|youth-union)\/[A-Za-z0-9_./-]+\.(?:avif|gif|jpe?g|png|svg|webp))/gi;

function readExistingManifest() {
  if (!fs.existsSync(manifestPath)) return new Map();
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.assets)) {
    throw new Error('Unsupported or invalid existing R2 media manifest.');
  }
  return new Map(manifest.assets.map(asset => [asset.sourceKey, asset]));
}

function listFiles(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs.readdirSync(target, { withFileTypes: true })
    .flatMap(entry => listFiles(path.join(target, entry.name)));
}

function contentHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function versionedObjectKey(key, hash) {
  const extension = path.posix.extname(key);
  return `${key.slice(0, -extension.length)}.${hash.slice(0, 12)}${extension}`;
}

function categoryFor(key, runtimeReferenced) {
  if (!runtimeReferenced) return 'unused-or-offline';
  if (key === 'intro/uet.png') return 'ui-brand';
  return 'content-media';
}

function optimizationFor(key, size) {
  const extension = path.extname(key).toLowerCase();
  if (extension === '.svg') return 'keep-svg';
  if (size >= 2_000_000) return 'convert-photo-to-webp-before-upload';
  if (extension === '.png' && size >= 500_000) return 'review-transparency-then-webp';
  return 'keep-or-optimize-losslessly';
}

const referencedKeys = new Set();
for (const sourceFile of scanRoots.flatMap(listFiles)) {
  if (sourceFile === generatedMapPath || !sourceExtensions.has(path.extname(sourceFile).toLowerCase())) continue;
  const source = fs.readFileSync(sourceFile, 'utf8');
  for (const match of source.matchAll(mediaReferencePattern)) referencedKeys.add(match[1]);
}

const existingAssets = readExistingManifest();
const localAssets = listFiles(publicAssetsRoot)
  .filter(filePath => mediaExtensions.has(path.extname(filePath).toLowerCase()))
  .map(filePath => {
    const key = path.relative(publicAssetsRoot, filePath).split(path.sep).join('/');
    const sourceBytes = fs.statSync(filePath).size;
    const sha256 = contentHash(filePath);
    const runtimeReferenced = referencedKeys.has(key);
    const existing = existingAssets.get(key);
    const alreadyVerified = runtimeReferenced
      && existing?.sha256 === sha256
      && existing?.migrationStatus === 'verified-r2';
    return {
      sourcePath: `frontend/public/assets/${key}`,
      sourceKey: key,
      objectKey: versionedObjectKey(key, sha256),
      sha256,
      sourceBytes,
      sourcePresent: true,
      category: categoryFor(key, runtimeReferenced),
      runtimeReferenced,
      uploadRequired: runtimeReferenced,
      optimization: optimizationFor(key, sourceBytes),
      migrationStatus: runtimeReferenced
        ? (alreadyVerified ? 'verified-r2' : 'pending-upload-and-url-verification')
        : 'not-required'
    };
  });

const localKeys = new Set(localAssets.map(asset => asset.sourceKey));
const remoteOnlyAssets = [...referencedKeys]
  .filter(key => !localKeys.has(key))
  .map(key => {
    const existing = existingAssets.get(key);
    if (!existing
      || existing.uploadRequired !== true
      || !/^[a-f0-9]{64}$/.test(existing.sha256 || '')
      || !Number.isSafeInteger(existing.sourceBytes)
      || existing.sourceBytes < 0
      || typeof existing.objectKey !== 'string') {
      throw new Error(`Runtime media reference has no valid local source or verified manifest entry: ${key}`);
    }
    return {
      ...existing,
      sourcePresent: false,
      category: categoryFor(key, true),
      runtimeReferenced: true,
      uploadRequired: true
    };
  });

const assets = [...localAssets, ...remoteOnlyAssets]
  .sort((left, right) => left.sourceKey.localeCompare(right.sourceKey));

const requiredAssets = assets.filter(asset => asset.uploadRequired);
const pendingAssets = requiredAssets.filter(asset => asset.migrationStatus !== 'verified-r2');
const verifiedAssets = requiredAssets.filter(asset => asset.migrationStatus === 'verified-r2');
const presentAssets = assets.filter(asset => asset.sourcePresent);
const manifest = {
  schemaVersion: 1,
  generatedBy: 'npm run media:manifest',
  mediaBaseEnvironmentVariable: 'VITE_MEDIA_BASE_URL',
  localAssetsRetainedUntilVerified: pendingAssets.length > 0,
  summary: {
    managedAssetCount: assets.length,
    localAssetCount: presentAssets.length,
    localAssetBytes: presentAssets.reduce((sum, asset) => sum + asset.sourceBytes, 0),
    runtimeAssetCount: requiredAssets.length,
    runtimeAssetBytes: requiredAssets.reduce((sum, asset) => sum + asset.sourceBytes, 0),
    pendingUploadCount: pendingAssets.length,
    verifiedCount: verifiedAssets.length
  },
  assets
};

const versionMap = Object.fromEntries(requiredAssets.map(asset => [asset.sourceKey, asset.sha256.slice(0, 12)]));
const mapSource = `// Generated by npm run media:manifest. Do not edit by hand.\nexport const mediaVersions = Object.freeze(${JSON.stringify(versionMap, null, 2)});\n`;

fs.mkdirSync(path.dirname(generatedMapPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(generatedMapPath, mapSource);
console.log(`Media manifest: ${requiredAssets.length}/${assets.length} runtime assets; ${verifiedAssets.length} verified, ${pendingAssets.length} pending, ${presentAssets.length} local sources.`);
