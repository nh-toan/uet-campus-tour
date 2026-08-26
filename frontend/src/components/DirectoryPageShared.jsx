import { createPortal } from 'react-dom';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { mediaUrl } from '../lib/media';
import '../styles.css';

function Logo({ item }) {
  const [broken, setBroken] = useState(false);
  const monogram = item.monogram || item.name.replace(/^(CLB|Liên chi)\s+/i, '').slice(0, 3).toUpperCase();
  return !item.logoUrl || broken
    ? <span className="entity-logo is-monogram" aria-hidden="true">{monogram}</span>
    : <img className="entity-logo" src={mediaUrl(item.logoUrl)} alt={`Logo ${item.name}`} width="128" height="128" loading="lazy" decoding="async" onError={() => setBroken(true)} />;
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

export function Loading({ error }) {
  return <section className="loading-page site-container" role={error ? 'alert' : 'status'}><p className="eyebrow">{error ? 'Không thể tải dữ liệu' : 'Đang tải'}</p><h1>{error || 'Đang tải dữ liệu từ máy chủ…'}</h1></section>;
}

export function EntityCard({ item, type, meta, selected, onSelect, actionLabel, hidden = false }) {
  const metaText = meta ?? item.summary ?? 'Thông tin đang được cập nhật';
  return <button type="button" className={`entity-card${selected ? ' selected' : ''}${item.backgroundImage ? ' has-background-image' : ''}`} onClick={onSelect} aria-pressed={selected} hidden={hidden}>
    {item.backgroundImage && <img className="entity-visual-media" src={mediaUrl(item.backgroundImage)} alt="" loading="lazy" decoding="async" />}
    <Logo item={item} /><span className="entity-type">{type}</span><h2>{item.name}</h2>{metaText && <span className="entity-meta">{metaText}</span>}<span className="entity-link">{actionLabel} <ArrowRight size={15} aria-hidden="true" /></span>
  </button>;
}

export function DetailPanel({ item, type, dark = false, onClose, subtitle = item.shortName, showActivityGallery = true }) {
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const detailSections = useMemo(() => {
    if (Array.isArray(item.sections)) return item.sections;
    const legacyItems = Array.isArray(item.paragraphs) ? item.paragraphs : [];
    return legacyItems.length ? [{ title: 'Giới thiệu', items: legacyItems }] : [];
  }, [item.paragraphs, item.sections]);
  const galleryItems = Array.isArray(item.activityImages) ? item.activityImages : [];
  const activeImage = activeImageIndex === null ? null : galleryItems[activeImageIndex];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  useEffect(() => {
    if (!activeImage) return undefined;
    const onLightboxKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setActiveImageIndex(null);
      } else if (event.key === 'ArrowLeft') {
        setActiveImageIndex(current => (current - 1 + galleryItems.length) % galleryItems.length);
      } else if (event.key === 'ArrowRight') {
        setActiveImageIndex(current => (current + 1) % galleryItems.length);
      }
    };
    window.addEventListener('keydown', onLightboxKeyDown, true);
    return () => window.removeEventListener('keydown', onLightboxKeyDown, true);
  }, [activeImage, galleryItems.length]);

  const showPreviousImage = () => setActiveImageIndex(current => (current - 1 + galleryItems.length) % galleryItems.length);
  const showNextImage = () => setActiveImageIndex(current => (current + 1) % galleryItems.length);
  const titleId = `detail-title-${item.id}`;

  const panel = <>
    <div className="detail-modal-backdrop" aria-hidden="true" onClick={onClose} />
    <aside className={`detail-panel${dark ? ' detail-panel-dark' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="detail-close-bar"><button className="detail-close" type="button" onClick={onClose} aria-label="Đóng thông tin chi tiết"><X size={18} aria-hidden="true" /></button></div>
      <div className={`detail-visual${item.backgroundImage ? ' has-background-image' : ''}`}>{item.backgroundImage && <span className="detail-visual-media" style={{ backgroundImage: `url("${mediaUrl(item.backgroundImage)}")` }} aria-hidden="true" />}<Logo item={item} /><span className="entity-type">{type}</span><h2 id={titleId}>{item.name}</h2>{subtitle && <p className="detail-short">{subtitle}</p>}{item.summary && <p>{item.summary}</p>}</div>
      <div className="detail-body">{detailSections.map(section => { const blocks = groupParagraphs(section.items); return <section className="detail-section" key={section.title}><h3>{section.title}</h3>{blocks.map((block, index) => block.type === 'list' ? <ul key={index}>{block.items.map((text, itemIndex) => <li key={itemIndex}>{text}</li>)}</ul> : <p key={index}>{block.text}</p>)}</section>; })}{detailSections.length > 0 && item.governingBody && <section className="detail-section"><h3>Đơn vị chủ quản</h3><p>{item.governingBody}</p></section>}{showActivityGallery && dark && galleryItems.length > 0 && <section className="activity-gallery" aria-labelledby="activity-gallery-title"><div className="activity-gallery-head"><h3 id="activity-gallery-title">Các hoạt động nổi bật của CLB</h3></div><div className={`activity-gallery-grid ${galleryItems.length === 1 ? 'count-1' : galleryItems.length === 2 ? 'count-2' : galleryItems.length === 3 ? 'count-3' : 'count-many'}`}>{galleryItems.map((image, index) => <figure key={image.src}><button className="activity-gallery-open" type="button" onClick={() => setActiveImageIndex(index)} aria-label={`Xem ảnh ${index + 1} của ${item.name}`}><img src={mediaUrl(image.src)} alt={image.alt || `Hoạt động ${index + 1} của ${item.name}`} loading="lazy" decoding="async" /></button></figure>)}</div></section>}<section className="detail-section detail-contact"><h3>Liên hệ</h3>{item.fanpageUrl ? <a className="btn btn-primary" href={item.fanpageUrl} target="_blank" rel="noreferrer">Fanpage <ExternalLink size={16} aria-hidden="true" /></a> : <p className="empty-contact">Đơn vị chưa cung cấp liên kết chính thức.</p>}</section></div>
    </aside>
    {activeImage && <div className="activity-lightbox" role="dialog" aria-modal="true" aria-label={`Ảnh ${activeImageIndex + 1} của ${item.name}`} onClick={() => setActiveImageIndex(null)}>
      <div className="activity-lightbox-content" onClick={event => event.stopPropagation()}>
        <button className="activity-lightbox-close" type="button" onClick={() => setActiveImageIndex(null)} aria-label="Đóng ảnh"><X size={22} aria-hidden="true" /></button>
        {galleryItems.length > 1 && <button className="activity-lightbox-nav previous" type="button" onClick={showPreviousImage} aria-label="Xem ảnh trước"><ChevronLeft size={30} aria-hidden="true" /></button>}
        <img src={mediaUrl(activeImage.src)} alt={activeImage.alt || `Hoạt động của ${item.name}`} />
        {galleryItems.length > 1 && <button className="activity-lightbox-nav next" type="button" onClick={showNextImage} aria-label="Xem ảnh tiếp theo"><ChevronRight size={30} aria-hidden="true" /></button>}
        <p className="activity-lightbox-counter">{activeImageIndex + 1} / {galleryItems.length}</p>
      </div>
    </div>}
  </>;

  return createPortal(<div className="detail-modal-root"><div className={`detail-modal-context ${dark ? 'club-page' : 'academic-page'}`}>{panel}</div></div>, document.body);
}

export function useDirectorySelection(selectedId, setSelectedId, shown) {
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
