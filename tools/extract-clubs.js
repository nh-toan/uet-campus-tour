/**
 * Đọc UET.CLB.docx và sinh backend/data/clubs.json.
 *
 * Cách chạy:  node tools/extract-clubs.js
 *
 * Tài liệu Word chỉ chứa phần bài giới thiệu (tiêu đề dạng "Title" là tên CLB).
 * Danh sách đơn vị chủ quản + link fanpage nằm trong CLUB_DIRECTORY bên dưới.
 * CLB nào không có bài giới thiệu trong file Word sẽ để rỗng.
 */

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const ROOT = path.resolve(__dirname, '..');
const DOCX_FILE = path.join(ROOT, 'UET.CLB.docx');
const OUTPUT_FILE = path.join(ROOT, 'backend', 'data', 'clubs.json');

/** Bảng danh mục CLB: [tên trong file Word, tên hiển thị, viết tắt trên logo, đơn vị chủ quản, fanpage, các nhóm, màu] */
const CLUB_DIRECTORY = [
  ['CLB Nghệ thuật (PC)', 'CLB Nghệ thuật', 'Passion Club', 'PC', 'hoi-sinh-vien', 'https://www.facebook.com/PCuet', ['Nghệ thuật & Văn hóa'], '#e8447f'],
  ['CLB Hỗ trợ Sinh viên (SGUET)', 'CLB Hỗ trợ Sinh viên', 'SGUET', 'SG', 'hoi-sinh-vien', 'https://www.facebook.com/SupportGroupUET', ['Tình nguyện/Hỗ trợ cộng đồng'], '#2f7fd1'],
  ['CLB Vận động hiến máu', 'CLB Vận động hiến máu', 'Người Việt Trẻ', 'NVT', 'hoi-sinh-vien', 'https://www.facebook.com/NguoiVietTre0601', ['Tình nguyện/Hỗ trợ cộng đồng'], '#d63131'],
  ['CLB Thư viện Hội Sinh viên', 'CLB Thư viện Hội Sinh viên', 'LSA', 'LSA', 'hoi-sinh-vien', 'https://www.facebook.com/TVHSV.UET', ['Tình nguyện/Hỗ trợ cộng đồng'], '#0f8a6e'],
  ['CLB Bóng đá (UETFC)', 'CLB Bóng đá', 'UET FC', 'FC', 'hoi-sinh-vien', 'https://www.facebook.com/uetfc.vnu', ['Thể thao'], '#1f7a3d'],
  ['CLB Nhảy cổ động (GALAXY)', 'CLB Nhảy cổ động', 'GALAXY', 'GX', 'hoi-sinh-vien', 'https://www.facebook.com/UET.GALAXY.Cheerleading', ['Nghệ thuật & Văn hóa'], '#7b45d6'],
  ['CLB Cầu Lông', 'CLB Cầu lông', 'B-UET', 'BL', 'hoi-sinh-vien', 'https://www.facebook.com/clbcaulonguet', ['Thể thao'], '#12897f'],
  ['CLB Bóng rổ', 'CLB Bóng rổ', 'UET Basketball', 'BR', 'hoi-sinh-vien', 'https://www.facebook.com/UET.BasketballClub', ['Thể thao'], '#e2661f'],
  ['CLB Thuyết trình', 'CLB Thuyết trình', 'UET Presentation', 'TT', 'hoi-sinh-vien', 'https://www.facebook.com/CaulacboThuyettrinh/', ['Học thuật/Kỹ năng'], '#1c5fa8'],
  ['CLB Truyền thông', 'CLB Truyền thông', 'UETLC', 'LC', 'hoi-sinh-vien', 'https://www.facebook.com/uetlc.club', ['Truyền thông/Sự kiện'], '#c2317a'],
  ['CLB Hàng không Vũ trụ', 'CLB Hàng không Vũ trụ', 'ACUET', 'AC', 'hoi-sinh-vien', 'https://www.facebook.com/AerospaceClubUET', ['Học thuật/Kỹ năng'], '#3b5bd4'],
  ['CLB Tiếng Anh', 'CLB Tiếng Anh', 'English Club', 'EC', 'hoi-sinh-vien', 'https://www.facebook.com/EnglishClub.UET', ['Học thuật/Kỹ năng'], '#d4472a'],
  ['CLB Tiếng Nhật', 'CLB Tiếng Nhật', 'JAPIT', 'JP', 'hoi-sinh-vien', 'https://www.facebook.com/uet.clbtiengnhat', ['Học thuật/Kỹ năng'], '#d6355c'],
  ['CLB Điện tử và Tự động hóa (UETX)', 'CLB Điện tử và Tự động hóa', 'UETX', 'X', 'hoi-sinh-vien', 'https://www.facebook.com/uetX.club/', ['Học thuật/Kỹ năng'], '#0b7fa6'],
  ['CLB Nguồn nhân lực (HRTech)', 'CLB Nguồn nhân lực', 'HRTech', 'HR', 'hoi-sinh-vien', 'https://www.facebook.com/hrtechclub', ['Học thuật/Kỹ năng'], '#8a3fbf'],
  ['CLB Robotics (RCUET)', 'CLB Robotics', 'RCUET', 'RC', 'hoi-sinh-vien', 'https://www.facebook.com/clbrobotics.uet', ['Học thuật/Kỹ năng'], '#146fd1'],
  ['CLB Thiết kế và sáng tạo', 'CLB Thiết kế và Sáng tạo', 'UET-IS', 'IS', 'hoi-sinh-vien', '', ['Học thuật/Kỹ năng'], '#8b3fd6'],
  ['CLB Trí tuệ nhân tạo', 'CLB Trí tuệ nhân tạo', 'AI-UET', 'AI', 'hoi-sinh-vien', 'https://www.facebook.com/UETARTIFICIALINTELLIGENCE', ['Học thuật/Kỹ năng'], '#0d8fb0'],
  ['CLB Lý luận trẻ', 'CLB Lý luận trẻ', 'CLB Lý luận trẻ UET', 'LLT', 'doan-thanh-nien', 'https://www.facebook.com/CLBLLT.UET/', ['Học thuật/Kỹ năng'], '#c0342f'],
  ['CLB Vũ đạo (YDC)', 'CLB Vũ đạo', 'YDC', 'YD', 'hoi-sinh-vien', 'https://www.facebook.com/share/17JBR4zqhe/', ['Nghệ thuật & Văn hóa'], '#e0417a'],
  ['CLB Vi mạch bán dẫn (SMUET)', 'CLB Vi mạch bán dẫn', 'SMUET', 'SM', 'hoi-sinh-vien', 'https://www.facebook.com/smuet.smc', ['Học thuật/Kỹ năng'], '#5b46d9'],
  ['CLB Thiết kế Hệ thống và Vi mạch (UET CHIP+)', 'CLB Thiết kế Hệ thống và Vi mạch', 'UET CHIP+', 'C+', 'hoi-sinh-vien', 'https://www.facebook.com/uetchipplus', ['Học thuật/Kỹ năng'], '#0e7c8c'],
  ['CLB Khoa học vật liệu (UET MSC)', 'CLB Khoa học Vật liệu', 'UET MSC', 'MS', 'hoi-sinh-vien', 'https://www.facebook.com/msc.uet', ['Học thuật/Kỹ năng'], '#a8551b'],
  ['CLB Sinh viên 5 tốt', 'CLB Sinh viên 5 tốt', 'SV5T UET', '5T', 'hoi-sinh-vien', 'https://www.facebook.com/share/14tLYfytV96/', ['Học thuật/Kỹ năng', 'Tình nguyện/Hỗ trợ cộng đồng'], '#1d6fb8']
];

const GOVERNING_BODIES = {
  'hoi-sinh-vien': 'Hội Sinh viên Trường Đại học Công nghệ',
  'doan-thanh-nien': 'Đoàn Thanh niên Trường Đại học Công nghệ'
};

/* ------------------------------------------------------------------ */
/* Đọc word/document.xml ra khỏi tệp .docx (ZIP) mà không cần thư viện */
/* ------------------------------------------------------------------ */
function readZipEntry(zipBuffer, entryName) {
  const CENTRAL_SIGNATURE = 0x02014b50;
  const endIndex = zipBuffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (endIndex === -1) throw new Error('Tệp .docx không phải ZIP hợp lệ.');
  let offset = zipBuffer.readUInt32LE(endIndex + 16);
  const total = zipBuffer.readUInt16LE(endIndex + 10);
  for (let index = 0; index < total; index += 1) {
    if (zipBuffer.readUInt32LE(offset) !== CENTRAL_SIGNATURE) throw new Error('Central directory của ZIP bị lỗi.');
    const method = zipBuffer.readUInt16LE(offset + 10);
    const compressedSize = zipBuffer.readUInt32LE(offset + 20);
    const nameLength = zipBuffer.readUInt16LE(offset + 28);
    const extraLength = zipBuffer.readUInt16LE(offset + 30);
    const commentLength = zipBuffer.readUInt16LE(offset + 32);
    const localOffset = zipBuffer.readUInt32LE(offset + 42);
    const name = zipBuffer.toString('utf8', offset + 46, offset + 46 + nameLength);
    if (name === entryName) {
      const localNameLength = zipBuffer.readUInt16LE(localOffset + 26);
      const localExtraLength = zipBuffer.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const data = zipBuffer.subarray(dataStart, dataStart + compressedSize);
      return method === 0 ? data : zlib.inflateRawSync(data);
    }
    offset += 46 + nameLength + extraLength + commentLength;
  }
  throw new Error(`Không tìm thấy ${entryName} trong tệp .docx.`);
}

/* ------------------------------------------------------------------ */
/* Phân tích các đoạn văn                                             */
/* ------------------------------------------------------------------ */
const XML_ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" };

function decodeXml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&(amp|lt|gt|quot|apos);/g, match => XML_ENTITIES[match]);
}

/** Chuẩn hoá khoảng trắng, bỏ các ký tự bullet còn sót lại ở đầu dòng. */
function tidy(value) {
  return decodeXml(value)
    .replace(/\u00a0/g, ' ')
    .replace(/[\u200b-\u200d\ufeff]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s•·▪◦●○–—\-*→»>+]+/, '')
    .replace(/^\d+[.)]\s*/, '')
    .trim();
}

/**
 * Nhận diện đoạn thuộc danh sách gạch đầu dòng.
 *
 * Tài liệu Word này không có w:numPr, w:ind hay chữ đậm - toàn bộ cấu trúc chỉ
 * nằm ở ký tự thật trong văn bản. Vì vậy chỉ đánh dấu bullet khi có dấu hiệu rõ
 * ràng: ký tự bullet, số thứ tự, hoặc thụt lề bằng khoảng trắng/tab.
 * Các dòng chỉ có emoji trang trí (emoji được Word lưu thành ảnh nên biến mất
 * khi đọc) được giữ nguyên là đoạn văn thường thay vì đoán sai thành bullet.
 */
function detectBullet(rawText) {
  const value = decodeXml(rawText).replace(/\u00a0/g, ' ');
  if (/^[ \t]*[•·▪◦●○→»▸✦✧–—*]\s*\S/.test(value)) return true;
  if (/^[ \t]*\d+[.)]\s+\S/.test(value)) return true;
  if (/^(?:\t| {3,})\s*\S/.test(value)) return true;
  return false;
}

function parseParagraphs(xml) {
  const paragraphs = [];
  const paragraphPattern = /<w:p(?:\s[^>]*)?(?:\/>|>([\s\S]*?)<\/w:p>)/g;
  let match;
  while ((match = paragraphPattern.exec(xml)) !== null) {
    const inner = match[1] || '';
    const rawText = [...inner.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map(item => item[1]).join('');
    paragraphs.push({
      text: tidy(rawText),
      isTitle: /<w:pStyle\s+w:val="Title"\s*\/>/.test(inner),
      isBullet: detectBullet(rawText)
    });
  }
  return paragraphs;
}

/** Cắt danh sách đoạn văn thành từng khối theo tiêu đề (pStyle=Title). */
function groupByClub(paragraphs) {
  const groups = new Map();
  let currentTitle = null;
  for (const paragraph of paragraphs) {
    if (paragraph.isTitle && paragraph.text) {
      currentTitle = paragraph.text;
      if (!groups.has(currentTitle)) groups.set(currentTitle, []);
      continue;
    }
    if (!currentTitle || !paragraph.text) continue;
    groups.get(currentTitle).push({ text: paragraph.text, isBullet: paragraph.isBullet });
  }
  return groups;
}

function toSlug(value) {
  const map = {
    à: 'a', á: 'a', ạ: 'a', ả: 'a', ã: 'a', â: 'a', ầ: 'a', ấ: 'a', ậ: 'a', ẩ: 'a', ẫ: 'a', ă: 'a', ằ: 'a', ắ: 'a', ặ: 'a', ẳ: 'a', ẵ: 'a',
    è: 'e', é: 'e', ẹ: 'e', ẻ: 'e', ẽ: 'e', ê: 'e', ề: 'e', ế: 'e', ệ: 'e', ể: 'e', ễ: 'e',
    ì: 'i', í: 'i', ị: 'i', ỉ: 'i', ĩ: 'i',
    ò: 'o', ó: 'o', ọ: 'o', ỏ: 'o', õ: 'o', ô: 'o', ồ: 'o', ố: 'o', ộ: 'o', ổ: 'o', ỗ: 'o', ơ: 'o', ờ: 'o', ớ: 'o', ợ: 'o', ở: 'o', ỡ: 'o',
    ù: 'u', ú: 'u', ụ: 'u', ủ: 'u', ũ: 'u', ư: 'u', ừ: 'u', ứ: 'u', ự: 'u', ử: 'u', ữ: 'u',
    ỳ: 'y', ý: 'y', ỵ: 'y', ỷ: 'y', ỹ: 'y', đ: 'd'
  };
  return value
    .toLowerCase()
    .replace(/[^\u0000-\u007f]/g, character => map[character] || character)
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Đoạn đầu tiên đủ dài dùng làm câu dẫn ngắn cho thẻ CLB. */
function buildSummary(paragraphs) {
  const candidate = paragraphs.find(item => !item.isBullet && item.text.length >= 80) || paragraphs[0];
  if (!candidate) return '';
  const text = candidate.text;
  if (text.length <= 190) return text;
  const cut = text.slice(0, 190);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(', '), cut.lastIndexOf(' – '), cut.lastIndexOf(' - '));
  return `${(lastStop > 110 ? cut.slice(0, lastStop) : cut).trim()}…`;
}

function main() {
  const documentXml = readZipEntry(fs.readFileSync(DOCX_FILE), 'word/document.xml').toString('utf8');
  const groups = groupByClub(parseParagraphs(documentXml));

  const unmatched = [...groups.keys()].filter(title => !CLUB_DIRECTORY.some(([docTitle]) => docTitle === title));
  if (unmatched.length) console.warn('Tiêu đề trong Word chưa khớp danh mục:', unmatched);

  const clubs = CLUB_DIRECTORY.map(([docTitle, name, shortName, monogram, governing, fanpageUrl, categories, accentColor], index) => {
    const paragraphs = groups.get(docTitle) || [];
    const id = toSlug(name);
    return {
      id,
      sortOrder: index + 1,
      name,
      shortName,
      monogram,
      logoUrl: `/assets/clubs/${id}.svg`,
      accentColor,
      categories,
      governingBody: GOVERNING_BODIES[governing],
      fanpageUrl,
      summary: buildSummary(paragraphs),
      paragraphs
    };
  });

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(clubs, null, 2)}\n`, 'utf8');

  const empty = clubs.filter(club => !club.paragraphs.length).map(club => club.name);
  console.log(`Đã ghi ${clubs.length} CLB vào ${path.relative(ROOT, OUTPUT_FILE)}`);
  console.log(`Tổng số đoạn nội dung: ${clubs.reduce((sum, club) => sum + club.paragraphs.length, 0)}`);
  if (empty.length) console.log(`Chưa có bài giới thiệu (để trống): ${empty.join(', ')}`);
}

main();
