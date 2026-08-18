/**
 * Sinh logo SVG mặc định cho từng CLB dựa trên backend/data/clubs.json.
 *
 * Cách chạy:  node tools/build-club-logos.js
 *
 * Đây là logo tạm (huy hiệu chữ lồng theo màu nhận diện của từng CLB). Khi có
 * logo thật, chỉ cần ghi đè tệp cùng tên trong frontend/public/assets/clubs/
 * (hỗ trợ .svg, .png, .webp - đổi luôn "logoUrl" trong clubs.json nếu khác
 * phần mở rộng). Script sẽ KHÔNG ghi đè tệp không phải .svg do nó tạo ra.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const CLUBS_FILE = path.join(ROOT, 'backend', 'data', 'clubs.json');
const OUTPUT_DIRECTORY = path.join(ROOT, 'frontend', 'public', 'assets', 'clubs');
const MARKER = 'data-generated="uet-club-monogram"';

function shiftColor(hex, amount) {
  const value = Number.parseInt(hex.slice(1), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map(channel => {
    const next = amount >= 0 ? channel + (255 - channel) * amount : channel * (1 + amount);
    return Math.max(0, Math.min(255, Math.round(next)));
  });
  return `#${channels.map(channel => channel.toString(16).padStart(2, '0')).join('')}`;
}

function escapeXml(value) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]));
}

function buildSvg({ monogram, shortName, accentColor }) {
  const light = shiftColor(accentColor, 0.28);
  const dark = shiftColor(accentColor, -0.4);
  const letters = escapeXml(monogram);
  // Chữ lồng dài hơn 2 ký tự cần thu nhỏ để không tràn khỏi huy hiệu.
  const fontSize = letters.length > 2 ? 44 : 54;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="${escapeXml(shortName)}" ${MARKER}>
  <defs>
    <linearGradient id="badge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${light}"/>
      <stop offset="0.55" stop-color="${accentColor}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="34" fill="url(#badge)"/>
  <circle cx="64" cy="64" r="47" fill="none" stroke="#ffffff" stroke-opacity="0.34" stroke-width="2.5"/>
  <text x="64" y="64" text-anchor="middle" dominant-baseline="central"
        font-family="'Be Vietnam Pro','Segoe UI',system-ui,sans-serif"
        font-size="${fontSize}" font-weight="800" letter-spacing="1" fill="#ffffff">${letters}</text>
</svg>
`;
}

function main() {
  const clubs = JSON.parse(fs.readFileSync(CLUBS_FILE, 'utf8'));
  fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

  let written = 0;
  const skipped = [];
  for (const club of clubs) {
    const target = path.join(OUTPUT_DIRECTORY, `${club.id}.svg`);
    if (fs.existsSync(target) && !fs.readFileSync(target, 'utf8').includes(MARKER)) {
      skipped.push(`${club.id}.svg`);
      continue;
    }
    fs.writeFileSync(target, buildSvg(club), 'utf8');
    written += 1;
  }

  console.log(`Đã sinh ${written} logo tạm vào ${path.relative(ROOT, OUTPUT_DIRECTORY)}`);
  if (skipped.length) console.log(`Giữ nguyên logo thật đã có: ${skipped.join(', ')}`);
}

main();
