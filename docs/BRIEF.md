# 💡 BRIEF: Scrum Board & Git Integration Manager

**Ngày tạo:** 2026-07-18
**Trạng thái:** Đã phê duyệt qua Brainstorm

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
* Quản lý tiến độ phát triển phần mềm trong đội ngũ nhỏ gặp khó khăn khi phải chuyển đổi thủ công giữa bảng quản lý task (như Trello/Jira) và nền tảng quản lý code (GitHub).
* Việc cập nhật trạng thái công việc (như chuyển task sang "In Review" hoặc "Done") thường bị bỏ quên hoặc chậm trễ, dẫn đến dữ liệu báo cáo tiến độ không chính xác.

## 2. GIẢI PHÁP ĐỀ XUẤT
* Xây dựng một Web App quản lý dự án tối giản theo quy trình **Scrum/Sprints**.
* Tự động hóa cập nhật trạng thái công việc thông qua **GitHub Webhooks** (người dùng chỉ cần viết mã task kèm commit/PR để hệ thống tự ghi nhận và cập nhật).
* Hiển thị bảng Kanban động, Realtime và biểu đồ Burndown Chart để theo dõi sát sao tiến độ Sprint.

## 3. ĐỐI TƯỢNG SỬ DỤNG
* **Primary:** Các lập trình viên (Developer) cần kéo thả task và tích hợp nhanh commit/PR.
* **Secondary:** Product Owner (lên backlog, theo dõi tiến độ) và Scrum Master (điều phối Sprint, xem biểu đồ Burndown).

## 4. TÍNH NĂNG MVP (BẮT BUỘC):
* [ ] **Xác thực:** Đăng nhập qua Supabase Auth (hỗ trợ GitHub OAuth).
* [ ] **Quản lý Dự án & Thành viên:** Tạo dự án mới, liên kết với GitHub repository, phân quyền vai trò thành viên.
* [ ] **Lập kế hoạch Sprint (Backlog Planning):** Tạo Sprint mới, thêm Story Points, kéo thả task từ Backlog chung vào Sprint.
* [ ] **Bảng Sprint Kanban:** Bảng kéo thả realtime với các cột: To-Do, In Progress, In Review, Done.
* [ ] **Tích hợp GitHub Webhooks:** Tự động bắt sự kiện commit/PR, ghi nhận hoạt động vào task tương ứng và tự động cập nhật trạng thái task.
* [ ] **Biểu đồ Burndown:** Vẽ biểu đồ tiến độ thực tế so với lý thuyết của Sprint hiện tại.

## 5. ƯỚC TÍNH SƠ BỘ
* **Độ phức tạp:** Trung bình (Frontend Vite/React đơn giản kết hợp Supabase Realtime và Edge Functions xử lý Webhook).
* **Rủi ro:** Cần cấu hình GitHub Webhooks chính xác để tránh bỏ lỡ sự kiện từ GitHub.

## 6. BƯỚC TIẾP THEO
→ Thực hiện `/plan` để lên thiết kế kỹ thuật chi tiết.
