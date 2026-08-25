// Compatibility for API snapshots cached before the optimized cover migration.
export const mediaKeyAliases = Object.freeze({
  'clubs/backgrounds/clb-hang-khong-vu-tru.png': 'clubs/backgrounds/clb-hang-khong-vu-tru.webp',
  'clubs/backgrounds/clb-ho-tro-sinh-vien.jpg': 'clubs/backgrounds/clb-ho-tro-sinh-vien.webp',
  'clubs/backgrounds/clb-ly-luan-tre.jpg': 'clubs/backgrounds/clb-ly-luan-tre.webp',
  'clubs/backgrounds/clb-nghe-thuat.jpg': 'clubs/backgrounds/clb-nghe-thuat.webp',
  'clubs/backgrounds/clb-sinh-vien-5-tot.png': 'clubs/backgrounds/clb-sinh-vien-5-tot.webp',
  'clubs/backgrounds/clb-thu-vien-hoi-sinh-vien.jpg': 'clubs/backgrounds/clb-thu-vien-hoi-sinh-vien.webp',
  'clubs/backgrounds/clb-thuyet-trinh.jpg': 'clubs/backgrounds/clb-thuyet-trinh.webp',
  'clubs/backgrounds/clb-tieng-nhat.jpg': 'clubs/backgrounds/clb-tieng-nhat.webp',
  'clubs/backgrounds/clb-van-dong-hien-mau.jpg': 'clubs/backgrounds/clb-van-dong-hien-mau.webp'
});

export function resolveMediaSourceKey(sourceKey) {
  return mediaKeyAliases[sourceKey] || sourceKey;
}
