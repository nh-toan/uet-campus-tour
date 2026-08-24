import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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

  return {
    plugins: [react()],
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
