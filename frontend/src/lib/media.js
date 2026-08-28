import { resolveMediaSourceKey } from '../config/mediaAliases';
import { mediaVersions } from '../config/mediaObjects';

function getMediaBaseUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    return url.protocol === 'https:' ? url.href.replace(/\/+$/, '') : '';
  } catch {
    return '';
  }
}

const mediaBaseUrl = getMediaBaseUrl(import.meta.env.VITE_MEDIA_BASE_URL);
const useLocalDevelopmentMedia = import.meta.env.DEV && !mediaBaseUrl;
if (!mediaBaseUrl && !useLocalDevelopmentMedia) {
  throw new Error('VITE_MEDIA_BASE_URL must be a valid HTTPS URL.');
}

function normalizeMediaKey(value) {
  const key = String(value || '').trim().replace(/^\/assets\//, '').replace(/^\/+/, '');
  if (!key || key.includes('..') || !/^[A-Za-z0-9_./-]+$/.test(key)) return '';
  return key;
}

export function mediaUrl(value) {
  const directLocalPath = String(value || '').trim();
  if (/^\/[A-Za-z0-9_./-]+$/.test(directLocalPath) && !directLocalPath.includes('..')) return directLocalPath;
  const requestedKey = normalizeMediaKey(value);
  if (!requestedKey) return '';
  const sourceKey = resolveMediaSourceKey(requestedKey);
  if (useLocalDevelopmentMedia) return `/assets/${sourceKey}`;
  const version = mediaVersions[sourceKey];
  if (!version) throw new Error(`Unresolved runtime media key: ${requestedKey}`);
  const extensionIndex = sourceKey.lastIndexOf('.');
  const objectKey = `${sourceKey.slice(0, extensionIndex)}.${version}${sourceKey.slice(extensionIndex)}`;
  return `${mediaBaseUrl}/${objectKey}`;
}

export function applyMediaCssVariables() {
  const root = document.documentElement;
  root.style.setProperty('--media-aerial-campus', `url("${mediaUrl('map/aerial-campus.webp')}")`);
  root.style.setProperty('--media-map-tech-hero', `url("${mediaUrl('map/map_tech_hero.webp')}")`);
}
