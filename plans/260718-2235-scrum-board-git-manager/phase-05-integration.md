# Phase 05: Integration & Realtime
Status: ⬜ Pending
Dependencies: [Phase 02: Database & Auth](file:///d:/01_Projects/cic-ptpm/plans/260718-2235-scrum-board-git-manager/phase-02-database.md), [Phase 04: Frontend UI Components](file:///d:/01_Projects/cic-ptpm/plans/260718-2235-scrum-board-git-manager/phase-04-frontend.md)

## Objective
Tích hợp dữ liệu từ Supabase Database vào Frontend sử dụng React Query, áp dụng `@dnd-kit` để kéo thả cập nhật trạng thái Task và kích hoạt Realtime updates.

## Requirements
### Functional
- **Kéo thả Kanban:** Người dùng có thể kéo thả Task Card qua lại giữa các cột trạng thái. Khi thả, thực hiện cập nhật `tasks.status` trong database thông qua Supabase Client API.
- **Fetch dữ liệu:** Sử dụng React Query để fetch danh sách Projects, Sprints, Tasks, Git Activities theo thời gian thực.
- **Realtime sync:** Thiết lập Supabase Channel lắng nghe thay đổi của bảng `tasks` và `git_activities`. Khi có thay đổi, trigger `queryClient.invalidateQueries` của React Query để làm mới UI.
- **Dữ liệu thật cho Burndown:** Tính toán số lượng Story Points còn lại theo từng ngày của Sprint hiện tại để hiển thị chính xác biểu đồ Burndown.

### Non-Functional
- Cơ chế kéo thả mượt mà, có chỉ thị vùng thả (drop zone indicator).
- Quản lý trạng thái loading và error tốt khi gọi API cập nhật database, tránh tình trạng UI bị đơ hoặc mất dữ liệu khi mất kết nối mạng.

## Implementation Steps
1. [ ] Tạo file dịch vụ API `src/services/api.ts` chứa các hàm CRUD cho dự án, sprint, task.
2. [ ] Thiết lập React Query Provider trong `src/main.tsx`.
3. [ ] Cài đặt logic kéo thả `@dnd-kit` trong trang `src/pages/Board.tsx` (dùng `DndContext`, `useSensors`, `useSensor`, `PointerSensor`).
4. [ ] Viết hook `useRealtimeSync` đăng ký channel Supabase lắng nghe biến động và tự động cập nhật cache React Query.
5. [ ] Tích hợp API thật vào trang Backlog để lưu chuyển công việc giữa backlog và sprints.
6. [ ] Tích hợp API và viết hàm tính toán Burndown Chart thực tế hiển thị trên trang Dashboard.

## Files to Create/Modify
- [NEW] [src/services/api.ts](file:///d:/01_Projects/cic-ptpm/src/services/api.ts) - Chứa các truy vấn Supabase Client.
- [NEW] [src/hooks/useRealtimeSync.ts](file:///d:/01_Projects/cic-ptpm/src/hooks/useRealtimeSync.ts) - Lắng nghe Supabase realtime channel.
- [MODIFY] [src/pages/Board.tsx](file:///d:/01_Projects/cic-ptpm/src/pages/Board.tsx) - Tích hợp kéo thả thực tế và fetch dữ liệu.
- [MODIFY] [src/pages/Dashboard.tsx](file:///d:/01_Projects/cic-ptpm/src/pages/Dashboard.tsx) - Tải dữ liệu thật cho biểu đồ Burndown.
- [MODIFY] [src/main.tsx](file:///d:/01_Projects/cic-ptpm/src/main.tsx) - Cấu hình React Query Client Provider.

## Test Criteria
- [ ] Kéo thả task card từ cột "To-Do" sang "In Progress", tải lại trang thấy trạng thái task vẫn được giữ nguyên trong cơ sở dữ liệu.
- [ ] Mở hai trình duyệt song song, kéo thả task bên trình duyệt 1, trình duyệt 2 lập tức thấy task di chuyển theo (Realtime hoạt động).

---
Next Phase: [Phase 06: Testing & Refinements](file:///d:/01_Projects/cic-ptpm/plans/260718-2235-scrum-board-git-manager/phase-06-testing.md)
