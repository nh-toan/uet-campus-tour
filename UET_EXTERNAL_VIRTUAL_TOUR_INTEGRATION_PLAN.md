# UET Navigator — External Virtual Tour Embed Integration Plan

> Project: UET Navigator / UET Virtual Campus Tour  
> Scope: Tích hợp virtual tour chính thức từ `uet.vnu.asia` vào route `/ban-do`  
> Ngày lập kế hoạch: 21/08/2026  
> Trạng thái: Planned — chưa bắt đầu implementation trong session Map mới  
> Quy tắc: Mỗi checkpoint phải STOP để người dùng nghiệm thu trước khi Codex tiếp tục.

---

## 1. Quyết định kiến trúc

Virtual tour nguồn:

```text
https://uet.vnu.asia/?startscene=18&startlookat=-107.94,37.84,140,0,0;
```

Quyết định sản phẩm:

> UET Navigator không dựng lại, reverse-engineer hoặc rehost engine virtual tour.
> Route `/ban-do` sẽ nhúng trực tiếp virtual tour hoàn chỉnh từ `uet.vnu.asia` bằng iframe nếu server nguồn cho phép.

Lý do:

- tour bên ngoài đã có scene;
- panorama;
- hotspot;
- camera/navigation;
- interaction;
- asset;
- logic tour hoàn chỉnh;
- giảm đáng kể trách nhiệm vận hành Map engine trong UET Navigator;
- tránh phải duy trì hai implementation bản đồ 3D;
- giảm bundle/dependency của host sau khi cleanup Map cũ.

---

## 2. Kiến trúc mục tiêu

```text
UET Navigator
│
├── /gioi-thieu
├── /lien-chi
├── /cau-lac-bo
│
└── /ban-do
      │
      ├── UET Navigator Header
      │
      └── ExternalVirtualTour wrapper
              │
              └── <iframe>
                     │
                     └── https://uet.vnu.asia/...
```

Route `/ban-do` vẫn thuộc host UET Navigator.

Host sở hữu:

- header/navigation;
- route;
- theme shell;
- loading state;
- error/fallback UI;
- responsive container;
- accessibility wrapper.

`uet.vnu.asia` sở hữu:

- panorama engine;
- scene;
- hotspot;
- camera;
- internal map/tour UI;
- audio nếu có;
- virtual-tour interaction.

---

## 3. UX mục tiêu của `/ban-do`

Không thêm hero lớn phía trên virtual tour.

Layout ưu tiên:

```text
┌──────────────────────────────────────────┐
│ UET NAVIGATOR HEADER                     │
├──────────────────────────────────────────┤
│                                          │
│                                          │
│         UET VIRTUAL CAMPUS TOUR          │
│              external iframe             │
│                                          │
│                                          │
└──────────────────────────────────────────┘
```

Iframe chiếm gần toàn bộ phần viewport còn lại:

```text
height ≈ 100dvh - header height
width = 100%
```

Mục tiêu:

- vào `/ban-do` là có thể khám phá ngay;
- không có double-scroll khó chịu;
- không tạo khoảng trắng dư;
- desktop và mobile đều usable;
- header Navigator vẫn truy cập được.

---

## 4. Boundary và nguyên tắc an toàn

Trong các checkpoint đầu:

**KHÔNG xóa Map cũ.**

Giữ nguyên source hiện tại:

```text
frontend/src/features/campus-map/
```

bao gồm nếu đang tồn tại:

- `CampusMap3D`
- `PanoramaViewer`
- `Hotspots`
- `RadarMinimap`
- `TourControls`
- `useCampusStore`
- map config
- mock panorama
- camera/state helpers

Giữ nguyên dependency:

```text
three
@react-three/fiber
@react-three/drei
zustand
```

cho đến khi external tour đã:

1. embed PASS;
2. desktop PASS;
3. mobile thật PASS;
4. production wrapper PASS;
5. regression PASS.

Chỉ cleanup engine cũ ở checkpoint riêng sau đó.

---

# 5. Điều kiện phía server `uet.vnu.asia`

## 5.1 Điều quan trọng nhất: iframe embedding policy

Iframe **không cần CORS** chỉ để hiển thị cross-origin page.

Điều cần kiểm tra là server nguồn có gửi một trong các header chặn iframe hay không:

```text
X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN
```

hoặc CSP:

```text
Content-Security-Policy: frame-ancestors ...
```

Nếu server gửi:

```text
frame-ancestors 'self'
```

thì UET Navigator sẽ bị chặn.

### Trường hợp không có các header chặn

Không cần bên server kia chỉnh gì cho basic iframe.

### Trường hợp bị chặn

Cần nhờ bên `uet.vnu.asia` cho phép UET Navigator làm parent frame.

---

## 5.2 Header khuyến nghị nếu bên server cần whitelist

Ưu tiên CSP hiện đại:

```text
Content-Security-Policy:
  frame-ancestors 'self' <UET_NAVIGATOR_PRODUCTION_ORIGIN>;
```

Ví dụ khi production domain đã biết:

```text
Content-Security-Policy:
  frame-ancestors 'self' https://navigator.example.edu.vn;
```

Không nên vừa dùng CSP cho phép vừa giữ:

```text
X-Frame-Options: SAMEORIGIN
```

vì browser có thể vẫn chặn hoặc tạo behavior không nhất quán.

Nếu họ đang dùng `X-Frame-Options`, cần review/xóa policy đó cho route virtual tour và dùng CSP `frame-ancestors` thay thế.

---

## 5.3 Dev origin

Desktop localhost có thể dùng origin:

```text
http://localhost:5173
```

Mobile thật qua LAN thường sẽ là:

```text
http://<DEV-LAN-IP>:5173
```

Ví dụ:

```text
http://192.168.1.25:5173
```

Nếu `frame-ancestors` của server nguồn là whitelist nghiêm ngặt, bên server có thể cần tạm whitelist:

```text
http://localhost:5173
http://<DEV-LAN-IP>:5173
```

trong thời gian test.

Không cần yêu cầu điều này trước nếu server hiện không chặn iframe.

---

## 5.4 Production origin

Trước deploy final, cần biết **origin production thật** của UET Navigator.

Origin gồm:

```text
scheme + hostname + optional port
```

Ví dụ:

```text
https://navigator.uet.vnu.edu.vn
```

Không phải path:

```text
https://navigator.uet.vnu.edu.vn/ban-do
```

Nếu bên server cần whitelist, phải whitelist **origin**, không phải route path.

---

## 5.5 Fullscreen

Frontend iframe cần:

```html
allowfullscreen
```

và có thể:

```html
allow="fullscreen"
```

Nếu virtual tour dùng fullscreen API riêng, server/browser policy cũng phải cho phép.

Nếu fullscreen không hoạt động dù iframe load được, kiểm tra:

- iframe `allow`;
- browser;
- Permissions-Policy response của server nguồn;
- fullscreen có yêu cầu user gesture hay không.

---

## 5.6 Audio/autoplay

Nếu tour có audio:

- browser thường chặn autoplay có tiếng nếu chưa có user gesture;
- iframe có thể cần:

```html
allow="autoplay; fullscreen"
```

Không coi autoplay bị chặn là lỗi embed nếu audio hoạt động sau thao tác người dùng.

---

## 5.7 Cookies/storage

Nếu tour không cần login thì thường không có vấn đề.

Nếu virtual tour phụ thuộc:

- login;
- session cookie;
- third-party cookie;
- local storage đặc biệt;

Safari/Chrome privacy policy có thể ảnh hưởng trong iframe.

Checkpoint mobile cần test thực tế.

---

## 5.8 Cross-origin limitation

Basic iframe cho phép hiển thị tour nhưng host React **không được phép trực tiếp đọc DOM hoặc state** bên trong `uet.vnu.asia` vì Same-Origin Policy.

Do đó Phase 1 không yêu cầu:

- đọc scene hiện tại;
- đọc camera yaw/pitch;
- điều khiển hotspot từ React;
- inject JavaScript;
- thay CSS nội bộ;
- đọc DOM iframe.

Nếu sau này muốn host ↔ tour giao tiếp, phía `uet.vnu.asia` phải cung cấp API hoặc `window.postMessage` contract chính thức.

Không reverse-engineer.

---

# 6. Message chuẩn để gửi bên server `uet.vnu.asia` nếu bị chặn

Chỉ gửi nếu CHECKPOINT M0 xác nhận iframe bị browser chặn.

```text
Bên em đang tích hợp UET Virtual Tour từ:

https://uet.vnu.asia/

vào UET Navigator bằng iframe ở route /ban-do.

Nhờ bên anh/chị kiểm tra giúp response headers của virtual tour có đang chặn embedding qua:
- X-Frame-Options
- Content-Security-Policy / frame-ancestors

hay không.

Nếu đang chặn, bên em cần whitelist parent origin của UET Navigator.

Dev origins:
- http://localhost:5173
- http://<IP-LAN-MAY-DEV>:5173

Production origin:
- <UET_NAVIGATOR_PRODUCTION_ORIGIN>

Ưu tiên cấu hình CSP frame-ancestors, ví dụ:

Content-Security-Policy:
  frame-ancestors 'self' <UET_NAVIGATOR_PRODUCTION_ORIGIN>;

Nếu cần test mobile trong LAN, bên em sẽ gửi IP/origin dev chính xác tại thời điểm test.

Bên em chỉ cần quyền embed iframe; không cần CORS API, không cần truy cập DOM hoặc engine bên trong virtual tour.
```

---

# 7. Workflow tổng thể

```text
NEW CODEX SESSION
        ↓
M0 — iframe capability proof
        ↓
USER DESKTOP + MOBILE CHECKPOINT
        ↓ PASS
M1 — production wrapper
        ↓
USER VISUAL/UX CHECKPOINT
        ↓ PASS
M2 — responsive + real-device regression
        ↓
USER CHECKPOINT
        ↓ PASS
M3 — old Map cleanup + dependency cleanup
        ↓
MACHINE + USER REGRESSION
        ↓ PASS
M4 — final production smoke test
```

Mỗi phase phải STOP.

---

# 8. PHASE M0 — Iframe Capability Proof

## M0 objective

Chỉ chứng minh:

```text
uet.vnu.asia có thể chạy bên trong iframe của /ban-do
```

Không production polish.

Không cleanup.

---

## M0.1 Documentation / Git preflight

Session mới phải đọc:

- tất cả Markdown trong repo;
- `PROJECT_SUMMARY.md`;
- `STATUS.md`;
- integration docs;
- Map docs;
- file plan này.

Sau đó:

```bash
git status
git branch --show-current
git log -8 --oneline
git diff
git diff -- frontend/package-lock.json
```

Không:

- reset;
- stash;
- revert;
- commit;
- push.

---

## M0.2 Inspect Map boundary

Đọc:

```text
frontend/src/features/campus-map/
```

và cách `/ban-do` được lazy-load từ host.

Mục tiêu:

- hiểu existing architecture;
- thay đổi nhỏ nhất;
- giữ old Map source.

---

## M0.3 Check response headers

Dùng tool khả dụng:

```bash
curl -I -L "https://uet.vnu.asia/?startscene=18&startlookat=-107.94,37.84,140,0,0;"
```

Tìm:

```text
X-Frame-Options
Content-Security-Policy
frame-ancestors
Permissions-Policy
```

Nếu không truy cập được bằng CLI nhưng browser truy cập được:

- không đoán;
- vẫn thử minimal iframe;
- dùng DevTools Console/Network để xác định browser rejection.

Nếu rõ ràng bị server policy chặn:

**STOP M0.**

Không bypass.

---

## M0.4 Minimal component

Có thể tạo:

```text
frontend/src/features/campus-map/ExternalVirtualTour.tsx
```

hoặc naming hợp lý tương đương.

URL constant:

```text
https://uet.vnu.asia/?startscene=18&startlookat=-107.94,37.84,140,0,0;
```

Iframe tối thiểu:

```tsx
<iframe
  src={UET_VIRTUAL_TOUR_URL}
  title="UET Virtual Campus Tour"
  allow="fullscreen"
  allowFullScreen
/>
```

Có thể thêm autoplay sau nếu thực sự cần.

---

## M0.5 Temporary route rendering

Route `/ban-do` tạm render external iframe.

Giữ Header Navigator.

CSS proof tối thiểu:

- width 100%;
- border 0;
- height gần viewport trừ Header;
- dark navy background;
- không horizontal overflow.

---

## M0.6 Machine verification

```bash
npm run check
git diff --check
git status
git diff
```

---

# CHECKPOINT M0 — USER MUST TEST

Codex STOP.

User test desktop:

- tour load;
- camera rotate;
- zoom;
- hotspot;
- scene transitions;
- internal controls;
- fullscreen;
- browser Back;
- header Navigator;
- no double scroll.

User test mobile thật:

- touch rotate;
- pinch zoom;
- hotspot;
- scene switch;
- portrait;
- landscape;
- fullscreen;
- browser back;
- no horizontal overflow;
- no touch trap/double scroll.

Nếu M0 FAIL do server policy:

- gửi message ở Section 6 cho server team;
- chờ server fix;
- retry M0.

Nếu PASS:

- người dùng xác nhận `M0 PASS`;
- mới tiếp tục M1.

---

# 9. PHASE M1 — Production Wrapper

Chỉ làm sau M0 PASS.

## M1 objectives

Biến minimal iframe thành production-quality wrapper theo UET Navigator.

---

## M1.1 Wrapper ownership

Host wrapper sở hữu:

- loading state;
- background;
- fallback;
- external-open action;
- responsive viewport;
- title/accessibility.

Không overlay UI làm cản interaction virtual tour.

---

## M1.2 Loading state

Trước khi iframe `load`:

- dùng Navigator deep navy;
- simple spinner/progress indicator;
- text ngắn:

```text
Đang tải bản đồ khuôn viên...
```

Không fake % progress.

Không spinner phức tạp.

---

## M1.3 Fallback action

Có fallback button:

```text
Mở bản đồ 3D trong cửa sổ mới
```

Link chính xác:

```text
https://uet.vnu.asia/?startscene=18&startlookat=-107.94,37.84,140,0,0;
```

Dùng:

```text
target="_blank"
rel="noopener noreferrer"
```

Mục đích:

- fallback nếu iframe/browser có vấn đề;
- người dùng luôn có đường vào tour.

---

## M1.4 Error caveat

Browser iframe không cung cấp error event đáng tin cậy cho mọi cross-origin failure.

Không giả vờ có thể detect mọi CSP/X-Frame failure bằng JS.

Fallback có thể hiện:

- như một action luôn sẵn có;
- hoặc sau timeout UX hợp lý;

nhưng không được tự kết luận iframe failed chỉ vì load chậm.

---

## M1.5 Viewport

Desktop:

```text
height = 100dvh - header
```

Mobile:

- dùng `dvh`, không chỉ `vh`;
- tránh Safari browser chrome issue;
- không overflow;
- giữ interaction toàn màn hình.

---

# CHECKPOINT M1

User check:

- visual phù hợp Navigator;
- loading mượt;
- fallback rõ;
- header không cản tour;
- viewport đúng;
- light/dark shell;
- desktop/mobile.

STOP.

---

# 10. PHASE M2 — Real-device Regression

Chỉ sau M1 PASS.

Test tối thiểu:

## Desktop

- Firefox
- Chrome/Chromium nếu có

## Mobile

Ít nhất một thiết bị thật.

Checklist:

- load time;
- touch;
- zoom;
- hotspot;
- fullscreen;
- portrait/landscape;
- Back navigation;
- theme transition host;
- reload `/ban-do`;
- direct URL `/ban-do`;
- navigate từ route khác sang `/ban-do`;
- navigate từ `/ban-do` sang Intro/LC/CLB.

Regression host:

```text
/gioi-thieu
/lien-chi
/cau-lac-bo
/ban-do
```

STOP để user PASS.

---

# 11. PHASE M3 — Cleanup Old Three/R3F Map

**Chỉ làm sau external tour production wrapper + mobile regression PASS.**

Trước cleanup:

```bash
grep -R ...
```

xác minh dependency usage toàn frontend.

Không đoán.

---

## M3.1 Delete old Map implementation

Chỉ xóa file không còn runtime/reference.

Giữ `ExternalVirtualTour` và scoped styles.

---

## M3.2 Dependency cleanup

Candidate:

```text
three
@react-three/fiber
@react-three/drei
zustand
@types/three
```

Nhưng:

- chỉ remove nếu không còn usage nào khác;
- `zustand` chỉ remove nếu không còn module khác dùng;
- update package + lockfile đúng quy trình.

Đây là thời điểm mới xử lý lockfile có chủ đích.

---

## M3.3 TypeScript config cleanup

Nếu `tsconfig.map.json` chỉ tồn tại cho old Map và không còn relevant:

- inspect scripts;
- cleanup có kiểm soát;
- không phá `npm run check`.

---

## M3.4 Bundle comparison

Chạy production build trước/sau cleanup nếu baseline còn đo được.

Ghi:

- host bundle;
- Map lazy chunk trước;
- bundle sau;
- dependency removed.

Mục tiêu: warning Three chunk 918 kB biến mất nếu engine cũ đã hoàn toàn được loại.

---

# CHECKPOINT M3

User kiểm tra lại `/ban-do`.

Machine:

```bash
npm run check
git diff --check
```

Không commit/push tự động.

STOP.

---

# 12. PHASE M4 — Final Production Smoke

Sau cleanup PASS:

- production build;
- production/static server;
- direct route `/ban-do`;
- SPA refresh;
- external tour load;
- API smoke;
- Intro;
- Liên chi;
- CLB;
- theme;
- desktop/mobile.

Kiểm tra production origin có được `uet.vnu.asia` whitelist nếu server dùng `frame-ancestors`.

---

# 13. Security / policy checklist

Không:

- proxy external tour để né frame policy;
- strip response headers;
- iframe bypass;
- rehost asset không được phép;
- inject JS vào external page;
- disable browser security;
- use browser extension workaround;
- wildcard mở `frame-ancestors *` nếu không cần.

Ưu tiên whitelist origin cụ thể.

---

# 14. Availability / dependency risk

External embed tạo dependency runtime vào:

```text
uet.vnu.asia
```

Nếu server đó down:

- `/ban-do` không tải tour;
- các route khác của Navigator vẫn phải hoạt động.

Do đó wrapper phải có:

- background ổn;
- external link fallback;
- không crash toàn React app.

---

# 15. Performance expectation

Sau cleanup old engine:

Initial Navigator bundle có thể nhẹ hơn vì không còn Three/R3F lazy chunk local.

Tuy nhiên khi user vào `/ban-do`:

- browser vẫn tải tour từ `uet.vnu.asia`;
- network cost của virtual tour vẫn tồn tại;
- chỉ chuyển ownership/hosting ra server external.

Không claim rằng iframe làm virtual tour “không tốn tải”.

---

# 16. SEO / accessibility

Iframe cần:

```text
title="UET Virtual Campus Tour"
```

Fallback link phải keyboard accessible.

Không cần SEO index nội dung iframe như native content.

---

# 17. Acceptance Criteria cuối

## Embed

- `/ban-do` render external virtual tour.
- Không bị frame policy chặn.
- Desktop usable.
- Mobile usable.

## UX

- Header Navigator vẫn usable.
- iframe fill đúng viewport.
- loading state.
- fallback external link.
- không double-scroll/horizontal overflow.

## Functionality

- rotate;
- zoom;
- hotspot;
- scene transitions;
- fullscreen nếu tour hỗ trợ.

## Regression

Không phá:

```text
/gioi-thieu
/lien-chi
/cau-lac-bo
```

## Cleanup

Sau M3:

- old Map runtime không còn;
- unused Three/R3F deps được remove;
- build PASS;
- warning chunk cũ biến mất nếu không còn dependency.

## Machine

```text
npm run check — PASS
git diff --check — PASS
```

---

# 18. Khi nào cần liên hệ bên server kia?

Chỉ cần liên hệ nếu một trong các tình huống sau xảy ra:

### Case A — iframe bị chặn

Browser console báo dạng:

```text
Refused to display ...
X-Frame-Options
frame-ancestors
```

→ yêu cầu whitelist parent origin.

### Case B — iframe load nhưng fullscreen bị policy block

→ nhờ họ kiểm tra Permissions-Policy / fullscreen policy.

### Case C — tour phụ thuộc auth/cookie và không hoạt động trong iframe

→ cần họ xác nhận third-party iframe support.

### Case D — muốn integration sâu sau này

Ví dụ:

- Navigator điều khiển scene;
- tour báo scene hiện tại về host;
- sync route/hotspot;
- analytics event.

→ cần phía họ cung cấp `postMessage` API/SDK contract.

**Không cần cho Phase basic embed hiện tại.**

---

# 19. Thông tin cần hỏi bên server khi cần

Nếu phải liên hệ họ, cần xin:

1. Có cho phép iframe embed không?
2. Production origin nào được whitelist?
3. Dev origin có whitelist tạm được không?
4. Có `X-Frame-Options` không?
5. Có CSP `frame-ancestors` không?
6. Có Permissions-Policy giới hạn fullscreen/autoplay không?
7. Virtual tour có yêu cầu cookies/session không?
8. Có chính sách chống embedding/hotlink nào khác không?
9. Có API/postMessage chính thức không? — chỉ hỏi để biết, chưa cần triển khai.

---

# 20. Session boundary

## Session mới hiện tại

Chỉ bắt đầu:

```text
M0 — iframe capability proof
```

Codex phải STOP sau M0.

Không làm M1 cùng lượt.

## Sau M0 PASS

Tiếp tục cùng Map session nếu context còn sạch:

```text
M1 → STOP
```

## Sau M2 PASS

Có thể tiếp tục cùng session hoặc mở session cleanup mới nếu diff/context đã lớn.

Khuyến nghị mở **session mới cho M3 cleanup** vì đây là destructive change:

```text
delete old Map + remove dependencies
```

---

# 21. Baseline frozen

Trong Map integration không tự sửa:

- Intro official content;
- Intro assets;
- `/gioi-thieu`;
- `/lien-chi`;
- `/cau-lac-bo`;
- backend API/content;
- theme/navigation;

trừ regression fix được user approve cụ thể.

---

# 22. Final rule

Không được coi task Map hoàn tất chỉ vì iframe “hiện ra”.

Task chỉ final khi:

```text
iframe policy PASS
+ desktop interaction PASS
+ real mobile interaction PASS
+ production wrapper PASS
+ route regression PASS
+ old engine cleanup PASS
+ production smoke PASS
```

Mỗi dấu `PASS` cần user checkpoint hoặc machine verification tương ứng.
