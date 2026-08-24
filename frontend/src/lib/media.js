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
if (!mediaBaseUrl) throw new Error('VITE_MEDIA_BASE_URL must be a valid HTTPS URL.');

function normalizeMediaKey(value) {
  const key = String(value || '').trim().replace(/^\/assets\//, '').replace(/^\/+/, '');
  if (!key || key.includes('..') || !/^[A-Za-z0-9_./-]+$/.test(key)) return '';
  return key;
}

export function mediaUrl(value) {
  const sourceKey = normalizeMediaKey(value);
  if (!sourceKey) return '';
  const version = mediaVersions[sourceKey];
  if (!version) return `${mediaBaseUrl}/${sourceKey}`;
  const extensionIndex = sourceKey.lastIndexOf('.');
  const objectKey = `${sourceKey.slice(0, extensionIndex)}.${version}${sourceKey.slice(extensionIndex)}`;
  return `${mediaBaseUrl}/${objectKey}`;
}

export function applyMediaCssVariables() {
  const root = document.documentElement;
  root.style.setProperty('--media-aerial-campus', `url("${mediaUrl('map/aerial-campus.jpg')}")`);
  root.style.setProperty('--media-map-tech-hero', `url("${mediaUrl('map/map_tech_hero.png')}")`);
}
