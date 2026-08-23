## frontend/src/App.jsx

```jsx
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
const uetLogoUrl = '/assets/intro/uet.png';
import { ArrowRight, Building2, ChevronDown, ExternalLink, Flag, Gem, GraduationCap, Handshake, Lightbulb, Menu, Megaphone, Microscope, Search, Target, Telescope, X } from 'lucide-react';
import { introContent, introTabs } from './content/introContent';
import { YouthUnionPage } from './components/YouthUnionPage';

const ExternalVirtualTour = lazy(() => import('./features/campus-map/ExternalVirtualTour'));

const sections = [
  ['ban-do', 'Bản đồ khuôn viên'],
  ['gioi-thieu', 'Giới thiệu chung'],
  ['doan-thanh-nien-hoi-sinh-vien', 'Đoàn Thanh niên – Hội Sinh viên'],
  ['lien-chi', 'Liên chi Khoa/ Viện'],
  ['cau-lac-bo', 'Câu lạc bộ']
];
const clubCategories = [['academic', 'Học thuật'], ['tech', 'Công nghệ'], ['art', 'Nghệ thuật'], ['sport', 'Thể thao'], ['media', 'Truyền thông'], ['community', 'Cộng đồng']];
const clubCategoryLabels = Object.fromEntries(clubCategories);
const introMissionIcons = {
  mission: Flag,
  vision: Telescope,
  'education-philosophy': Lightbulb,
  'core-values': Gem,
  'action-slogan': Megaphone
};
const introTaskIcons = {
  training: GraduationCap,
  'science-technology': Microscope,
  'organization-governance': Building2,
  'international-integration': Handshake
};
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
  const response = await fetch(`/api${path}`, { cache: 'no-store' });
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

function VirtualTourFrame({ className = '' }) {
  return <div id="map-viewer" className={className}>
    <Suspense fallback={<div className="map-wait" role="status"><strong>Đang tải bản đồ khuôn viên…</strong><span>Đang chuẩn bị không gian tham quan.</span></div>}>
      <ExternalVirtualTour />
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
      {activeRoute === 'gioi-thieu' && <IntroPage />}
      {activeRoute === 'ban-do' && <MapPage />}
      {activeRoute === 'doan-thanh-nien-hoi-sinh-vien' && <YouthUnionPage navigate={navigate} />}
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

function IntroPage() {
  return <>
    <section className="intro-hero">
      <div className="hero-media" aria-hidden="true">
        <img src="/assets/map/map_tech_hero.png" alt="" />
        <div className="hero-media-blend" />
      </div>
      <div className="site-container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Khám phá</p>
          <h1><span className="hero-title-primary">Trường Đại học Công nghệ</span><span className="hero-title-location">ĐHQGHN – Hòa Lạc</span></h1>
          <p className="hero-tagline">Công nghệ tiên phong, Kiến tạo tương lai</p>
          <p className="hero-description">UET Navigator giúp bạn khám phá toàn diện Trường Đại học Công nghệ – ĐHQGHN: từ bản đồ, khoa & viện, câu lạc bộ đến cộng đồng sinh viên năng động. Hành trình bắt đầu từ đây.</p>
        </div>
      </div>
    </section>
    <div className="intro-content-flow tech-bg">
      <StrategicContent />
      <IntroClosingSection />
    </div>
  </>;
}

function OrganizationChart() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const openLightbox = event => {
    triggerRef.current = event.currentTarget;
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnKeyDown = event => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'Tab') event.preventDefault();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnKeyDown);
      triggerRef.current?.focus();
    };
  }, [lightboxOpen]);

  return <>
    <div className="intro-organization-diagram">
      <button className="intro-organization-preview" type="button" onClick={openLightbox} aria-label="Mở sơ đồ cơ cấu tổ chức đầy đủ">
        <img src="/assets/intro/uet-organization-chart.webp" alt="Sơ đồ cơ cấu tổ chức Trường Đại học Công nghệ" width="1448" height="1086" loading="lazy" decoding="async" />
      </button>
      <div className="intro-organization-link-wrap">
        <button className="intro-organization-link" type="button" onClick={openLightbox}>Xem sơ đồ tổ chức đầy đủ <ArrowRight size={17} aria-hidden="true" /></button>
      </div>
    </div>
    {lightboxOpen && <div className="intro-lightbox" role="dialog" aria-modal="true" aria-labelledby="intro-lightbox-title" onClick={event => {
      if (event.target === event.currentTarget) setLightboxOpen(false);
    }}>
      <h2 id="intro-lightbox-title" className="visually-hidden">Sơ đồ cơ cấu tổ chức Trường Đại học Công nghệ</h2>
      <button ref={closeButtonRef} className="intro-lightbox-close" type="button" onClick={() => setLightboxOpen(false)} aria-label="Đóng sơ đồ đầy đủ"><X size={24} aria-hidden="true" /></button>
      <div className="intro-lightbox-image">
        <img src="/assets/intro/uet-organization-chart.webp" alt="Sơ đồ cơ cấu tổ chức Trường Đại học Công nghệ phóng to" width="1448" height="1086" />
      </div>
    </div>}
  </>;
}

function MilestoneSection() {
  return <section className="intro-milestone-section" aria-labelledby="milestone-title">
    <div className="site-container intro-page-container intro-milestone-layout">
      <div className="intro-milestone-copy">
        <p className="eyebrow">Hành trình UET</p>
        <p className="intro-milestone-number">20<span>+</span></p>
        <h2 id="milestone-title">Năm phát triển</h2>
        <p>Và khẳng định vị thế trên bản đồ giáo dục và công nghệ toàn cầu.</p>
      </div>
      <div className="intro-milestone-visual" aria-hidden="true" />
    </div>
  </section>;
}

function IntroClosingSection() {
  return <>
    <section className="intro-organization-section" aria-labelledby="organization-title">
      <div className="site-container intro-page-container">
        <header className="intro-section-heading">
          <p className="eyebrow">Cơ cấu tổ chức</p>
          <h2 id="organization-title">Hệ thống tổ chức UET</h2>
          <span className="intro-heading-line" aria-hidden="true" />
        </header>
        <p className="intro-organization-lead">Một cấu trúc kết nối đào tạo, nghiên cứu, đổi mới sáng tạo và cộng đồng học thuật của Trường Đại học Công nghệ.</p>
        <OrganizationChart />
      </div>
    </section>
    <MilestoneSection />
  </>;
}

function StrategicContent() {
  const [activeSectionId, setActiveSectionId] = useState(introContent.context.id);
  const activeSection = introTabs.find(section => section.id === activeSectionId) ?? introContent.context;

  const onSectionKeyDown = (event, currentIndex) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const lastIndex = introTabs.length - 1;
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? lastIndex
        : (currentIndex + direction + introTabs.length) % introTabs.length;
    const nextSection = introTabs[nextIndex];
    setActiveSectionId(nextSection.id);
    document.getElementById(`intro-tab-${nextSection.id}`)?.focus();
  };

  return <section className="intro-strategy-section" aria-labelledby="strategy-title">
    <div className="site-container intro-page-container">
      <header className="intro-section-heading intro-strategy-heading">
        <p className="eyebrow">Định hướng phát triển</p>
        <h2 id="strategy-title">Nền tảng và tầm nhìn phát triển bền vững</h2>
        <span className="intro-heading-line" aria-hidden="true" />
      </header>
      <div className="intro-primary-tabs" role="tablist" aria-label="Nội dung định hướng phát triển">
        {introTabs.map((section, index) => {
          const isActive = activeSectionId === section.id;
          return <button
            id={`intro-tab-${section.id}`}
            key={section.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="intro-strategy-panel"
            tabIndex={isActive ? 0 : -1}
            className={`intro-primary-tab${isActive ? ' active' : ''}`}
            onClick={() => setActiveSectionId(section.id)}
            onKeyDown={event => onSectionKeyDown(event, index)}
          >
            <span className="intro-primary-tab-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="intro-primary-tab-label">{section.label}</span>
          </button>;
        })}
      </div>
      <div id="intro-strategy-panel" className="intro-section-panel" role="tabpanel" aria-labelledby={`intro-tab-${activeSection.id}`}>
        {activeSection.id === introContent.keyTasks.id
          ? <KeyTasksAccordion sections={introContent.keyTasks.sections} />
          : activeSection.id === introContent.missionVision.id
            ? <MissionVisionContent sections={introContent.missionVision.sections} />
            : <ContextContent sections={introContent.context.sections} />}
      </div>
    </div>
  </section>;
}

function ContextContent({ sections }) {
  const [activeContextId, setActiveContextId] = useState(sections[0]?.id ?? null);
  const activeContext = sections.find(section => section.id === activeContextId) ?? sections[0];

  const onContextKeyDown = (event, currentIndex) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const lastIndex = sections.length - 1;
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? lastIndex
        : (currentIndex + direction + sections.length) % sections.length;
    const nextSection = sections[nextIndex];
    setActiveContextId(nextSection.id);
    document.getElementById(`intro-context-tab-${nextSection.id}`)?.focus();
  };

  if (!activeContext) return null;

  return <div className="intro-context-layout">
    <div className="intro-context-nav" role="tablist" aria-label="Bối cảnh phát triển">
      {sections.map((section, index) => {
        const isActive = activeContext.id === section.id;
        return <button
          id={`intro-context-tab-${section.id}`}
          key={section.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-controls="intro-context-panel"
          tabIndex={isActive ? 0 : -1}
          className={isActive ? 'active' : ''}
          onClick={() => setActiveContextId(section.id)}
          onKeyDown={event => onContextKeyDown(event, index)}
        >{section.title}</button>;
      })}
    </div>
    <article id="intro-context-panel" className="intro-context-reading" role="tabpanel" aria-labelledby={`intro-context-tab-${activeContext.id}`}>
      <h3>{activeContext.title}</h3>
      <div className="intro-content-copy">
        {activeContext.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </article>
  </div>;
}

function MissionVisionContent({ sections }) {
  const cards = sections.flatMap(section => section.id === 'core-values'
    ? [
        { id: 'core-values', title: 'Giá trị cốt lõi', paragraphs: section.paragraphs.slice(0, -2) },
        { id: 'action-slogan', title: 'Khẩu hiệu hành động', paragraphs: section.paragraphs.slice(-2) }
      ]
    : [section]);

  return <div className="intro-mission-grid">
    {cards.map(card => {
      const Icon = introMissionIcons[card.id];
      return <article className={`intro-mission-card intro-mission-card-${card.id}`} key={card.id}>
        <span className="intro-card-icon"><Icon size={22} aria-hidden="true" /></span>
        <h3>{card.title}</h3>
        <div className="intro-content-copy">
          {card.paragraphs.map((paragraph, index) => <p key={`${card.id}-${index}`}>{paragraph}</p>)}
        </div>
      </article>;
    })}
  </div>;
}

function KeyTasksAccordion({ sections }) {
  const [openSectionId, setOpenSectionId] = useState(sections[0]?.id ?? null);

  return <div className="intro-accordion">
    {sections.map(section => {
      const isOpen = openSectionId === section.id;
      const panelId = `intro-accordion-panel-${section.id}`;
      const Icon = introTaskIcons[section.id];
      return <section className={`intro-accordion-item${isOpen ? ' open' : ''}`} key={section.id}>
        <h3>
          <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenSectionId(current => current === section.id ? null : section.id)}>
            <span className="intro-accordion-title"><span className="intro-accordion-icon"><Icon size={20} aria-hidden="true" /></span><span>{section.title}</span></span><ChevronDown size={21} aria-hidden="true" />
          </button>
        </h3>
        {isOpen && <div id={panelId} className="intro-accordion-panel">
          <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>
        </div>}
      </section>;
    })}
  </div>;
}

function MapPage() {
  return <section className="explorer-page" aria-label="Bản đồ khuôn viên UET"><VirtualTourFrame className="explorer-map-viewer" /></section>;
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
  const galleryItems = Array.isArray(item.activityImages) ? item.activityImages : [];
  return <>
    <div className="detail-modal-backdrop" aria-hidden="true" onClick={onClose} />
    <aside className={`detail-panel${dark ? ' detail-panel-dark' : ''}`} aria-label={`Thông tin ${item.name}`}>
      <div className="detail-close-bar"><button className="detail-close" type="button" onClick={onClose} aria-label="Đóng thông tin chi tiết"><X size={18} aria-hidden="true" /></button></div>
      <div className={`detail-visual${item.backgroundImage ? ' has-background-image' : ''}`}>{item.backgroundImage && <span className="detail-visual-media" style={{ backgroundImage: `url("${item.backgroundImage}")` }} aria-hidden="true" />}<Logo item={item} /><span className="entity-type">{type}</span><h2>{item.name}</h2>{subtitle && <p className="detail-short">{subtitle}</p>}{item.summary && <p>{item.summary}</p>}</div>
      <div className="detail-body">{detailSections.map(section => { const blocks = groupParagraphs(section.items); return <section className="detail-section" key={section.title}><h3>{section.title}</h3>{blocks.map((block, index) => block.type === 'list' ? <ul key={index}>{block.items.map((text, itemIndex) => <li key={itemIndex}>{text}</li>)}</ul> : <p key={index}>{block.text}</p>)}</section>; })}{detailSections.length > 0 && item.governingBody && <section className="detail-section"><h3>Đơn vị chủ quản</h3><p>{item.governingBody}</p></section>}{showActivityGallery && dark && galleryItems.length > 0 && <section className="activity-gallery" aria-labelledby="activity-gallery-title"><div className="activity-gallery-head"><h3 id="activity-gallery-title">Các hoạt động nổi bật của CLB</h3></div><div className={`activity-gallery-grid ${galleryItems.length === 1 ? 'count-1' : galleryItems.length === 2 ? 'count-2' : galleryItems.length === 3 ? 'count-3' : 'count-many'}`}>{galleryItems.map(image => <figure key={image.src}><img src={image.src} alt="" loading="lazy" decoding="async" /></figure>)}</div></section>}<section className="detail-section detail-contact"><h3>Liên hệ</h3>{item.fanpageUrl ? <a className="btn btn-primary" href={item.fanpageUrl} target="_blank" rel="noreferrer">Fanpage <ExternalLink size={16} aria-hidden="true" /></a> : <p className="empty-contact">Đơn vị chưa cung cấp liên kết chính thức.</p>}</section></div>
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

  return <section className="directory-page academic-page tech-bg"><div className={`site-container directory-layout${selected ? ' has-detail' : ' is-full-width'}`}><div><header className="directory-head directory-hero"><h1>Khám phá Liên chi Khoa / Viện</h1></header><div className="toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Tìm kiếm Khoa, Viện hoặc lĩnh vực..." /></div><div className="entity-grid">{shown.map(item => <EntityCard key={item.id} item={item} type="Liên chi Đoàn - Liên chi Hội" meta={lienChiEnglishNames[item.id]} selected={selected?.id === item.id} onSelect={() => setSelectedId(current => current === item.id ? null : item.id)} actionLabel="Xem giới thiệu" />)}</div>{!shown.length && <p className="empty-state">Không tìm thấy Liên chi khớp bộ lọc.</p>}</div>{selected && <DetailPanel item={selected} type={`Liên chi · ${selected.unitType}`} subtitle={lienChiEnglishNames[selected.id]} showLienChiGallery onClose={() => setSelectedId(null)} />}</div></section>;
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

  return <section className="directory-page club-page tech-bg"><div className={`site-container directory-layout${selected ? ' has-detail' : ' is-full-width'}`}><div><header className="directory-head directory-hero"><p className="eyebrow">Cộng đồng câu lạc bộ</p><h1>Kết nối đam mê — Kiến tạo giá trị — Lan tỏa ảnh hưởng</h1><p>Khám phá một cộng đồng đa dạng, nơi mỗi ý tưởng và sở thích đều có không gian để phát triển.</p></header><div className="toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Tìm kiếm câu lạc bộ, lĩnh vực, kỹ năng..." /></div><div className="chips" aria-label="Lọc câu lạc bộ">{[['all', 'Tất cả'], ...available].map(([id, label]) => <button key={id} className={`chip${filter === id ? ' active' : ''}`} onClick={() => setFilter(id)} aria-pressed={filter === id}>{label}</button>)}</div><div className="entity-grid club-grid">{shown.map(club => <EntityCard key={club.id} item={club} type={clubCategoryLabels[club.category]} meta={clubDisplayName(club)} selected={selected?.id === club.id} onSelect={() => setSelectedId(current => current === club.id ? null : club.id)} actionLabel="Khám phá" />)}</div>{!shown.length && <p className="empty-state">Không tìm thấy CLB khớp bộ lọc.</p>}</div>{selected && <DetailPanel item={{ ...selected, backgroundImage: '' }} type={`UET Hòa Lạc · ${clubCategoryLabels[selected.category]}`} subtitle={clubDisplayName(selected)} dark onClose={() => setSelectedId(null)} />}</div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="site-container footer-inner"><div><b>UET NAVIGATOR</b><span>Không gian khám phá số dành cho cộng đồng UET Hòa Lạc.</span></div><span>© {new Date().getFullYear()} UET Navigator</span></div></footer>;
}
```

## frontend/src/styles/intro.css

```css
/* General introduction page — institutional editorial composition. */
.intro-content-flow {
  position: relative;
  overflow: clip;
  color: var(--text-primary);
  background: var(--page-bg);
}

.intro-content-flow::before {
  position: absolute;
  inset: 6% 0 auto;
  height: min(720px, 48vw);
  background-image:
    linear-gradient(rgb(20 107 255 / 3%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(20 107 255 / 3%) 1px, transparent 1px);
  background-size: 44px 44px;
  content: '';
  mask-image: linear-gradient(to bottom, transparent, #000 14%, #000 68%, transparent);
  pointer-events: none;
}

.intro-content-flow.tech-bg::before { display: block; }
.intro-content-flow::after { display: none; }
.intro-page-container { max-width: 1280px; }

/* Hero: keep its established navy/photo composition and improve reading contrast. */
.intro-hero {
  min-height: clamp(500px, 57vh, 590px);
  border-radius: 0 0 24px 24px;
  background: linear-gradient(110deg, var(--navy-950) 0%, var(--navy-900) 54%, var(--navy-850) 100%);
}

.hero-media img {
  width: 60%;
  opacity: .76;
  filter: brightness(.8) saturate(.78) contrast(1.04);
  object-position: 56% 58%;
}

.hero-media::before {
  background: radial-gradient(circle at 75% 37%, rgb(76 201 255 / 16%), transparent 30%), radial-gradient(circle at 56% 68%, rgb(47 128 255 / 13%), transparent 38%);
}

.hero-media-blend {
  background:
    linear-gradient(90deg, var(--navy-950) 0%, var(--navy-950) 25%, rgb(4 21 42 / 93%) 40%, rgb(4 21 42 / 63%) 57%, rgb(4 21 42 / 18%) 74%, transparent 91%),
    linear-gradient(0deg, var(--navy-950) 0%, rgb(4 21 42 / 70%) 14%, rgb(4 21 42 / 16%) 49%, transparent 72%);
}

.hero-copy { width: min(100%, 690px); padding: 80px 0 52px; }
.hero-copy h1 { max-width: 690px; font-size: clamp(48px, 4.25vw, 66px); line-height: 1.04; letter-spacing: -.05em; }
.hero-copy > p:not(.eyebrow) { max-width: 600px; color: rgb(255 255 255 / 84%); font-size: clamp(15px, 1.15vw, 17px); line-height: 1.7; }
.hero-copy .hero-tagline { margin-top: 24px; color: var(--cyan-400); font-size: clamp(17px, 1.4vw, 21px); font-weight: 600; line-height: 1.42; }
.hero-copy .hero-description { margin-top: 13px; }

.intro-strategy-section,
.intro-organization-section,
.intro-milestone-section { position: relative; z-index: 1; }

.intro-strategy-section { padding: clamp(80px, 7vw, 104px) 0 clamp(88px, 7.5vw, 108px); }
.intro-section-heading { max-width: 820px; margin: 0 auto clamp(38px, 3.5vw, 48px); text-align: center; }
.intro-section-heading .eyebrow { margin-bottom: 13px; color: var(--blue-600); font-size: 12px; font-weight: 700; letter-spacing: .16em; }
.intro-section-heading h2 { margin: 0; color: var(--text-primary); font-size: clamp(34px, 3.15vw, 44px); font-weight: 800; line-height: 1.14; letter-spacing: -.04em; }
.intro-heading-line { display: block; width: 36px; height: 2px; margin: 18px auto 0; background: var(--orange-500); }

/* Strategy navigation is editorial navigation, not a card collection. */
.intro-primary-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 0; border-bottom: 1px solid var(--line-strong); }
.intro-primary-tab {
  position: relative;
  display: grid;
  min-height: 140px;
  align-content: start;
  justify-items: start;
  gap: 8px;
  padding: 18px 24px 25px;
  border: 0;
  border-right: 1px solid var(--line);
  color: var(--text-secondary);
  background: transparent;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  text-align: left;
  transition: color .2s ease, background-color .2s ease;
}
.intro-primary-tab:last-child { border-right: 0; }
.intro-primary-tab::after { position: absolute; right: 0; bottom: -1px; left: 0; height: 2px; background: var(--blue-600); content: ''; opacity: 0; transform: scaleX(.35); transition: opacity .2s ease, transform .2s ease; }
.intro-primary-tab:hover { color: var(--blue-600); background: rgb(20 107 255 / 2.5%); }
.intro-primary-tab.active { color: var(--text-primary); background: rgb(20 107 255 / 3%); }
.intro-primary-tab.active::after { opacity: 1; transform: scaleX(1); }
.intro-primary-tab-number { color: var(--blue-600); font: 700 12px/1 var(--font-mono); letter-spacing: .1em; }
.intro-primary-tab-label { max-width: 22ch; }
.intro-primary-tab-icon { display: none; }
.intro-primary-tab-arrow { display: none; }

.intro-section-panel { min-width: 0; padding-top: clamp(36px, 3.5vw, 48px); }
.intro-context-layout { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: clamp(32px, 4.4vw, 56px); align-items: start; }
.intro-context-nav { display: grid; gap: 2px; padding-top: 3px; border-right: 1px solid var(--line-strong); }
.intro-context-nav button { position: relative; min-height: 42px; padding: 8px 22px 8px 0; border: 0; color: var(--text-secondary); background: transparent; font-size: 13px; font-weight: 700; letter-spacing: .08em; line-height: 1.25; text-align: left; text-transform: uppercase; transition: color .2s ease; }
.intro-context-nav button::before { position: absolute; top: 50%; right: -1px; width: 2px; height: 24px; background: var(--blue-600); content: ''; opacity: 0; transform: translateY(-50%); transition: opacity .2s ease; }
.intro-context-nav button:hover, .intro-context-nav button.active { color: var(--blue-600); }
.intro-context-nav button.active::before { opacity: 1; }
.intro-context-reading { min-width: 0; max-width: 860px; }
.intro-context-reading h3 { margin: 0 0 18px; color: var(--text-primary); font-size: clamp(24px, 2vw, 28px); line-height: 1.2; letter-spacing: -.025em; }
.intro-content-copy p { margin: 0; color: var(--text-secondary); font-size: 16px; line-height: 1.76; }
.intro-content-copy p + p { margin-top: 20px; }

/* Other panels remain readable without becoming a card-in-card dashboard. */
.intro-mission-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(20px, 2.4vw, 32px); }
.intro-mission-card { min-width: 0; padding: 0 0 26px; border-bottom: 1px solid var(--line-strong); }
.intro-mission-card-core-values { grid-column: span 2; }
.intro-card-icon { display: none; }
.intro-mission-card h3 { margin: 0 0 15px; color: var(--text-primary); font-size: clamp(19px, 1.6vw, 23px); line-height: 1.28; letter-spacing: -.025em; }
.intro-mission-card-education-philosophy .intro-content-copy p:first-child { color: var(--text-primary); font-weight: 700; }
.intro-mission-card-education-philosophy .intro-content-copy p:nth-child(2) { color: var(--blue-600); font: 600 13px/1.55 var(--font-mono); }
.intro-mission-card-action-slogan { padding: 25px; border: 1px solid var(--line); border-radius: 16px; background: rgb(20 107 255 / 4%); }
.intro-mission-card-action-slogan .intro-content-copy p { color: var(--text-primary); font-weight: 650; }

.intro-accordion { display: grid; border-top: 1px solid var(--line-strong); }
.intro-accordion-item { border-bottom: 1px solid var(--line-strong); }
.intro-accordion-item h3 { margin: 0; }
.intro-accordion-item h3 button { display: flex; width: 100%; min-height: 76px; align-items: center; justify-content: space-between; gap: 18px; padding: 17px 0; border: 0; color: var(--text-primary); background: transparent; font-size: 16px; font-weight: 700; line-height: 1.35; text-align: left; }
.intro-accordion-item h3 button:hover { color: var(--blue-600); }
.intro-accordion-title { display: flex; min-width: 0; align-items: center; gap: 16px; }
.intro-accordion-icon { display: grid; width: 28px; height: 28px; flex: 0 0 auto; place-items: center; color: var(--blue-600); background: rgb(20 107 255 / 8%); }
.intro-accordion-icon svg { width: 16px; height: 16px; }
.intro-accordion-item h3 button > svg { flex: 0 0 auto; color: var(--blue-600); transition: transform .2s ease; }
.intro-accordion-item.open h3 button > svg { transform: rotate(180deg); }
.intro-accordion-panel { max-width: 910px; padding: 0 0 28px 44px; }
.intro-accordion-panel ul { display: grid; gap: 13px; margin: 2px 0 0; padding-left: 21px; }
.intro-accordion-panel li { padding-left: 4px; color: var(--text-secondary); font-size: 16px; line-height: 1.72; }
.intro-accordion-panel li::marker { color: var(--orange-500); }

/* Organization is a diagram on a calm surface, with the link separated from the artifact. */
.intro-organization-section { padding: clamp(80px, 7vw, 104px) 0 clamp(72px, 6vw, 88px); background: linear-gradient(180deg, rgb(238 244 251 / .85), var(--page-bg)); }
:root[data-theme='dark'] .intro-organization-section { background: linear-gradient(180deg, rgb(17 34 58 / .96), var(--page-bg)); }
.intro-organization-section .intro-section-heading { margin-bottom: 30px; }
.intro-organization-lead { max-width: 660px; margin: -9px auto 42px; color: var(--text-secondary); font-size: 16px; line-height: 1.7; text-align: center; }
.intro-organization-diagram { width: min(100%, 1140px); margin: 0 auto; }
.intro-organization-preview { display: block; width: 100%; overflow: hidden; padding: 0; border: 1px solid var(--line); border-radius: 18px; background: var(--logo-surface); box-shadow: 0 1px 2px rgb(7 24 44 / 3%), 0 14px 36px rgb(7 24 44 / 6%); }
.intro-organization-preview:hover { border-color: rgb(20 107 255 / 35%); }
.intro-organization-preview img { width: 100%; height: auto; background: #f7fbff; }
.intro-organization-link { display: inline-flex; align-items: center; gap: 8px; margin: 23px auto 0; padding: 5px 0; border: 0; border-bottom: 1px solid transparent; color: var(--blue-600); background: transparent; font-size: 14px; font-weight: 700; transition: transform .2s ease, border-color .2s ease; }
.intro-organization-link:hover { border-color: currentColor; transform: translateX(2px); }
.intro-organization-link svg { transition: transform .2s ease; }
.intro-organization-link:hover svg { transform: translateX(2px); }
.intro-organization-link-wrap { text-align: center; }

/* Milestone replaces the campaign poster with typographic institutional storytelling. */
.intro-milestone-section { isolation: isolate; overflow: hidden; padding: clamp(68px, 6vw, 88px) 0; color: var(--white); background: radial-gradient(circle at 76% 46%, rgb(39 128 245 / 15%), transparent 38%), var(--navy-950); }
.intro-milestone-section::before { position: absolute; inset: 0; z-index: -2; background: linear-gradient(90deg, var(--navy-950) 20%, rgb(4 21 42 / 84%) 56%, rgb(4 21 42 / 68%)), url('/assets/intro/uet-20-years-banner.webp') right center / auto 100% no-repeat; content: ''; filter: saturate(.42) contrast(.9); opacity: .38; }
.intro-milestone-section::after { position: absolute; inset: 0; z-index: -1; background: linear-gradient(90deg, var(--navy-950), transparent 68%); content: ''; }
.intro-milestone-layout { display: grid; grid-template-columns: minmax(0, 680px) minmax(200px, 1fr); gap: 48px; align-items: end; min-height: 300px; }
.intro-milestone-copy { position: relative; z-index: 1; }
.intro-milestone-copy .eyebrow { color: var(--cyan-400); }
.intro-milestone-number { margin: 0; color: var(--white); font-size: clamp(82px, 9.5vw, 132px); font-weight: 800; line-height: .83; letter-spacing: -.08em; }
.intro-milestone-number span { color: var(--blue-400); }
.intro-milestone-copy h2 { max-width: 13ch; margin: 13px 0 18px; color: var(--white); font-size: clamp(28px, 3vw, 42px); font-weight: 750; line-height: 1.05; letter-spacing: -.04em; }
.intro-milestone-copy p:not(.eyebrow) { max-width: 40ch; margin: 0; color: rgb(255 255 255 / 76%); font-size: 16px; line-height: 1.7; }
.intro-milestone-link { display: inline-flex; align-items: center; gap: 8px; margin-top: 27px; padding: 10px 0; border: 0; border-bottom: 1px solid rgb(255 255 255 / 34%); color: var(--white); background: transparent; font-size: 14px; font-weight: 700; transition: transform .2s ease, border-color .2s ease; }
.intro-milestone-link:hover { border-color: var(--cyan-400); transform: translateX(2px); }
.intro-milestone-visual { min-height: 190px; }

.intro-lightbox { position: fixed; inset: 0; z-index: 220; display: grid; place-items: center; padding: 18px; background: rgb(3 20 38 / 94%); backdrop-filter: blur(8px); }
.intro-lightbox-close { position: fixed; top: 16px; right: 16px; z-index: 2; display: grid; width: 46px; height: 46px; place-items: center; padding: 0; border: 1px solid rgb(255 255 255 / 30%); border-radius: 50%; color: var(--white); background: var(--navy-900); }
.intro-lightbox-image { max-width: min(1448px, calc(100vw - 36px)); max-height: calc(100dvh - 36px); overflow: auto; border-radius: 12px; background: var(--logo-surface); box-shadow: 0 28px 80px rgb(0 0 0 / 45%); overscroll-behavior: contain; touch-action: pinch-zoom; }
.intro-lightbox-image img { width: auto; max-width: 100%; max-height: calc(100dvh - 36px); object-fit: contain; }

@media (max-width: 1199px) {
  .intro-mission-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .intro-milestone-layout { grid-template-columns: minmax(0, 1fr) minmax(180px, .55fr); }
}

@media (max-width: 1024px) {
  .intro-hero { min-height: 510px; }
  .hero-copy { width: min(100%, 600px); }
  .hero-media img { width: 65%; object-position: 62% 58%; }
}

@media (max-width: 767px) {
  .intro-content-flow::before { height: 860px; opacity: .7; }
  .intro-hero { min-height: 474px; border-radius: 0 0 20px 20px; }
  .hero-inner { min-height: 474px; align-items: end; }
  .hero-copy { width: 100%; padding: 54px 0 35px; }
  .hero-copy h1 { font-size: clamp(39px, 10.8vw, 48px); line-height: 1.05; }
  .hero-copy > p:not(.eyebrow) { font-size: 15px; line-height: 1.68; }
  .hero-copy .hero-tagline { margin-top: 19px; font-size: 17px; }
  .hero-media img { width: 100%; height: 72%; top: 0; opacity: .46; object-position: 60% 45%; }
  .hero-media-blend { background: linear-gradient(0deg, var(--navy-950) 4%, rgb(4 21 42 / 88%) 44%, rgb(4 21 42 / 36%) 100%); }
  .intro-strategy-section, .intro-organization-section { padding: 58px 0 64px; }
  .intro-section-heading { margin-bottom: 32px; text-align: left; }
  .intro-section-heading h2 { font-size: clamp(28px, 8.3vw, 34px); }
  .intro-heading-line { margin-left: 0; }
  .intro-primary-tabs { display: flex; overflow-x: auto; margin-inline: calc(var(--page-gutter) * -1); padding-inline: var(--page-gutter); scrollbar-width: thin; }
  .intro-primary-tab { min-width: 184px; min-height: 126px; flex: 0 0 72%; padding: 16px 16px 22px; border-right: 1px solid var(--line); }
  .intro-section-panel { padding-top: 30px; }
  .intro-context-layout { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  .intro-context-nav { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0; padding: 3px; border: 1px solid var(--line); border-radius: 10px; background: rgb(20 107 255 / 3%); }
  .intro-context-nav button { min-height: 42px; padding: 8px; border-radius: 7px; font-size: 11px; text-align: center; }
  .intro-context-nav button::before { display: none; }
  .intro-context-nav button.active { color: var(--blue-600); background: var(--panel-bg); box-shadow: 0 1px 3px rgb(7 24 44 / 7%); }
  .intro-context-reading h3 { font-size: 24px; }
  .intro-content-copy p, .intro-accordion-panel li { font-size: 15px; line-height: 1.74; }
  .intro-mission-grid { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .intro-mission-card-core-values { grid-column: auto; }
  .intro-mission-card-action-slogan { padding: 20px; }
  .intro-accordion-item h3 button { min-height: 70px; font-size: 15px; }
  .intro-accordion-panel { padding-left: 0; }
  .intro-organization-lead { margin: -7px 0 30px; font-size: 15px; text-align: left; }
  .intro-organization-preview { border-radius: 12px; }
  .intro-milestone-section { padding: 60px 0 64px; }
  .intro-milestone-section::before { background-position: 88% center; background-size: auto 80%; opacity: .22; }
  .intro-milestone-layout { display: block; min-height: 0; }
  .intro-milestone-number { font-size: clamp(76px, 24vw, 92px); }
  .intro-milestone-copy h2 { max-width: 12ch; font-size: 31px; }
  .intro-milestone-visual { display: none; }
  .intro-lightbox { padding: 12px; }
  .intro-lightbox-image { max-width: calc(100vw - 24px); max-height: calc(100dvh - 24px); }
  .intro-lightbox-image img { max-height: calc(100dvh - 24px); }
}
```

## frontend/src/styles.css

```css
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
@import './styles/tokens.css';

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; min-width: 320px; color: var(--ink-950); background: var(--surface); font-family: var(--font-sans); font-size: 15px; line-height: 1.6; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
button, input { font: inherit; }
button { cursor: pointer; }
button, a { -webkit-tap-highlight-color: transparent; }
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
button:focus-visible, a:focus-visible, input:focus-visible { outline: none; box-shadow: var(--focus-ring); }

.site-container { width: min(calc(100% - (var(--page-gutter) * 2)), var(--container)); margin-inline: auto; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.eyebrow { margin: 0 0 14px; color: var(--blue-600); font: 600 12px/1.2 var(--font-mono); letter-spacing: .12em; text-transform: uppercase; }
h1, h2, h3, p { margin-top: 0; }
h1 { margin-bottom: 0; font-size: clamp(38px, 4.1vw, 64px); line-height: 1.02; letter-spacing: -.045em; font-weight: 800; }
h1 span { color: var(--blue-400); }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 44px; padding: 10px 17px; border: 1px solid transparent; border-radius: var(--radius-sm); font-size: 14px; font-weight: 700; line-height: 1.25; transition: transform .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease; }
.btn:hover { transform: translateY(-1px); }
.btn-primary { color: var(--white); background: linear-gradient(135deg, var(--blue-500), var(--blue-700)); box-shadow: 0 10px 28px rgb(20 107 255 / 24%); }
.btn-secondary { color: var(--ink-950); border-color: var(--line-strong); background: var(--white); }
.btn-dark-secondary { color: var(--white); border-color: rgb(255 255 255 / 24%); background: rgb(255 255 255 / 7%); }
.btn-ghost { color: var(--blue-600); border-color: rgb(20 107 255 / 28%); background: transparent; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

.site-header { position: sticky; top: 0; z-index: 100; height: var(--header-h); border-bottom: 1px solid rgb(199 215 232 / 75%); background: rgb(255 255 255 / 93%); backdrop-filter: blur(18px); }
.header-inner { position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 36px; height: 100%; }
.brand { display: inline-flex; align-items: center; gap: 12px; padding: 0; border: 0; color: var(--ink-950); background: transparent; text-align: left; }
.brand-mark { display: grid; width: 40px; height: 40px; place-items: center; border-radius: 10px; color: var(--white); background: var(--navy-950); font-size: 14px; font-weight: 800; letter-spacing: -.02em; }
.brand-copy strong { display: block; font-size: 17px; line-height: 1.2; letter-spacing: .06em; }
.main-nav { display: flex; align-self: stretch; align-items: center; justify-content: center; gap: 20px; }
.main-nav button { position: relative; align-self: stretch; padding: 0; border: 0; color: var(--ink-800); background: transparent; font-size: 15px; font-weight: 650; white-space: nowrap; }
.main-nav button.active { color: var(--blue-600); }
.main-nav button.active::after { position: absolute; bottom: 14px; left: 50%; width: 22px; height: 3px; border-radius: 99px; background: var(--blue-600); content: ''; transform: translateX(-50%); }
.mobile-menu, .mobile-nav { display: none; }

.intro-hero { position: relative; isolation: isolate; overflow: hidden; min-height: clamp(480px, 55vh, 540px); border-radius: 0 0 var(--radius-hero) var(--radius-hero); color: var(--white); background: linear-gradient(110deg, var(--navy-900) 0%, #0a3158 52%, var(--navy-850) 100%); }
.intro-hero::after { position: absolute; inset: 0; z-index: -1; background-image: linear-gradient(rgb(76 201 255 / 3.5%) 1px, transparent 1px), linear-gradient(90deg, rgb(76 201 255 / 3.5%) 1px, transparent 1px); background-size: 46px 46px; content: ''; mask-image: linear-gradient(120deg, #000, transparent 72%); pointer-events: none; }
.hero-media { position: absolute; inset: 0; z-index: -2; overflow: hidden; }
.hero-media img { position: absolute; top: 0; right: 0; width: 62%; height: 100%; object-fit: cover; object-position: 52% 60%; opacity: .8; filter: brightness(.86) saturate(.9) contrast(1.04); -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 25%) 17%, #000 42%, #000 100%); mask-image: linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 25%) 17%, #000 42%, #000 100%); }
.hero-media::before { position: absolute; inset: 0; z-index: 1; background: radial-gradient(circle at 72% 37%, rgb(76 201 255 / 28%), transparent 27%), radial-gradient(circle at 58% 61%, rgb(47 128 255 / 23%), transparent 34%), radial-gradient(circle at 88% 76%, rgb(20 107 255 / 17%), transparent 24%); content: ''; mix-blend-mode: screen; pointer-events: none; }
.hero-media::after { position: absolute; inset: 0; z-index: 2; background: linear-gradient(180deg, rgb(4 21 42 / 28%), transparent 22%, transparent 70%, rgb(4 21 42 / 52%)), linear-gradient(90deg, transparent 72%, rgb(4 21 42 / 26%)); content: ''; pointer-events: none; }
.hero-media-blend { position: absolute; inset: 0; z-index: 3; background: linear-gradient(90deg, var(--navy-950) 0%, var(--navy-950) 24%, rgb(4 21 42 / 92%) 40%, rgb(4 21 42 / 68%) 52%, rgb(4 21 42 / 28%) 67%, transparent 83%), linear-gradient(0deg, var(--navy-950) 0%, rgb(4 21 42 / 82%) 15%, rgb(4 21 42 / 32%) 39%, transparent 64%); pointer-events: none; }
.hero-inner { position: relative; z-index: 1; display: flex; align-items: center; min-height: inherit; }
.hero-copy { width: min(100%, 820px); padding: 62px 0 30px; }
.hero-copy .eyebrow { color: var(--cyan-400); }
.hero-copy h1 { max-width: 820px; font-size: clamp(46px, 3.65vw, 56px); line-height: .99; }
.hero-copy h1 > span { display: block; }
.hero-title-primary { color: inherit; white-space: nowrap; }
.hero-title-location { color: var(--blue-400); }
.hero-copy > p:not(.eyebrow) { max-width: 500px; margin: 20px 0 0; color: rgb(255 255 255 / 78%); font-size: 16px; line-height: 1.62; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.campus-location-badge { position: absolute; z-index: 4; top: var(--location-y); left: var(--location-x); display: inline-flex; align-items: center; gap: 5px; padding: 5px 8px; border: 1px solid rgb(255 255 255 / 29%); border-radius: 9px; color: rgb(255 255 255 / 92%); background: rgb(4 21 42 / 64%); box-shadow: 0 6px 16px rgb(0 0 0 / 18%); font-size: 10px; font-weight: 600; line-height: 1; transform: translate(-50%, -50%); white-space: nowrap; backdrop-filter: blur(7px); }
.campus-location-badge::after { position: absolute; top: 100%; left: 13px; width: 1px; height: 13px; background: linear-gradient(var(--cyan-400), transparent); content: ''; opacity: .7; }
.campus-location-badge svg { width: 13px; height: 13px; color: var(--cyan-400); }

.tech-bg::before { position: absolute; inset: 0; z-index: -1; background-image: linear-gradient(rgb(20 107 255 / 3.5%) 1px, transparent 1px), linear-gradient(90deg, rgb(20 107 255 / 3.5%) 1px, transparent 1px); background-size: 46px 46px; content: ''; mask-image: linear-gradient(to bottom, rgb(0 0 0 / 90%), transparent 90%); pointer-events: none; }
.map-wait { display: grid; width: 100%; height: 100%; min-height: inherit; place-content: center; gap: 6px; padding: 28px; color: var(--white); background: var(--navy-900); text-align: center; }
.map-wait span { color: rgb(255 255 255 / 72%); font-size: 14px; }
.explorer-map-viewer { position: relative; width: 100%; height: 100%; min-height: 0; overflow: hidden; background: var(--navy-900); }

.explorer-page { width: 100%; height: calc(100vh - var(--header-h)); height: calc(100dvh - var(--header-h)); min-height: 0; overflow: hidden; color: var(--white); background: var(--navy-900); }

.directory-page { min-height: calc(100vh - var(--header-h)); padding: 46px 0 70px; }
.academic-page { background: var(--surface); }
.directory-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 430px); gap: 28px; align-items: start; }
.directory-head { margin-bottom: 28px; }
.directory-head h1 { max-width: 800px; font-size: clamp(35px, 3.4vw, 54px); }
.directory-head > p:last-child { max-width: 760px; margin: 15px 0 0; color: var(--ink-600); }
.toolbar { display: flex; align-items: center; gap: 12px; margin: 26px 0 18px; }
.directory-search { position: relative; display: block; flex: 1; min-width: 0; }
.directory-search svg { position: absolute; top: 50%; left: 16px; color: var(--ink-500); transform: translateY(-50%); pointer-events: none; }
.directory-search input { width: 100%; min-height: 50px; padding: 0 16px 0 46px; border: 1px solid var(--line-strong); border-radius: 14px; color: var(--ink-950); background: rgb(255 255 255 / 92%); outline: 0; }
.directory-search input::placeholder { color: var(--ink-500); }
.directory-search input:focus { border-color: rgb(20 107 255 / 55%); box-shadow: var(--focus-ring); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { min-height: 38px; padding: 7px 13px; border: 1px solid var(--line-strong); border-radius: 999px; color: var(--ink-800); background: rgb(255 255 255 / 92%); font-size: 13px; font-weight: 650; }
.chip.active { border-color: rgb(20 107 255 / 45%); color: var(--blue-600); background: rgb(20 107 255 / 8%); }
.entity-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 20px; }
.entity-card { display: flex; min-width: 0; min-height: 238px; flex-direction: column; align-items: flex-start; padding: 21px; border: 1px solid var(--line); border-radius: var(--radius-card); color: var(--ink-950); background: rgb(255 255 255 / 94%); box-shadow: var(--shadow-sm); text-align: left; transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
.entity-card:hover { border-color: rgb(20 107 255 / 30%); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.entity-card.selected { border-color: var(--blue-600); box-shadow: var(--shadow-blue); }
.entity-logo { display: grid; width: 58px; height: 58px; flex: 0 0 auto; place-items: center; margin: 0 0 20px; padding: 5px; border: 1px solid rgb(20 107 255 / 22%); border-radius: 16px; color: var(--blue-600); background: linear-gradient(145deg, rgb(20 107 255 / 14%), rgb(76 201 255 / 4%)); font: 700 17px/1 var(--font-mono); object-fit: contain; }
.entity-type { display: block; margin-bottom: 8px; color: var(--blue-600); font: 600 10px/1.25 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; }
.entity-card h2 { display: -webkit-box; overflow: hidden; min-height: 48px; margin: 0; -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-size: 17px; line-height: 1.38; }
.entity-meta { display: -webkit-box; overflow: hidden; min-height: 40px; margin-top: 8px; color: var(--ink-500); -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-size: 12px; line-height: 1.5; }
.entity-link { display: inline-flex; align-items: center; gap: 6px; margin-top: auto; padding-top: 18px; color: var(--blue-600); font-size: 13px; font-weight: 700; }
.empty-state { margin: 22px 0; color: var(--ink-600); }
.detail-panel { position: sticky; top: calc(var(--header-h) + 24px); overflow: hidden; border: 1px solid var(--line); border-radius: 22px; background: var(--white); box-shadow: var(--shadow-md); }
.detail-visual { min-height: 254px; padding: 28px; color: var(--white); background: radial-gradient(circle at 80% 18%, rgb(76 201 255 / 32%), transparent 32%), linear-gradient(145deg, #0b315f, #06192f); }
.detail-visual .entity-logo { border-color: rgb(255 255 255 / 24%); color: var(--white); background: rgb(255 255 255 / 8%); }
.detail-visual .entity-type { color: var(--cyan-400); }
.detail-visual h2 { margin: 6px 0 0; font-size: clamp(27px, 2.25vw, 34px); line-height: 1.14; letter-spacing: -.03em; }
.detail-visual p { margin: 10px 0 0; color: rgb(255 255 255 / 74%); font-size: 14px; }
.detail-visual .detail-short { color: var(--cyan-400); font: 600 12px/1.4 var(--font-mono); }
.detail-body { padding: 25px; }
.detail-section { padding: 0 0 22px; border-bottom: 1px solid var(--line); }
.detail-section h3 { margin: 0 0 11px; font-size: 14px; }
.detail-section p, .detail-section li { color: var(--ink-600); font-size: 14px; line-height: 1.65; }
.detail-section p:last-child, .detail-section ul:last-child { margin-bottom: 0; }
.detail-section ul { display: grid; gap: 8px; margin: 0; padding-left: 20px; }
.detail-section + .detail-section { padding-top: 20px; }
.detail-contact { padding-bottom: 0; border-bottom: 0; }
.detail-contact .btn { width: 100%; justify-content: center; }
.empty-contact { margin: 0; color: var(--ink-500); font-size: 13px; font-style: italic; }
.detail-section-empty { padding: 16px; border: 1px dashed var(--line-strong); border-radius: 12px; background: var(--surface); }
.detail-section-empty p { margin: 0; }
.detail-actions { padding-top: 20px; }
.unavailable { color: var(--ink-500); font-size: 13px; font-style: italic; }
.activity-gallery { padding: 0 25px 25px; border-bottom: 1px solid var(--line); }
.activity-gallery-head { margin-bottom: 14px; }
.activity-gallery h3 { margin: 0; font-size: 14px; }
.activity-gallery p { margin: 5px 0 0; color: var(--ink-600); font-size: 12px; line-height: 1.5; }
.activity-gallery-grid { display: grid; gap: 10px; margin: 0; }
.activity-gallery-grid.count-1 { grid-template-columns: minmax(0, 1fr); }
.activity-gallery-grid.count-2, .activity-gallery-grid.count-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.activity-gallery-grid.count-3 figure:first-child { grid-column: 1 / -1; }
.activity-gallery-grid.count-many { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
.activity-gallery figure { min-width: 0; margin: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }
.activity-gallery img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.activity-gallery figcaption { padding: 8px 10px; color: var(--ink-700); font-size: 12px; font-weight: 700; }

.club-page { color: var(--white); background: radial-gradient(circle at 68% 14%, rgb(20 107 255 / 15%), transparent 24%), linear-gradient(160deg, var(--navy-950), #051b35 55%, var(--navy-900)); }
.club-page .eyebrow { color: var(--cyan-400); }
.club-page .directory-head > p:last-child { color: rgb(255 255 255 / 64%); }
.club-page .directory-search input, .club-page .chip, .club-page .entity-card { border-color: rgb(148 184 224 / 18%); color: var(--white); background: rgb(10 42 77 / 62%); box-shadow: none; }
.club-page .directory-search svg, .club-page .directory-search input::placeholder { color: rgb(255 255 255 / 48%); }
.club-page .chip { color: rgb(255 255 255 / 72%); }
.club-page .chip.active { border-color: rgb(76 201 255 / 55%); color: var(--white); background: rgb(20 107 255 / 35%); }
.club-page .entity-card:hover, .club-page .entity-card.selected { border-color: rgb(76 201 255 / 70%); box-shadow: 0 0 0 1px rgb(76 201 255 / 20%), 0 18px 48px rgb(0 0 0 / 24%); }
.club-page .entity-type, .club-page .entity-link { color: var(--cyan-400); }
.club-page .entity-meta { color: rgb(255 255 255 / 54%); }
.club-page .detail-panel { border-color: rgb(148 184 224 / 20%); background: rgb(6 27 53 / 93%); box-shadow: 0 26px 70px rgb(0 0 0 / 34%); }
.club-page .detail-section { border-color: rgb(255 255 255 / 10%); }
.club-page .detail-section p, .club-page .detail-section li, .club-page .unavailable, .club-page .empty-contact { color: rgb(255 255 255 / 64%); }
.club-page .detail-section h3 { color: var(--white); }

.club-page .entity-card {
  border-color: var(--line);
  color: var(--ink-950);
  background: rgb(255 255 255 / 97%);
  box-shadow: var(--shadow-sm);
}
.club-page .entity-card:hover {
  border-color: rgb(20 107 255 / 34%);
  background: var(--white);
  box-shadow: var(--shadow-md);
}
.club-page .entity-card.selected {
  border-color: var(--blue-600);
  background: var(--white);
  box-shadow: var(--shadow-blue);
}
.club-page .entity-card .entity-type,
.club-page .entity-card .entity-link { color: var(--blue-600); }
.club-page .entity-card .entity-meta { color: var(--ink-500); }
.club-page .entity-card .entity-logo {
  border-color: rgb(20 107 255 / 20%);
  background: linear-gradient(145deg, rgb(20 107 255 / 10%), rgb(76 201 255 / 4%));
  box-shadow: none;
}

.loading-page { min-height: calc(100vh - var(--header-h)); padding-top: 84px; }
.loading-page h1 { max-width: 760px; }
.site-footer { color: rgb(255 255 255 / 66%); background: var(--navy-950); }
.footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 104px; font-size: 13px; }
.footer-inner div { display: grid; gap: 5px; }
.footer-inner b { color: var(--white); font: 700 14px/1 var(--font-mono); letter-spacing: .08em; }

@media (max-width: 1260px) { .header-inner { gap: 32px; } .main-nav { gap: 24px; } }
@media (max-width: 1100px) { .hero-copy { width: min(100%, 720px); } .hero-copy h1 { font-size: clamp(44px, 4.45vw, 52px); } }
@media (max-width: 1024px) { .hero-media img { width: 58%; object-position: 58% 58%; } .directory-layout { grid-template-columns: 1fr; } .detail-panel { position: relative; top: auto; max-width: none; } .detail-body { columns: 2; column-gap: 32px; } .detail-section, .detail-actions { break-inside: avoid; } }
@media (max-width: 1440px) { :root { --header-h: 68px; } .header-inner { display: flex; gap: 24px; } .main-nav { display: none; } .mobile-menu { display: grid; width: 42px; height: 42px; margin-left: auto; place-items: center; padding: 0; border: 1px solid var(--line-strong); border-radius: 12px; color: var(--ink-950); background: var(--white); } .mobile-nav { position: absolute; top: calc(100% + 9px); right: 0; left: 0; display: grid; gap: 4px; padding: 8px; border: 1px solid var(--line); border-radius: var(--radius-card); background: var(--white); box-shadow: var(--shadow-md); } .mobile-nav button { display: flex; align-items: center; justify-content: space-between; min-height: 45px; padding: 0 12px; border: 0; border-radius: 10px; color: var(--ink-800); background: transparent; font-weight: 650; text-align: left; } .mobile-nav button.active { color: var(--blue-600); background: rgb(20 107 255 / 8%); } .hero-copy { width: min(100%, 530px); padding: 52px 0 32px; transform: none; } .hero-title-primary { white-space: normal; } .hero-media img { width: 65%; object-position: 60% 58%; } }
@media (max-width: 640px) { .site-container { width: min(calc(100% - 32px), var(--container)); } .brand-copy strong { font-size: 14px; } .intro-hero { min-height: auto; border-radius: 0 0 24px 24px; } .hero-inner { min-height: 436px; align-items: end; } .hero-copy { width: 100%; padding: 48px 0 32px; } .hero-copy h1 { font-size: clamp(39px, 11vw, 54px); } .hero-copy > p:not(.eyebrow) { max-width: 500px; font-size: 16px; } .hero-media img { width: 100%; opacity: .5; } .hero-media-blend { background: linear-gradient(0deg, var(--navy-950) 8%, rgb(4 21 42 / 80%) 54%, rgb(4 21 42 / 38%) 100%); } .campus-location-badge { display: none; } .directory-page { padding: 32px 0 48px; } .toolbar { align-items: stretch; flex-direction: column; } .entity-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; } .entity-card { min-height: 218px; padding: 17px; } .entity-logo { width: 52px; height: 52px; margin-bottom: 16px; border-radius: 14px; } .entity-card h2 { min-height: 45px; font-size: 15px; } .entity-meta { min-height: 36px; font-size: 11px; } .detail-body { columns: 1; } .footer-inner { align-items: flex-start; flex-direction: column; justify-content: center; min-height: 128px; } }
@media (max-width: 420px) { .actions { display: grid; grid-template-columns: 1fr; width: 100%; } .btn { width: 100%; } .entity-grid { grid-template-columns: 1fr; } .entity-card { min-height: 196px; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }

/* Faculty visual layers and the final compact hero composition. */
.hero-media-blend {
  background:
    linear-gradient(90deg, var(--navy-900) 0%, var(--navy-900) 18%, rgb(8 36 67 / 95%) 31%, rgb(8 36 67 / 70%) 43%, rgb(8 36 67 / 34%) 58%, transparent 76%),
    linear-gradient(0deg, var(--navy-900) 0%, rgb(8 36 67 / 76%) 15%, rgb(8 36 67 / 28%) 41%, transparent 67%);
}
.intro-hero::after {
  background-image:
    linear-gradient(rgb(76 201 255 / 5%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(76 201 255 / 5%) 1px, transparent 1px);
}
.entity-card,
.detail-visual {
  position: relative;
  overflow: hidden;
}
.entity-visual-media,
.detail-visual-media {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  background-position: 68% center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: brightness(.78) saturate(.82) contrast(1.04);
  opacity: .58;
  pointer-events: none;
}
.entity-card.has-background-image {
  border-color: rgb(89 161 255 / 34%);
  color: var(--white);
  background: var(--navy-900);
  box-shadow: 0 12px 30px rgb(4 21 42 / 14%);
}
.entity-card.has-background-image::before,
.detail-visual.has-background-image::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(90deg, var(--navy-950) 0%, rgb(4 21 42 / 97%) 34%, rgb(4 21 42 / 71%) 58%, rgb(4 21 42 / 23%) 100%),
    linear-gradient(0deg, rgb(4 21 42 / 80%), transparent 56%);
  content: '';
  pointer-events: none;
}
.entity-card.has-background-image::after,
.detail-visual.has-background-image::after {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: radial-gradient(circle at 82% 18%, rgb(76 201 255 / 20%), transparent 28%);
  content: '';
  mix-blend-mode: screen;
  pointer-events: none;
}
.entity-card.has-background-image > :not(.entity-visual-media),
.detail-visual.has-background-image > :not(.detail-visual-media) {
  position: relative;
  z-index: 3;
}
.entity-card.has-background-image h2 { color: var(--white); }
.entity-card.has-background-image .entity-type,
.entity-card.has-background-image .entity-link { color: var(--cyan-400); }
.entity-card.has-background-image .entity-meta { color: rgb(255 255 255 / 72%); }
.detail-visual.has-background-image { background: var(--navy-900); }
.detail-visual.has-background-image .entity-type,
.detail-visual.has-background-image .detail-short { color: var(--cyan-400); }

@media (max-width: 1024px) {
  .hero-media img { width: 60%; object-position: 54% 60%; }
}
@media (max-width: 640px) {
  .hero-media img { width: 100%; opacity: .58; }
}

/* Runtime entity visuals: light directory cards and stronger dark detail imagery. */
.entity-card.has-background-image {
  color: var(--ink-950);
  background: var(--white);
  border-color: var(--line);
  box-shadow: var(--shadow-sm);
}
.entity-card.has-background-image:hover,
.entity-card.has-background-image.selected {
  border-color: rgb(20 107 255 / 42%);
  box-shadow: var(--shadow-blue);
}
.entity-card.has-background-image .entity-visual-media {
  background-position: right center;
  filter: brightness(.98) saturate(.94) contrast(1.03);
  opacity: .62;
}
.entity-card.has-background-image::before {
  background:
    linear-gradient(90deg, var(--white) 0%, rgb(255 255 255 / 94%) 36%, rgb(255 255 255 / 42%) 63%, rgb(255 255 255 / 4%) 100%),
    linear-gradient(0deg, rgb(255 255 255 / 60%) 0%, rgb(255 255 255 / 30%) 32%, transparent 68%);
}
.entity-card.has-background-image::after {
  background: radial-gradient(circle at 88% 18%, rgb(76 201 255 / 18%), transparent 31%);
  mix-blend-mode: normal;
}
.entity-card.has-background-image h2 { color: var(--ink-950); }
.entity-card.has-background-image .entity-type,
.entity-card.has-background-image .entity-link { color: var(--blue-600); }
.entity-card.has-background-image .entity-meta { color: var(--ink-500); }
.detail-visual.has-background-image .detail-visual-media {
  background-position: 72% center;
  filter: brightness(.96) saturate(.94) contrast(1.05);
  opacity: .9;
}
.detail-visual.has-background-image::before {
  background:
    linear-gradient(90deg, rgb(4 21 42 / 92%) 0%, rgb(4 21 42 / 84%) 34%, rgb(4 21 42 / 42%) 63%, rgb(4 21 42 / 5%) 100%),
    linear-gradient(0deg, rgb(4 21 42 / 55%), transparent 58%);
}

/* Hero artwork is pre-composed; CSS only positions it and protects left-side copy. */
.intro-hero { background: var(--navy-900); }
.intro-hero::after,
.hero-media::before,
.hero-media::after { display: none; }
.hero-media img {
  width: 100%;
  object-position: center 52%;
  opacity: 1;
  filter: none;
  -webkit-mask-image: none;
  mask-image: none;
}
.hero-media-blend {
  background: linear-gradient(90deg, var(--navy-900) 0%, rgb(8 36 67 / 93%) 23%, rgb(8 36 67 / 52%) 38%, transparent 56%);
}

/* Micro-scale typography pass: retain hierarchy while reducing visual weight. */
body { font-size: 14px; }
.eyebrow { font-size: 11.3px; }
.main-nav button { font-size: 14px; }
.btn { font-size: 13px; }
.hero-copy h1 { font-size: clamp(46px, 3.65vw, 56px); }
.hero-copy > p:not(.eyebrow),
.directory-head > p:last-child { font-size: 15px; }
.entity-type { font-size: 9.3px; }
.entity-card h2 { font-size: 16px; line-height: 1.34; }
.entity-meta { font-size: 11px; }
.entity-link { font-size: 12px; }
.directory-search input,
.chip { font-size: 12px; }
.detail-visual h2 { font-size: clamp(26px, 2.15vw, 33px); }
.detail-visual p,
.detail-section p,
.detail-section li { font-size: 13px; }
.detail-section h3 { font-size: 13px; }

@media (max-width: 640px) {
  .hero-media img { object-position: 64% center; }
  .hero-media-blend { background: linear-gradient(0deg, var(--navy-900) 7%, rgb(8 36 67 / 76%) 50%, rgb(8 36 67 / 22%) 100%); }
  .hero-copy h1 { font-size: clamp(38px, 10.75vw, 53px); }
}


/* Directory atmosphere and opt-in detail layout. */
.directory-page {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}
.directory-page > .site-container {
  position: relative;
  z-index: 2;
}
.directory-page.tech-bg::before {
  z-index: 1;
}
.academic-page {
  background: radial-gradient(circle at 76% 8%, rgb(76 201 255 / 11%), transparent 31%), var(--surface);
}
.academic-page::after,
.club-page::after {
  position: fixed;
  top: var(--header-h);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  background-image: url('/assets/map/aerial-campus.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  content: '';
  pointer-events: none;
}
.academic-page::after {
  background-position: center 44%;
  filter: brightness(1.22) saturate(.58) contrast(.88);
  opacity: .13;
}
.club-page::after {
  background-position: center;
  filter: brightness(.68) saturate(.78) contrast(1.06);
  opacity: .19;
}
.directory-layout.is-full-width {
  grid-template-columns: minmax(0, 1fr);
}
.directory-layout.is-full-width .entity-grid {
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
}
.detail-close {
  position: absolute;
  z-index: 4;
  top: 16px;
  right: 16px;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  padding: 0;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 10px;
  color: var(--white);
  background: rgb(4 21 42 / 32%);
  transition: background-color .18s ease, border-color .18s ease, transform .18s ease;
}
.detail-close:hover {
  border-color: rgb(255 255 255 / 58%);
  background: rgb(255 255 255 / 12%);
  transform: translateY(-1px);
}
.club-page .entity-logo {
  border-color: rgb(255 255 255 / 55%);
  background: rgb(255 255 255 / 5%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 10%);
}
.club-page .detail-visual .entity-logo {
  border-color: rgb(255 255 255 / 70%);
  background: rgb(255 255 255 / 7%);
}

@media (max-width: 640px) {
  .directory-layout.is-full-width .entity-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 420px) {
  .directory-layout.is-full-width .entity-grid {
    grid-template-columns: 1fr;
  }
}


/* Institutional header and faculty directory refinements. */
.brand {
  min-width: 370px;
}
.brand-copy {
  display: grid;
  gap: 4px;
}
.brand-copy small {
  margin: 0;
  color: var(--ink-600);
  font: 600 9px/1.1 var(--font-sans);
  letter-spacing: .03em;
}
.brand-copy strong {
  font-size: 15px;
  line-height: 1.1;
  letter-spacing: .01em;
}
.header-actions {
  min-width: 0;
}
.hero-copy h1 {
  max-width: none;
  font-size: clamp(36px, 3.3vw, 48px);
  line-height: 1.08;
  white-space: nowrap;
}
.academic-page .entity-card .entity-logo {
  background: var(--white);
}
.academic-page .detail-visual.has-background-image {
  min-height: 0;
  padding: 0 0 24px;
  color: var(--ink-950);
  background: var(--white);
}
.academic-page .detail-visual.has-background-image::before,
.academic-page .detail-visual.has-background-image::after {
  display: none;
}
.academic-page .detail-visual.has-background-image .detail-visual-media {
  position: relative;
  inset: auto;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: var(--white);
  filter: none;
  opacity: 1;
}
.academic-page .detail-visual.has-background-image .entity-logo {
  margin: 24px 24px 16px;
  border-color: var(--line-strong);
  color: var(--blue-600);
  background: var(--white);
}
.academic-page .detail-visual.has-background-image > :not(.detail-visual-media):not(.detail-close) {
  margin-right: 24px;
  margin-left: 24px;
}
.academic-page .detail-visual.has-background-image .entity-type,
.academic-page .detail-visual.has-background-image .detail-short {
  color: var(--blue-600);
}
.academic-page .detail-visual.has-background-image h2 {
  color: var(--ink-950);
}
.academic-page .detail-visual.has-background-image p {
  color: var(--ink-600);
}
.academic-page .detail-visual.has-background-image .detail-close {
  border-color: var(--line-strong);
  color: var(--ink-950);
  background: rgb(255 255 255 / 88%);
}

@media (min-width: 1025px) {
  .academic-page .directory-layout.is-full-width .entity-grid,
  .academic-page .directory-layout.has-detail .entity-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .academic-page .directory-layout.has-detail .entity-card {
    min-height: 205px;
    padding: 16px;
  }
  .academic-page .directory-layout.has-detail .entity-logo {
    width: 50px;
    height: 50px;
    margin-bottom: 14px;
    border-radius: 13px;
  }
  .academic-page .directory-layout.has-detail .entity-card h2 {
    min-height: 42px;
    font-size: 14px;
  }
  .academic-page .directory-layout.has-detail .entity-meta {
    min-height: 34px;
    font-size: 10px;
  }
  .academic-page .directory-layout.has-detail .entity-link {
    padding-top: 13px;
    font-size: 11px;
  }
}

@media (max-width: 640px) {
  .brand {
    gap: 8px;
  }
  .brand-mark {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    font-size: 12px;
  }
  .brand-copy small {
    display: block;
    font-size: 7px;
  }
  .brand-copy strong {
    font-size: 11px;
  }
  .hero-copy h1 {
    font-size: clamp(31px, 8.7vw, 42px);
    white-space: normal;
  }
}


/* Reference hero and cohesive faculty activity photo treatment. */
.brand-crest {
  display: block;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  border-radius: 50%;
  object-fit: contain;
}
.hero-copy {
  width: min(100%, 900px);
}
.hero-copy .eyebrow {
  margin-bottom: 16px;
  color: var(--blue-400);
}
.hero-copy h1 {
  max-width: 900px;
  color: var(--white);
  font-size: clamp(48px, 4.55vw, 72px);
  line-height: 1.03;
  letter-spacing: -.045em;
  white-space: normal;
}
.hero-copy h1 span {
  color: var(--blue-400);
}
.hero-copy h1 .hero-title-primary {
  color: inherit;
}
.hero-copy .hero-tagline {
  margin: 17px 0 0;
  color: var(--blue-400);
  font-size: clamp(18px, 1.7vw, 24px);
  font-weight: 500;
  line-height: 1.35;
}
.hero-copy .hero-description {
  max-width: 660px;
  margin: 25px 0 0;
  color: rgb(255 255 255 / 78%);
  font-size: 16px;
  line-height: 1.72;
}

@media (min-width: 1200px) {
  .hero-inner {
    margin-right: auto;
    margin-left: max(16px, calc(50% - 788px));
  }
  .hero-copy h1 {
    font-size: clamp(43.2px, 4.095vw, 64.8px);
  }
  .hero-media img {
    right: auto;
    left: 19px;
  }
}
.academic-page .detail-panel {
  position: sticky;
}
.academic-page .detail-visual.has-background-image {
  padding: 18px 18px 26px;
  background: linear-gradient(145deg, rgb(242 248 255 / 96%), var(--white) 62%);
}
.academic-page .detail-visual.has-background-image .detail-visual-media {
  aspect-ratio: 3 / 2;
  border: 1px solid rgb(20 107 255 / 14%);
  border-radius: 18px;
  background-size: cover;
  box-shadow: 0 16px 32px rgb(10 27 51 / 12%);
}
.academic-page .detail-visual.has-background-image .entity-logo {
  margin: 22px 6px 14px;
}
.academic-page .detail-visual.has-background-image > :not(.detail-visual-media):not(.detail-close) {
  margin-right: 6px;
  margin-left: 6px;
}
.academic-page .detail-panel .detail-close {
  position: absolute;
  z-index: 10;
  top: 30px;
  right: 30px;
  width: 40px;
  height: 40px;
  border-color: rgb(10 27 51 / 14%);
  border-radius: 50%;
  color: var(--ink-950);
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 6px 18px rgb(10 27 51 / 16%);
}
.academic-page .detail-panel .detail-close:hover {
  border-color: rgb(20 107 255 / 38%);
  background: var(--white);
}

@media (max-width: 640px) {
  .brand-crest {
    width: 36px;
    height: 36px;
  }
  .hero-copy h1 {
    font-size: clamp(40px, 10vw, 52px);
  }
  .hero-copy .hero-tagline {
    font-size: 18px;
  }
  .hero-copy .hero-description {
    font-size: 15px;
  }
  .academic-page .detail-visual.has-background-image {
    padding: 12px 12px 22px;
  }
  .academic-page .detail-visual.has-background-image .detail-visual-media {
    border-radius: 14px;
  }
  .academic-page .detail-panel .detail-close {
    top: 22px;
    right: 22px;
  }
}


/* Keep the faculty detail close control independent of the image flow. */
.academic-page .detail-panel > .detail-close {
  position: absolute !important;
  inset: 20px 20px auto auto !important;
  margin: 0 !important;
}
@media (max-width: 640px) {
  .academic-page .detail-panel > .detail-close {
    inset: 16px 16px auto auto !important;
  }
}


/* A normal-flow close bar keeps the control visible on every detail layout. */
.detail-close-bar {
  display: flex;
  justify-content: flex-end;
  padding: 12px 12px 0;
  background: var(--white);
}
.detail-close-bar .detail-close {
  position: static !important;
  inset: auto !important;
  flex: 0 0 auto;
  margin: 0 !important;
}
.academic-page .detail-close-bar {
  background: linear-gradient(145deg, rgb(242 248 255 / 96%), var(--white));
}
.club-page .detail-close-bar {
  background: rgb(6 27 53 / 93%);
}
.club-page .detail-close-bar .detail-close {
  border-color: rgb(255 255 255 / 30%);
  color: var(--white);
  background: rgb(255 255 255 / 8%);
}


/* Mobile detail panels are modal overlays so the directory stays in place. */
.detail-modal-backdrop {
  display: none;
}

@media (max-width: 1360px) {
  .detail-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 90;
    display: block;
    background: rgb(3 16 35 / 68%);
    backdrop-filter: blur(5px);
  }

  .directory-layout.has-detail .detail-panel {
    position: fixed;
    top: calc(var(--header-h) + 10px);
    right: 12px;
    bottom: 12px;
    left: 12px;
    z-index: 91;
    max-width: none;
    max-height: calc(100dvh - var(--header-h) - 22px);
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    border-radius: 20px;
  }

  .directory-layout.has-detail .detail-close-bar {
    position: sticky;
    top: 0;
    z-index: 10;
    padding-top: 10px;
  }

  .directory-layout.has-detail .detail-visual {
    min-height: 0;
    padding: 22px 20px;
  }

  .activity-gallery {
    padding: 0 20px 20px;
  }
}


/* Keep the club activity gallery as the final content block, not a hero-panel element. */
.detail-body > .activity-gallery {
  margin: 24px 0;
  padding: 0 0 22px;
  border-bottom: 1px solid var(--line);
}

.club-page .detail-body > .activity-gallery {
  border-color: rgb(255 255 255 / 10%);
}

.club-page .activity-gallery h3 {
  color: var(--white);
}

.club-page .activity-gallery p,
.club-page .activity-gallery figcaption {
  color: rgb(255 255 255 / 70%);
}

@media (max-width: 1360px) {
  .directory-layout.has-detail .detail-close-bar {
    min-height: 58px;
  }

  .detail-body > .activity-gallery {
    margin: 20px 0;
    padding-bottom: 20px;
  }
}


/* Global Light/Dark theme controls and the unified Club directory presentation. */
body {
  color: var(--text-primary);
  background: var(--page-bg);
  transition: color .2s ease, background-color .2s ease;
}
.site-header {
  border-color: var(--line);
  background: var(--header-bg);
}
.header-inner {
  grid-template-columns: auto minmax(0, 1fr) auto;
}
.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
}
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  padding: 7px 11px;
  border: 1px solid var(--line-strong);
  border-radius: 11px;
  color: var(--text-primary);
  background: var(--control-bg);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}
.theme-toggle > span:first-child {
  color: var(--blue-600);
  font-size: 16px;
}

/* Light mode: Clubs use the same directory/panel language as Khoa & Viện. */
:root:not([data-theme='dark']) .club-page {
  color: var(--text-primary);
  background: radial-gradient(circle at 78% 11%, rgb(76 201 255 / 12%), transparent 32%), var(--page-bg);
}
:root:not([data-theme='dark']) .club-page::after {
  display: none;
}
:root:not([data-theme='dark']) .club-page .eyebrow,
:root:not([data-theme='dark']) .club-page .entity-type,
:root:not([data-theme='dark']) .club-page .entity-link {
  color: var(--blue-600);
}
:root:not([data-theme='dark']) .club-page .directory-head > p:last-child,
:root:not([data-theme='dark']) .club-page .entity-meta {
  color: var(--text-secondary);
}
:root:not([data-theme='dark']) .club-page .directory-search input,
:root:not([data-theme='dark']) .club-page .chip,
:root:not([data-theme='dark']) .club-page .entity-card {
  border-color: var(--line);
  color: var(--text-primary);
  background: var(--control-bg);
  box-shadow: var(--shadow-sm);
}
:root:not([data-theme='dark']) .club-page .directory-search svg,
:root:not([data-theme='dark']) .club-page .directory-search input::placeholder {
  color: var(--ink-500);
}
:root:not([data-theme='dark']) .club-page .chip {
  color: var(--ink-800);
}
:root:not([data-theme='dark']) .club-page .chip.active {
  border-color: rgb(20 107 255 / 45%);
  color: var(--blue-600);
  background: rgb(20 107 255 / 8%);
}
:root:not([data-theme='dark']) .club-page .entity-card:hover,
:root:not([data-theme='dark']) .club-page .entity-card.selected {
  border-color: rgb(20 107 255 / 38%);
  box-shadow: var(--shadow-blue);
}
:root:not([data-theme='dark']) .club-page .detail-panel,
:root:not([data-theme='dark']) .club-page .detail-close-bar {
  border-color: var(--line);
  background: var(--panel-bg);
  box-shadow: var(--shadow-md);
}
:root:not([data-theme='dark']) .club-page .detail-visual {
  color: var(--text-primary);
  background: radial-gradient(circle at 86% 18%, rgb(76 201 255 / 18%), transparent 28%), linear-gradient(145deg, var(--surface-2), var(--panel-bg) 76%);
}
:root:not([data-theme='dark']) .club-page .detail-visual h2,
:root:not([data-theme='dark']) .club-page .detail-section h3 {
  color: var(--text-primary);
}
:root:not([data-theme='dark']) .club-page .detail-visual p,
:root:not([data-theme='dark']) .club-page .detail-section p,
:root:not([data-theme='dark']) .club-page .detail-section li,
:root:not([data-theme='dark']) .club-page .empty-contact,
:root:not([data-theme='dark']) .club-page .activity-gallery p,
:root:not([data-theme='dark']) .club-page .activity-gallery figcaption {
  color: var(--text-secondary);
}
:root:not([data-theme='dark']) .club-page .detail-visual .entity-type,
:root:not([data-theme='dark']) .club-page .detail-visual .detail-short {
  color: var(--blue-600);
}
:root:not([data-theme='dark']) .club-page .detail-section,
:root:not([data-theme='dark']) .club-page .detail-body > .activity-gallery {
  border-color: var(--line);
}
:root:not([data-theme='dark']) .club-page .detail-close-bar .detail-close {
  border-color: var(--line-strong);
  color: var(--text-primary);
  background: var(--control-bg);
}

/* Directory heroes share one campus artwork treatment across content sections. */
.directory-hero {
  position: relative;
  isolation: isolate;
  min-height: 232px;
  margin-bottom: 28px;
  padding: 28px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  background: var(--panel-bg);
}
.directory-hero::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: linear-gradient(90deg, var(--panel-bg) 0%, color-mix(in srgb, var(--panel-bg) 90%, transparent) 35%, color-mix(in srgb, var(--panel-bg) 26%, transparent) 67%, color-mix(in srgb, var(--panel-bg) 6%, transparent) 100%), url('/assets/map/map_tech_hero.png');
  background-position: center, 70% 62%;
  background-repeat: no-repeat;
  background-size: cover;
  content: '';
  opacity: .9;
  pointer-events: none;
}
.directory-hero > * {
  position: relative;
  z-index: 1;
}

/* All Club logos sit on an intentionally white, theme-independent tile. */
.club-page .entity-logo,
.club-page .detail-visual .entity-logo {
  border-color: rgb(20 107 255 / 22%) !important;
  color: var(--blue-600) !important;
  background: var(--logo-surface) !important;
  box-shadow: 0 5px 14px rgb(10 27 51 / 10%) !important;
}

/* Dark mode changes pages, controls and panels without changing logo tiles or hero artwork. */
:root[data-theme='dark'] .academic-page,
:root[data-theme='dark'] .club-page {
  background: radial-gradient(circle at 78% 9%, rgb(76 201 255 / 10%), transparent 30%), var(--page-bg);
}
:root[data-theme='dark'] .academic-page::after {
  opacity: .07;
}
:root[data-theme='dark'] .directory-search input,
:root[data-theme='dark'] .chip,
:root[data-theme='dark'] .entity-card,
:root[data-theme='dark'] .detail-panel,
:root[data-theme='dark'] .detail-close-bar,
:root[data-theme='dark'] .directory-hero {
  border-color: var(--line);
  color: var(--text-primary);
  background: var(--panel-bg);
  box-shadow: var(--shadow-sm);
}
:root[data-theme='dark'] .directory-head > p:last-child,
:root[data-theme='dark'] .entity-meta,
:root[data-theme='dark'] .detail-section p,
:root[data-theme='dark'] .detail-section li,
:root[data-theme='dark'] .empty-contact,
:root[data-theme='dark'] .activity-gallery p,
:root[data-theme='dark'] .activity-gallery figcaption {
  color: var(--text-secondary);
}
:root[data-theme='dark'] .main-nav button,
:root[data-theme='dark'] .brand,
:root[data-theme='dark'] .mobile-menu,
:root[data-theme='dark'] .mobile-nav button,
:root[data-theme='dark'] .theme-toggle,
:root[data-theme='dark'] .chip,
:root[data-theme='dark'] .directory-search input {
  color: var(--text-primary);
}
:root[data-theme='dark'] .mobile-menu,
:root[data-theme='dark'] .mobile-nav,
:root[data-theme='dark'] .theme-toggle {
  border-color: var(--line-strong);
  background: var(--control-bg);
}
:root[data-theme='dark'] .detail-visual {
  background: radial-gradient(circle at 80% 18%, rgb(76 201 255 / 22%), transparent 32%), linear-gradient(145deg, #102f58, #091c35);
}
:root[data-theme='dark'] .detail-close-bar .detail-close {
  border-color: var(--line-strong);
  color: var(--text-primary);
  background: var(--control-bg);
}
:root[data-theme='dark'] .directory-hero::before {
  background-image: linear-gradient(90deg, rgb(11 23 41 / 98%) 0%, rgb(11 23 41 / 91%) 37%, rgb(11 23 41 / 42%) 67%, rgb(11 23 41 / 9%) 100%), url('/assets/map/map_tech_hero.png');
}
:root[data-theme='dark'] .club-page .detail-visual {
  color: var(--white);
}
:root[data-theme='dark'] .club-page .detail-visual h2,
:root[data-theme='dark'] .club-page .detail-section h3,
:root[data-theme='dark'] .club-page .activity-gallery h3 {
  color: var(--white);
}
:root[data-theme='dark'] .club-page .detail-visual p,
:root[data-theme='dark'] .club-page .detail-section p,
:root[data-theme='dark'] .club-page .detail-section li,
:root[data-theme='dark'] .club-page .activity-gallery p,
:root[data-theme='dark'] .club-page .activity-gallery figcaption {
  color: rgb(255 255 255 / 72%);
}

@media (max-width: 860px) {
  .header-inner {
    gap: 12px;
    padding-inline-end: max(8px, env(safe-area-inset-right));
  }
  .brand { min-width: 0; }
  .header-actions { margin-left: auto; }
  .mobile-menu { margin-left: 0; }
}
@media (max-width: 640px) {
  .theme-toggle { min-width: 42px; justify-content: center; padding-inline: 10px; }
  .theme-toggle > span:last-child { display: none; }
  .directory-hero { min-height: 205px; padding: 22px 20px; }
  .directory-hero::before { background-position: center, 72% center; opacity: .72; }
}

:root[data-theme='dark'] .club-page::after {
  display: none;
}


/* Dark-mode Khoa & Viện cards: replace the light image wash with a navy overlay. */
:root[data-theme='dark'] .academic-page .entity-card.has-background-image {
  border-color: rgb(89 161 255 / 28%);
  color: var(--white);
  background: #0c1d35;
  box-shadow: 0 14px 34px rgb(0 0 0 / 28%);
}
:root[data-theme='dark'] .academic-page .entity-card.has-background-image .entity-visual-media {
  filter: brightness(.64) saturate(.88) contrast(1.05);
  opacity: .72;
}
:root[data-theme='dark'] .academic-page .entity-card.has-background-image::before {
  background:
    linear-gradient(90deg, rgb(8 24 46 / 97%) 0%, rgb(8 24 46 / 91%) 34%, rgb(8 24 46 / 62%) 62%, rgb(8 24 46 / 18%) 100%),
    linear-gradient(0deg, rgb(8 24 46 / 72%), transparent 68%);
}
:root[data-theme='dark'] .academic-page .entity-card.has-background-image::after {
  background: radial-gradient(circle at 88% 16%, rgb(76 201 255 / 20%), transparent 31%);
}
:root[data-theme='dark'] .academic-page .entity-card.has-background-image h2 {
  color: var(--white);
}
:root[data-theme='dark'] .academic-page .entity-card.has-background-image .entity-type,
:root[data-theme='dark'] .academic-page .entity-card.has-background-image .entity-link {
  color: var(--cyan-400);
}
:root[data-theme='dark'] .academic-page .entity-card.has-background-image .entity-meta {
  color: rgb(255 255 255 / 74%);
}
:root[data-theme='dark'] .academic-page .detail-panel,
:root[data-theme='dark'] .academic-page .detail-close-bar {
  border-color: var(--line);
  background: var(--panel-bg);
}
:root[data-theme='dark'] .academic-page .detail-visual.has-background-image {
  color: var(--white);
  background: linear-gradient(145deg, #132c4d, #0c1d35);
}
:root[data-theme='dark'] .academic-page .detail-visual.has-background-image .detail-visual-media {
  border-color: rgb(89 161 255 / 24%);
  background-color: #0b1729;
  filter: brightness(.78) saturate(.9);
}
:root[data-theme='dark'] .academic-page .detail-visual.has-background-image h2 {
  color: var(--white);
}
:root[data-theme='dark'] .academic-page .detail-visual.has-background-image p {
  color: rgb(255 255 255 / 72%);
}
:root[data-theme='dark'] .academic-page .detail-visual.has-background-image .entity-type,
:root[data-theme='dark'] .academic-page .detail-visual.has-background-image .detail-short {
  color: var(--cyan-400);
}
:root[data-theme='dark'] .academic-page .detail-close-bar .detail-close {
  border-color: var(--line-strong);
  color: var(--white);
  background: var(--control-bg);
}


/* Approved Intro redesign contract: editorial strategic flow and closing media. */
.intro-content-flow {
  --intro-card-radius: 16px;
  --intro-soft-shadow: 0 10px 30px color-mix(in srgb, var(--navy-950) 7%, transparent);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  color: var(--text-primary);
  background-color: var(--page-bg);
}
.intro-content-flow::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--blue-600) 3.5%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--blue-600) 3.5%, transparent) 1px, transparent 1px);
  background-size: 48px 48px;
  content: '';
  pointer-events: none;
}
.intro-content-flow.tech-bg::before {
  display: none;
}
.intro-page-container {
  max-width: 1280px;
}
.intro-strategy-section,
.intro-closing-section {
  position: relative;
  z-index: 1;
}
.intro-strategy-section {
  padding: clamp(64px, 6.5vw, 92px) 0 clamp(72px, 7vw, 104px);
  border: 0;
  background: transparent;
}
.intro-section-heading {
  max-width: 820px;
  margin: 0 auto clamp(28px, 3vw, 40px);
  text-align: center;
}
.intro-section-heading .eyebrow {
  margin-bottom: 12px;
  color: var(--blue-600);
  font-size: 12px;
  font-weight: 700;
}
.intro-section-heading h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: clamp(32px, 3vw, 40px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -.035em;
}
.intro-heading-line {
  display: block;
  width: 38px;
  height: 2px;
  margin: 16px auto 0;
  border-radius: 999px;
  background: var(--orange-500);
}
.intro-strategy-heading {
  margin-bottom: clamp(28px, 3vw, 38px);
}
.intro-primary-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}
.intro-primary-tab {
  display: flex;
  min-width: 0;
  min-height: 70px;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--text-primary);
  background: var(--panel-bg);
  box-shadow: 0 5px 18px color-mix(in srgb, var(--navy-950) 4%, transparent);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  text-align: left;
  transition: border-color .2s ease, color .2s ease, background-color .2s ease, box-shadow .2s ease;
}
.intro-primary-tab:hover {
  border-color: color-mix(in srgb, var(--blue-600) 35%, var(--line));
  color: var(--blue-600);
}
.intro-primary-tab.active {
  border-color: color-mix(in srgb, var(--blue-500) 58%, transparent);
  color: var(--white);
  background: linear-gradient(135deg, var(--navy-800), color-mix(in srgb, var(--blue-600) 55%, var(--navy-800)));
  box-shadow: 0 9px 24px rgb(3 20 38 / 14%);
}
.intro-primary-tab-icon {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: var(--blue-600);
  background: color-mix(in srgb, var(--blue-600) 9%, var(--panel-bg));
}
.intro-primary-tab.active .intro-primary-tab-icon {
  color: var(--white);
  background: rgb(255 255 255 / 12%);
}
.intro-primary-tab-arrow {
  display: none;
  flex: 0 0 auto;
  margin-left: auto;
}
.intro-section-panel {
  min-width: 0;
  margin: 0;
  padding: clamp(18px, 2.2vw, 28px);
  border: 1px solid var(--line);
  border-radius: var(--intro-card-radius);
  background: var(--panel-bg);
  box-shadow: var(--intro-soft-shadow);
}
.intro-context-layout {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: clamp(22px, 3vw, 40px);
  align-items: start;
}
.intro-context-nav {
  display: grid;
  gap: 10px;
}
.intro-context-nav button {
  min-height: 48px;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--text-primary);
  background: color-mix(in srgb, var(--surface-2) 55%, var(--panel-bg));
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  transition: border-color .2s ease, color .2s ease, background-color .2s ease;
}
.intro-context-nav button:hover {
  border-color: color-mix(in srgb, var(--blue-600) 36%, var(--line));
  color: var(--blue-600);
}
.intro-context-nav button.active {
  border-color: var(--navy-800);
  color: var(--white);
  background: var(--navy-800);
}
.intro-context-reading {
  min-width: 0;
  max-width: 82ch;
}
.intro-context-reading h3 {
  margin: 0 0 18px;
  color: var(--blue-600);
  font-size: clamp(20px, 2vw, 25px);
  line-height: 1.25;
}
.intro-content-copy {
  max-width: none;
}
.intro-content-copy p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.78;
}
.intro-content-copy p + p {
  margin-top: 18px;
}
.intro-mission-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.intro-mission-card {
  min-width: 0;
  padding: clamp(22px, 2.2vw, 28px);
  border: 1px solid var(--line);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 34%, var(--panel-bg));
  box-shadow: 0 8px 24px color-mix(in srgb, var(--navy-950) 5%, transparent);
}
.intro-mission-card-core-values {
  grid-column: span 2;
}
.intro-card-icon,
.intro-accordion-icon {
  display: grid;
  place-items: center;
  color: var(--white);
  background: linear-gradient(145deg, var(--navy-800), #0b3f86);
}
.intro-card-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 18px;
  border-radius: 50%;
}
.intro-mission-card h3 {
  margin: 0 0 14px;
  color: var(--text-primary);
  font-size: clamp(18px, 1.55vw, 21px);
  line-height: 1.3;
  letter-spacing: -.015em;
}
.intro-mission-card-education-philosophy .intro-content-copy p:first-child {
  color: var(--text-primary);
  font-weight: 700;
}
.intro-mission-card-education-philosophy .intro-content-copy p:nth-child(2) {
  color: var(--blue-600);
  font-family: var(--font-mono);
  font-size: 14px;
}
.intro-mission-card-action-slogan .intro-content-copy p {
  color: var(--text-primary);
  font-weight: 650;
}
.intro-accordion {
  display: grid;
  gap: 12px;
}
.intro-accordion-item {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface-2) 34%, var(--panel-bg));
}
.intro-accordion-item.open {
  border-color: color-mix(in srgb, var(--blue-600) 42%, var(--line));
}
.intro-accordion-item h3 {
  margin: 0;
}
.intro-accordion-item h3 button {
  display: flex;
  width: 100%;
  min-height: 68px;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 18px;
  border: 0;
  color: var(--text-primary);
  background: transparent;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  text-align: left;
}
.intro-accordion-item h3 button:hover {
  color: var(--blue-600);
  background: color-mix(in srgb, var(--blue-600) 5%, transparent);
}
.intro-accordion-title {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
}
.intro-accordion-icon {
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border-radius: 11px;
}
.intro-accordion-item h3 button > svg {
  flex: 0 0 auto;
  color: var(--blue-600);
  transition: transform .2s ease;
}
.intro-accordion-item.open h3 button > svg {
  transform: rotate(180deg);
}
.intro-accordion-panel {
  padding: 0 22px 24px 74px;
  border-top: 1px solid var(--line);
}
.intro-accordion-panel ul {
  display: grid;
  max-width: 94ch;
  gap: 13px;
  margin: 22px 0 0;
  padding-left: 22px;
}
.intro-accordion-panel li {
  padding-left: 5px;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.74;
}
.intro-accordion-panel li::marker {
  color: var(--orange-500);
}
.intro-closing-section {
  padding: clamp(64px, 6.5vw, 92px) 0 clamp(56px, 5vw, 64px);
  overflow-x: clip;
  border-top: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface-2) 72%, var(--page-bg));
}
.intro-final-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  gap: clamp(24px, 3vw, 40px);
  align-items: start;
}
.intro-media-card {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--intro-card-radius);
  background: var(--panel-bg);
  box-shadow: var(--intro-soft-shadow);
}
.intro-organization-card {
  display: flex;
  width: 100%;
  max-width: 1080px;
  margin-inline: auto;
  flex-direction: column;
}
.intro-organization-preview {
  display: block;
  width: 100%;
  padding: clamp(6px, 1vw, 12px);
  border: 0;
  background: var(--logo-surface);
}
.intro-organization-preview img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
.intro-media-actions {
  margin-top: auto;
  padding: 14px;
  border-top: 1px solid var(--line);
  background: var(--panel-bg);
}
.intro-media-actions button {
  display: inline-flex;
  width: 100%;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 10px 16px;
  border: 1px solid color-mix(in srgb, var(--blue-500) 50%, transparent);
  border-radius: 999px;
  color: var(--white);
  background: linear-gradient(135deg, var(--navy-800), color-mix(in srgb, var(--blue-600) 55%, var(--navy-800)));
  font-size: 14px;
  font-weight: 700;
}
.intro-milestone-card {
  position: relative;
  isolation: isolate;
  display: grid;
  width: 100vw;
  max-width: none;
  justify-self: center;
  place-items: center;
  min-height: 0;
  border-right: 0;
  border-left: 0;
  border-radius: 0;
  background: linear-gradient(90deg, var(--navy-950), var(--navy-800), var(--navy-950));
  box-shadow: none;
}
.intro-milestone-card::before {
  position: absolute;
  inset: -32px;
  z-index: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--navy-950) 52%, transparent), color-mix(in srgb, var(--navy-800) 38%, transparent)),
    url('/assets/intro/uet-20-years-banner.webp');
  background-position: center;
  background-size: cover;
  content: '';
  filter: blur(22px) saturate(.9);
  opacity: .72;
  transform: scale(1.05);
  pointer-events: none;
}
.intro-milestone-card img {
  position: relative;
  z-index: 1;
  width: min(100%, 1280px);
  height: auto;
  margin-inline: auto;
  border-radius: 0;
  object-fit: contain;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 clamp(16px, 4vw, 64px), #000 calc(100% - clamp(16px, 4vw, 64px)), transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 clamp(16px, 4vw, 64px), #000 calc(100% - clamp(16px, 4vw, 64px)), transparent 100%);
}
.intro-lightbox {
  position: fixed;
  inset: 0;
  z-index: 220;
  display: grid;
  place-items: center;
  padding: max(18px, env(safe-area-inset-top)) max(18px, env(safe-area-inset-right)) max(18px, env(safe-area-inset-bottom)) max(18px, env(safe-area-inset-left));
  background: rgb(3 20 38 / 94%);
  backdrop-filter: blur(8px);
}
.intro-lightbox-close {
  position: fixed;
  top: max(16px, env(safe-area-inset-top));
  right: max(16px, env(safe-area-inset-right));
  z-index: 2;
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  padding: 0;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 50%;
  color: var(--white);
  background: var(--navy-900);
}
.intro-lightbox-image {
  max-width: min(1448px, calc(100vw - 36px));
  max-height: calc(100dvh - 36px);
  overflow: auto;
  border-radius: 12px;
  background: var(--logo-surface);
  box-shadow: 0 28px 80px rgb(0 0 0 / 45%);
  overscroll-behavior: contain;
  touch-action: pinch-zoom;
}
.intro-lightbox-image img {
  width: auto;
  max-width: 100%;
  max-height: calc(100dvh - 36px);
  object-fit: contain;
}

@media (max-width: 1199px) {
  .intro-mission-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .intro-content-flow {
    --intro-card-radius: 16px;
  }
  .intro-strategy-section,
  .intro-closing-section {
    padding: 56px 0 64px;
  }
  .intro-section-heading {
    margin-right: 0;
    margin-bottom: 28px;
    margin-left: 0;
    text-align: left;
  }
  .intro-section-heading h2 {
    font-size: clamp(28px, 8.4vw, 34px);
    line-height: 1.18;
  }
  .intro-heading-line {
    margin-left: 0;
  }
  .intro-primary-tabs {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    margin-bottom: 14px;
  }
  .intro-primary-tab {
    min-height: 64px;
    padding: 11px 14px;
    font-size: 14px;
  }
  .intro-primary-tab-icon {
    width: 38px;
    height: 38px;
  }
  .intro-primary-tab-arrow {
    display: block;
  }
  .intro-section-panel {
    padding: 14px;
    border-radius: 16px;
  }
  .intro-context-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
  }
  .intro-context-nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
  .intro-context-nav button {
    min-height: 48px;
    text-align: center;
  }
  .intro-context-reading h3 {
    font-size: 21px;
  }
  .intro-content-copy p,
  .intro-accordion-panel li {
    font-size: 15px;
    line-height: 1.72;
  }
  .intro-mission-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
  .intro-mission-card,
  .intro-mission-card-core-values {
    grid-column: auto;
  }
  .intro-mission-card {
    padding: 22px 18px;
  }
  .intro-mission-card h3 {
    font-size: 19px;
  }
  .intro-accordion-item h3 button {
    min-height: 64px;
    gap: 10px;
    padding: 12px;
    font-size: 14px;
  }
  .intro-accordion-title {
    gap: 10px;
  }
  .intro-accordion-icon {
    width: 38px;
    height: 38px;
  }
  .intro-accordion-panel {
    padding: 0 14px 20px;
  }
  .intro-accordion-panel ul {
    margin-top: 18px;
    padding-left: 20px;
  }
  .intro-organization-preview {
    padding: 5px;
  }
  .intro-lightbox {
    padding: 12px;
  }
  .intro-lightbox-image {
    max-width: calc(100vw - 24px);
    max-height: calc(100dvh - 24px);
  }
  .intro-lightbox-image img {
    max-height: calc(100dvh - 24px);
  }
}


/* Club background imagery mirrors the established Khoa / Viện treatment. */
:root:not([data-theme='dark']) .club-page .entity-card.has-background-image {
  border-color: var(--line);
  color: var(--ink-950);
  background: var(--white);
  box-shadow: var(--shadow-sm);
}
:root:not([data-theme='dark']) .club-page .entity-card.has-background-image .entity-visual-media {
  background-position: right center;
  filter: brightness(.98) saturate(.94) contrast(1.03);
  opacity: .62;
}
:root:not([data-theme='dark']) .club-page .entity-card.has-background-image::before {
  background:
    linear-gradient(90deg, var(--white) 0%, rgb(255 255 255 / 94%) 36%, rgb(255 255 255 / 42%) 63%, rgb(255 255 255 / 4%) 100%),
    linear-gradient(0deg, rgb(255 255 255 / 60%) 0%, rgb(255 255 255 / 30%) 32%, transparent 68%);
}
:root:not([data-theme='dark']) .club-page .entity-card.has-background-image::after {
  background: radial-gradient(circle at 88% 16%, rgb(76 201 255 / 18%), transparent 31%);
  mix-blend-mode: normal;
}
:root:not([data-theme='dark']) .club-page .entity-card.has-background-image h2 { color: var(--ink-950); }
:root:not([data-theme='dark']) .club-page .entity-card.has-background-image .entity-type,
:root:not([data-theme='dark']) .club-page .entity-card.has-background-image .entity-link { color: var(--blue-600); }
:root:not([data-theme='dark']) .club-page .entity-card.has-background-image .entity-meta { color: var(--ink-500); }

:root:not([data-theme='dark']) .club-page .detail-visual.has-background-image {
  min-height: 0;
  padding: 18px 18px 26px;
  color: var(--ink-950);
  background: linear-gradient(145deg, rgb(242 248 255 / 96%), var(--white) 62%);
}
:root:not([data-theme='dark']) .club-page .detail-visual.has-background-image::before,
:root:not([data-theme='dark']) .club-page .detail-visual.has-background-image::after { display: none; }
:root:not([data-theme='dark']) .club-page .detail-visual.has-background-image .detail-visual-media {
  position: relative;
  inset: auto;
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  border: 1px solid rgb(20 107 255 / 14%);
  border-radius: 18px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: var(--white);
  box-shadow: 0 16px 32px rgb(10 27 51 / 12%);
  filter: none;
  opacity: 1;
}
:root:not([data-theme='dark']) .club-page .detail-visual.has-background-image .entity-logo {
  margin: 22px 6px 14px;
  border-color: var(--line-strong);
  color: var(--blue-600);
  background: var(--white);
}
:root:not([data-theme='dark']) .club-page .detail-visual.has-background-image > :not(.detail-visual-media):not(.detail-close) {
  margin-right: 6px;
  margin-left: 6px;
}
:root:not([data-theme='dark']) .club-page .detail-visual.has-background-image .entity-type,
:root:not([data-theme='dark']) .club-page .detail-visual.has-background-image .detail-short { color: var(--blue-600); }
:root:not([data-theme='dark']) .club-page .detail-visual.has-background-image h2 { color: var(--ink-950); }
:root:not([data-theme='dark']) .club-page .detail-visual.has-background-image p { color: var(--ink-600); }
:root:not([data-theme='dark']) .club-page .detail-close-bar { background: linear-gradient(145deg, rgb(242 248 255 / 96%), var(--white)); }
:root:not([data-theme='dark']) .club-page .detail-close-bar .detail-close {
  border-color: rgb(10 27 51 / 14%);
  color: var(--ink-950);
  background: rgb(255 255 255 / 94%);
}

:root[data-theme='dark'] .club-page .entity-card.has-background-image {
  border-color: rgb(89 161 255 / 28%);
  color: var(--white);
  background: #0c1d35;
  box-shadow: 0 14px 34px rgb(0 0 0 / 28%);
}
:root[data-theme='dark'] .club-page .entity-card.has-background-image .entity-visual-media {
  filter: brightness(.64) saturate(.88) contrast(1.05);
  opacity: .72;
}
:root[data-theme='dark'] .club-page .entity-card.has-background-image::before {
  background:
    linear-gradient(90deg, rgb(8 24 46 / 97%) 0%, rgb(8 24 46 / 91%) 34%, rgb(8 24 46 / 62%) 62%, rgb(8 24 46 / 18%) 100%),
    linear-gradient(0deg, rgb(8 24 46 / 72%), transparent 68%);
}
:root[data-theme='dark'] .club-page .entity-card.has-background-image::after {
  background: radial-gradient(circle at 88% 16%, rgb(76 201 255 / 20%), transparent 31%);
}
:root[data-theme='dark'] .club-page .entity-card.has-background-image h2 { color: var(--white); }
:root[data-theme='dark'] .club-page .entity-card.has-background-image .entity-type,
:root[data-theme='dark'] .club-page .entity-card.has-background-image .entity-link { color: var(--cyan-400); }
:root[data-theme='dark'] .club-page .entity-card.has-background-image .entity-meta { color: rgb(255 255 255 / 74%); }
:root[data-theme='dark'] .club-page .detail-visual.has-background-image {
  color: var(--white);
  background: linear-gradient(145deg, #132c4d, #0c1d35);
}
:root[data-theme='dark'] .club-page .detail-visual.has-background-image .detail-visual-media {
  border-color: rgb(89 161 255 / 24%);
  background-color: #0b1729;
  filter: brightness(.78) saturate(.9);
}
:root[data-theme='dark'] .club-page .detail-visual.has-background-image h2 { color: var(--white); }
:root[data-theme='dark'] .club-page .detail-visual.has-background-image p { color: rgb(255 255 255 / 72%); }
:root[data-theme='dark'] .club-page .detail-visual.has-background-image .entity-type,
:root[data-theme='dark'] .club-page .detail-visual.has-background-image .detail-short { color: var(--cyan-400); }
:root[data-theme='dark'] .club-page .detail-close-bar { background: var(--panel-bg); }
:root[data-theme='dark'] .club-page .detail-close-bar .detail-close {
  border-color: var(--line-strong);
  color: var(--white);
  background: var(--control-bg);
}

@media (max-width: 640px) {
  :root:not([data-theme='dark']) .club-page .detail-visual.has-background-image { padding: 12px 12px 22px; }
  :root:not([data-theme='dark']) .club-page .detail-visual.has-background-image .detail-visual-media { border-radius: 14px; }
}


/* Club page surface matches the Khoa / Viện directory atmosphere. */
:root:not([data-theme='dark']) .club-page {
  background: radial-gradient(circle at 76% 8%, rgb(76 201 255 / 11%), transparent 31%), var(--surface);
}
:root:not([data-theme='dark']) .club-page::after {
  display: block;
  background-position: center 44%;
  filter: brightness(1.22) saturate(.58) contrast(.88);
  opacity: .13;
}
:root[data-theme='dark'] .club-page::after {
  opacity: .07;
}
```

## frontend/src/styles/tokens.css

```css
/* Production design tokens for the UET Navigator UI. */
:root {
  --font-sans: "Be Vietnam Pro", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Consolas, monospace;

  --navy-950: #04152a;
  --navy-900: #082443;
  --navy-850: #0b2d52;
  --navy-800: #10395f;
  --blue-700: #0a56d8;
  --blue-600: #146bff;
  --blue-500: #2f80ff;
  --blue-400: #59a1ff;
  --cyan-400: #4cc9ff;
  --orange-500: #ff7a2f;
  --ink-950: #0a1b33;
  --ink-800: #23364f;
  --ink-600: #5d6d83;
  --ink-500: #728197;
  --white: #ffffff;
  --surface: #f7fafe;
  --surface-2: #eef4fb;
  --surface-3: #e7eff8;
  --line: #d9e4f0;
  --line-strong: #c7d7e8;

  --shadow-sm: 0 8px 24px rgb(10 27 51 / 8%);
  --shadow-md: 0 18px 48px rgb(10 27 51 / 12%);
  --shadow-blue: 0 0 0 1px rgb(20 107 255 / 18%), 0 18px 50px rgb(20 107 255 / 18%);

  --radius-sm: 12px;
  --radius-card: 18px;
  --radius-panel: 28px;
  --radius-hero: 36px;
  --container: 1480px;
  --header-h: 72px;
  --page-gutter: clamp(16px, 3vw, 32px);
  --focus-ring: 0 0 0 4px rgb(20 107 255 / 18%);
}


/* Semantic theme tokens. `--logo-surface` stays white in both modes. */
:root {
  --page-bg: var(--surface);
  --panel-bg: var(--white);
  --control-bg: rgb(255 255 255 / 92%);
  --header-bg: rgb(255 255 255 / 93%);
  --text-primary: var(--ink-950);
  --text-secondary: var(--ink-600);
  --logo-surface: #ffffff;
}

:root[data-theme='dark'] {
  --surface: #0b1729;
  --surface-2: #11223a;
  --surface-3: #172c48;
  --ink-950: #f6f9ff;
  --ink-800: #d9e4f4;
  --ink-600: #aebed3;
  --ink-500: #8ea1bb;
  --line: #29415f;
  --line-strong: #3a5574;
  --shadow-sm: 0 8px 24px rgb(0 0 0 / 22%);
  --shadow-md: 0 18px 48px rgb(0 0 0 / 34%);
  --shadow-blue: 0 0 0 1px rgb(89 161 255 / 30%), 0 18px 50px rgb(0 0 0 / 30%);
  --page-bg: #0b1729;
  --panel-bg: #10233e;
  --control-bg: #152b49;
  --header-bg: rgb(10 24 43 / 93%);
  --text-primary: #f6f9ff;
  --text-secondary: #aebed3;
}
```

## frontend/src/main.jsx

```jsx
import { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './styles/intro.css';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UET Navigator render error:', error, errorInfo);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return <main className="runtime-error">
      <p className="eyebrow">LỖI HIỂN THỊ</p>
      <h1>Không thể hiển thị trang này.</h1>
      <p>{this.state.error.message || 'Đã xảy ra lỗi không xác định trong giao diện React.'}</p>
      <button className="primary" onClick={() => location.reload()}>Tải lại trang</button>
    </main>;
  }
}

const rootElement = document.getElementById('root');
rootElement.dataset.mounted = 'true';

createRoot(rootElement).render(
  <StrictMode><AppErrorBoundary><App /></AppErrorBoundary></StrictMode>
);
```