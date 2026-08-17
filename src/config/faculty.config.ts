import type { Faculty } from '../types/campus.types'

// TODO: thay bằng dữ liệu thật
export const faculties: Faculty[] = [
  {
    id: 'faculty-information-technology',
    name: 'Khoa Công nghệ thông tin',
    dean: 'Đang cập nhật',
    programs: ['Khoa học máy tính', 'Công nghệ thông tin'],
    description: 'Đào tạo và nghiên cứu các lĩnh vực công nghệ số.',
  },
  {
    id: 'faculty-electronics-telecommunications',
    name: 'Khoa Điện tử Viễn thông',
    dean: 'Đang cập nhật',
    programs: ['Kỹ thuật điện tử và tin học', 'Kỹ thuật robot'],
    description: 'Đào tạo kỹ thuật điện tử, truyền thông và hệ thống thông minh.',
  },
]
