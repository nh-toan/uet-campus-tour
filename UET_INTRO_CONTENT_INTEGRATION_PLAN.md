# UET Intro Content Integration Plan

> Project: UET Navigator / UET Virtual Campus Tour  
> Scope: Trang `/gioi-thieu` — tích hợp nội dung giới thiệu chính thức của Trường Đại học Công nghệ, ĐHQGHN  
> Ngày lập kế hoạch: 21/08/2026  
> Trạng thái: Planned — chưa bắt đầu implementation  
> Yêu cầu: Codex phải dừng tại từng checkpoint để người dùng nghiệm thu trước khi tiếp tục.

## 1. Mục tiêu

Hoàn thiện trang **Giới thiệu chung** của UET Navigator bằng cách tích hợp nội dung chính thức từ:

- https://uet.vnu.edu.vn/gioi-thieu/?tab=tab-5

Phạm vi:

1. Banner “Hơn 20 năm phát triển...”
2. Cơ cấu tổ chức
3. Bối cảnh
4. Sứ mạng, tầm nhìn và giá trị cốt lõi
5. Nhiệm vụ trọng tâm

Ba nhóm nội dung **Bối cảnh**, **Sứ mạng, tầm nhìn và giá trị cốt lõi**, **Nhiệm vụ trọng tâm** phải được giữ **100% theo nội dung chính thức**.

Không được tự:
- rút gọn;
- diễn giải;
- sửa chính tả;
- viết lại;
- bỏ bullet;
- thay đổi ý nghĩa.

Nếu nguồn chính thức có typo hoặc cách viết bất thường, giữ nguyên trong source snapshot và báo người dùng; mọi editorial correction phải được duyệt riêng.

## 2. Nguyên tắc thiết kế

- Nội dung: lấy từ website UET chính thức.
- Information architecture: có thể tham khảo website UET chính thức.
- Visual / interaction: thiết kế lại cho phù hợp UET Navigator.
- Giữ phong cách modern, premium, clean, Future Campus / Human Technology.
- Đồng bộ light/dark theme và responsive.
- Không copy nguyên giao diện website UET cũ.
- Không thêm UI framework hoặc dependency mới nếu không cần.

## 3. Thứ tự nội dung trong `/gioi-thieu`

```text
Header navigation
↓
Existing Intro Hero
↓
Banner “Hơn 20 năm phát triển...”
↓
Cơ cấu tổ chức
↓
Khối nội dung chiến lược
    ├── Bối cảnh
    ├── Sứ mạng, tầm nhìn và giá trị cốt lõi
    └── Nhiệm vụ trọng tâm
↓
Các phần còn lại / Footer
```

Không đổi route `/gioi-thieu`.

## 4. Asset plan

Tạo thư mục:

```text
frontend/public/assets/intro/
```

### Banner 20 năm

Tên file khuyến nghị:

```text
frontend/public/assets/intro/uet-20-years-banner.webp
```

Yêu cầu:
- ưu tiên file gốc chất lượng cao từ nguồn chính thức;
- không dùng screenshot nếu lấy được original asset;
- không crop nội dung;
- giữ đúng tỷ lệ.

### Cơ cấu tổ chức

Tên file khuyến nghị:

```text
frontend/public/assets/intro/uet-organization-chart.webp
```

Yêu cầu:
- tuyệt đối không crop;
- render bằng `object-fit: contain` hoặc tương đương;
- desktop đọc được;
- mobile có thể click/tap để xem lớn hơn nếu cần.

Runtime URL dự kiến:

```text
/assets/intro/uet-20-years-banner.webp
/assets/intro/uet-organization-chart.webp
```

## 5. Source-of-truth cho nội dung

Không dùng DOCX làm nguồn trung gian.

Tạo:

```text
docs/UET_INTRO_OFFICIAL_SOURCE.md
```

File này dùng để:
- ghi URL nguồn;
- ghi ngày truy xuất;
- lưu nguyên văn nội dung;
- giữ cấu trúc section/subsection;
- cho người dùng review trước khi implementation;
- làm audit trail nếu website nguồn thay đổi.

Cấu trúc dự kiến:

```markdown
# UET Intro Official Source

Source:
https://uet.vnu.edu.vn/gioi-thieu/?tab=tab-5

Retrieved:
YYYY-MM-DD

## Bối cảnh

### Quốc tế
...

### Trong nước
...

## Sứ mạng, tầm nhìn và giá trị cốt lõi
...

## Nhiệm vụ trọng tâm

### Đào tạo
...

### Khoa học và công nghệ
...

### Tổ chức, đội ngũ và quản trị đại học
...

### Hội nhập quốc tế
...
```

Markdown là **human-review source of truth**, không parse trực tiếp ở runtime.

## 6. Runtime content architecture

Sau khi source Markdown được nghiệm thu, tạo file runtime riêng:

```text
frontend/src/content/introContent.js
```

Không nhét toàn bộ text dài trực tiếp vào `App.jsx`.

Dữ liệu cần:
- data-driven;
- giữ semantic grouping;
- không làm mất nội dung;
- không phụ thuộc backend nếu không cần.

## 7. UI architecture đề xuất

### 7.1 Banner section
- nằm ngay sau existing hero;
- cùng max-width/container với Navigator;
- giữ tỷ lệ ảnh;
- responsive;
- không crop text/logo trong ảnh.

### 7.2 Organization chart
- ngay sau banner;
- heading: `Cơ cấu tổ chức`;
- ảnh dùng contain;
- mobile có thể mở enlarged/lightbox;
- không thêm dependency chỉ để zoom nếu có thể làm bằng React/CSS hiện tại.

### 7.3 Strategic content component

Ba mục chính:

```text
Bối cảnh
Sứ mạng, tầm nhìn và giá trị cốt lõi
Nhiệm vụ trọng tâm
```

Desktop:
- tab/segmented navigation;
- chỉ hiển thị một nhóm chính tại một thời điểm.

Mobile:
- tab ngang scroll hoặc interaction phù hợp;
- không ép ba label dài vào một dòng nếu overflow.

### 7.4 Bối cảnh
Giữ nguyên 100% text và chia theo semantic của nguồn, ví dụ:
- Quốc tế
- Trong nước

### 7.5 Sứ mạng, tầm nhìn và giá trị cốt lõi
Giữ nguyên 100% text, chia thành các visual block theo nguồn chính thức.

### 7.6 Nhiệm vụ trọng tâm
Giữ nguyên 100% text.

Khuyến nghị accordion:
- Đào tạo
- Khoa học và công nghệ
- Tổ chức, đội ngũ và quản trị đại học
- Hội nhập quốc tế

Accordion chỉ thay đổi cách hiển thị, không được làm mất nội dung.

## 8. Scope guard

Không thay đổi nếu chưa được yêu cầu:

- `/ban-do`;
- Campus Map / Three.js / R3F;
- Zustand map store;
- hotspot;
- panorama;
- guided tour;
- `/lien-chi`;
- `/cau-lac-bo`;
- backend;
- API;
- JSON data;
- routing contract;
- browser history;
- dependencies.

Không thêm:
- React Router;
- Tailwind;
- UI framework;
- Markdown runtime parser.

## 9. Workflow và checkpoint

### PHASE A — Preflight

Codex session mới phải:
1. đọc tất cả `.md` hiện có;
2. đọc `PROJECT_SUMMARY.md`;
3. đọc `STATUS.md`;
4. đọc file kế hoạch này;
5. inspect Git;
6. inspect source `/gioi-thieu`;
7. chưa sửa code ngay.

Commands tối thiểu:

```bash
git status
git branch --show-current
git log -5 --oneline
git diff
git diff -- frontend/package-lock.json
```

Bảo toàn diff có sẵn trong `frontend/package-lock.json`.

### CHECKPOINT 1 — Official content source

Task:
- lấy đúng nội dung chính thức từ URL UET;
- tạo `docs/UET_INTRO_OFFICIAL_SOURCE.md`;
- giữ 100% nội dung ba nhóm đã chốt;
- chưa sửa UI/runtime.

**STOP HERE.**

Người dùng kiểm tra:
- đủ section chưa;
- nguyên văn chưa;
- heading/subheading đúng chưa;
- có mất đoạn không;
- có typo nguồn cần ghi chú không.

Chỉ tiếp tục khi PASS.

### CHECKPOINT 2 — Assets

Task:
- lấy/đặt hai asset vào `frontend/public/assets/intro/`;
- báo tên file, pixel size, dung lượng;
- ưu tiên original asset;
- chưa sửa UI sâu.

**STOP HERE.**

Người dùng kiểm tra:
- đúng banner;
- đúng sơ đồ;
- đủ nét;
- đúng phiên bản;
- không crop.

Chỉ tiếp tục khi PASS.

### CHECKPOINT 3 — UI skeleton

Sau checkpoint 1 và 2 PASS, implement:
- banner;
- organization chart;
- strategic content section;
- 3-tab navigation;
- accordion cho Nhiệm vụ trọng tâm;
- responsive skeleton.

Chưa polish sâu.

**STOP HERE.**

Người dùng nghiệm thu:
- thứ tự section;
- visual hierarchy;
- tab interaction;
- accordion interaction;
- banner;
- sơ đồ;
- desktop/mobile direction.

Chỉ tiếp tục khi PASS.

### CHECKPOINT 4 — Full content + polish

Sau skeleton PASS:
- đưa full official content vào runtime;
- hoàn thiện typography;
- spacing;
- light/dark;
- mobile/tablet/desktop;
- enlarged view cho org chart nếu cần;
- accessibility cơ bản;
- regression.

Verification:

```bash
npm run check
git diff --check
git status
git diff
```

**STOP HERE.**

Người dùng nghiệm thu toàn bộ `/gioi-thieu`.

## 10. Acceptance Criteria

### Content
- Bối cảnh: 100% nội dung chính thức.
- Sứ mạng, tầm nhìn và giá trị cốt lõi: 100%.
- Nhiệm vụ trọng tâm: 100%.
- Không tự editorialize.

### Assets
- Banner 20 năm đúng asset.
- Cơ cấu tổ chức đúng asset.
- Không crop.
- Responsive.

### UX
- Không render tất cả text dài thành wall-of-text mặc định.
- Strategic navigation dễ hiểu.
- Nhiệm vụ trọng tâm có cơ chế thu gọn/mở.
- Mobile dùng được.
- Dark/light theme nhất quán.

### Regression
Không phá:
```text
/gioi-thieu
/lien-chi
/cau-lac-bo
/ban-do
```

### Machine checks
```text
npm run check — PASS
git diff --check — PASS
```

## 11. Khi nào kết thúc session này

Kết thúc khi:
- CHECKPOINT 1 PASS;
- CHECKPOINT 2 PASS;
- CHECKPOINT 3 PASS;
- CHECKPOINT 4 PASS;
- `/gioi-thieu` được người dùng nghiệm thu hoàn chỉnh.

Sau đó **kết thúc session**.

Không tiếp tục Map 3D trong cùng session.

Mở Codex session mới dành riêng cho:

```text
Map 3D → Integration → Final regression
```

## 12. Quy tắc nghiệm thu

Sau mỗi checkpoint, Codex phải:
1. báo file đã thay đổi;
2. báo việc đã làm;
3. báo verification;
4. nêu manual test cụ thể;
5. ghi rõ `STOP HERE`;
6. chờ người dùng xác nhận PASS.

Không tự động làm checkpoint tiếp theo.
