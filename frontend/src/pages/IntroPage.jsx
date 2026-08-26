import { useState } from 'react';
import { ArrowRight, Building2, ChevronDown, Flag, Gem, GraduationCap, Handshake, Lightbulb, Megaphone, Microscope, Target, Telescope } from 'lucide-react';
import { introContent, introTabs } from '../content/introContent';
import { mediaUrl } from '../lib/media';
import '../styles/intro.css';

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

const introTabIcons = {
  context: Target,
  'mission-vision': Gem,
  'key-tasks': Flag
};

const introCoreValueIcons = [Lightbulb, Handshake, Target, Gem];

export default function IntroPage() {
  return <>
    <section className="intro-hero">
      <div className="hero-media" aria-hidden="true">
        <img src={mediaUrl('map/map_tech_hero.webp')} alt="" width="1672" height="941" loading="eager" decoding="async" fetchPriority="high" />
        <div className="hero-media-blend" />
      </div>
      <div className="site-container hero-inner">
        <div className="hero-copy">
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
  return <div className="intro-organization-diagram">
    <div className="intro-organization-preview">
      <img src={mediaUrl('intro/uet-organization-chart.webp')} alt="Sơ đồ cơ cấu tổ chức Trường Đại học Công nghệ" width="2400" height="1802" loading="lazy" decoding="async" />
    </div>
  </div>;
}

function MilestoneSection() {
  return <section className="intro-milestone-artwork-section" aria-label="Hơn 20 năm phát triển của UET">
    <img className="intro-milestone-artwork" src={mediaUrl('intro/uet-20-years-banner.png')} alt="Hơn 20 năm phát triển và khẳng định vị thế trên bản đồ giáo dục toàn cầu" width="8755" height="3117" loading="lazy" decoding="async" />
  </section>;
}

function IntroClosingSection() {
  return <>
    <section className="intro-organization-section" aria-labelledby="organization-title">
      <div className="site-container intro-page-container">
        <header className="intro-section-heading">
          <h2 id="organization-title">Cơ cấu tổ chức</h2>
          <span className="intro-heading-line" aria-hidden="true" />
        </header>
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
        <h2 id="strategy-title">Nền tảng và tầm nhìn <span>phát triển bền vững</span></h2>
        <span className="intro-heading-line" aria-hidden="true" />
      </header>
      <div className="intro-primary-tabs" role="tablist" aria-label="Nội dung định hướng phát triển">
        {introTabs.flatMap((section, index) => {
          const isActive = activeSectionId === section.id;
          const Icon = introTabIcons[section.id];
          const tab = <button
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
            <span className="intro-primary-tab-icon" aria-hidden="true"><Icon size={25} strokeWidth={1.8} /></span>
            <span className="intro-primary-tab-copy"><span className="intro-primary-tab-label">{section.label}</span></span>
          </button>;
          if (index === introTabs.length - 1) return [tab];
          return [tab, <span className="intro-primary-tab-separator" role="presentation" key={`${section.id}-separator`}><ArrowRight size={22} aria-hidden="true" /></span>];
        })}
      </div>
      <div id="intro-strategy-panel" key={activeSection.id} className="intro-section-panel" role="tabpanel" aria-labelledby={`intro-tab-${activeSection.id}`}>
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
      <div className="intro-content-copy">{activeContext.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </article>
  </div>;
}

function MissionVisionContent({ sections }) {
  const mission = sections.find(section => section.id === 'mission');
  const vision = sections.find(section => section.id === 'vision');
  const philosophy = sections.find(section => section.id === 'education-philosophy');
  const coreValues = sections.find(section => section.id === 'core-values');
  const valueParagraphs = coreValues?.paragraphs.slice(1, -2) ?? [];
  const actionSlogans = coreValues?.paragraphs.slice(-2) ?? [];
  const [vietnameseSlogan, englishSlogan] = actionSlogans.map(slogan => slogan
    .replace(/^[–-]\s*Khẩu hiệu hành động\s+tiếng\s+(Việt|Anh)\s*:\s*/i, '')
    .replace(/[\u201C\u201D]/g, '')
    .trim());
  const values = valueParagraphs.map(paragraph => {
    const separator = paragraph.indexOf(':');
    return separator === -1
      ? { title: paragraph, description: '' }
      : { title: paragraph.slice(0, separator), description: paragraph.slice(separator + 1).trim() };
  });

  return <div className="intro-mission-layout">
    <section className="intro-mission-foundation" aria-label="Sứ mạng và tầm nhìn">
      {[mission, vision].filter(Boolean).map(card => {
        const Icon = introMissionIcons[card.id];
        return <article className={`intro-mission-card intro-mission-card-${card.id}`} key={card.id}>
          <header className="intro-mission-card-heading">
            <span className="intro-mission-icon" aria-hidden="true"><Icon size={21} strokeWidth={1.8} /></span>
            <h3>{card.title}</h3>
          </header>
          <div className="intro-content-copy">{card.paragraphs.map((paragraph, paragraphIndex) => <p key={`${card.id}-${paragraphIndex}`}>{paragraph}</p>)}</div>
        </article>;
      })}
    </section>

    {coreValues && <section className="intro-core-values" aria-labelledby="intro-core-values-title">
      <header className="intro-core-values-heading"><h3 id="intro-core-values-title">Giá trị cốt lõi</h3></header>
      <div className="intro-core-values-grid">
        {values.map((value, index) => {
          const Icon = introCoreValueIcons[index % introCoreValueIcons.length];
          return <article className="core-value-item" key={value.title}>
            <span className="core-value-icon" aria-hidden="true"><Icon size={24} strokeWidth={1.7} /></span>
            <h4>{value.title}</h4>
            {value.description && <p>{value.description}</p>}
          </article>;
        })}
      </div>
    </section>}

    {philosophy && <article className="intro-mission-card intro-mission-card-education-philosophy">
      <h3>{philosophy.title}</h3>
      <div className="intro-content-copy">{philosophy.paragraphs.map((paragraph, paragraphIndex) => <p key={`${philosophy.id}-${paragraphIndex}`}>{paragraph}</p>)}</div>
    </article>}

    {(vietnameseSlogan || englishSlogan) && <article className="intro-mission-card intro-mission-card-action-slogan">
      <h3>Khẩu hiệu hành động</h3>
      <div className="intro-content-copy">
        {vietnameseSlogan && <p className="intro-action-slogan-main">{vietnameseSlogan}</p>}
        {englishSlogan && <p className="intro-action-slogan-english">{englishSlogan}</p>}
      </div>
    </article>}
  </div>;
}

function KeyTasksAccordion({ sections }) {
  const [openSectionIds, setOpenSectionIds] = useState(() => new Set(sections[0]?.id ? [sections[0].id] : []));

  const toggleSection = sectionId => {
    setOpenSectionIds(current => {
      const next = new Set(current);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  return <div className="intro-accordion">
    {sections.map((section, index) => {
      const isOpen = openSectionIds.has(section.id);
      const panelId = `intro-accordion-panel-${section.id}`;
      const buttonId = `intro-accordion-button-${section.id}`;
      const Icon = introTaskIcons[section.id];
      return <section className={`intro-accordion-item${isOpen ? ' open' : ''}`} key={section.id}>
        <h3>
          <button id={buttonId} type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggleSection(section.id)}>
            <span className="intro-accordion-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className="intro-accordion-icon"><Icon size={20} aria-hidden="true" /></span>
            <span className="intro-accordion-title">{section.title}</span>
            <span className="intro-accordion-count">{String(section.items.length).padStart(2, '0')} nhiệm vụ</span>
            <ChevronDown size={21} aria-hidden="true" />
          </button>
        </h3>
        {isOpen && <div id={panelId} className="intro-accordion-panel" role="region" aria-labelledby={buttonId}>
          <ul>{section.items.map((item, itemIndex) => <li key={item}><span className="intro-task-index" aria-hidden="true">{String(itemIndex + 1).padStart(2, '0')}</span><span>{item}</span></li>)}</ul>
        </div>}
      </section>;
    })}
  </div>;
}
