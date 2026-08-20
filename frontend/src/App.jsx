import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Eye, HeartHandshake, Menu, Rocket, Search, X } from 'lucide-react';

const CampusMapModule = lazy(() => import('./features/campus-map/CampusMapModule'));

const sections = [
  ['ban-do', 'Khám phá'],
  ['gioi-thieu', 'Giới thiệu'],
  ['lien-chi', 'Khoa & Viện'],
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

function normalizeSearch(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function currentRoute() {
  return location.pathname.replace(/\/+$/, '').slice(1) || 'gioi-thieu';
}

function MapCanvas({ className = '' }) {
  return <div id="map-viewer" className={className}>
    <Suspense fallback={<div className="map-wait" role="status"><strong>Đang tải bản đồ 3D…</strong><span>Đang chuẩn bị không gian tham quan khuôn viên.</span></div>}>
      <CampusMapModule />
    </Suspense>
  </div>;
}

export default function App() {
  const [route, setRoute] = useState(currentRoute());

  useEffect(() => {
    const onPopState = () => setRoute(currentRoute());
    addEventListener('popstate', onPopState);
    return () => removeEventListener('popstate', onPopState);
  }, []);

  const navigate = path => {
    if (currentRoute() !== path) history.pushState({}, '', `/${path}`);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const activeRoute = sections.some(([id]) => id === route) ? route : 'gioi-thieu';

  return <div className="app-shell">
    <Header current={activeRoute} navigate={navigate} />
    <main>
      {activeRoute === 'gioi-thieu' && <IntroPage navigate={navigate} />}
      {activeRoute === 'ban-do' && <MapPage />}
      {activeRoute === 'lien-chi' && <LienChiPage />}
      {activeRoute === 'cau-lac-bo' && <ClubPage />}
    </main>
    {activeRoute !== 'ban-do' && <Footer />}
  </div>;
}

function Header({ current, navigate }) {
  const [open, setOpen] = useState(false);
  const goTo = id => {
    navigate(id);
    setOpen(false);
  };

  return <header className="site-header">
    <div className="site-container header-inner">
      <button className="brand" onClick={() => goTo('gioi-thieu')} aria-label="Về trang giới thiệu UET Navigator">
        <span className="brand-mark">UET</span>
        <span className="brand-copy"><strong>UET NAVIGATOR</strong></span>
      </button>
      <nav className="main-nav" aria-label="Điều hướng chính">
        {sections.map(([id, label]) => <button key={id} className={current === id ? 'active' : ''} aria-current={current === id ? 'page' : undefined} onClick={() => goTo(id)}>{label}</button>)}
      </nav>
      <button className="mobile-menu" type="button" onClick={() => setOpen(value => !value)} aria-label={open ? 'Đóng menu' : 'Mở menu'} aria-expanded={open}>{open ? <X size={21} /> : <Menu size={22} />}</button>
      {open && <nav className="mobile-nav" aria-label="Điều hướng di động">
        {sections.map(([id, label]) => <button key={id} className={current === id ? 'active' : ''} onClick={() => goTo(id)}>{label}<ArrowRight size={16} aria-hidden="true" /></button>)}
      </nav>}
    </div>
  </header>;
}

function IntroPage({ navigate }) {
  return <>
    <section className="intro-hero">
      <div className="hero-media" aria-hidden="true">
        <img src="/assets/map/map_tech_hero.png" alt="" />
        <div className="hero-media-blend" />
      </div>
      <div className="site-container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Khám phá UET Hòa Lạc</p>
          <h1><span className="hero-title-primary">Trường Đại học Công nghệ</span><span className="hero-title-location">ĐHQGHN – Hòa Lạc</span></h1>
          <p>UET Navigator là cánh cửa số để khám phá không gian, con người và cộng đồng của UET.</p>
          <div className="actions"><button className="btn btn-primary" onClick={() => navigate('ban-do')}>Khám phá bản đồ <ArrowRight size={17} aria-hidden="true" /></button><button className="btn btn-dark-secondary" onClick={() => navigate('lien-chi')}>Xem Khoa & Viện</button></div>
        </div>
      </div>
      <div className="site-container hero-stats-wrap"><section className="stat-bar" aria-label="Tổng quan UET Navigator"><Stat value="08" label="Khoa & Viện" caption="Đa lĩnh vực, tiên phong công nghệ" /><Stat value="24+" label="Câu lạc bộ" caption="Năng động – Sáng tạo – Kết nối" /><Stat value="20+" label="Năm phát triển" caption="Vững nền tảng, bứt phá tương lai" /><Stat value="25.000+" label="Sinh viên & Cựu sinh viên" caption="Cộng đồng mạnh mẽ, toàn cầu" /></section></div>
    </section>
    <section className="story-section tech-bg">
      <div className="site-container about-layout">
        <div className="about-copy"><p className="eyebrow">Về UET</p><h2>Kiến tạo công nghệ vì con người và tương lai</h2><p className="story-lead">Khám phá hành trình học tập, nghiên cứu và kết nối cộng đồng trong một không gian số trực quan, luôn sẵn sàng cho những trải nghiệm đầu tiên tại Hòa Lạc.</p><button className="btn btn-ghost" onClick={() => navigate('lien-chi')}>Khám phá hệ sinh thái UET <ArrowRight size={17} aria-hidden="true" /></button></div>
        <Principle icon={Rocket} title="Sứ mệnh" text="Đào tạo nguồn nhân lực công nghệ chất lượng cao, tạo ra tri thức và giá trị bền vững." />
        <Principle icon={Eye} title="Tầm nhìn" text="Trở thành trung tâm đổi mới sáng tạo, kết nối nghiên cứu với những thách thức của tương lai." />
        <Principle icon={HeartHandshake} title="Giá trị cốt lõi" text="Đổi mới sáng tạo, chất lượng cao, hợp tác và tinh thần nhân văn." />
        <blockquote className="future-quote"><p className="eyebrow">UET / FUTURE</p><strong>Innovative Thinking for the Future</strong></blockquote>
      </div>
    </section>
  </>;
}

function Stat({ value, label, caption }) {
  return <article className="stat"><strong>{value}</strong><span>{label}</span><small>{caption}</small></article>;
}

function Principle({ icon: Icon, title, text }) {
  return <article className="principle-card"><span className="principle-icon"><Icon size={24} aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p></article>;
}

function MapPage() {
  return <section className="explorer-page" aria-label="Bản đồ 3D khuôn viên UET"><MapCanvas className="explorer-map-viewer" /></section>;
}

function Logo({ item }) {
  const [broken, setBroken] = useState(false);
  const monogram = item.monogram || item.name.replace(/^(CLB|Liên chi)\s+/i, '').slice(0, 3).toUpperCase();
  return !item.logoUrl || broken ? <span className="entity-logo is-monogram" aria-hidden="true">{monogram}</span> : <img className="entity-logo" src={item.logoUrl} alt={`Logo ${item.name}`} width="128" height="128" loading="lazy" decoding="async" onError={() => setBroken(true)} />;
}

function groupParagraphs(paragraphs = []) {
  return paragraphs.reduce((groups, item) => {
    const previous = groups[groups.length - 1];
    if (item.isBullet && previous?.type === 'list') previous.items.push(item.text);
    else if (item.isBullet) groups.push({ type: 'list', items: [item.text] });
    else groups.push({ type: 'text', text: item.text });
    return groups;
  }, []);
}

function SearchInput({ value, onChange, placeholder }) {
  return <label className="directory-search"><Search size={18} aria-hidden="true" /><span className="visually-hidden">{placeholder}</span><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function Loading({ error }) {
  return <section className="loading-page site-container"><p className="eyebrow">Đang tải</p><h1>{error || 'Đang tải dữ liệu từ máy chủ…'}</h1></section>;
}

function EntityCard({ item, type, meta, selected, onSelect, actionLabel }) {
  const backgroundStyle = item.backgroundImage ? { backgroundImage: `url("${item.backgroundImage}")` } : undefined;
  return <button type="button" className={`entity-card${selected ? ' selected' : ''}${item.backgroundImage ? ' has-background-image' : ''}`} onClick={onSelect} aria-pressed={selected}>
    {item.backgroundImage && <span className="entity-visual-media" style={backgroundStyle} aria-hidden="true" />}
    <Logo item={item} /><span className="entity-type">{type}</span><h2>{item.name}</h2><span className="entity-meta">{meta || item.summary || 'Thông tin đang được cập nhật'}</span><span className="entity-link">{actionLabel} <ArrowRight size={15} aria-hidden="true" /></span>
  </button>;
}

function DetailPanel({ item, type, dark = false, onClose }) {
  const blocks = useMemo(() => groupParagraphs(item.paragraphs), [item.paragraphs]);
  return <aside className={`detail-panel${dark ? ' detail-panel-dark' : ''}`} aria-label={`Thông tin ${item.name}`}>
    <div className={`detail-visual${item.backgroundImage ? ' has-background-image' : ''}`}>{item.backgroundImage && <span className="detail-visual-media" style={{ backgroundImage: `url("${item.backgroundImage}")` }} aria-hidden="true" />}<button className="detail-close" type="button" onClick={onClose} aria-label="Đóng thông tin chi tiết"><X size={18} aria-hidden="true" /></button><Logo item={item} /><span className="entity-type">{type}</span><h2>{item.name}</h2>{item.shortName && <p className="detail-short">{item.shortName}</p>}<p>{item.summary || 'Nội dung giới thiệu đang được cập nhật.'}</p></div>
    <div className="detail-body"><section className="detail-section"><h3>Giới thiệu</h3>{blocks.length ? blocks.map((block, index) => block.type === 'list' ? <ul key={index}>{block.items.map((text, itemIndex) => <li key={itemIndex}>{text}</li>)}</ul> : <p key={index}>{block.text}</p>) : <p>Nội dung giới thiệu đang được cập nhật.</p>}</section>{item.governingBody && <section className="detail-section"><h3>Đơn vị chủ quản</h3><p>{item.governingBody}</p></section>}<div className="detail-actions">{item.fanpageUrl ? <a className="btn btn-primary" href={item.fanpageUrl} target="_blank" rel="noreferrer">Fanpage <ExternalLink size={16} aria-hidden="true" /></a> : <span className="unavailable">Đơn vị chưa cung cấp liên kết chính thức.</span>}</div></div>
  </aside>;
}

function useDirectorySelection(selectedId, setSelectedId, shown) {
  const selected = selectedId === null ? null : shown.find(item => item.id === selectedId) || null;

  useEffect(() => {
    if (selectedId !== null && !selected) setSelectedId(null);
  }, [selected, selectedId, setSelectedId]);

  useEffect(() => {
    if (selectedId === null) return undefined;
    const onKeyDown = event => {
      if (event.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId, setSelectedId]);

  return selected;
}

function LienChiPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState('all');

  useEffect(() => { api('/lien-chi').then(setItems).catch(reason => setError(reason.message)); }, []);
  const availableItems = items || [];
  const needle = normalizeSearch(query.trim());
  const byType = unitFilter === 'all' ? availableItems : availableItems.filter(item => item.unitType === unitFilter);
  const shown = needle ? byType.filter(item => normalizeSearch(`${item.name} ${item.shortName} ${item.summary}`).includes(needle)) : byType;
  const selected = useDirectorySelection(selectedId, setSelectedId, shown);
  if (!items) return <Loading error={error} />;

  return <section className="directory-page academic-page tech-bg"><div className={`site-container directory-layout${selected ? ' has-detail' : ' is-full-width'}`}><div><header className="directory-head"><p className="eyebrow">Academic communities</p><h1>Khám phá Khoa & Viện / Liên chi</h1><p>Mỗi đơn vị là một điểm kết nối của đào tạo, nghiên cứu và cộng đồng sinh viên UET.</p></header><div className="toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Tìm kiếm Khoa, Viện hoặc lĩnh vực..." /><div className="chips" aria-label="Lọc đơn vị">{[['all', 'Tất cả'], ['Khoa', 'Khoa'], ['Viện', 'Viện']].map(([id, label]) => <button key={id} className={`chip${unitFilter === id ? ' active' : ''}`} onClick={() => setUnitFilter(id)} aria-pressed={unitFilter === id}>{label}</button>)}</div></div><div className="entity-grid">{shown.map(item => <EntityCard key={item.id} item={item} type={`Liên chi · ${item.unitType}`} meta={item.shortName} selected={selected?.id === item.id} onSelect={() => setSelectedId(current => current === item.id ? null : item.id)} actionLabel="Xem giới thiệu" />)}</div>{!shown.length && <p className="empty-state">Không tìm thấy Liên chi khớp bộ lọc.</p>}</div>{selected && <DetailPanel item={selected} type={`Liên chi · ${selected.unitType}`} onClose={() => setSelectedId(null)} />}</div></section>;
}

function ClubPage() {
  const [clubs, setClubs] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => { api('/clubs').then(setClubs).catch(reason => setError(reason.message)); }, []);
  const availableClubs = clubs || [];
  const available = clubCategories.filter(([id]) => availableClubs.some(club => club.category === id));
  const needle = normalizeSearch(query.trim());
  const filtered = filter === 'all' ? availableClubs : availableClubs.filter(club => club.category === filter);
  const shown = needle ? filtered.filter(club => normalizeSearch(`${club.name} ${club.shortName} ${club.summary}`).includes(needle)) : filtered;
  const selected = useDirectorySelection(selectedId, setSelectedId, shown);
  if (!clubs) return <Loading error={error} />;

  return <section className="directory-page club-page tech-bg"><div className={`site-container directory-layout${selected ? ' has-detail' : ' is-full-width'}`}><div><header className="directory-head"><p className="eyebrow">Cộng đồng câu lạc bộ</p><h1>Kết nối đam mê — Kiến tạo giá trị — Lan tỏa ảnh hưởng</h1><p>Khám phá một cộng đồng đa dạng, nơi mỗi ý tưởng và sở thích đều có không gian để phát triển.</p></header><div className="toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Tìm kiếm câu lạc bộ, lĩnh vực, kỹ năng..." /></div><div className="chips" aria-label="Lọc câu lạc bộ">{[['all', 'Tất cả'], ...available].map(([id, label]) => <button key={id} className={`chip${filter === id ? ' active' : ''}`} onClick={() => setFilter(id)} aria-pressed={filter === id}>{label}</button>)}</div><div className="entity-grid club-grid">{shown.map(club => <EntityCard key={club.id} item={club} type={clubCategoryLabels[club.category]} meta={club.shortName || club.summary} selected={selected?.id === club.id} onSelect={() => setSelectedId(current => current === club.id ? null : club.id)} actionLabel="Khám phá" />)}</div>{!shown.length && <p className="empty-state">Không tìm thấy CLB khớp bộ lọc.</p>}</div>{selected && <DetailPanel item={selected} type={`UET Hòa Lạc · ${clubCategoryLabels[selected.category]}`} dark onClose={() => setSelectedId(null)} />}</div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="site-container footer-inner"><div><b>UET NAVIGATOR</b><span>Không gian khám phá số dành cho cộng đồng UET Hòa Lạc.</span></div><span>© {new Date().getFullYear()} UET Navigator</span></div></footer>;
}
