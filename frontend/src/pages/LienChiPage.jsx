import { useEffect, useState } from 'react';
import { DetailPanel, EntityCard, Loading, useDirectorySelection } from '../components/DirectoryPageShared';
import { api } from '../lib/api';

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

export default function LienChiPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let active = true;
    api('/lien-chi')
      .then(data => { if (active) setItems(data); })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : 'Không thể tải dữ liệu.'); });
    return () => { active = false; };
  }, []);
  const availableItems = items || [];
  const selected = useDirectorySelection(selectedId, setSelectedId, availableItems);
  if (!items) return <Loading error={error} />;

  return <section className="directory-page academic-page tech-bg"><div className="site-container directory-layout is-full-width"><div><header className="directory-head directory-hero"><h1>Khám phá Liên chi Khoa / Viện</h1></header><div className="entity-grid">{availableItems.map(item => <EntityCard key={item.id} item={item} type="Liên chi Đoàn - Liên chi Hội" meta={lienChiEnglishNames[item.id]} selected={selected?.id === item.id} onSelect={() => setSelectedId(current => current === item.id ? null : item.id)} actionLabel="Xem giới thiệu" />)}</div></div>{selected && <DetailPanel item={selected} type={`Liên chi · ${selected.unitType}`} subtitle={lienChiEnglishNames[selected.id]} onClose={() => setSelectedId(null)} />}</div></section>;
}
