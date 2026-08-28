import { useCallback, useRef, useState } from 'react';
import { ArrowRight, BookOpen, CalendarDays, ExternalLink, GraduationCap, UsersRound } from 'lucide-react';
import ActivityModal from '../components/ActivityModal';
import { featuredActivities, youthUnionFacebookUrl, youthUnionMedia } from '../content/youthUnionContent';
import { mediaUrl } from '../lib/media';
import campusRadialCollage from '../assets/academic-plan/campus-radial-collage.png';
import oneUetLogo from '../assets/academic-plan/one-uet-logo.png';
import uetVisionLogo from '../assets/academic-plan/uet-vision-logo.png';
import studentsCutout from '../assets/academic-plan/students-uet-cutout.png';
import winterCampaignImage from '../assets/academic-plan/mua-dong-am.jpg';
import '../styles/academic-plan.css';

const academicPlan = {
  semester1: {
    label: 'Học kỳ I',
    tone: 'primary',
    phases: [
      { date: '03/09/2026 – 14/10/2026', label: 'Học GDQP & GDTC' },
      { date: '19/10/2026 – 24/01/2027', label: 'Học chuyên môn' },
      { date: '25/01/2027 – 31/01/2027', label: 'Thi học kỳ' }
    ]
  },
  semester2: {
    label: 'Học kỳ II',
    tone: 'secondary',
    phases: [
      { date: '15/02/2027 – 23/05/2027', label: 'Học chuyên môn' },
      { date: '24/05/2027 – 30/05/2027', label: 'Tuần học dự phòng' },
      { date: '31/05/2027 – 20/06/2027', label: 'Thi học kỳ' }
    ]
  },
  summerSemester: {
    label: 'Học kỳ phụ',
    tone: 'summer',
    phases: [
      { date: '05/07/2027 – 15/08/2027', label: 'Học chuyên môn' },
      { date: '16/08/2027 – 29/08/2027', label: 'Thi học kỳ phụ' }
    ]
  }
};

const activitySchedule = {
  semester1: [
    ['vytec', 'Tháng 8 – 11'],
    ['makerthon', 'Tháng 8 – 11'],
    ['future-display-innovation-contest', 'Tháng 9 – 11'],
    ['dai-hoi', 'Tháng 10'],
    ['sac-hong-hy-vong', 'Tháng 11'],
    ['uet-connect', 'Tháng 11'],
    ['hoi-thao-uet', 'Học kỳ I'],
    ['mua-he-xanh-mua-dong-am', 'Học kỳ I', 'MÙA ĐÔNG ẤM', winterCampaignImage]
  ],
  semester2: [
    ['job-fair-uet', 'Tháng 3'],
    ['lop-toi-la-so-1', 'Tháng 3'],
    ['lang-kinh-tre', 'Tháng 4 – 5'],
    ['code-camp', 'Học kỳ II'],
    ['sac-hong-hy-vong', 'Tháng 5'],
    ['procon-uet-2026', 'Tháng 6 – 7'],
    ['toi-ban-linh', 'Tháng 7 – 8'],
    ['mua-he-xanh-mua-dong-am', 'Tháng 7 – 8', 'MÙA HÈ XANH']
  ]
};

const activityById = new Map(featuredActivities.map(activity => [activity.id, activity]));
const activities = Object.fromEntries(Object.entries(activitySchedule).map(([semester, entries]) => [
  semester,
  entries.map(([id, period, cardTitle, image]) => ({ ...activityById.get(id), period, semester, cardTitle, image: image || activityById.get(id)?.image })).filter(activity => activity.id)
]));

const tabs = [
  { id: 'semester1', label: 'Học kỳ I' },
  { id: 'semester2', label: 'Học kỳ II' }
];

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ArcText({ text, startAngle, endAngle, radius = 44 }) {
  const characters = [...text];
  return <span className="academic-hero__identity-arc" aria-hidden="true">
    {characters.map((character, index) => {
      const progress = characters.length === 1 ? 0 : index / (characters.length - 1);
      const angle = startAngle + ((endAngle - startAngle) * progress);
      const radians = angle * Math.PI / 180;
      return <span
        className="academic-hero__identity-character"
        key={`${character}-${index}`}
        style={{ '--identity-x': Math.cos(radians) * radius, '--identity-y': Math.sin(radians) * radius, '--identity-rotation': `${angle - 90}deg` }}
      >{character === ' ' ? '\u00a0' : character}</span>;
    })}
  </span>;
}

function AcademicHero() {
  return <section className="academic-hero" aria-labelledby="academic-plan-title">
    <span className="academic-hero__dot-pattern academic-hero__dot-pattern--left" aria-hidden="true" />
    <span className="academic-hero__dot-pattern academic-hero__dot-pattern--right" aria-hidden="true" />
    <span className="academic-hero__sweep" aria-hidden="true"><i /><i /><i /></span>
    <div className="academic-plan-container academic-hero__grid">
      <div className="academic-hero__content">
        <p className="academic-plan-eyebrow">Welcome UET · Student roadmap</p>
        <h1 className="academic-plan-title" id="academic-plan-title">Kế hoạch <span>Năm học 2026 – 2027</span></h1>
        <div className="academic-hero__title-bar" aria-hidden="true" />
        <p className="academic-hero__tagline">Cùng nhìn lại hành trình – Sẵn sàng bứt phá!</p>
        <p className="academic-plan-subtitle">Khám phá kế hoạch năm học, các hoạt động nổi bật của Đoàn – Hội UET và đừng bỏ lỡ cơ hội tỏa sáng cùng cộng đồng sinh viên UET!</p>
        <div className="academic-hero__actions">
          <button className="academic-plan-btn academic-plan-btn--primary" type="button" onClick={() => scrollToSection('academic-timeline-section')}><CalendarDays className="academic-hero__action-icon" size={27} aria-hidden="true" /><span className="academic-hero__action-copy">Kế hoạch học tập <span>Năm học 2026 – 2027</span></span><ArrowRight size={17} aria-hidden="true" /></button>
          <button className="academic-plan-btn academic-plan-btn--action" type="button" onClick={() => scrollToSection('academic-activities-section')}><UsersRound className="academic-hero__action-icon" size={27} aria-hidden="true" /><span className="academic-hero__action-copy">Danh mục hoạt động <span>Đoàn – Hội theo kỳ</span></span><ArrowRight size={17} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="academic-hero__visual" aria-label="Không gian học tập và hoạt động sinh viên UET">
        <span className="academic-hero__orbit academic-hero__orbit--one" aria-hidden="true" />
        <span className="academic-hero__orbit academic-hero__orbit--two" aria-hidden="true" />
        <span className="academic-hero__orbit academic-hero__orbit--three" aria-hidden="true" />
        <span className="academic-hero__dot academic-hero__dot--yellow" aria-hidden="true" />
        <span className="academic-hero__dot academic-hero__dot--blue" aria-hidden="true" />
        <span className="academic-hero__dot academic-hero__dot--top" aria-hidden="true" />
        <span className="academic-hero__dot academic-hero__dot--left" aria-hidden="true" />
        <span className="academic-hero__dot academic-hero__dot--bottom" aria-hidden="true" />
        <div className="academic-hero__student-stage">
          <div className="academic-hero__student-bg" aria-hidden="true" />
          <div className="academic-hero__students-cutout"><img src={studentsCutout} alt="Bốn sinh viên UET" width="2870" height="1092" loading="eager" decoding="async" fetchPriority="high" /></div>
        </div>
        <div className="academic-hero__badge">
          <img src={oneUetLogo} alt="ONE UET" width="1764" height="1583" loading="eager" decoding="async" />
        </div>
        <div className="academic-hero__vision-mark">
          <img src={uetVisionLogo} alt="One vision, one identity, one mission" width="1764" height="1583" loading="eager" decoding="async" />
        </div>
        <span className="academic-hero__identity-line" aria-hidden="true">
          <ArcText text="ONE VISION · ONE IDENTITY · ONE MISSION" startAngle={165} endAngle={105} radius={47} />
        </span>
        <div className="academic-hero__event-bubble">
          <img src={mediaUrl(youthUnionMedia.heroImage)} alt="Sinh viên UET trong hoạt động Đoàn – Hội" width="300" height="200" loading="eager" decoding="async" />
        </div>
      </div>
    </div>
  </section>;
}

function SemesterTimeline({ semester }) {
  return <article className={`academic-semester academic-semester--${semester.tone}`}>
    <h3 className="academic-semester__header">{semester.label}</h3>
    <ol className="academic-timeline">
      {semester.phases.map(phase => <li className="academic-timeline__item" key={phase.date}>
        <span className="academic-timeline__dot" aria-hidden="true" />
        <div><time className="academic-timeline__date">{phase.date}</time><p className="academic-timeline__label">{phase.label}</p></div>
      </li>)}
    </ol>
  </article>;
}

function AcademicTimeline() {
  return <section className="academic-plan-section academic-timeline-section" id="academic-timeline-section" aria-labelledby="academic-timeline-title">
    <div className="academic-plan-container">
      <div className="academic-timeline-card">
        <span className="academic-timeline-card__accents" aria-hidden="true"><i /><i /><i /></span>
        <p className="academic-plan-eyebrow academic-plan-eyebrow--center">Lộ trình học tập</p>
        <h2 className="academic-plan-section-title" id="academic-timeline-title">Kế hoạch học tập cho sinh viên K71</h2>
        <div className="academic-timeline-layout">
          <div className="academic-timeline-layout__left">
            <SemesterTimeline semester={academicPlan.semester1} />
            <nav className="academic-study-links" aria-label="Tài liệu và dịch vụ học tập">
              <a className="academic-plan-btn academic-plan-btn--primary" href="https://handbook.uet.vnu.edu.vn/" target="_blank" rel="noopener noreferrer"><BookOpen size={19} aria-hidden="true" /><span>Handbook UET</span><ExternalLink size={15} aria-hidden="true" /></a>
              <a className="academic-plan-btn academic-study-links__hub" href="https://studenthub.uet.edu.vn/login" target="_blank" rel="noopener noreferrer"><GraduationCap size={19} aria-hidden="true" /><span>Student HUB UET</span><ExternalLink size={15} aria-hidden="true" /></a>
              <a className="academic-plan-btn academic-plan-btn--action" href="https://drive.google.com/file/d/1ams5rQstWBuk-Gg_ik4273qJwRhAxxzG/view?usp=drivesdk" target="_blank" rel="noopener noreferrer"><CalendarDays size={19} aria-hidden="true" /><span>Chi tiết kế hoạch năm học</span><ExternalLink size={15} aria-hidden="true" /></a>
            </nav>
          </div>
          <figure className="academic-campus-wheel">
            <img src={campusRadialCollage} alt="Không gian học tập và khuôn viên UET" width="1080" height="1350" loading="lazy" decoding="async" />
          </figure>
          <div className="academic-timeline-layout__right">
            <SemesterTimeline semester={academicPlan.semester2} />
            <SemesterTimeline semester={academicPlan.summerSemester} />
          </div>
        </div>
      </div>
    </div>
  </section>;
}

function ActivityCard({ activity, onSelect }) {
  return <button className="academic-activity-card" type="button" onClick={() => onSelect(activity)} aria-haspopup="dialog">
    <span className="academic-activity-card__image"><img src={mediaUrl(activity.image)} alt={`Hoạt động ${activity.title}`} width="480" height="310" loading="lazy" decoding="async" /></span>
    <span className="academic-activity-card__body">
      <strong className="academic-activity-card__title">{activity.cardTitle || activity.title}</strong>
      <span className="academic-activity-card__meta"><CalendarDays size={16} aria-hidden="true" />{activity.period}</span>
      <span className="academic-activity-card__link">Xem thông tin <ArrowRight size={14} aria-hidden="true" /></span>
    </span>
  </button>;
}

function ActivityTabs() {
  const [activeTab, setActiveTab] = useState('semester1');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const closeActivity = useCallback(() => setSelectedActivity(null), []);
  const tabRefs = useRef([]);
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  const selectTabByIndex = index => {
    const nextIndex = (index + tabs.length) % tabs.length;
    setActiveTab(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  const onTabKeyDown = event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); selectTabByIndex(activeIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); selectTabByIndex(activeIndex - 1); }
    if (event.key === 'Home') { event.preventDefault(); selectTabByIndex(0); }
    if (event.key === 'End') { event.preventDefault(); selectTabByIndex(tabs.length - 1); }
  };

  return <>
    <div className="academic-activity-tabs" role="tablist" aria-label="Chọn học kỳ">
      {tabs.map((tab, index) => <button
        className={`academic-activity-tab${activeTab === tab.id ? ' is-active' : ''}`}
        id={`academic-tab-${tab.id}`}
        key={tab.id}
        ref={element => { tabRefs.current[index] = element; }}
        type="button"
        role="tab"
        aria-selected={activeTab === tab.id}
        aria-controls={`academic-panel-${tab.id}`}
        tabIndex={activeTab === tab.id ? 0 : -1}
        onClick={() => setActiveTab(tab.id)}
        onKeyDown={onTabKeyDown}
      >{tab.label}</button>)}
    </div>
    <div className="academic-activity-panel" id={`academic-panel-${activeTab}`} role="tabpanel" aria-labelledby={`academic-tab-${activeTab}`} tabIndex="0">
      <div className="academic-activity-grid">{activities[activeTab].map(activity => <ActivityCard activity={activity} key={activity.id} onSelect={setSelectedActivity} />)}</div>
    </div>
    {selectedActivity && <ActivityModal activity={selectedActivity} onClose={closeActivity} />}
  </>;
}

function ActivitiesSection() {
  return <section className="academic-plan-section academic-activities" id="academic-activities-section" aria-labelledby="academic-activities-title">
    <div className="academic-plan-container">
      <p className="academic-plan-eyebrow academic-plan-eyebrow--center">Dấu ấn tuổi trẻ UET</p>
      <h2 className="academic-plan-section-title" id="academic-activities-title">Hoạt động tiêu biểu của Đoàn – Hội</h2>
      <ActivityTabs />
    </div>
  </section>;
}

function AcademicCTA() {
  return <section className="academic-cta" aria-labelledby="academic-cta-title">
    <img className="academic-cta__background" src={mediaUrl(youthUnionMedia.heroImage)} alt="" loading="lazy" decoding="async" />
    <div className="academic-plan-container academic-cta__content">
      <div className="academic-cta__mark" aria-hidden="true"><img src={uetVisionLogo} alt="" width="1764" height="1583" loading="lazy" decoding="async" /></div>
      <div className="academic-cta__copy">
        <span className="academic-cta__icon"><UsersRound size={30} aria-hidden="true" /></span>
        <h2 className="academic-cta__title" id="academic-cta-title">Tham gia – Kết nối – Tỏa sáng cùng UET!</h2>
        <p className="academic-cta__text">Đừng bỏ lỡ bất kỳ hoạt động nào trong năm học mới.</p>
        <a className="academic-plan-btn academic-plan-btn--light" href={youthUnionFacebookUrl} target="_blank" rel="noopener noreferrer">Theo dõi Fanpage Đoàn – Hội UET <ExternalLink size={17} aria-hidden="true" /></a>
      </div>
      <span className="academic-cta__one" aria-hidden="true"><img src={oneUetLogo} alt="" width="1764" height="1583" loading="lazy" decoding="async" /></span>
    </div>
  </section>;
}

export default function AcademicPlanPage() {
  return <div className="academic-plan-page">
    <AcademicHero />
    <AcademicTimeline />
    <ActivitiesSection />
    <AcademicCTA />
  </div>;
}
