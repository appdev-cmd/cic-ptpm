# Phase 03: Backend Webhooks
Status: ⬜ Pending
Dependencies: [Phase 02: Database & Auth](file:///d:/01_Projects/cic-ptpm/plans/260718-2235-scrum-board-git-manager/phase-02-database.md)

## Objective
Xây dựng và deploy Supabase Edge Function đón nhận Webhooks từ GitHub, phân tích (parse) commit message/PR title để liên kết và tự động cập nhật trạng thái của Task trong database.

## Requirements
### Functional
- Endpoint công khai chấp nhận phương thức POST chứa JSON payload từ GitHub Webhook.
- Nhận diện sự kiện `push` (đọc các commit) và `pull_request` (đọc trạng thái open/close/merged).
- Regular Expression (Regex) chính xác tìm mã task dạng `#TASK-[uuid]` hoặc `#BUG-[uuid]` hoặc định dạng số ngắn (nếu áp dụng mã tăng tự động).
- Thực hiện thêm bản ghi vào `git_activities` và cập nhật cột `status` trong `tasks`.

### Non-Functional
- Có cơ chế xác thực webhook bằng GitHub Webhook Secret (HMAC SHA-256) để tránh các yêu cầu giả mạo.
- Xử lý lỗi ngoại lệ tốt, trả về HTTP status code tương thích (ví dụ: 200 OK cho yêu cầu hợp lệ nhưng không chứa task ID, 400 cho bad request, 401 cho unauthorized).

## Implementation Steps
1. [ ] Khởi tạo Supabase Edge Function: `supabase functions new github-webhook`.
2. [ ] Viết logic kiểm tra chữ ký số GitHub (`x-hub-signature-256`) bằng Webhook Secret.
3. [ ] Viết hàm parse nội dung (commit message, PR title/description) bằng Regex để trích xuất Task ID.
4. [ ] Viết câu lệnh SQL cập nhật trạng thái Task (PR open -> `'in_review'`, PR merged -> `'done'`) và insert vào bảng `git_activities`.
5. [ ] Deploy Edge Function lên Supabase và lấy URL endpoint để cấu hình Webhook trên GitHub repo thử nghiệm.

## Files to Create/Modify
- [NEW] [supabase/functions/github-webhook/index.ts](file:///d:/01_Projects/cic-ptpm/supabase/functions/github-webhook/index.ts) - Source code Edge Function bằng Deno/TypeScript.
- [NEW] [supabase/functions/github-webhook/README.md](file:///d:/01_Projects/cic-ptpm/supabase/functions/github-webhook/README.md) - Hướng dẫn cấu hình Secret và tạo webhook trên GitHub.

## Test Criteria
- [ ] Gửi payload mock (chạy local qua `supabase functions serve`) trả về kết quả chính xác.
- [ ] Test thực tế: Khi thực hiện push một commit có chứa mã task lên GitHub, bảng `git_activities` tự động tăng thêm 1 bản ghi và task di chuyển trạng thái tương ứng.

---
Next Phase: [Phase 04: Frontend UI Components](file:///d:/01_Projects/cic-ptpm/plans/260718-2235-scrum-board-git-manager/phase-04-frontend.md)
