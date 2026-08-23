import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  FlaskConical,
  HeartHandshake,
  Megaphone,
  MessageCircle,
  Palette,
  Sparkles,
  Trophy,
  X
} from 'lucide-react';
import {
  affiliatedUnits,
  clubCategories,
  featuredActivities,
  youthUnionFacebookUrl,
  youthUnionMedia,
  youthUnionOverview
} from '../content/youthUnionContent';
import '../styles/youth-union.css';

const categoryIcons = {
  book: BookOpen,
  research: FlaskConical,
  arts: Palette,
  sports: Trophy,
  community: HeartHandshake,
  media: Megaphone
};

function OrganizationLogo({ image, label, alt }) {
  return image
    ? <img className="youth-logo" src={image} alt={alt} width="68" height="68" />
    : <span className="youth-logo youth-logo-placeholder" aria-label={alt}>{label}</span>;
}

function MediaSlot({ image, alt, className = '', children }) {
  return <div className={`youth-media-slot ${className}`}>
    <img src={image} alt={alt} loading="lazy" decoding="async" />
    {children && <div className="youth-media-overlay">{children}</div>}
  </div>;
}

function SectionHeading({ eyebrow, title, description, id }) {
  return <header className="youth-section-heading">
    <p className="eyebrow">{eyebrow}</p>
    <h2 id={id}>{title}</h2>
    {description && <p>{description}</p>}
  </header>;
}

function ActivityModal({ activity, onClose }) {
  useEffect(() => {
    const onKeyDown = event => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return <div className="youth-activity-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="youth-activity-modal" role="dialog" aria-modal="true" aria-labelledby={`activity-dialog-${activity.id}`}>
      <button className="youth-activity-modal-close" type="button" onClick={onClose} aria-label="Đóng hoạt động"><X size={22} aria-hidden="true" /></button>
      <header className="youth-activity-modal-header"><h2 id={`activity-dialog-${activity.id}`}>{activity.title}</h2></header>
      <div className="youth-activity-modal-media">
        <img src={activity.image} alt={activity.title} />
        {activity.gallery?.map(image => <img key={image} src={image} alt="Hình ảnh hoạt động bổ sung" loading="lazy" decoding="async" />)}
      </div>
    </section>
  </div>;
}

export function YouthUnionPage({ navigate }) {
  const [selectedActivity, setSelectedActivity] = useState(null);

  return <div className="youth-page">
    <section className="youth-hero youth-reference-hero" aria-labelledby="youth-hero-title">
      <h1 className="visually-hidden" id="youth-hero-title">Tuổi trẻ Trường Đại học Công nghệ: Kết nối - Kiến tạo - Đổi mới</h1>
      <div className="youth-reference-hero-image" aria-hidden="true">
        <img src="/assets/youth-union/hero/visual-header-reference.png" alt="" />
      </div>
    </section>

    <section className="youth-overview" aria-labelledby="youth-overview-title">
      <div className="site-container youth-container">
        <div className="youth-overview-card">
          <div className="youth-overview-copy">
            <p className="eyebrow">Giới thiệu</p>
            <h2 id="youth-overview-title">Đoàn Thanh niên – Hội Sinh viên Trường Đại học Công nghệ</h2>
            <p>{youthUnionOverview.intro}</p>
          </div>
          <div className="youth-overview-stats" aria-label="Quy mô tổ chức">
            <div className="youth-stat"><strong>{youthUnionOverview.affiliatedCount}</strong><span>Liên chi Khoa/ Viện</span></div>
            <div className="youth-stat"><strong>{youthUnionOverview.staffUnitCount}</strong><span>Chi Đoàn Cán bộ<br />khối Hiệu bộ</span></div>
            <div className="youth-stat"><strong>{youthUnionOverview.clubCount}</strong><span>Câu lạc bộ<br />trực thuộc</span></div>
          </div>
        </div>
      </div>
    </section>

    <section className="youth-showcase-section youth-affiliated-section" aria-labelledby="youth-affiliated-title">
      <div className="site-container youth-container youth-showcase-grid">
        <div className="youth-showcase-copy">
          <SectionHeading title="Liên chi Đoàn – Liên chi Hội" id="youth-affiliated-title" />
          <p className="youth-lead">Các Liên chi Đoàn – Liên chi Hội là cầu nối gần gũi giữa Đoàn Thanh niên- Hội Sinh viên trường với sinh viên tại từng Khoa, Viện; cùng tạo nên một cộng đồng UET năng động, gắn kết và trách nhiệm.</p>
          <ul className="youth-unit-list">{affiliatedUnits.map(name => <li key={name}>{name}</li>)}</ul>
        </div>
        <MediaSlot image={youthUnionMedia.affiliatedImage} alt="Hoạt động của Liên chi Đoàn – Hội UET" className="youth-showcase-media">
          <button className="youth-showcase-cta" type="button" onClick={() => navigate('lien-chi')}>Tìm hiểu về Liên chi <ArrowRight size={18} aria-hidden="true" /></button>
        </MediaSlot>
      </div>
    </section>

    <section className="youth-showcase-section youth-clubs-section" aria-labelledby="youth-clubs-title">
      <div className="site-container youth-container youth-showcase-grid youth-showcase-grid-reverse">
        <MediaSlot image={youthUnionMedia.clubsImage} alt="Sinh viên UET tại hoạt động Câu lạc bộ" className="youth-showcase-media">
          <button className="youth-showcase-cta" type="button" onClick={() => navigate('cau-lac-bo')}>Khám phá các Câu lạc bộ <ArrowRight size={18} aria-hidden="true" /></button>
        </MediaSlot>
        <div className="youth-showcase-copy">
          <SectionHeading title="Các Câu lạc bộ trực thuộc" id="youth-clubs-title" />
          <p className="youth-lead">Từ học thuật, nghiên cứu đến nghệ thuật, thể thao và hoạt động cộng đồng, các câu lạc bộ là không gian để sinh viên khám phá đam mê và tìm thấy những người đồng hành.</p>
          <div className="youth-category-grid">{clubCategories.map(category => {
            const Icon = categoryIcons[category.icon];
            return <div className="youth-category" key={category.id}><Icon size={20} aria-hidden="true" /><span>{category.label}</span></div>;
          })}</div>
        </div>
      </div>
    </section>

    <section className="youth-activities-section" aria-labelledby="youth-activities-title">
      <div className="site-container youth-container">
        <SectionHeading eyebrow="Dấu ấn sinh viên" title="Hoạt động nổi bật" description="Bấm vào mỗi hoạt động để xem hình ảnh." id="youth-activities-title" />
        <div className="youth-activities-grid">
          {featuredActivities.map(activity => <button className="youth-activity" type="button" key={activity.id} onClick={() => setSelectedActivity(activity)} aria-haspopup="dialog">
            <img src={activity.image} alt="" loading="lazy" decoding="async" />
            <span className="youth-activity-overlay"><Sparkles size={16} aria-hidden="true" /><span>{activity.title}</span><small>XEM HÌNH ẢNH</small></span>
          </button>)}
        </div>
      </div>
    </section>

    <section className="youth-facebook-section" aria-label="Facebook Đoàn Thanh niên – Hội Sinh viên UET">
      <div className="site-container youth-container">
        <div className="youth-facebook-card">
          <span className="youth-facebook-icon"><MessageCircle size={27} aria-hidden="true" /></span>
          <div><p className="eyebrow">Cập nhật cùng ĐTN – HSV UET</p><h2>Kết nối và đồng hành cùng tuổi trẻ UET</h2><p>Theo dõi Facebook để không bỏ lỡ các tin tức, sự kiện và hoạt động mới nhất.</p></div>
          <a href={youthUnionFacebookUrl} target="_blank" rel="noopener noreferrer">Theo dõi Facebook <ExternalLink size={17} aria-hidden="true" /></a>
        </div>
      </div>
    </section>

    {selectedActivity && <ActivityModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />}
  </div>;
}
