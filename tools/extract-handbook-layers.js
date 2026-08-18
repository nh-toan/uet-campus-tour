'use strict';
/*
  Tách lớp chữ của sổ tay UET thành các khối chỉnh sửa được từ backend.

  Nguồn dữ liệu: `pdftohtml -xml` cho từng dòng chữ kèm toạ độ, cỡ chữ, màu,
  nét chữ và kiểu in nghiêng. Nền thiết kế do tools/build-handbook-layers.ps1 tạo.

  Kết quả được ghi vào backend/data/handbook.json, ghép theo `sourcePdfPage`.

  Cách dùng: node tools/extract-handbook-layers.js
*/
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const PDF_FILE = path.join(ROOT, 'frontend', 'public', 'assets', 'handbook', 'handbook-uet-2025.pdf');
const HANDBOOK_FILE = path.join(ROOT, 'backend', 'data', 'handbook.json');
const BACKGROUND_URL = pageNumber => `/assets/handbook/backgrounds/page-${String(pageNumber).padStart(2, '0')}.jpg`;
const WEIGHTS = [
  ['thin', 100], ['extralight', 200], ['ultralight', 200], ['light', 300], ['regular', 400], ['normal', 400],
  ['medium', 500], ['semibold', 600], ['demibold', 600], ['extrabold', 800], ['ultrabold', 800], ['black', 900], ['heavy', 900], ['bold', 700]
];

function decodeXmlEntities(value) {
  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, digits) => String.fromCodePoint(Number(digits)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}
function readAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) attributes[match[1]] = match[2];
  return attributes;
}
function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
function fontWeight(family) {
  const name = String(family).toLowerCase();
  const match = WEIGHTS.find(([token]) => name.includes(token));
  return match ? match[1] : 0;
}
function normalizeHexColor(value) {
  const color = String(value || '').trim().toLowerCase();
  return /^#[0-9a-f]{6}$/.test(color) ? color : '#102e45';
}
function runText(inner) {
  return decodeXmlEntities(inner.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

function parsePages(xml) {
  const pages = [];
  const fonts = new Map();
  for (const pageMatch of xml.matchAll(/<page\b([^>]*)>([\s\S]*?)<\/page>/g)) {
    const pageAttributes = readAttributes(pageMatch[1]);
    const body = pageMatch[2];
    for (const fontMatch of body.matchAll(/<fontspec\b([^>]*)\/>/g)) {
      const font = readAttributes(fontMatch[1]);
      fonts.set(font.id, { size: Number(font.size), family: font.family || '', color: normalizeHexColor(font.color) });
    }
    const runs = [];
    for (const textMatch of body.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
      const attributes = readAttributes(textMatch[1]);
      const markup = textMatch[2];
      const text = runText(markup);
      if (!text) continue;
      const font = fonts.get(attributes.font) || { size: Number(attributes.height) || 12, family: '', color: '#102e45' };
      const familyWeight = fontWeight(font.family);
      const markedBold = !familyWeight && /<b\b/i.test(markup);
      runs.push({
        text,
        left: Number(attributes.left),
        top: Number(attributes.top),
        width: Number(attributes.width),
        height: Number(attributes.height),
        fontSize: font.size || Number(attributes.height) || 12,
        color: font.color,
        weight: familyWeight || (markedBold ? 700 : 400),
        italic: /italic|oblique/i.test(font.family) || /<i\b/i.test(markup)
      });
    }
    pages.push({
      number: Number(pageAttributes.number),
      width: Number(pageAttributes.width),
      height: Number(pageAttributes.height),
      runs: dedupeRuns(runs)
    });
  }
  return pages;
}
function dedupeRuns(runs) {
  const seen = new Map();
  runs.forEach(run => {
    const key = `${run.text}|${Math.round(run.left)}|${Math.round(run.top)}`;
    seen.set(key, run);
  });
  return [...seen.values()].sort((a, b) => (a.top - b.top) || (a.left - b.left));
}

function sameStyle(a, b) {
  return a.fontSize === b.fontSize && a.color === b.color && a.weight === b.weight && a.italic === b.italic;
}
function horizontalOverlap(a, b) {
  const start = Math.max(a.left, b.left);
  const end = Math.min(a.left + a.width, b.left + b.width);
  const shared = end - start;
  return shared <= 0 ? 0 : shared / Math.min(a.width, b.width);
}
function canContinue(run, previous) {
  if (!sameStyle(run, previous)) return 0;
  const pitch = run.top - previous.top;
  if (pitch <= 0 || pitch > previous.fontSize * 2.2) return 0;
  const alignedLeft = Math.abs(run.left - previous.left) <= 4;
  const alignedRight = Math.abs((run.left + run.width) - (previous.left + previous.width)) <= 4;
  const alignedCentre = Math.abs((run.left + run.width / 2) - (previous.left + previous.width / 2)) <= 4;
  if (!alignedLeft && !alignedRight && !alignedCentre && horizontalOverlap(run, previous) < 0.6) return 0;
  return pitch;
}
function groupRuns(runs) {
  const groups = [];
  runs.forEach(run => {
    let bestGroup = null;
    let bestPitch = Infinity;
    for (let index = groups.length - 1; index >= 0; index -= 1) {
      const candidate = groups[index];
      const pitch = canContinue(run, candidate[candidate.length - 1]);
      if (pitch && pitch < bestPitch) { bestPitch = pitch; bestGroup = candidate; }
    }
    if (bestGroup) bestGroup.push(run); else groups.push([run]);
  });
  return groups.sort((a, b) => (a[0].top - b[0].top) || (a[0].left - b[0].left));
}
function detectAlignment(lines) {
  if (lines.length < 2) return 'left';
  const tolerance = 2.6;
  const spread = values => Math.max(...values) - Math.min(...values);
  const body = lines.length > 2 ? lines.slice(1) : lines;
  const leftAligned = spread(body.map(line => line.left)) <= tolerance;
  const rightAligned = spread(lines.slice(0, -1).map(line => line.left + line.width)) <= tolerance;
  const centreAligned = spread(lines.map(line => line.left + line.width / 2)) <= tolerance;
  if (leftAligned && rightAligned) return 'justify';
  if (centreAligned && !leftAligned) return 'center';
  if (rightAligned && !leftAligned) return 'right';
  return 'left';
}
function buildBlocks(page) {
  return groupRuns(page.runs).map((lines, index) => {
    const x = Math.min(...lines.map(line => line.left));
    const right = Math.max(...lines.map(line => line.left + line.width));
    const y = Math.min(...lines.map(line => line.top));
    const bottom = Math.max(...lines.map(line => line.top + line.height));
    const pitches = lines.slice(1).map((line, position) => line.top - lines[position].top).filter(pitch => pitch > 0);
    const fontSize = round(median(lines.map(line => line.fontSize)), 1);
    const align = detectAlignment(lines);
    const wrap = lines.length > 1 && align === 'justify';
    const indent = wrap ? Math.max(0, round(lines[0].left - x)) : 0;
    return {
      id: `p${String(page.number).padStart(2, '0')}-b${String(index + 1).padStart(2, '0')}`,
      text: lines.map(line => line.text).join(wrap ? ' ' : '\n'),
      x: round(x),
      y: round(y),
      indent: indent > 2 ? indent : 0,
      width: round(Math.max(fontSize, right - x)),
      height: round(Math.max(fontSize, bottom - y)),
      fontSize,
      lineHeight: round(Math.max(fontSize, pitches.length ? median(pitches) : fontSize * 1.34), 1),
      color: lines[0].color,
      align,
      weight: lines[0].weight,
      italic: lines[0].italic,
      wrap
    };
  });
}

function main() {
  if (!fs.existsSync(PDF_FILE)) throw new Error(`Không tìm thấy PDF nguồn: ${PDF_FILE}`);
  const workDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'uet-handbook-text-'));
  const xmlFile = path.join(workDirectory, 'handbook.xml');
  execFileSync('pdftohtml', ['-xml', '-zoom', '1', '-i', '-nodrm', PDF_FILE, xmlFile], { stdio: ['ignore', 'ignore', 'inherit'] });
  const pages = parsePages(fs.readFileSync(xmlFile, 'utf8'));
  if (!pages.length) throw new Error('Không đọc được lớp chữ từ PDF.');

  const layers = new Map();
  pages.forEach(page => layers.set(page.number, { backgroundImageUrl: BACKGROUND_URL(page.number), blocks: buildBlocks(page) }));

  const handbook = JSON.parse(fs.readFileSync(HANDBOOK_FILE, 'utf8'));
  handbook.pageSize = { width: round(pages[0].width, 3), height: round(pages[0].height, 3) };
  const coverLayer = layers.get(1) || { backgroundImageUrl: BACKGROUND_URL(1), blocks: [] };
  handbook.cover.backgroundImageUrl = coverLayer.backgroundImageUrl;
  handbook.cover.blocks = coverLayer.blocks;
  handbook.pages = handbook.pages.map(page => {
    const layer = layers.get(page.sourcePdfPage);
    return layer ? { ...page, backgroundImageUrl: layer.backgroundImageUrl, blocks: layer.blocks } : page;
  });
  fs.writeFileSync(HANDBOOK_FILE, `${JSON.stringify(handbook, null, 2)}\n`, 'utf8');
  fs.rmSync(workDirectory, { recursive: true, force: true });

  const blockCount = [coverLayer, ...handbook.pages].reduce((total, item) => total + (item.blocks?.length || 0), 0);
  console.log(`Đã tách ${layers.size} trang, tổng ${blockCount} khối chữ có thể chỉnh sửa.`);
}

main();
