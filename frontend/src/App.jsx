import { lazy, Suspense, useEffect, useMemo, useState } from 'react';

const CampusMapModule = lazy(() => import('./features/campus-map/CampusMapModule'));

const sections = [
  ['gioi-thieu', 'Giới thiệu'],
  ['ban-do', 'Bản đồ'],
  ['lien-chi', 'Liên chi'],
  ['cau-lac-bo', 'Câu lạc bộ']
];
const clubCategories = [['academic', 'Học thuật'], ['tech', 'Công nghệ'], ['art', 'Nghệ thuật'], ['sport', 'Thể thao'], ['media', 'Truyền thông'], ['community', 'Cộng đồng']];
const clubCategoryLabels = Object.fromEntries(clubCategories);

async function api(path) {
  const response = await fetch(`/api${path}`);
  const data = await response.json().catch(() => ({ error: 'API không trả về dữ liệu hợp lệ.' }));
  if (!response.ok) throw new Error(data.error || 'Không thể tải dữ liệu.');
  return data;
}
function normalizeSearch(value) { return String(value || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function currentRoute() { return location.pathname.replace(/\/+$/, '').slice(1) || 'gioi-thieu'; }

export default function App() {
  const [route, setRoute] = useState(currentRoute());
  useEffect(() => {
    const onPopState = () => setRoute(currentRoute());
    addEventListener('popstate', onPopState);
    return () => removeEventListener('popstate', onPopState);
  }, []);
  const navigate = path => { history.pushState({}, '', `/${path}`); setRoute(path); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const activeRoute = sections.some(([id]) => id === route) ? route : 'gioi-thieu';
  return <><Header current={activeRoute} navigate={navigate} /><main>
    {activeRoute === 'gioi-thieu' && <IntroPage navigate={navigate} />}
    {activeRoute === 'ban-do' && <MapPage navigate={navigate} />}
    {activeRoute === 'lien-chi' && <LienChiPage />}
    {activeRoute === 'cau-lac-bo' && <ClubPage />}
  </main><footer className="site-footer"><b>UET NAVIGATOR</b><span>Nền tảng thông tin dành cho sinh viên Trường Đại học Công nghệ — ĐHQGHN.</span><span>© {new Date().getFullYear()}</span></footer></>;
}

function Header({ current, navigate }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><button className="brand" onClick={() => navigate('gioi-thieu')} aria-label="Về trang giới thiệu"><span className="brand-mark">UET</span><span><b>UET NAVIGATOR</b><small>HÒA LẠC · K71</small></span></button><button className="mobile-menu" onClick={() => setOpen(value => !value)} aria-label="Mở menu" aria-expanded={open}>☰</button><nav className={open ? 'open' : ''}>{sections.map(([id, label]) => <button key={id} className={current === id ? 'active' : ''} onClick={() => { navigate(id); setOpen(false); }}>{label}</button>)}</nav><span className="header-tag">HÒA LẠC</span></header>;
}

function IntroPage({ navigate }) {
  return <section className="content-page split"><div><p className="eyebrow">VỀ UET NAVIGATOR</p><h1>Khởi đầu hành trình<br /><em>tại UET.</em></h1></div><div><p className="lead">Một không gian số gọn gàng để tân sinh viên khám phá khuôn viên, kết nối với Liên chi và tìm cộng đồng phù hợp.</p><p>Thông tin được tổ chức thành bốn khu vực rõ ràng: giới thiệu, bản đồ, Liên chi và câu lạc bộ. Mỗi khu vực có dữ liệu và tài nguyên riêng để dễ cập nhật, mở rộng và sử dụng.</p><div className="actions"><button className="primary" onClick={() => navigate('ban-do')}>Khám phá bản đồ →</button><button className="secondary" onClick={() => navigate('lien-chi')}>Xem các Liên chi</button></div><blockquote>“Kết nối tri thức, cộng đồng và những trải nghiệm đầu tiên tại UET.”<small>UET NAVIGATOR</small></blockquote></div></section>;
}

function MapPage({ navigate }) {
  return <section className="map-page"><div className="map-copy"><p className="eyebrow">BẢN ĐỒ KHUÔN VIÊN</p><h1>Khám phá Hòa Lạc<br /><em>theo cách của bạn.</em></h1><p>Khu vực bản đồ đã được tách riêng để sẵn sàng tích hợp dữ liệu 2D, panorama hoặc mô hình 3D khi được bàn giao. Các section thông tin khác vẫn hoạt động độc lập.</p><div className="actions"><button className="primary" onClick={() => document.querySelector('#map-viewer')?.requestFullscreen?.()}>Mở toàn màn hình ↗</button><button className="secondary" onClick={() => navigate('cau-lac-bo')}>Khám phá CLB →</button></div><div className="stats"><span><b>01</b>Khu vực<br />bản đồ</span><span><b>08</b>Liên chi</span><span><b>24</b>Câu lạc bộ</span></div></div><div id="map-viewer" className="map-viewer"><Suspense fallback={<div className="map-wait" role="status"><strong>Đang tải bản đồ 3D…</strong><span>Đang chuẩn bị không gian tham quan khuôn viên.</span></div>}><CampusMapModule /></Suspense></div></section>;
}

function Logo({ item }) {
  const [broken, setBroken] = useState(false);
  const monogram = item.monogram || item.name.replace(/^(CLB|Liên chi)\s+/i, '').slice(0, 2).toUpperCase();
  return !item.logoUrl || broken ? <span className="item-logo is-monogram" aria-hidden="true">{monogram}</span> : <img className="item-logo" src={item.logoUrl} alt={`Logo ${item.name}`} width="128" height="128" loading="lazy" decoding="async" onError={() => setBroken(true)} />;
}
function groupParagraphs(paragraphs = []) { return paragraphs.reduce((groups, item) => { const previous = groups[groups.length - 1]; if (item.isBullet && previous?.type === 'list') previous.items.push(item.text); else if (item.isBullet) groups.push({ type: 'list', items: [item.text] }); else groups.push({ type: 'text', text: item.text }); return groups; }, []); }
function Modal({ title, close, children }) { useEffect(() => { const onKey = event => event.key === 'Escape' && close(); addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey); }, [close]); return <div className="modal"><button className="backdrop" aria-label="Đóng" onClick={close} /><section role="dialog" aria-modal="true" aria-label={title}><button className="close" aria-label="Đóng" onClick={close}>×</button><h2>{title}</h2>{children}</section></div>; }
function DirectoryDetail({ item, type, close }) { const blocks = useMemo(() => groupParagraphs(item.paragraphs), [item.paragraphs]); return <Modal title={item.name} close={close}><div className="directory-detail"><header><Logo item={item} /><div>{item.shortName && <p className="detail-short">{item.shortName}</p>}<p className="detail-meta"><span>{type}</span>{item.governingBody && <span>{item.governingBody}</span>}</p></div></header>{blocks.length ? <div className="detail-body">{blocks.map((block, index) => block.type === 'list' ? <ul key={index}>{block.items.map((text, itemIndex) => <li key={itemIndex}>{text}</li>)}</ul> : <p key={index}>{block.text}</p>)}</div> : <p className="detail-empty">Nội dung giới thiệu đang được cập nhật.</p>}<footer className="detail-actions">{item.fanpageUrl ? <a className="primary" href={item.fanpageUrl} target="_blank" rel="noreferrer">Fanpage Facebook ↗</a> : <span className="detail-empty">Đơn vị chưa cung cấp fanpage.</span>}</footer></div></Modal>; }
function SearchInput({ value, onChange, placeholder }) { return <label className="directory-search"><span>⌕</span><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} /></label>; }
function Loading({ error }) { return <section className="content-page"><p className="eyebrow">ĐANG TẢI</p><h1>{error || 'Đang tải dữ liệu từ máy chủ…'}</h1></section>; }

function LienChiPage() { const [items, setItems] = useState(null); const [error, setError] = useState(''); const [selectedId, setSelectedId] = useState(null); const [query, setQuery] = useState(''); useEffect(() => { api('/lien-chi').then(setItems).catch(reason => setError(reason.message)); }, []); if (!items) return <Loading error={error} />; const needle = normalizeSearch(query.trim()); const shown = needle ? items.filter(item => normalizeSearch(`${item.name} ${item.shortName} ${item.summary}`).includes(needle)) : items; const selected = items.find(item => item.id === selectedId); return <section className="directory-page lien-chi-page"><div className="directory-heading"><p className="eyebrow">CỘNG ĐỒNG KHOA · VIỆN</p><h1>{String(items.length).padStart(2, '0')} Liên chi,<br /><em>một tinh thần UET.</em></h1><p>Chọn một logo để đọc bài giới thiệu và truy cập kênh thông tin chính thức của Liên chi.</p><SearchInput value={query} onChange={setQuery} placeholder="Tìm Liên chi…" /></div><div className="directory-grid">{shown.map(item => <button key={item.id} type="button" className="directory-card" onClick={() => setSelectedId(item.id)} aria-label={`Xem giới thiệu ${item.name}`}><Logo item={item} /><small>LIÊN CHI · {item.unitType}</small><h2>{item.name}</h2>{item.shortName && <span>{item.shortName}</span>}<b>Xem giới thiệu →</b></button>)}</div>{!shown.length && <p className="detail-empty">Không tìm thấy Liên chi khớp “{query}”.</p>}{selected && <DirectoryDetail item={selected} type={`Liên chi · ${selected.unitType}`} close={() => setSelectedId(null)} />}</section>; }
function ClubPage() { const [clubs, setClubs] = useState(null); const [error, setError] = useState(''); const [filter, setFilter] = useState('all'); const [selectedId, setSelectedId] = useState(null); const [query, setQuery] = useState(''); useEffect(() => { api('/clubs').then(setClubs).catch(reason => setError(reason.message)); }, []); if (!clubs) return <Loading error={error} />; const available = clubCategories.filter(([id]) => clubs.some(club => club.category === id)); const needle = normalizeSearch(query.trim()); const filtered = filter === 'all' ? clubs : clubs.filter(club => club.category === filter); const shown = needle ? filtered.filter(club => normalizeSearch(`${club.name} ${club.shortName} ${club.summary}`).includes(needle)) : filtered; const selected = clubs.find(club => club.id === selectedId); return <section className="directory-page clubs-page"><p className="eyebrow">CỘNG ĐỒNG SINH VIÊN</p><h1>{clubs.length} câu lạc bộ,<br /><em>vô vàn điều chờ đợi.</em></h1><p className="directory-copy">Từ học thuật, công nghệ đến nghệ thuật và thể thao — hãy tìm cộng đồng phù hợp với bạn.</p><div className="filters">{[['all', 'Tất cả'], ...available].map(([id, label]) => <button key={id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>{label}</button>)}</div><SearchInput value={query} onChange={setQuery} placeholder="Tìm câu lạc bộ…" /><div className="directory-grid club-grid">{shown.map(club => <button key={club.id} type="button" className="directory-card club-card" onClick={() => setSelectedId(club.id)} aria-label={`Xem giới thiệu ${club.name}`}><Logo item={club} /><h2>{club.name}</h2>{club.shortName && <small>{club.shortName}</small>}<b>Xem giới thiệu →</b></button>)}</div>{!shown.length && <p className="detail-empty">Không tìm thấy CLB khớp bộ lọc.</p>}{selected && <DirectoryDetail item={selected} type={clubCategoryLabels[selected.category]} close={() => setSelectedId(null)} />}</section>; }
