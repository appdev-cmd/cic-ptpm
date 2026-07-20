# GitHub Webhook handler for Scrum Board automation

Edge Function này tự động bắt sự kiện Commit/PR từ các repo GitHub và cập nhật trạng thái Task tương ứng trong bảng Kanban.

## Hướng dẫn triển khai (Deploy)

Bạn mở terminal tại thư mục gốc của dự án (`d:\QuocAnh\2026\01.Project\cic-ptpm`) và chạy lệnh sau để deploy hàm lên Supabase Cloud:

```bash
npx supabase functions deploy github-webhook --project-ref bpmatlkrotoftowpsbcz
```

*Lưu ý:* Hệ thống Supabase sẽ tự động gán hai biến môi trường `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY` cho Edge Function này, nên bạn không cần cài thêm biến thủ công.

---

## Hướng dẫn cấu hình Webhook trên GitHub Repo

Sau khi deploy thành công, bạn sẽ nhận được một Public URL từ Supabase (dạng: `https://bpmatlkrotoftowpsbcz.supabase.co/functions/v1/github-webhook`).

Bạn vào trang quản lý Repo GitHub (ví dụ: `appdev-cmd/cic-ibst`), chọn mục **Settings** -> **Webhooks** -> **Add webhook** và điền như sau:

1. **Payload URL**: `https://bpmatlkrotoftowpsbcz.supabase.co/functions/v1/github-webhook`
2. **Content type**: Chọn `application/json` (Rất quan trọng!)
3. **Secret**: Điền mã khóa bí mật bạn muốn dùng để xác thực webhook cho dự án này (phải khớp với cột `github_webhook_secret` trong bảng `projects` của dự án đó).
   * Ví dụ với dự án `cic-ibst` trong database đang là: `secret_ibst`.
4. **SSL verification**: Giữ nguyên `Enable SSL verification`.
5. **Which events would you like to trigger this webhook?**:
   * Chọn `Let me select individual events` và tick chọn hai ô:
     * `Pushes` (gửi commit)
     * `Pull requests` (gửi PR)
6. Bấm **Add webhook**.

---

## Cách viết Commit/PR để tự động chuyển trạng thái Task

Tên task trong cơ sở dữ liệu có dạng `TASK-1`, `TASK-2`, `BUG-1`, v.v.

### 1. Khi Commit code
Hàm sẽ quét tin nhắn commit (commit message) để chuyển đổi trạng thái:
- **Chuyển sang In Progress (`inprogress`)**: Mặc định khi commit nhắc tới mã Task:
  * Ví dụ: `feat: add database schema for TASK-1`
- **Chuyển sang In Review (`review`)**: Nếu commit chứa từ khóa `#review`:
  * Ví dụ: `refactor: optimize query speed for TASK-3 #review`
- **Chuyển sang Done (`done`)**: Nếu commit chứa từ khóa kết thúc (`fix`, `closes`, `resolves`, v.v.) đi kèm mã task, hoặc có nhãn `#done`:
  * Ví dụ: `fix: resolved TASK-2 connection issue` hoặc `docs: complete walkthrough.md TASK-4 #done`

### 2. Khi gửi Pull Request (PR)
- **Khi mở PR (Opened)**: Tất cả các Task ID được nhắc tên trong Tiêu đề PR hoặc nội dung Mô tả sẽ tự động chuyển sang trạng thái **In Review (`review`)**.
- **Khi hợp nhất PR (Merged)**: Các Task ID liên quan sẽ tự động chuyển sang trạng thái **Done (`done`)**.
- **Khi đóng PR không hợp nhất (Closed without merging)**: Các Task ID liên quan sẽ tự động chuyển về trạng thái **To Do (`todo`)**.
