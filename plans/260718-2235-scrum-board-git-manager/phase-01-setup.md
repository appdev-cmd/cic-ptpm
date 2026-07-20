# Phase 01: Setup Environment
Status: ⬜ Pending
Dependencies: None

## Objective
Khởi tạo cấu trúc dự án React 19 + Vite 7 + TypeScript, cài đặt các thư viện phụ thuộc và thiết lập theme tối (Dark Mode) Slate lạnh của `qa-qtdn` làm gốc.

## Requirements
### Functional
- Cấu trúc thư mục ngăn nắp chuẩn React: `src/components`, `src/layouts`, `src/pages`, `src/services`, `src/hooks`, `src/context`, `src/types`.
- Thiết lập React Router cho các khu vực chính: Dashboard, Backlog, Kanban Board, Settings.

### Non-Functional
- Tối ưu hóa bundle size và cấu hình Tailwind để loại bỏ các CSS dư thừa.
- File cấu hình Tailwind chứa đầy đủ các token màu slate lạnh của `qa-qtdn`.

## Implementation Steps
1. [ ] Khởi tạo dự án Vite mới trong thư mục hiện tại: `npm create vite@latest ./ -- --template react-ts` (nếu thư mục rỗng).
2. [ ] Cài đặt các package cần thiết:
   `npm install @supabase/supabase-js @tanstack/react-query react-router-dom lucide-react @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities recharts react-hook-form zod`
3. [ ] Cài đặt các package hỗ trợ dev (TailwindCSS, Autoprefixer, PostCSS):
   `npm install -D tailwindcss postcss autoprefixer prettier prettier-plugin-tailwindcss`
4. [ ] Khởi tạo Tailwind: `npx tailwindcss init -p`.
5. [ ] Cập nhật `tailwind.config.js` với hệ thống màu `primary`, `app`, `surface`, `elevated`, `bd`, `txt` như thiết kế của `qa-qtdn`.
6. [ ] Tạo `src/index.css` định nghĩa các biến CSS Dark Mode cho Slate theme.
7. [ ] Thiết lập base layout với Sidebar và Router cơ bản trong `src/App.tsx`.

## Files to Create/Modify
- [NEW] [tailwind.config.js](file:///d:/01_Projects/cic-ptpm/tailwind.config.js) - Cấu hình token màu slate lạnh.
- [NEW] [src/index.css](file:///d:/01_Projects/cic-ptpm/src/index.css) - Thiết lập CSS variables Dark Mode.
- [MODIFY] [src/App.tsx](file:///d:/01_Projects/cic-ptpm/src/App.tsx) - Tích hợp React Router, Layout, và Context.
- [MODIFY] [package.json](file:///d:/01_Projects/cic-ptpm/package.json) - Quản lý script và dependency.

## Test Criteria
- [ ] Lệnh `npm run dev` chạy không lỗi, hiển thị màn hình trống với nền tối slate `#0a0f1a`.
- [ ] Build dự án thử nghiệm `npm run build` thành công, không gặp lỗi TypeScript.

---
Next Phase: [Phase 02: Database & Auth](file:///d:/01_Projects/cic-ptpm/plans/260718-2235-scrum-board-git-manager/phase-02-database.md)
