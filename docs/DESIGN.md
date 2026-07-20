# 🎨 DESIGN SPECIFICATION: Scrum Board & Git Integration Manager

Tài liệu thiết kế chi tiết mô tả kiến trúc cơ sở dữ liệu, phong cách giao diện và luồng tích hợp của hệ thống, dựa trên phong cách của dự án **qa-qtdn** và tech stack của **qlda-ddcn-ht**.

---

## 1. PHONG CÁCH GIAO DIỆN (THEME & STYLING)
Hệ thống sử dụng phong cách giao diện tối (Dark Mode) Slate lạnh từ dự án **qa-qtdn**:

### 1.1. Các biến CSS (CSS Variables) - Dark Mode
```css
:root {
  /* Tông màu nền slate lạnh */
  --bg-app: #0a0f1a;
  --bg-surface: #141b2b;
  --bg-elevated: #1b2333;
  --bg-subtle: #111826;
  --bg-muted: #232c3e;
  
  /* Hệ thống đường viền */
  --border: #263148;
  --border-subtle: #33405a;
  
  /* Hệ thống chữ */
  --txt-primary: #f3f6fb;
  --txt-secondary: #c3cdda;
  --txt-muted: #8896a9;
  
  /* Màu chủ đạo (Teal mặc định) */
  --primary-500: 0 102 140;
}
```

### 1.2. Kiểu dáng UI nổi bật
* **Bo góc (Border Radius):** `border-radius: 20px` cho các khối thẻ (`.card`), mang lại cảm giác mềm mại nhưng hiện đại.
* **Font chữ:** Dùng font `Inter` cho nội dung chung và `JetBrains Mono` kèm utility `.mono { font-variant-numeric: tabular-nums; }` cho tất cả mã task và số liệu để hiển thị ngay ngắn.

---

## 2. SƠ ĐỒ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)
Hệ thống sử dụng cơ sở dữ liệu PostgreSQL lưu trữ trên Supabase:

### Bảng `profiles`
* `id`: UUID (Khóa chính, nối `auth.users`).
* `full_name`: TEXT.
* `avatar_url`: TEXT.
* `role`: TEXT (`product_owner`, `scrum_master`, `developer`).
* `created_at`: TIMESTAMPTZ.

### Bảng `projects`
* `id`: UUID (Khóa chính).
* `name`: TEXT.
* `description`: TEXT.
* `github_repo`: TEXT (Dạng `owner/repo`).
* `owner_id`: UUID (Nối `profiles.id`).
* `created_at`: TIMESTAMPTZ.

### Bảng `sprints`
* `id`: UUID (Khóa chính).
* `project_id`: UUID (Nối `projects.id`).
* `name`: TEXT.
* `start_date`: TIMESTAMPTZ.
* `end_date`: TIMESTAMPTZ.
* `status`: TEXT (`planning`, `active`, `completed`).
* `created_at`: TIMESTAMPTZ.

### Bảng `tasks`
* `id`: UUID (Khóa chính).
* `project_id`: UUID (Nối `projects.id`).
* `sprint_id`: UUID (Nối `sprints.id`, nullable).
* `title`: TEXT.
* `description`: TEXT.
* `type`: TEXT (`story`, `task`, `bug`).
* `status`: TEXT (`backlog`, `todo`, `in_progress`, `in_review`, `done`).
* `priority`: TEXT (`low`, `medium`, `high`).
* `assignee_id`: UUID (Nối `profiles.id`, nullable).
* `reporter_id`: UUID (Nối `profiles.id`).
* `story_points`: INTEGER.
* `created_at`: TIMESTAMPTZ.

### Bảng `git_activities`
* `id`: UUID (Khóa chính).
* `task_id`: UUID (Nối `tasks.id`).
* `type`: TEXT (`commit`, `pull_request`).
* `title`: TEXT.
* `url`: TEXT.
* `author`: TEXT.
* `created_at`: TIMESTAMPTZ.

---

## 3. LUỒNG TÍCH HỢP GIT & REALTIME
1. **GitHub Webhooks:** Repo GitHub sẽ cấu hình Webhook hướng tới Supabase Edge Function khi phát sinh sự kiện `push` hoặc `pull_request`.
2. **Xử lý sự kiện:** 
   * Trích xuất mã task dạng `#TASK-[id]` hoặc `#BUG-[id]` từ commit message hoặc tiêu đề PR.
   * Thêm hoạt động vào `git_activities`.
   * Tự động cập nhật `tasks.status` tương ứng (PR open -> `in_review`, PR merged -> `done`).
3. **Realtime Broadcast:** Supabase Realtime thông báo trực tiếp thay đổi tới frontend để di chuyển task trên bảng Kanban lập tức.

---

## 4. DIỄN BIẾN QUYẾT ĐỊNH (DECISION LOG)
1. **Sử dụng React SPA + Supabase** thay vì Next.js để đạt hiệu năng biên dịch và chạy tối đa, tận dụng realtime có sẵn.
2. **Áp dụng phong cách Slate tối lạnh (qa-qtdn)** thay vì Nature cát ấm để phù hợp thói quen lập trình viên.
3. **Lưu lịch sử Git riêng ở `git_activities`** để quản lý 1-nhiều thuận tiện.
4. **Tự động chuyển trạng thái task theo PR** giúp tinh giản thao tác.
5. **Dùng Sidebar chi tiết bên phải (Task Detail Panel)** thay vì Modal nhằm tối đa hóa diện tích hiển thị bảng Kanban.
