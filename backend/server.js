const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT || 3001);
const ROOT_DIRECTORY = __dirname;
const FRONTEND_DIRECTORY = path.resolve(ROOT_DIRECTORY, '..', 'frontend', 'dist');
const DATA_DIRECTORY = path.join(ROOT_DIRECTORY, 'data');
const LIEN_CHI_FILE = path.join(DATA_DIRECTORY, 'lien-chi.json');
const CLUBS_FILE = path.join(DATA_DIRECTORY, 'clubs.json');
const ADMIN_KEY = process.env.UET_ADMIN_KEY || 'uet-admin-2026';
const MAX_BODY_SIZE = 4_000_000;
const APP_ROUTES = new Set(['/', '/gioi-thieu', '/ban-do', '/doan-thanh-nien-hoi-sinh-vien', '/lien-chi', '/cau-lac-bo']);
const MIME_TYPES = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream' };
const CLUB_CATEGORIES = new Set(['academic', 'tech', 'art', 'sport', 'media', 'community']);
const CACHEABLE_STATIC_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.woff', '.woff2']);
const VITE_HASHED_ASSET_PATTERN = /-[a-zA-Z0-9_-]{8,}\.(?:css|js)$/;
const PUBLIC_API_CACHE_CONTROL = 'public, no-cache';
const IMMUTABLE_ASSET_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const STATIC_ASSET_CACHE_CONTROL = 'public, max-age=86400';
const REVALIDATE_CACHE_CONTROL = 'public, no-cache';
const DEFAULT_CLUB_BACKGROUND = '/assets/clubs/backgrounds/default.jpg';
const CLUB_BACKGROUND_IMAGES = Object.freeze({
  'clb-nghe-thuat': '/assets/clubs/backgrounds/clb-nghe-thuat.jpg',
  'clb-van-dong-hien-mau': '/assets/clubs/backgrounds/clb-van-dong-hien-mau.jpg',
  'clb-nguon-nhan-luc': '/assets/clubs/backgrounds/clb-nguon-nhan-luc.jpg',
  'clb-thu-vien-hoi-sinh-vien': '/assets/clubs/backgrounds/clb-thu-vien-hoi-sinh-vien.jpg',
  'clb-nhay-co-dong': '/assets/clubs/backgrounds/clb-nhay-co-dong.jpg',
  'clb-cau-long': '/assets/clubs/backgrounds/clb-cau-long.jpg',
  'clb-bong-ro': '/assets/clubs/backgrounds/clb-bong-ro.jpg',
  'clb-thuyet-trinh': '/assets/clubs/backgrounds/clb-thuyet-trinh.jpg',
  'clb-hang-khong-vu-tru': '/assets/clubs/backgrounds/clb-hang-khong-vu-tru.png',
  'clb-tieng-anh': '/assets/clubs/backgrounds/clb-tieng-anh.jpg',
  'clb-tieng-nhat': '/assets/clubs/backgrounds/clb-tieng-nhat.jpg',
  'clb-dien-tu-va-tu-dong-hoa': '/assets/clubs/backgrounds/clb-dien-tu-va-tu-dong-hoa.png',
  'clb-robotics': '/assets/clubs/backgrounds/clb-robotics.jpg',
  'clb-ly-luan-tre': '/assets/clubs/backgrounds/clb-ly-luan-tre.jpg',
  'clb-thiet-ke-he-thong-va-vi-mach': '/assets/clubs/backgrounds/clb-thiet-ke-he-thong-va-vi-mach.jpg',
  'clb-sinh-vien-5-tot': '/assets/clubs/backgrounds/clb-sinh-vien-5-tot.png',
  'clb-ho-tro-sinh-vien': '/assets/clubs/backgrounds/clb-ho-tro-sinh-vien.jpg'
});
function normalizeClubBackground(value) { const backgroundPath = typeof value === 'string' ? value.trim() : ''; return /^\/assets\/clubs\/backgrounds\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(backgroundPath) ? backgroundPath : ''; }

let publicDataCache = null;
let lienChiMutationQueue = Promise.resolve();

function createJsonSnapshot(items) {
  const body = JSON.stringify(items);
  return Object.freeze({
    items: Object.freeze(items),
    body,
    etag: `"${crypto.createHash('sha256').update(body).digest('base64url')}"`
  });
}

function sendJson(response, statusCode, payload) { response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); response.end(JSON.stringify(payload)); }
function sendPublicJson(request, response, snapshot) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': PUBLIC_API_CACHE_CONTROL,
    ETag: snapshot.etag
  };
  if (request.headers['if-none-match'] === snapshot.etag) {
    response.writeHead(304, headers);
    return response.end();
  }
  response.writeHead(200, headers);
  response.end(snapshot.body);
}
function sendError(response, statusCode, message) { sendJson(response, statusCode, { error: message }); }
function isAuthorized(request) { return request.headers['x-admin-key'] === ADMIN_KEY; }
async function readJson(filePath) { return JSON.parse(await fs.readFile(filePath, 'utf8')); }
async function writeJson(filePath, value) { const temporaryFile = `${filePath}.tmp`; await fs.writeFile(temporaryFile, `${JSON.stringify(value, null, 2)}\n`, 'utf8'); await fs.rename(temporaryFile, filePath); }
function normalizeText(value, field, maximum, required = false) { const text = typeof value === 'string' ? value.trim() : ''; if (required && !text) throw new Error(`${field} là bắt buộc.`); if (text.length > maximum) throw new Error(`${field} tối đa ${maximum} ký tự.`); return text; }
function normalizeColor(value, fallback) { const color = typeof value === 'string' ? value.trim() : ''; if (!color) return fallback; if (!/^#[0-9a-fA-F]{6}$/.test(color)) throw new Error('Màu sắc phải có định dạng #RRGGBB.'); return color.toLowerCase(); }
function normalizeLink(value) { const link = typeof value === 'string' ? value.trim() : ''; if (!link) return ''; try { return ['http:', 'https:'].includes(new URL(link).protocol) ? link : ''; } catch { return ''; } }
function normalizePublicLogo(value, directory) { const logoPath = typeof value === 'string' ? value.trim() : ''; return new RegExp(`^/assets/${directory}/[a-zA-Z0-9_-]+\\.(svg|png|webp|jpe?g)$`, 'i').test(logoPath) ? logoPath : ''; }
function normalizeLienChiBackground(value) { const backgroundPath = typeof value === 'string' ? value.trim() : ''; return /^\/assets\/lien-chi\/backgrounds\/[a-z0-9-]+\.jpe?g$/i.test(backgroundPath) ? backgroundPath : ''; }
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
function normalizeLienChi(input, existing = {}, index = 0) { const source = input && typeof input === 'object' ? input : {}; const pick = field => typeof source[field] === 'string' ? source[field] : (existing[field] || ''); return { id: typeof source.id === 'string' && /^[a-z0-9-]+$/.test(source.id) ? source.id : (existing.id || `lien-chi-${index + 1}`), sortOrder: Number.isInteger(source.sortOrder) ? source.sortOrder : (existing.sortOrder || index + 1), name: normalizeText(pick('name'), 'Tên Liên chi', 160, true), shortName: normalizeText(pick('shortName'), 'Tên viết tắt', 80), monogram: normalizeText(pick('monogram'), 'Chữ lồng logo', 6), unitType: ['Khoa', 'Viện'].includes(pick('unitType')) ? pick('unitType') : 'Khoa', logoUrl: normalizePublicLogo(pick('logoUrl'), 'lien-chi'), backgroundImage: normalizeLienChiBackground(pick('backgroundImage')), accentColor: normalizeColor(pick('accentColor'), '#087ea4'), fanpageUrl: normalizeLink(pick('fanpageUrl')), summary: normalizeText(pick('summary') || pick('description'), 'Câu dẫn Liên chi', 400), paragraphs: normalizeParagraphs(source.paragraphs ?? existing.paragraphs, 'Đoạn giới thiệu Liên chi') }; }
function normalizeClubActivityImages(value, clubId) {
  const route = new RegExp(`^/assets/clubs/activity/${clubId}/[a-z0-9-]+\\.(jpg|jpeg|png|webp)$`, 'i');
  return (Array.isArray(value) ? value : []).map(item => {
    const src = typeof item?.src === 'string' ? item.src.trim() : '';
    const alt = typeof item?.alt === 'string' ? item.alt.trim().slice(0, 240) : '';
    return route.test(src) && alt ? { src, alt } : null;
  }).filter(Boolean).slice(0, 20);
}
function normalizeClub(input, index) {
  const id = typeof input?.id === 'string' && /^[a-z0-9-]+$/.test(input.id) ? input.id : `clb-${index + 1}`;
  const paragraphs = normalizeParagraphs(input?.paragraphs, 'Đoạn giới thiệu câu lạc bộ');
  const sections = normalizeClubSections(input?.sections);
  return {
    id,
    sortOrder: Number.isInteger(input?.sortOrder) ? input.sortOrder : index + 1,
    name: normalizeText(input?.name, 'Tên câu lạc bộ', 160, true),
    shortName: normalizeText(input?.shortName, 'Tên viết tắt', 80),
    monogram: normalizeText(input?.monogram, 'Chữ lồng logo', 6),
    logoUrl: normalizePublicLogo(input?.logoUrl, 'clubs'),
    backgroundImage: normalizeClubBackground(input?.backgroundImage) || CLUB_BACKGROUND_IMAGES[id] || DEFAULT_CLUB_BACKGROUND,
    accentColor: normalizeColor(input?.accentColor, '#087ea4'),
    category: CLUB_CATEGORIES.has(input?.category) ? input.category : 'community',
    governingBody: normalizeText(input?.governingBody, 'Đơn vị chủ quản', 200),
    fanpageUrl: normalizeLink(input?.fanpageUrl),
    summary: normalizeText(input?.summary, 'Câu dẫn', 400),
    sections: sections.length ? sections : (paragraphs.length ? [{ title: 'Giới thiệu', items: paragraphs }] : []),
    activityImages: normalizeClubActivityImages(input?.activityImages, id),
    paragraphs
  };
}
async function readLienChi() { const items = await readJson(LIEN_CHI_FILE); if (!Array.isArray(items)) throw new Error('Dữ liệu Liên chi không hợp lệ.'); return items.map(normalizeLienChi).sort((a, b) => a.sortOrder - b.sortOrder); }
async function readClubs() { const items = await readJson(CLUBS_FILE); if (!Array.isArray(items)) throw new Error('Dữ liệu câu lạc bộ không hợp lệ.'); return items.map(normalizeClub).sort((a, b) => a.sortOrder - b.sortOrder); }
async function loadPublicDataCache() {
  const [lienChi, clubs] = await Promise.all([readLienChi(), readClubs()]);
  publicDataCache = Object.freeze({
    lienChi: createJsonSnapshot(lienChi),
    clubs: createJsonSnapshot(clubs)
  });
}
function updateLienChiCache(snapshot) {
  publicDataCache = Object.freeze({ ...publicDataCache, lienChi: snapshot });
}
function queueLienChiMutation(operation) {
  const mutation = lienChiMutationQueue.then(operation, operation);
  lienChiMutationQueue = mutation.catch(() => undefined);
  return mutation;
}
function readRequestBody(request) { return new Promise((resolve, reject) => { let size = 0; let body = ''; request.setEncoding('utf8'); request.on('data', chunk => { size += Buffer.byteLength(chunk); if (size > MAX_BODY_SIZE) { reject(new Error('Dữ liệu gửi lên quá lớn.')); request.destroy(); return; } body += chunk; }); request.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Dữ liệu JSON không hợp lệ.')); } }); request.on('error', reject); }); }
async function mutateLienChi(method, id, input) {
  return queueLienChiMutation(async () => {
    const items = [...publicDataCache.lienChi.items];
    if (method === 'POST') {
      const item = normalizeLienChi(input, { id: crypto.randomUUID(), sortOrder: items.length ? Math.max(...items.map(value => value.sortOrder)) + 1 : 1 });
      items.push(item);
      const snapshot = createJsonSnapshot(items);
      await writeJson(LIEN_CHI_FILE, items);
      updateLienChiCache(snapshot);
      return { statusCode: 201, payload: item };
    }

    const index = items.findIndex(item => item.id === id);
    if (index < 0) return { statusCode: 404, payload: { error: 'Không tìm thấy Liên chi.' } };
    if (method === 'PATCH') {
      items[index] = normalizeLienChi(input, items[index], index);
      const snapshot = createJsonSnapshot(items);
      await writeJson(LIEN_CHI_FILE, items);
      updateLienChiCache(snapshot);
      return { statusCode: 200, payload: items[index] };
    }
    if (method === 'DELETE') {
      items.splice(index, 1);
      const snapshot = createJsonSnapshot(items);
      await writeJson(LIEN_CHI_FILE, items);
      updateLienChiCache(snapshot);
      return { statusCode: 200, payload: { success: true } };
    }
    return { statusCode: 405, payload: { error: 'Phương thức hoặc đường dẫn API không được hỗ trợ.' } };
  });
}
async function handleLienChiApi(request, response, url) {
  const id = url.pathname.match(/^\/api\/lien-chi\/([a-zA-Z0-9-]+)$/)?.[1];
  if (request.method === 'GET' && url.pathname === '/api/lien-chi') return sendPublicJson(request, response, publicDataCache.lienChi);
  if (!isAuthorized(request)) return sendError(response, 401, 'Cần mật khẩu quản trị để thay đổi danh mục.');
  if (request.method === 'POST' && url.pathname !== '/api/lien-chi') return sendError(response, 405, 'Phương thức hoặc đường dẫn API không được hỗ trợ.');
  const input = request.method === 'POST' || request.method === 'PATCH' ? await readRequestBody(request) : undefined;
  const result = await mutateLienChi(request.method, id, input);
  return sendJson(response, result.statusCode, result.payload);
}
async function handleApi(request, response, url) { if (url.pathname.startsWith('/api/lien-chi')) return handleLienChiApi(request, response, url); if (request.method === 'GET' && url.pathname === '/api/clubs') return sendPublicJson(request, response, publicDataCache.clubs); return sendError(response, 404, 'Không tìm thấy API được yêu cầu.'); }
function getStaticCacheControl(safePath, extension) {
  if (safePath === 'index.html') return REVALIDATE_CACHE_CONTROL;
  if (VITE_HASHED_ASSET_PATTERN.test(safePath)) return IMMUTABLE_ASSET_CACHE_CONTROL;
  if (CACHEABLE_STATIC_EXTENSIONS.has(extension)) return STATIC_ASSET_CACHE_CONTROL;
  return REVALIDATE_CACHE_CONTROL;
}
async function serveStaticFile(request, response, url) { const requestedPath = APP_ROUTES.has(url.pathname) ? 'index.html' : decodeURIComponent(url.pathname).replace(/^[/\\]+/, ''); const safePath = path.normalize(requestedPath).replace(/^[/\\]+/, ''); if (!safePath || safePath.startsWith('..')) return sendError(response, 404, 'Không tìm thấy trang hoặc tệp được yêu cầu.'); const filePath = path.resolve(FRONTEND_DIRECTORY, safePath); if (!filePath.startsWith(`${FRONTEND_DIRECTORY}${path.sep}`)) return sendError(response, 403, 'Không được phép truy cập tệp này.'); try { const content = await fs.readFile(filePath); const extension = path.extname(filePath).toLowerCase(); response.writeHead(200, { 'Content-Type': MIME_TYPES[extension] || 'application/octet-stream', 'Cache-Control': getStaticCacheControl(safePath, extension) }); response.end(request.method === 'HEAD' ? undefined : content); } catch (error) { if (error.code === 'ENOENT') return sendError(response, 404, 'Chưa có bản build React. Hãy chạy npm run build trước khi dùng máy chủ.'); throw error; } }
const server = http.createServer(async (request, response) => { try { const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`); if (url.pathname.startsWith('/api/')) await handleApi(request, response, url); else if (request.method === 'GET' || request.method === 'HEAD') await serveStaticFile(request, response, url); else sendError(response, 405, 'Chỉ hỗ trợ GET hoặc HEAD cho tệp giao diện.'); } catch (error) { console.error(error); const isSystemError = typeof error?.code === 'string'; sendError(response, isSystemError ? 500 : 400, isSystemError ? 'Máy chủ không thể đọc hoặc lưu dữ liệu.' : (error.message || 'Máy chủ không thể xử lý yêu cầu.')); } });
async function startServer() {
  await loadPublicDataCache();
  await new Promise((resolve, reject) => {
    const onError = error => {
      server.off('listening', onListening);
      reject(error);
    };
    const onListening = () => {
      server.off('error', onError);
      resolve();
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(PORT);
  });
  console.log(`UET Navigator is running at http://localhost:${PORT}`);
}
startServer().catch(error => {
  console.error('Không thể tải dữ liệu public khi khởi động máy chủ.', error);
  process.exitCode = 1;
});
