import {
  ArrowRight,
  ExternalLink,
  Image as ImageIcon,
  MessageCircle,
  Sparkles
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

function OrganizationLogo({ image, label, alt }) {
  return image
    ? <img className="youth-logo" src={image} alt={alt} width="68" height="68" />
    : <span className="youth-logo youth-logo-placeholder" aria-label={`Vị trí logo ${alt}`}>{label}</span>;
}

function MediaSlot({ image, label, alt = label, className = '' }) {
  return <div className={`youth-media-slot ${className}${image ? ' has-image' : ''}`}>
    {image
      ? <img src={image} alt={alt} loading="lazy" decoding="async" />
      : <div className="youth-media-placeholder" aria-label={`${label} — chưa có asset`}>
          <ImageIcon size={30} aria-hidden="true" />
          <strong>{label}</strong>
          <span>TODO(asset)</span>
        </div>}
  </div>;
}

function SectionHeading({ eyebrow, title, description, id }) {
  return <header className="youth-section-heading">
    <p className="eyebrow">{eyebrow}</p>
    <h2 id={id}>{title}</h2>
    {description && <p>{description}</p>}
    <span aria-hidden="true" />
  </header>;
}

export function YouthUnionPage({ navigate }) {
  const unitNames = affiliatedUnits.length > 0
    ? affiliatedUnits
    : [
        ...Array.from({ length: youthUnionOverview.affiliatedCount }, (_, index) => `Liên chi ${String(index + 1).padStart(2, '0')}`),
        'Cán bộ khối Hiệu bộ'
      ];

  return <div className="youth-page">
    <section className="youth-hero" aria-labelledby="youth-hero-title">
      <div className="site-container youth-container youth-hero-grid">
        <div className="youth-hero-copy">
          <div className="youth-logos">
            <OrganizationLogo image={youthUnionMedia.youthUnionLogo} label="ĐOÀN" alt="Đoàn Thanh niên" />
            <OrganizationLogo image={youthUnionMedia.studentAssociationLogo} label="HỘI" alt="Hội Sinh viên" />
          </div>
          <p className="eyebrow">Đoàn Thanh niên – Hội Sinh viên UET</p>
          <h1 id="youth-hero-title">Tiên phong – Bản lĩnh – Sáng tạo –<br />Tình nguyện – Hội nhập</h1>
          <p className="youth-placeholder-copy">[Nội dung giới thiệu chính thức sẽ được bổ sung từ handbook]</p>
        </div>
        <MediaSlot image={youthUnionMedia.heroImage} label="HERO IMAGE" alt="Hoạt động Đoàn Thanh niên – Hội Sinh viên UET" className="youth-hero-media" />
      </div>
    </section>

    <section className="youth-overview" aria-labelledby="youth-overview-title">
      <div className="site-container youth-container">
        <div className="youth-overview-card">
          <div className="youth-overview-copy">
            <p className="eyebrow">Về ĐTN – HSV UET</p>
            <h2 id="youth-overview-title">Đoàn Thanh niên – Hội Sinh viên UET</h2>
            <p>{youthUnionOverview.intro || '[Nội dung giới thiệu chính thức sẽ được bổ sung từ handbook]'}</p>
          </div>
          <div className="youth-overview-stats" aria-label="Quy mô tổ chức">
            <div className="youth-stat"><strong>{youthUnionOverview.affiliatedCount}</strong><span>Liên chi Đoàn – Hội Khoa/Viện</span></div>
            <div className="youth-stat"><strong>+ {youthUnionOverview.staffUnitCount}</strong><span>Cán bộ khối Hiệu bộ</span></div>
            <div className="youth-stat"><strong>{youthUnionOverview.clubCount}</strong><span>Câu lạc bộ trực thuộc</span></div>
          </div>
        </div>
      </div>
    </section>

    <section className="youth-editorial-section" aria-labelledby="youth-affiliated-title">
      <div className="site-container youth-container">
        <SectionHeading eyebrow="Hệ thống trực thuộc" title="Liên chi Đoàn – Liên chi Hội trực thuộc" id="youth-affiliated-title" />
        <div className="youth-editorial-copy youth-editorial-copy-wide">
          <p className="youth-placeholder-copy">[Nội dung giới thiệu sẽ bổ sung]</p>
          {!affiliatedUnits.length && <p className="youth-placeholder-note">Danh sách dưới đây là placeholder để kiểm tra nhịp và khoảng cách.</p>}
          <ul className="youth-unit-list">
            {unitNames.map(name => <li key={name}>{name}</li>)}
          </ul>
          <button className="youth-link-button" type="button" onClick={() => navigate('lien-chi')}>Tìm hiểu về Liên chi Đoàn – Hội <ArrowRight size={17} aria-hidden="true" /></button>
        </div>
      </div>
    </section>

    <section className="youth-editorial-section youth-clubs-section" aria-labelledby="youth-clubs-title">
      <div className="site-container youth-container">
        <SectionHeading eyebrow="Cộng đồng sinh viên" title="Các Câu lạc bộ trực thuộc" id="youth-clubs-title" />
        <div className="youth-editorial-copy youth-editorial-copy-wide">
          <p className="youth-placeholder-copy">[Nội dung giới thiệu sẽ bổ sung]</p>
          <p className="youth-domain-line">{clubCategories.map(category => category.label).join(' · ')}</p>
          <button className="youth-link-button" type="button" onClick={() => navigate('cau-lac-bo')}>Khám phá các Câu lạc bộ <ArrowRight size={17} aria-hidden="true" /></button>
        </div>
      </div>
    </section>

    <section className="youth-activities-section" aria-labelledby="youth-activities-title">
      <div className="site-container youth-container">
        <SectionHeading eyebrow="Dấu ấn sinh viên" title="Hoạt động nổi bật" description="Khung hình đang chờ ảnh và mô tả chính thức từ handbook." id="youth-activities-title" />
        <div className="youth-activities-grid">
          {featuredActivities.map((activity, index) => <article className={`youth-activity youth-activity-${(index % 5) + 1}${activity.image ? ' has-image' : ''}`} key={activity.id}>
            {activity.image && <img src={activity.image} alt={activity.title} loading="lazy" decoding="async" />}
            {!activity.image && <span className="youth-activity-image-label"><ImageIcon size={16} aria-hidden="true" /> IMAGE</span>}
            <div className="youth-activity-overlay">
              <Sparkles size={17} aria-hidden="true" />
              <h3>{activity.title}</h3>
              {activity.description && <p>{activity.description}</p>}
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="youth-facebook-section" aria-label="Facebook Đoàn Thanh niên – Hội Sinh viên UET">
      <div className="site-container youth-container">
        <div className="youth-facebook-card">
          <span className="youth-facebook-icon"><MessageCircle size={27} aria-hidden="true" /></span>
          <div><h2>Kết nối với Đoàn Thanh niên – Hội Sinh viên UET</h2><p>Theo dõi kênh Facebook để cập nhật thông tin và hoạt động mới nhất.</p></div>
          <a href={youthUnionFacebookUrl} target="_blank" rel="noopener noreferrer">Theo dõi Facebook <ExternalLink size={17} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  </div>;
}
