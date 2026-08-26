import { useEffect, useState } from 'react';
import { DetailPanel, EntityCard, Loading, useDirectorySelection } from '../components/DirectoryPageShared';
import { clubCategories } from '../content/clubCategories';
import { api } from '../lib/api';

function clubDisplayName(club) {
  return club.shortName;
}

function clubCategoryLabel(club) {
  return club.categories.join(' · ');
}

export default function ClubPage() {
  const [clubs, setClubs] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let active = true;
    api('/clubs')
      .then(data => { if (active) setClubs(data); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : 'Không thể tải dữ liệu.'); });
    return () => { active = false; };
  }, []);
  const availableClubs = clubs || [];
  const available = clubCategories.filter(category => availableClubs.some(club => club.categories.includes(category.label)));
  const activeCategory = available.find(category => category.id === filter);
  const shown = activeCategory ? availableClubs.filter(club => club.categories.includes(activeCategory.label)) : availableClubs;
  const shownIds = new Set(shown.map(club => club.id));
  const selected = useDirectorySelection(selectedId, setSelectedId, shown);
  if (!clubs) return <Loading error={error} />;

  return <section className="directory-page club-page tech-bg"><div className="site-container directory-layout is-full-width"><div><header className="directory-head directory-hero"><p className="eyebrow">Cộng đồng câu lạc bộ</p><h1>Kết nối đam mê — Kiến tạo giá trị — Lan tỏa ảnh hưởng</h1><p>Khám phá một cộng đồng đa dạng, nơi mỗi ý tưởng và sở thích đều có không gian để phát triển.</p></header><div className="chips" aria-label="Lọc câu lạc bộ">{[{ id: 'all', label: 'Tất cả' }, ...available].map(category => <button key={category.id} className={`chip${filter === category.id ? ' active' : ''}`} onClick={() => setFilter(category.id)} aria-pressed={filter === category.id}>{category.label}</button>)}</div><div className="entity-grid club-grid">{availableClubs.map(club => <EntityCard key={club.id} item={club} type={clubCategoryLabel(club)} meta={clubDisplayName(club)} selected={selected?.id === club.id} onSelect={() => setSelectedId(current => current === club.id ? null : club.id)} actionLabel="Khám phá" hidden={!shownIds.has(club.id)} />)}</div>{!shown.length && <p className="empty-state">Không tìm thấy CLB khớp bộ lọc.</p>}</div>{selected && <DetailPanel item={{ ...selected, backgroundImage: '' }} type={`UET Hòa Lạc · ${clubCategoryLabel(selected)}`} subtitle={clubDisplayName(selected)} dark onClose={() => setSelectedId(null)} />}</div></section>;
}
