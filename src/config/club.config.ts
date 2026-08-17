import type { Club } from '../types/campus.types'

// TODO: thay bằng dữ liệu thật
export const clubs: Club[] = [
  {
    id: 'club-programming',
    name: 'Câu lạc bộ Lập trình',
    category: 'academic',
    memberCount: 120,
    description: 'Cộng đồng học thuật dành cho sinh viên yêu thích lập trình.',
  },
  {
    id: 'club-football',
    name: 'Câu lạc bộ Bóng đá',
    category: 'sports',
    memberCount: 60,
    description: 'Môi trường rèn luyện thể chất và kết nối sinh viên.',
  },
  {
    id: 'club-volunteer',
    name: 'Câu lạc bộ Tình nguyện',
    category: 'volunteer',
    memberCount: 90,
    description: 'Tổ chức hoạt động cộng đồng và hỗ trợ sinh viên.',
  },
]
