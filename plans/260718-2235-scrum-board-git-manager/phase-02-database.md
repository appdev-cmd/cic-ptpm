# Phase 02: Database & Auth
Status: ⬜ Pending
Dependencies: [Phase 01: Setup Environment](file:///d:/01_Projects/cic-ptpm/plans/260718-2235-scrum-board-git-manager/phase-01-setup.md)

## Objective
Khởi tạo cơ sở dữ liệu trên Supabase, viết migration cho các bảng dữ liệu Scrum, cấu hình RLS (Row Level Security) và thiết lập Supabase Auth (GitHub OAuth / Email).

## Requirements
### Functional
- Có 5 bảng: `profiles`, `projects`, `sprints`, `tasks`, `git_activities` với kiểu dữ liệu và khóa ngoại chính xác.
- Tạo trigger tự động chèn profile mới từ `auth.users` khi người dùng đăng ký.
- Thiết lập phân quyền cơ bản: Chỉ những người là thành viên/owner dự án mới được đọc và chỉnh sửa các Sprint/Task của dự án đó.

### Non-Functional
- RLS được thiết lập đầy đủ trên tất cả các bảng. Không cho phép truy cập nặc danh không an toàn.
- Khóa ngoại có các ràng buộc cascade delete hợp lý để tránh dữ liệu mồ côi.

## Implementation Steps
1. [ ] Tạo file SQL migration `supabase/migrations/20260718000000_init_schema.sql` định nghĩa cấu trúc bảng.
2. [ ] Viết Function & Trigger tự động tạo bản ghi trong `profiles` khi có user mới trong `auth.users`.
3. [ ] Định nghĩa các chính sách RLS cho 5 bảng chính, đảm bảo tính bảo mật.
4. [ ] Tạo file cấu hình Supabase Client `src/lib/supabaseClient.ts` trong dự án.
5. [ ] Tạo hook `useAuth` xử lý đăng ký, đăng nhập và lấy thông tin phiên làm việc hiện tại.

## Files to Create/Modify
- [NEW] [supabase/migrations/20260718000000_init_schema.sql](file:///d:/01_Projects/cic-ptpm/supabase/migrations/20260718000000_init_schema.sql) - Định nghĩa SQL schema và trigger.
- [NEW] [src/lib/supabaseClient.ts](file:///d:/01_Projects/cic-ptpm/src/lib/supabaseClient.ts) - Cấu hình Supabase client JS.
- [NEW] [src/context/AuthContext.tsx](file:///d:/01_Projects/cic-ptpm/src/context/AuthContext.tsx) - Context cung cấp trạng thái Auth toàn cục.

## Test Criteria
- [ ] Chạy migration thành công trên Supabase console hoặc CLI.
- [ ] Thực hiện đăng ký/đăng nhập qua Supabase Auth thành công và bảng `profiles` tự động nhận bản ghi mới.
- [ ] Test thử RLS: User A không thể đọc hoặc ghi đè dữ liệu của User B nếu không cùng chung project.

---
Next Phase: [Phase 03: Backend Webhooks](file:///d:/01_Projects/cic-ptpm/plans/260718-2235-scrum-board-git-manager/phase-03-backend.md)
