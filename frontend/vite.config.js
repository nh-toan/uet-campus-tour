import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { mediaVersions } from './src/config/mediaObjects.js';

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '');
  let mediaBaseUrl;
  try {
    mediaBaseUrl = new URL(environment.VITE_MEDIA_BASE_URL || '');
  } catch {
    throw new Error('VITE_MEDIA_BASE_URL must be a valid HTTPS URL.');
  }
  if (mediaBaseUrl.protocol !== 'https:' || mediaBaseUrl.username || mediaBaseUrl.password) {
    throw new Error('VITE_MEDIA_BASE_URL must be a credential-free HTTPS URL.');
  }
  if (mediaBaseUrl.hostname.endsWith('.r2.cloudflarestorage.com')) {
    throw new Error('VITE_MEDIA_BASE_URL cannot use the private R2 S3 endpoint.');
  }
  if (mediaBaseUrl.hostname.endsWith('.r2.dev')) {
    console.warn('Building with r2.dev for staging/UAT; use an official R2 Custom Domain for public production.');
  }

  const faviconSourceKey = 'intro/uet.png';
  const faviconVersion = mediaVersions[faviconSourceKey];
  if (!faviconVersion) throw new Error(`Missing media version for ${faviconSourceKey}.`);
  const faviconExtensionIndex = faviconSourceKey.lastIndexOf('.');
  const faviconObjectKey = `${faviconSourceKey.slice(0, faviconExtensionIndex)}.${faviconVersion}${faviconSourceKey.slice(faviconExtensionIndex)}`;
  const faviconUrl = `${mediaBaseUrl.href.replace(/\/+$/, '')}/${faviconObjectKey}`;

  const mediaOriginHints = {
    name: 'media-origin-hints',
    transformIndexHtml: {
      order: 'pre',
      handler: () => [
        { tag: 'link', attrs: { rel: 'preconnect', href: mediaBaseUrl.origin }, injectTo: 'head-prepend' },
        { tag: 'link', attrs: { rel: 'dns-prefetch', href: `//${mediaBaseUrl.host}` }, injectTo: 'head-prepend' },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', href: faviconUrl }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: faviconUrl }, injectTo: 'head' }
      ]
    }
  };

  return {
    plugins: [react(), mediaOriginHints],
    server: {
      port: 5173,
      proxy: {
        '/api': 'http://127.0.0.1:3001'
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      copyPublicDir: false,
      sourcemap: false
    }
  };
});
