import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { mediaUrl } from './lib/media';

const IntroPage = lazy(() => import('./pages/IntroPage'));
const AcademicPlanPage = lazy(() => import('./pages/AcademicPlanPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const YouthUnionPage = lazy(() => import('./components/YouthUnionPage').then(module => ({ default: module.YouthUnionPage })));
const LienChiPage = lazy(() => import('./pages/LienChiPage'));
const ClubPage = lazy(() => import('./pages/ClubPage'));

const uetLogoUrl = mediaUrl('intro/uet.png');
const defaultRoute = 'ke-hoach-nam-hoc';

const sections = [
  [defaultRoute, 'Cẩm nang Tân sinh viên'],
  ['ban-do', 'Bản đồ khuôn viên'],
  ['gioi-thieu', 'Giới thiệu chung'],
  ['doan-thanh-nien-hoi-sinh-vien', 'Đoàn Thanh niên – Hội Sinh viên'],
  ['lien-chi', 'Liên chi Khoa/ Viện'],
  ['cau-lac-bo', 'Câu lạc bộ']
];

function currentRoute() {
  const path = location.pathname.replace(/\/+$/, '').slice(1);
  return !path || path === 'trang-chu' ? defaultRoute : path;
}

function RouteLoading() {
  return <section className="route-loading" role="status" aria-live="polite">
    <span className="route-loading-mark" aria-hidden="true">U</span>
    <p>Đang chuẩn bị nội dung</p>
    <span className="route-loading-line" aria-hidden="true" />
  </section>;
}

function ActivePage({ route, navigate }) {
  if (route === 'ke-hoach-nam-hoc') return <AcademicPlanPage navigate={navigate} />;
  if (route === 'ban-do') return <MapPage />;
  if (route === 'doan-thanh-nien-hoi-sinh-vien') return <YouthUnionPage navigate={navigate} />;
  if (route === 'lien-chi') return <LienChiPage />;
  if (route === 'cau-lac-bo') return <ClubPage />;
  if (route === 'gioi-thieu') return <IntroPage />;
  return <AcademicPlanPage navigate={navigate} />;
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
  const activeRoute = sections.some(([id]) => id === route) ? route : defaultRoute;

  return <div className="app-shell">
    <Header current={activeRoute} navigate={navigate} theme={theme} onThemeToggle={() => setTheme(value => value === 'dark' ? 'light' : 'dark')} />
    <main>
      <Suspense fallback={<RouteLoading />}>
        <ActivePage route={activeRoute} navigate={navigate} />
      </Suspense>
    </main>
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
      <button className="brand" onClick={() => goTo(defaultRoute)} aria-label="Về Cẩm nang Tân sinh viên">
        <img className="brand-crest" src={uetLogoUrl} alt="Logo Trường Đại học Công nghệ" width="52" height="52" loading="eager" decoding="async" fetchPriority="high" />
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
