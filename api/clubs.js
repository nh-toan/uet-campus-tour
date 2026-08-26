const clubs = require('../backend/data/clubs.json');

const DEFAULT_BACKGROUND = '/assets/clubs/backgrounds/default.jpg';
const BACKGROUNDS_BY_CLUB = Object.freeze({
  'clb-nghe-thuat': '/assets/clubs/backgrounds/clb-nghe-thuat.jpg',
  'clb-van-dong-hien-mau': '/assets/clubs/backgrounds/clb-van-dong-hien-mau.jpg',
  'clb-nguon-nhan-luc': '/assets/clubs/backgrounds/clb-nguon-nhan-luc.jpg',
  'clb-thu-vien-hoi-sinh-vien': '/assets/clubs/backgrounds/clb-thu-vien-hoi-sinh-vien.jpg',
  'clb-nhay-co-dong': '/assets/clubs/backgrounds/clb-nhay-co-dong.jpg',
  'clb-cau-long': '/assets/clubs/backgrounds/clb-cau-long.jpg',
  'clb-bong-ro': '/assets/clubs/backgrounds/clb-bong-ro.jpg',
  'clb-thuyet-trinh': '/assets/clubs/backgrounds/clb-thuyet-trinh.jpg',
  'clb-hang-khong-vu-tru': '/assets/clubs/backgrounds/clb-hang-khong-vu-tru.png',
  'clb-tieng-anh': '/assets/clubs/backgrounds/clb-tieng-anh.jpg',
  'clb-tieng-nhat': '/assets/clubs/backgrounds/clb-tieng-nhat.jpg',
  'clb-dien-tu-va-tu-dong-hoa': '/assets/clubs/backgrounds/clb-dien-tu-va-tu-dong-hoa.png',
  'clb-robotics': '/assets/clubs/backgrounds/clb-robotics.jpg',
  'clb-ly-luan-tre': '/assets/clubs/backgrounds/clb-ly-luan-tre.jpg',
  'clb-thiet-ke-he-thong-va-vi-mach': '/assets/clubs/backgrounds/clb-thiet-ke-he-thong-va-vi-mach.jpg',
  'clb-sinh-vien-5-tot': '/assets/clubs/backgrounds/clb-sinh-vien-5-tot.png',
  'clb-ho-tro-sinh-vien': '/assets/clubs/backgrounds/clb-ho-tro-sinh-vien.jpg'
});

module.exports = function clubsHandler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.statusCode = 405;
    return response.end(JSON.stringify({ error: 'Chỉ hỗ trợ GET.' }));
  }

  const payload = clubs
    .map(club => ({
      ...club,
      backgroundImage: club.backgroundImage || BACKGROUNDS_BY_CLUB[club.id] || DEFAULT_BACKGROUND
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.statusCode = 200;
  return response.end(JSON.stringify(payload));
};
