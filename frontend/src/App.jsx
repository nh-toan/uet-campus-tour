import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import uetLogoUrl from '../../LOGO KHOA - BO MON - VIEN/UET.png';
import { ArrowRight, Building2, ChevronDown, ChevronRight, ExternalLink, Flag, Gem, Globe2, GraduationCap, Handshake, Lightbulb, ListChecks, Megaphone, Menu, Microscope, Search, Target, Telescope, X, ZoomIn } from 'lucide-react';
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
const introPrimaryIcons = {
  context: Globe2,
  'mission-vision': Target,
  'key-tasks': ListChecks
};
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
    const closeOnEscape = event => {
      if (event.key === 'Escape') setLightboxOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
      triggerRef.current?.focus();
    };
  }, [lightboxOpen]);

  return <>
    <article className="intro-media-card intro-organization-card">
      <button className="intro-organization-preview" type="button" onClick={openLightbox} aria-label="Mở sơ đồ cơ cấu tổ chức đầy đủ">
        <img src="/assets/intro/uet-organization-chart.webp" alt="Sơ đồ cơ cấu tổ chức Trường Đại học Công nghệ" width="1448" height="1086" />
      </button>
      <div className="intro-media-actions">
        <button type="button" onClick={openLightbox}><ZoomIn size={19} aria-hidden="true" />Xem sơ đồ đầy đủ</button>
      </div>
    </article>
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

function IntroClosingSection() {
  return <section className="intro-closing-section" aria-labelledby="organization-title">
    <div className="site-container intro-page-container">
      <header className="intro-section-heading">
        <p className="eyebrow">Cơ cấu tổ chức</p>
        <h2 id="organization-title">Hệ thống tổ chức UET</h2>
        <span className="intro-heading-line" aria-hidden="true" />
      </header>
      <div className="intro-final-grid">
        <OrganizationChart />
        <figure className="intro-media-card intro-milestone-card">
          <img src="/assets/intro/uet-20-years-banner.webp" alt="Hơn 20 năm phát triển và khẳng định vị thế trên bản đồ giáo dục toàn cầu" width="2103" height="748" />
        </figure>
      </div>
    </div>
  </section>;
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
          const Icon = introPrimaryIcons[section.id];
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
            <span className="intro-primary-tab-icon"><Icon size={21} aria-hidden="true" /></span>
            <span>{section.label}</span>
            <ChevronRight className="intro-primary-tab-arrow" size={20} aria-hidden="true" />
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

  return <section className="directory-page club-page tech-bg"><div className={`site-container directory-layout${selected ? ' has-detail' : ' is-full-width'}`}><div><header className="directory-head directory-hero"><p className="eyebrow">Cộng đồng câu lạc bộ</p><h1>Kết nối đam mê — Kiến tạo giá trị — Lan tỏa ảnh hưởng</h1><p>Khám phá một cộng đồng đa dạng, nơi mỗi ý tưởng và sở thích đều có không gian để phát triển.</p></header><div className="toolbar"><SearchInput value={query} onChange={setQuery} placeholder="Tìm kiếm câu lạc bộ, lĩnh vực, kỹ năng..." /></div><div className="chips" aria-label="Lọc câu lạc bộ">{[['all', 'Tất cả'], ...available].map(([id, label]) => <button key={id} className={`chip${filter === id ? ' active' : ''}`} onClick={() => setFilter(id)} aria-pressed={filter === id}>{label}</button>)}</div><div className="entity-grid club-grid">{shown.map(club => <EntityCard key={club.id} item={club} type={clubCategoryLabels[club.category]} meta={clubDisplayName(club)} selected={selected?.id === club.id} onSelect={() => setSelectedId(current => current === club.id ? null : club.id)} actionLabel="Khám phá" />)}</div>{!shown.length && <p className="empty-state">Không tìm thấy CLB khớp bộ lọc.</p>}</div>{selected && <DetailPanel item={selected} type={`UET Hòa Lạc · ${clubCategoryLabels[selected.category]}`} subtitle={clubDisplayName(selected)} dark onClose={() => setSelectedId(null)} />}</div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="site-container footer-inner"><div><b>UET NAVIGATOR</b><span>Không gian khám phá số dành cho cộng đồng UET Hòa Lạc.</span></div><span>© {new Date().getFullYear()} UET Navigator</span></div></footer>;
}
