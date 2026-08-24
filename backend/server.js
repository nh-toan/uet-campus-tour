const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || '127.0.0.1';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ROOT_DIRECTORY = __dirname;
const FRONTEND_DIRECTORY = path.resolve(ROOT_DIRECTORY, '..', 'frontend', 'dist');
const DATA_DIRECTORY = path.join(ROOT_DIRECTORY, 'data');
const LIEN_CHI_FILE = path.join(DATA_DIRECTORY, 'lien-chi.json');
const CLUBS_FILE = path.join(DATA_DIRECTORY, 'clubs.json');
const APP_ROUTES = new Set(['/', '/gioi-thieu', '/ban-do', '/doan-thanh-nien-hoi-sinh-vien', '/lien-chi', '/cau-lac-bo']);
const MIME_TYPES = { '.avif': 'image/avif', '.css': 'text/css; charset=utf-8', '.gif': 'image/gif', '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2' };
const CLUB_CATEGORIES = new Set(['academic', 'tech', 'art', 'sport', 'media', 'community']);
const CACHEABLE_STATIC_EXTENSIONS = new Set(['.avif', '.gif', '.ico', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.woff', '.woff2']);
const VITE_HASHED_ASSET_PATTERN = /-[a-zA-Z0-9_-]{8,}\.(?:css|js)$/;
const PUBLIC_API_CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';
const IMMUTABLE_ASSET_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const STATIC_ASSET_CACHE_CONTROL = 'public, max-age=86400';
const REVALIDATE_CACHE_CONTROL = 'no-cache';
const DEFAULT_CLUB_BACKGROUND = 'clubs/backgrounds/default.jpg';
const CLUB_BACKGROUND_IMAGES = Object.freeze({
  'clb-nghe-thuat': 'clubs/backgrounds/clb-nghe-thuat.jpg',
  'clb-van-dong-hien-mau': 'clubs/backgrounds/clb-van-dong-hien-mau.jpg',
  'clb-nguon-nhan-luc': 'clubs/backgrounds/clb-nguon-nhan-luc.jpg',
  'clb-thu-vien-hoi-sinh-vien': 'clubs/backgrounds/clb-thu-vien-hoi-sinh-vien.jpg',
  'clb-nhay-co-dong': 'clubs/backgrounds/clb-nhay-co-dong.jpg',
  'clb-cau-long': 'clubs/backgrounds/clb-cau-long.jpg',
  'clb-bong-ro': 'clubs/backgrounds/clb-bong-ro.jpg',
  'clb-thuyet-trinh': 'clubs/backgrounds/clb-thuyet-trinh.jpg',
  'clb-hang-khong-vu-tru': 'clubs/backgrounds/clb-hang-khong-vu-tru.png',
  'clb-tieng-anh': 'clubs/backgrounds/clb-tieng-anh.jpg',
  'clb-tieng-nhat': 'clubs/backgrounds/clb-tieng-nhat.jpg',
  'clb-dien-tu-va-tu-dong-hoa': 'clubs/backgrounds/clb-dien-tu-va-tu-dong-hoa.png',
  'clb-robotics': 'clubs/backgrounds/clb-robotics.jpg',
  'clb-ly-luan-tre': 'clubs/backgrounds/clb-ly-luan-tre.jpg',
  'clb-thiet-ke-he-thong-va-vi-mach': 'clubs/backgrounds/clb-thiet-ke-he-thong-va-vi-mach.jpg',
  'clb-sinh-vien-5-tot': 'clubs/backgrounds/clb-sinh-vien-5-tot.png',
  'clb-ho-tro-sinh-vien': 'clubs/backgrounds/clb-ho-tro-sinh-vien.jpg'
});

let publicDataCache = null;

function normalizeMediaKey(value, pattern) {
  const key = typeof value === 'string' ? value.trim().replace(/^\/assets\//, '') : '';
  return pattern.test(key) ? key : '';
}
function normalizeClubBackground(value) { return normalizeMediaKey(value, /^clubs\/backgrounds\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i); }
function normalizeText(value, field, maximum, required = false) { const text = typeof value === 'string' ? value.trim() : ''; if (required && !text) throw new Error(`${field} là bắt buộc.`); if (text.length > maximum) throw new Error(`${field} tối đa ${maximum} ký tự.`); return text; }
function normalizeColor(value, fallback) { const color = typeof value === 'string' ? value.trim() : ''; if (!color) return fallback; if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error('Màu sắc phải có định dạng #RRGGBB.'); return color.toLowerCase(); }
function normalizeLink(value) { const link = typeof value === 'string' ? value.trim() : ''; if (!link) return ''; try { return ['http:', 'https:'].includes(new URL(link).protocol) ? link : ''; } catch { return ''; } }
function normalizePublicLogo(value, directory) { return normalizeMediaKey(value, new RegExp(`^${directory}\/[a-zA-Z0-9_-]+\\.(svg|png|webp|jpe?g)$`, 'i')); }
function normalizeLienChiBackground(value) { return normalizeMediaKey(value, /^lien-chi\/backgrounds\/[a-z0-9-]+\.jpe?g$/i); }
function normalizeParagraphs(value, label) { return (Array.isArray(value) ? value : []).map(item => ({ text: normalizeText(item?.text, label, 4000), isBullet: item?.isBullet === true })).filter(item => item.text); }
const CLUB_SECTION_TITLES = ['Giới thiệu', 'Hoạt động nổi bật', 'Cơ cấu tổ chức', 'Thành tích'];
function normalizeClubSections(value) {
  const source = Array.isArray(value) ? value : [];
  return CLUB_SECTION_TITLES.map(title => {
    const section = source.find(item => item?.title === title);
    if (!section) return null;
    const items = normalizeParagraphs(section.items, `Nội dung ${title}`);
    return items.length ? { title, items } : null;
  }).filter(Boolean);
}
function normalizeLienChi(input, index = 0) {
  const source = input && typeof input === 'object' ? input : {};
  return { id: typeof source.id === 'string' && /^[a-z0-9-]+$/.test(source.id) ? source.id : `lien-chi-${index + 1}`, sortOrder: Number.isInteger(source.sortOrder) ? source.sortOrder : index + 1, name: normalizeText(source.name, 'Tên Liên chi', 160, true), shortName: normalizeText(source.shortName, 'Tên viết tắt', 80), monogram: normalizeText(source.monogram, 'Chữ lồng logo', 6), unitType: ['Khoa', 'Viện'].includes(source.unitType) ? source.unitType : 'Khoa', logoUrl: normalizePublicLogo(source.logoUrl, 'lien-chi'), backgroundImage: normalizeLienChiBackground(source.backgroundImage), accentColor: normalizeColor(source.accentColor, '#087ea4'), fanpageUrl: normalizeLink(source.fanpageUrl), summary: normalizeText(source.summary || source.description, 'Câu dẫn Liên chi', 400), paragraphs: normalizeParagraphs(source.paragraphs, 'Đoạn giới thiệu Liên chi') };
}
function normalizeClubActivityImages(value, clubId) {
  const route = new RegExp(`^clubs/activity/${clubId}/[a-z0-9-]+\\.(jpg|jpeg|png|webp)$`, 'i');
  return (Array.isArray(value) ? value : []).map(item => {
    const src = normalizeMediaKey(item?.src, route);
    const alt = typeof item?.alt === 'string' ? item.alt.trim().slice(0, 240) : '';
    return src && alt ? { src, alt } : null;
  }).filter(Boolean).slice(0, 20);
}
function normalizeClub(input, index) {
  const id = typeof input?.id === 'string' && /^[a-z0-9-]+$/.test(input.id) ? input.id : `clb-${index + 1}`;
  const paragraphs = normalizeParagraphs(input?.paragraphs, 'Đoạn giới thiệu câu lạc bộ');
  const sections = normalizeClubSections(input?.sections);
  return { id, sortOrder: Number.isInteger(input?.sortOrder) ? input.sortOrder : index + 1, name: normalizeText(input?.name, 'Tên câu lạc bộ', 160, true), shortName: normalizeText(input?.shortName, 'Tên viết tắt', 80), monogram: normalizeText(input?.monogram, 'Chữ lồng logo', 6), logoUrl: normalizePublicLogo(input?.logoUrl, 'clubs'), backgroundImage: normalizeClubBackground(input?.backgroundImage) || CLUB_BACKGROUND_IMAGES[id] || DEFAULT_CLUB_BACKGROUND, accentColor: normalizeColor(input?.accentColor, '#087ea4'), category: CLUB_CATEGORIES.has(input?.category) ? input.category : 'community', governingBody: normalizeText(input?.governingBody, 'Đơn vị chủ quản', 200), fanpageUrl: normalizeLink(input?.fanpageUrl), summary: normalizeText(input?.summary, 'Câu dẫn', 400), sections: sections.length ? sections : (paragraphs.length ? [{ title: 'Giới thiệu', items: paragraphs }] : []), activityImages: normalizeClubActivityImages(input?.activityImages, id), paragraphs };
}
async function readJson(filePath) { return JSON.parse(await fs.readFile(filePath, 'utf8')); }
async function readLienChi() { const items = await readJson(LIEN_CHI_FILE); if (!Array.isArray(items)) throw new Error('Dữ liệu Liên chi không hợp lệ.'); return items.map(normalizeLienChi).sort((a, b) => a.sortOrder - b.sortOrder); }
async function readClubs() { const items = await readJson(CLUBS_FILE); if (!Array.isArray(items)) throw new Error('Dữ liệu câu lạc bộ không hợp lệ.'); return items.map(normalizeClub).sort((a, b) => a.sortOrder - b.sortOrder); }
function createJsonSnapshot(items) {
  const body = JSON.stringify(items);
  return Object.freeze({ body, etag: `"${crypto.createHash('sha256').update(body).digest('base64url')}"` });
}
async function loadPublicDataCache() {
  const [lienChi, clubs] = await Promise.all([readLienChi(), readClubs()]);
  publicDataCache = Object.freeze({ lienChi: createJsonSnapshot(lienChi), clubs: createJsonSnapshot(clubs) });
}

function getMediaOrigin() {
  try {
    const url = new URL(process.env.VITE_MEDIA_BASE_URL || '');
    return url.protocol === 'https:' ? url.origin : '';
  } catch {
    return '';
  }
}
function getSecurityHeaders() {
  const mediaOrigin = getMediaOrigin();
  const imageSources = ["'self'", 'data:', mediaOrigin].filter(Boolean).join(' ');
  const headers = {
    'Content-Security-Policy': `default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' https://fonts.gstatic.com; form-action 'self'; frame-ancestors 'self'; frame-src https://uet.vnu.asia; img-src ${imageSources}; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=(), fullscreen=(self "https://uet.vnu.asia")',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN'
  };
  if (IS_PRODUCTION) headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  return headers;
}
const SECURITY_HEADERS = Object.freeze(getSecurityHeaders());
function applySecurityHeaders(response) { for (const [name, value] of Object.entries(SECURITY_HEADERS)) response.setHeader(name, value); }
function sendJson(request, response, statusCode, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body), 'Cache-Control': 'no-store', ...extraHeaders });
  response.end(request.method === 'HEAD' ? undefined : body);
}
function sendPublicJson(request, response, snapshot) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': PUBLIC_API_CACHE_CONTROL, ETag: snapshot.etag, Vary: 'Accept-Encoding' };
  if (request.headers['if-none-match'] === snapshot.etag) {
    response.writeHead(304, headers);
    return response.end();
  }
  response.writeHead(200, { ...headers, 'Content-Length': Buffer.byteLength(snapshot.body) });
  response.end(request.method === 'HEAD' ? undefined : snapshot.body);
}
function sendError(request, response, statusCode, message, extraHeaders) { sendJson(request, response, statusCode, { error: message }, extraHeaders); }
function handleApi(request, response, url) {
  if (url.pathname === '/api/lien-chi') return sendPublicJson(request, response, publicDataCache.lienChi);
  if (url.pathname === '/api/clubs') return sendPublicJson(request, response, publicDataCache.clubs);
  return sendError(request, response, 404, 'Không tìm thấy API được yêu cầu.');
}
function getStaticCacheControl(safePath, extension) {
  if (safePath === 'index.html') return REVALIDATE_CACHE_CONTROL;
  if (VITE_HASHED_ASSET_PATTERN.test(safePath)) return IMMUTABLE_ASSET_CACHE_CONTROL;
  if (CACHEABLE_STATIC_EXTENSIONS.has(extension)) return STATIC_ASSET_CACHE_CONTROL;
  return REVALIDATE_CACHE_CONTROL;
}
function resolveStaticFile(pathname) {
  const routePath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (APP_ROUTES.has(routePath)) return { filePath: path.join(FRONTEND_DIRECTORY, 'index.html'), safePath: 'index.html' };
  const decodedPath = decodeURIComponent(pathname);
  if (decodedPath.includes('\0') || decodedPath.includes('\\')) return null;
  const segments = decodedPath.split('/');
  if (segments.some(segment => segment === '.' || segment === '..')) return null;
  const requestedPath = segments.filter(Boolean).join('/');
  if (!requestedPath) return null;
  const filePath = path.resolve(FRONTEND_DIRECTORY, requestedPath);
  const safePath = path.relative(FRONTEND_DIRECTORY, filePath);
  if (!safePath || safePath === '..' || safePath.startsWith(`..${path.sep}`) || path.isAbsolute(safePath)) return null;
  return { filePath, safePath };
}
async function serveStaticFile(request, response, url) {
  const resolved = resolveStaticFile(url.pathname);
  if (!resolved) return sendError(request, response, 404, 'Không tìm thấy trang hoặc tệp được yêu cầu.');
  try {
    const content = await fs.readFile(resolved.filePath);
    const extension = path.extname(resolved.filePath).toLowerCase();
    response.writeHead(200, { 'Content-Type': MIME_TYPES[extension] || 'application/octet-stream', 'Content-Length': content.length, 'Cache-Control': getStaticCacheControl(resolved.safePath, extension) });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') return sendError(request, response, 404, 'Không tìm thấy trang hoặc tệp được yêu cầu.');
    throw error;
  }
}

const server = http.createServer(async (request, response) => {
  applySecurityHeaders(response);
  try {
    const method = request.method || '';
    if (method !== 'GET' && method !== 'HEAD') return sendError(request, response, 405, 'Production chỉ hỗ trợ GET hoặc HEAD.', { Allow: 'GET, HEAD' });
    const url = new URL(request.url || '/', 'http://localhost');
    if (url.pathname.startsWith('/api/')) return handleApi(request, response, url);
    return serveStaticFile(request, response, url);
  } catch (error) {
    const statusCode = error instanceof URIError || error?.code === 'ERR_INVALID_ARG_VALUE' ? 400 : 500;
    if (statusCode === 500) console.error(error);
    return sendError(request, response, statusCode, statusCode === 400 ? 'URL không hợp lệ.' : 'Máy chủ không thể xử lý yêu cầu.');
  }
});
async function startServer() {
  await loadPublicDataCache();
  await new Promise((resolve, reject) => {
    const onError = error => { server.off('listening', onListening); reject(error); };
    const onListening = () => { server.off('error', onError); resolve(); };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(PORT, HOST);
  });
  console.log(`UET Navigator is running at http://${HOST}:${PORT}`);
}
startServer().catch(error => {
  console.error('Không thể tải dữ liệu public khi khởi động máy chủ.', error);
  process.exitCode = 1;
});
