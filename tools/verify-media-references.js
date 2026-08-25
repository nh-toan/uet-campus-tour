const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const projectRoot = path.resolve(__dirname, '..');
const clubsPath = path.join(projectRoot, 'backend', 'data', 'clubs.json');
const serverPath = path.join(projectRoot, 'backend', 'server.js');
const manifestPath = path.join(projectRoot, 'r2-media-manifest.json');
const versionMapPath = path.join(projectRoot, 'frontend', 'src', 'config', 'mediaObjects.js');
const aliasMapPath = path.join(projectRoot, 'frontend', 'src', 'config', 'mediaAliases.js');

function readBackgroundConfiguration() {
  const source = fs.readFileSync(serverPath, 'utf8');
  const defaultMatch = source.match(/const DEFAULT_CLUB_BACKGROUND = '([^']+)'/);
  const mapMatch = source.match(/const CLUB_BACKGROUND_IMAGES = Object\.freeze\(\{([\s\S]*?)\}\);/);
  if (!defaultMatch || !mapMatch) throw new Error('Cannot read club background configuration from backend/server.js.');
  return {
    defaultBackground: defaultMatch[1],
    backgrounds: Object.fromEntries([...mapMatch[1].matchAll(/'([^']+)': '([^']+)'/g)].map(match => [match[1], match[2]]))
  };
}

function fail(failures) {
  console.error(JSON.stringify({ clubMediaReferenceFailures: failures }, null, 2));
  process.exit(1);
}

async function main() {
  const clubs = JSON.parse(fs.readFileSync(clubsPath, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const [{ mediaVersions }, { mediaKeyAliases, resolveMediaSourceKey }] = await Promise.all([
    import(pathToFileURL(versionMapPath).href),
    import(pathToFileURL(aliasMapPath).href)
  ]);
  const { defaultBackground, backgrounds } = readBackgroundConfiguration();
  const manifestByKey = new Map(manifest.assets.map(asset => [asset.sourceKey, asset]));
  const failures = [];
  const ids = new Set();
  const counts = { logo: 0, cover: 0, gallery: 0 };
  let mediaBaseUrl;

  try {
    mediaBaseUrl = new URL(String(process.env.VITE_MEDIA_BASE_URL || '').trim());
    if (mediaBaseUrl.protocol !== 'https:' || mediaBaseUrl.username || mediaBaseUrl.password) throw new Error();
  } catch {
    throw new Error('VITE_MEDIA_BASE_URL must be a credential-free HTTPS URL for media reference verification.');
  }

  if (!Array.isArray(clubs) || clubs.length !== 24) failures.push({ scope: 'clubs', reason: `expected 24 clubs, received ${Array.isArray(clubs) ? clubs.length : 'non-array'}` });

  function verifyReference(club, kind, requestedKey) {
    counts[kind] += 1;
    if (typeof requestedKey !== 'string' || !requestedKey) {
      failures.push({ club: club.id, kind, requestedKey, reason: 'empty runtime source key' });
      return;
    }
    if (mediaKeyAliases[requestedKey]) {
      failures.push({ club: club.id, kind, requestedKey, reason: `obsolete source key; use ${mediaKeyAliases[requestedKey]}` });
      return;
    }
    const version = mediaVersions[requestedKey];
    const asset = manifestByKey.get(requestedKey);
    if (!version) failures.push({ club: club.id, kind, requestedKey, reason: 'missing from frontend media version map' });
    if (!asset) failures.push({ club: club.id, kind, requestedKey, reason: 'missing from R2 media manifest' });
    if (!version || !asset) return;
    if (!asset.runtimeReferenced || !asset.uploadRequired) failures.push({ club: club.id, kind, requestedKey, reason: 'manifest entry is not a runtime asset' });
    if (asset.sha256.slice(0, 12) !== version) failures.push({ club: club.id, kind, requestedKey, reason: 'version map hash does not match manifest SHA-256' });
    const resolvedUrl = new URL(asset.objectKey, `${mediaBaseUrl.href.replace(/\/+$/, '')}/`).href;
    if (!resolvedUrl || resolvedUrl === mediaBaseUrl.href) failures.push({ club: club.id, kind, requestedKey, reason: 'resolved media URL is empty or invalid' });
  }

  for (const club of Array.isArray(clubs) ? clubs : []) {
    if (ids.has(club.id)) failures.push({ club: club.id, reason: 'duplicate club id' });
    ids.add(club.id);
    verifyReference(club, 'logo', club.logoUrl);
    verifyReference(club, 'cover', club.backgroundImage || backgrounds[club.id] || defaultBackground);
    for (const image of Array.isArray(club.activityImages) ? club.activityImages : []) verifyReference(club, 'gallery', image?.src);
  }

  for (const [legacyKey, currentKey] of Object.entries(mediaKeyAliases)) {
    if (resolveMediaSourceKey(legacyKey) !== currentKey) failures.push({ legacyKey, currentKey, reason: 'compatibility resolver returned the wrong source key' });
    if (!mediaVersions[currentKey] || !manifestByKey.has(currentKey)) failures.push({ legacyKey, currentKey, reason: 'compatibility alias target does not resolve' });
  }

  if (failures.length) fail(failures);
  const total = counts.logo + counts.cover + counts.gallery;
  console.log(`Verified ${clubs.length}/${clubs.length} clubs: ${counts.logo} logos, ${counts.cover} covers, ${counts.gallery} gallery images; ${total}/${total} runtime media references resolve to versioned manifest objects.`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
