import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, X } from 'lucide-react';
import { mediaUrl } from '../lib/media';
import '../styles/youth-union.css';

// Shared by the academic plan and the Youth Union activity directory.
export default function ActivityModal({ activity, onClose }) {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const albumGroups = activity.albums?.reduce((groups, album) => {
    const year = String(album.year);
    const group = groups.find(item => item.year === year);
    if (group) group.albums.push(album);
    else groups.push({ year, albums: [album] });
    return groups;
  }, []) ?? [];

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const bodyPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll('button:not([disabled]), a[href]');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;
    closeButtonRef.current?.focus();
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) previouslyFocused.focus();
    };
  }, [onClose]);

  return createPortal(<div className="youth-activity-modal-backdrop" role="presentation" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} className="youth-activity-modal" role="dialog" aria-modal="true" aria-labelledby={`activity-dialog-${activity.id}`}>
      <button ref={closeButtonRef} className="youth-activity-modal-close" type="button" onClick={onClose} aria-label="Đóng hoạt động"><X size={22} aria-hidden="true" /></button>
      <header className="youth-activity-modal-header"><h2 id={`activity-dialog-${activity.id}`}>{activity.title}</h2></header>
      <div className="youth-activity-modal-body">
        <img className="youth-activity-modal-cover" src={mediaUrl(activity.image)} alt={activity.title} decoding="async" />
        <div className="youth-activity-modal-content">
          <p className="youth-activity-modal-description">{activity.description}</p>
          {albumGroups.length > 0 && <div className="youth-activity-album-groups" aria-label="Album ảnh sự kiện">
            {albumGroups.map(group => <section className="youth-activity-album-group" key={group.year} aria-labelledby={`activity-${activity.id}-${group.year}`}>
              <h3 id={`activity-${activity.id}-${group.year}`}>{group.year}</h3>
              <div className="youth-activity-album-list">
                {group.albums.map(album => <article className="youth-activity-album-card" key={album.url}>
                  <div>
                    <h4>{album.title}</h4>
                    {album.description && <p>{album.description}</p>}
                  </div>
                  <a href={album.url} target="_blank" rel="noopener noreferrer" aria-label={`Xem album ${album.title} trên Facebook`}>
                    Xem album <ExternalLink size={16} aria-hidden="true" />
                  </a>
                </article>)}
              </div>
            </section>)}
          </div>}
        </div>
      </div>
    </section>
  </div>, document.body);
}
