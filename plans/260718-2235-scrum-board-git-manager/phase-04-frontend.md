# Phase 04: Frontend UI Components
Status: ⬜ Pending
Dependencies: [Phase 01: Setup Environment](file:///d:/01_Projects/cic-ptpm/plans/260718-2235-scrum-board-git-manager/phase-01-setup.md)

## Objective
Xây dựng giao diện tĩnh (Mock UI) hoàn chỉnh với đầy đủ các trang và Component theo phong cách tối slate lạnh của `qa-qtdn`.

## Requirements
### Functional
- **Layout:** Sidebar điều hướng chính kèm Project Selector dropdown.
- **Dashboard:** Thẻ thống kê KPI và biểu đồ Burndown Chart sử dụng dữ liệu giả lập (mock data) thông qua thư viện `recharts`.
- **Backlog & Planning:** Danh sách Sprint gập mở được, hiển thị danh sách các task thuộc Sprint đó, và nút thêm Sprint/thêm Task.
- **Kanban Board:** Hiển thị 4 cột trạng thái, các thẻ Task Card có màu chỉ thị Priority, assignee avatar, loại task, và biểu tượng liên kết Git.
- **Task Detail Sidebar:** Panel trượt từ bên phải vào khi click chọn Task Card, hiển thị thông tin mô tả chi tiết và danh sách Git activity giả lập.

### Non-Functional
- Giao diện đáp ứng (responsive), tuy nhiên ưu tiên hiển thị tối ưu cực tốt trên Desktop (màn hình lớn).
- Sử dụng đúng các CSS variables và class `.card` của `qa-qtdn` để giữ tính nhất quán về bo góc và bóng đổ.

## Implementation Steps
1. [ ] Tạo Layout chính `src/layouts/MainLayout.tsx` với thanh Sidebar trái và khu vực Content phải.
2. [ ] Tạo trang Dashboard `src/pages/Dashboard.tsx` có Burndown Chart (Recharts).
3. [ ] Tạo trang Backlog `src/pages/Backlog.tsx` hiển thị backlog items và sprints.
4. [ ] Tạo trang Kanban Board `src/pages/Board.tsx` vẽ các cột Kanban.
5. [ ] Tạo Component `src/components/TaskCard.tsx` hiển thị thông tin ngắn gọn của task.
6. [ ] Tạo Component `src/components/TaskDetailPanel.tsx` hiển thị thông tin chi tiết trượt ra từ bên phải.
7. [ ] Cài đặt định tuyến các trang trong `src/App.tsx`.

## Files to Create/Modify
- [NEW] [src/layouts/MainLayout.tsx](file:///d:/01_Projects/cic-ptpm/src/layouts/MainLayout.tsx) - Main Layout có Sidebar.
- [NEW] [src/pages/Dashboard.tsx](file:///d:/01_Projects/cic-ptpm/src/pages/Dashboard.tsx) - Trang dashboard tổng quan.
- [NEW] [src/pages/Backlog.tsx](file:///d:/01_Projects/cic-ptpm/src/pages/Backlog.tsx) - Trang quản lý backlog & planning.
- [NEW] [src/pages/Board.tsx](file:///d:/01_Projects/cic-ptpm/src/pages/Board.tsx) - Trang Kanban board kéo thả.
- [NEW] [src/components/TaskCard.tsx](file:///d:/01_Projects/cic-ptpm/src/components/TaskCard.tsx) - Component thẻ Task.
- [NEW] [src/components/TaskDetailPanel.tsx](file:///d:/01_Projects/cic-ptpm/src/components/TaskDetailPanel.tsx) - Sidebar xem chi tiết task.

## Test Criteria
- [ ] Trình duyệt hiển thị đầy đủ giao diện các trang thông qua Router mà không có lỗi runtime.
- [ ] Giao diện tối hoàn chỉnh, các nút bấm có hover effect mượt mà.
- [ ] Biểu đồ Recharts hiển thị đúng dữ liệu mock với màu xanh Teal chuẩn.

---
Next Phase: [Phase 05: Integration & Realtime](file:///d:/01_Projects/cic-ptpm/plans/260718-2235-scrum-board-git-manager/phase-05-integration.md)
