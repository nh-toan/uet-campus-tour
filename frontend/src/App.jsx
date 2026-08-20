import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import uetLogoUrl from '../../LOGO KHOA - BO MON - VIEN/UET.png';
import { ArrowRight, ExternalLink, Eye, HeartHandshake, Menu, Rocket, Search, X } from 'lucide-react';

const CampusMapModule = lazy(() => import('./features/campus-map/CampusMapModule'));

const sections = [
  ['ban-do', 'Bản đồ khuôn viên'],
  ['gioi-thieu', 'Giới thiệu chung'],
  ['lien-chi', 'Khoa & Viện'],
  ['cau-lac-bo', 'Câu lạc bộ']
];
const clubCategories = [['academic', 'Học thuật'], ['tech', 'Công nghệ'], ['art', 'Nghệ thuật'], ['sport', 'Thể thao'], ['media', 'Truyền thông'], ['community', 'Cộng đồng']];
const clubCategoryLabels = Object.fromEntries(clubCategories);
const lienChiEnglishNames = {
  'co-hoc-ky-thuat-tu-dong-hoa': 'Faculty of Engineering Mechanics and Automation (FEMA)',
  'cong-nghe-thong-tin': 'Faculty of Information Technology (FIT)',
  'dien-tu-vien-thong': 'Faculty of Electronics and Telecommunications (FET)',
  'cong-nghe-xay-dung-giao-thong': 'Faculty of Civil Engineering (FCE)',
  'vat-ly-ky-thuat-cong-nghe-nano': 'Faculty of Engineering Physics and Nanotechnology (FEPN)',
  'vien-cong-nghe-hang-khong-vu-tru': 'School of Aerospace Engineering (SAE)',
  'vien-tri-tue-nhan-tao': 'Institute for Artificial Intelligence (IAI)',
  'cong-nghe-nong-nghiep': 'Faculty of Agricultural Technology (FAT)'
};

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
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('uet-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return 'light';
  });

  useEffect(() => {
    const onPopState = () => setRoute(currentRoute());
    addEventListener('popstate', onPopState);
    return () => removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('uet-theme', theme);
  }, [theme]);

  const navigate = path => {
    if (currentRoute() !== path) history.pushState({}, '', `/${path}`);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const activeRoute = sections.some(([id]) => id === route) ? route : 'gioi-thieu';

  return <div className="app-shell">
    <Header current={activeRoute} navigate={navigate} theme={theme} onThemeToggle={() => setTheme(value => value === 'dark' ? 'light' : 'dark')} />
    <main>
      {activeRoute === 'gioi-thieu' && <IntroPage navigate={navigate} />}
      {activeRoute === 'ban-do' && <MapPage />}
      {activeRoute === 'lien-chi' && <LienChiPage />}
      {activeRoute === 'cau-lac-bo' && <ClubPage />}
    </main>
    {activeRoute !== 'ban-do' && <Footer />}
  </div>;
}

function Header({ current, navigate, theme, onThemeToggle }) {
  const [open, setOpen] = useState(false);
  const goTo = id => {
    navigate(id);
    setOpen(false);
  };
  const nextThemeLabel = theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';

  return <header className="site-header">
    <div className="site-container header-inner">
      <button className="brand" onClick={() => goTo('gioi-thieu')} aria-label="Về trang giới thiệu Trường Đại học Công nghệ">
        <img className="brand-crest" src={uetLogoUrl} alt="Logo Trường Đại học Công nghệ" width="52" height="52" />
        <span className="brand-copy"><small>ĐẠI HỌC QUỐC GIA HÀ NỘI</small><strong>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ</strong></span>
      </button>
      <nav className="main-nav" aria-label="Điều hướng chính">
        {sections.map(([id, label]) => <button key={id} className={current === id ? 'active' : ''} aria-current={current === id ? 'page' : undefined} onClick={() => goTo(id)}>{label}</button>)}
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" type="button" onClick={onThemeToggle} aria-label={nextThemeLabel} aria-pressed={theme === 'dark'}><span aria-hidden="true">{theme === 'dark' ? '☀' : '◐'}</span><span>{theme === 'dark' ? 'Sáng' : 'Tối'}</span></button>
        <button className="mobile-menu" type="button" onClick={() => setOpen(value => !value)} aria-label={open ? 'Đóng menu' : 'Mở menu'} aria-expanded={open}>{open ? <X size={21} /> : <Menu size={22} />}</button>
      </div>
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
          <p className="eyebrow">Khám phá</p>
          <h1>Trường Đại học Công nghệ<br /><span>ĐHQGHN – Hòa Lạc</span></h1>
          <p className="hero-tagline">Công nghệ tiên phong, Kiến tạo tương lai</p>
          <p className="hero-description">UET Navigator giúp bạn khám phá toàn diện Trường Đại học Công nghệ – ĐHQGHN: từ bản đồ, khoa & viện, câu lạc bộ đến cộng đồng sinh viên năng động. Hành trình bắt đầu từ đây.</p>
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
  const metaText = meta ?? item.summary ?? 'Thông tin đang được cập nhật';
  return <button type="button" className={`entity-card${selected ? ' selected' : ''}${item.backgroundImage ? ' has-background-image' : ''}`} onClick={onSelect} aria-pressed={selected}>
    {item.backgroundImage && <span className="entity-visual-media" style={backgroundStyle} aria-hidden="true" />}
    <Logo item={item} /><span className="entity-type">{type}</span><h2>{item.name}</h2>{metaText && <span className="entity-meta">{metaText}</span>}<span className="entity-link">{actionLabel} <ArrowRight size={15} aria-hidden="true" /></span>
  </button>;
}

function DetailPanel({ item, type, dark = false, onClose, subtitle = item.shortName, showActivityGallery = true }) {
  const detailSections = useMemo(() => {
    if (Array.isArray(item.sections)) return item.sections;
    const legacyItems = Array.isArray(item.paragraphs) ? item.paragraphs : [];
    return legacyItems.length ? [{ title: 'Giới thiệu', items: legacyItems }] : [];
  }, [item.paragraphs, item.sections]);
  const galleryItems = [
    { code: 'FIT', src: '/assets/lien-chi/backgrounds/fit.jpg', alt: 'Hoạt động của Khoa Công nghệ Thông tin (FIT)' },
    { code: 'FET', src: '/assets/lien-chi/backgrounds/fet.jpg', alt: 'Hoạt động của Khoa Điện tử Viễn thông (FET)' },
    { code: 'FEMA', src: '/assets/lien-chi/backgrounds/fema.jpg', alt: 'Hoạt động của Khoa Cơ học Kỹ thuật và Tự động hóa (FEMA)' },
    { code: 'IAI', src: '/assets/lien-chi/backgrounds/iai.jpg', alt: 'Hoạt động của Viện Trí tuệ Nhân tạo (IAI)' }
  ];
  return <>
    <div className="detail-modal-backdrop" aria-hidden="true" onClick={onClose} />
    <aside className={`detail-panel${dark ? ' detail-panel-dark' : ''}`} aria-label={`Thông tin ${item.name}`}>
      <div className="detail-close-bar"><button className="detail-close" type="button" onClick={onClose} aria-label="Đóng thông tin chi tiết"><X size={18} aria-hidden="true" /></button></div>
      <div className={`detail-visual${item.backgroundImage ? ' has-background-image' : ''}`}>{item.backgroundImage && <span className="detail-visual-media" style={{ backgroundImage: `url("${item.backgroundImage}")` }} aria-hidden="true" />}<Logo item={item} /><span className="entity-type">{type}</span><h2>{item.name}</h2>{subtitle && <p className="detail-short">{subtitle}</p>}{item.summary && <p>{item.summary}</p>}</div>
      <div className="detail-body">{detailSections.map(section => { const blocks = groupParagraphs(section.items); return <section className="detail-section" key={section.title}><h3>{section.title}</h3>{blocks.map((block, index) => block.type === 'list' ? <ul key={index}>{block.items.map((text, itemIndex) => <li key={itemIndex}>{text}</li>)}</ul> : <p key={index}>{block.text}</p>)}</section>; })}{detailSections.length > 0 && item.governingBody && <section className="detail-section"><h3>Đơn vị chủ quản</h3><p>{item.governingBody}</p></section>}{showActivityGallery && dark && <section className="activity-gallery" aria-labelledby="activity-gallery-title"><div className="activity-gallery-head"><h3 id="activity-gallery-title">Các hoạt động nổi bật của CLB</h3><p>Ảnh minh họa bố cục hiện lấy từ hoạt động Khoa/Viện.</p></div><div className="activity-gallery-grid">{galleryItems.map(image => <figure key={image.code}><img src={image.src} alt={image.alt} loading="lazy" decoding="async" /><figcaption>{image.code}</figcaption></figure>)}</div></section>}<section className="detail-section detail-contact"><h3>Liên hệ</h3>{item.fanpageUrl ? <a className="btn btn-primary" href={item.fanpageUrl} target="_blank" rel="noreferrer">Fanpage <ExternalLink size={16} aria-hidden="true" /></a> : <p className="empty-contact">Đơn vị chưa cung cấp liên kết chính thức.</p>}</section></div>
    </aside>
  </>;
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

  useEffect(() => { api('/lien-chi').then(setItems).catch(reason => setError(reason.message)); }, []);
  const availableItems = items || [];
  const needle = normalizeSearch(query.trim());
  const shown = needle ? availableItems.filter(item => normalizeSearch(`${item.name} ${lienChiEnglishNames[item.id] || ''} ${item.summary}`).includes(needle)) : availableItems;
  const selected = useDirectorySelection(selectedId, setSelectedId, shown);
  if (!items) return <Loading error={error} />;

  return <section className="directory-page academic-page tech-bg"><div className={`site-container directory-layout${selected ? ' has-detail' : ' is-full-width'}`}><div><header className="directory-head"><h1>Khám phá Liên chi Khoa / Viện</h1></header><div className="toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Tìm kiếm Khoa, Viện hoặc lĩnh vực..." /></div><div className="entity-grid">{shown.map(item => <EntityCard key={item.id} item={item} type={`Liên chi · ${item.unitType}`} meta={lienChiEnglishNames[item.id]} selected={selected?.id === item.id} onSelect={() => setSelectedId(current => current === item.id ? null : item.id)} actionLabel="Xem giới thiệu" />)}</div>{!shown.length && <p className="empty-state">Không tìm thấy Liên chi khớp bộ lọc.</p>}</div>{selected && <DetailPanel item={selected} type={`Liên chi · ${selected.unitType}`} subtitle={lienChiEnglishNames[selected.id]} showLienChiGallery onClose={() => setSelectedId(null)} />}</div></section>;
}

function clubDisplayName(club) {
  return club.shortName;
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

  return <section className="directory-page club-page tech-bg"><div className={`site-container directory-layout${selected ? ' has-detail' : ' is-full-width'}`}><div><header className="directory-head"><p className="eyebrow">Cộng đồng câu lạc bộ</p><h1>Kết nối đam mê — Kiến tạo giá trị — Lan tỏa ảnh hưởng</h1><p>Khám phá một cộng đồng đa dạng, nơi mỗi ý tưởng và sở thích đều có không gian để phát triển.</p></header><div className="toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Tìm kiếm câu lạc bộ, lĩnh vực, kỹ năng..." /></div><div className="chips" aria-label="Lọc câu lạc bộ">{[['all', 'Tất cả'], ...available].map(([id, label]) => <button key={id} className={`chip${filter === id ? ' active' : ''}`} onClick={() => setFilter(id)} aria-pressed={filter === id}>{label}</button>)}</div><div className="entity-grid club-grid">{shown.map(club => <EntityCard key={club.id} item={club} type={clubCategoryLabels[club.category]} meta={clubDisplayName(club)} selected={selected?.id === club.id} onSelect={() => setSelectedId(current => current === club.id ? null : club.id)} actionLabel="Khám phá" />)}</div>{!shown.length && <p className="empty-state">Không tìm thấy CLB khớp bộ lọc.</p>}</div>{selected && <DetailPanel item={selected} type={`UET Hòa Lạc · ${clubCategoryLabels[selected.category]}`} subtitle={clubDisplayName(selected)} dark onClose={() => setSelectedId(null)} />}</div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="site-container footer-inner"><div><b>UET NAVIGATOR</b><span>Không gian khám phá số dành cho cộng đồng UET Hòa Lạc.</span></div><span>© {new Date().getFullYear()} UET Navigator</span></div></footer>;
}
