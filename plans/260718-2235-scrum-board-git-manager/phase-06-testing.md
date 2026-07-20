# Phase 06: Testing & Refinements
Status: ⬜ Pending
Dependencies: [Phase 05: Integration & Realtime](file:///d:/01_Projects/cic-ptpm/plans/260718-2235-scrum-board-git-manager/phase-05-integration.md)

## Objective
Viết kiểm thử, tối ưu hóa hiệu suất hiển thị, xử lý các trạng thái lỗi/mất mạng và tạo báo cáo nghiệm thu hoàn thành dự án.

## Requirements
### Functional
- Có các test case kiểm tra việc parse commit message bằng Regex xem có trích xuất đúng Task ID hay không.
- Giao diện có Error Boundary để bắt lỗi render, tránh làm sập cả ứng dụng.
- Thêm Skeleton loaders cho các bảng và biểu đồ trong thời gian tải dữ liệu.

### Non-Functional
- Test coverage đạt tối thiểu 70% cho các helper logic và webhook parser.
- Giao diện tối ưu hóa tốt về thời gian phản hồi (chỉ số TTI và LCP đạt chuẩn tốt của Lighthouse).

## Implementation Steps
1. [ ] Cấu hình Vitest và viết unit test cho hàm parse GitHub Webhooks tại `supabase/functions/github-webhook/index.test.ts`.
2. [ ] Viết unit test cho React component chính như `TaskCard` và các utils chuyển đổi định dạng.
3. [ ] Tạo Component `src/components/SkeletonLoader.tsx` hiển thị trạng thái chờ tải dữ liệu đẹp mắt.
4. [ ] Thêm React `ErrorBoundary` bọc quanh các view chính.
5. [ ] Thực hiện chạy build sản xuất `npm run build` và kiểm tra lỗi bundle size hoặc lỗi kiểu dữ liệu.
6. [ ] Tạo tài liệu nghiệm thu `walkthrough.md` tổng kết các thay đổi và hình ảnh/video demo.

## Files to Create/Modify
- [NEW] [src/components/ErrorBoundary.tsx](file:///d:/01_Projects/cic-ptpm/src/components/ErrorBoundary.tsx) - Bọc và bắt lỗi ứng dụng.
- [NEW] [src/components/SkeletonLoader.tsx](file:///d:/01_Projects/cic-ptpm/src/components/SkeletonLoader.tsx) - Hiển thị trạng thái chờ tải.
- [NEW] [supabase/functions/github-webhook/index.test.ts](file:///d:/01_Projects/cic-ptpm/supabase/functions/github-webhook/index.test.ts) - Kiểm thử hàm parser webhook.
- [NEW] [walkthrough.md](file:///d:/01_Projects/cic-ptpm/walkthrough.md) - Tài liệu nghiệm thu dự án.

## Test Criteria
- [ ] Lệnh `npm run test` chạy tất cả các test case đều Pass.
- [ ] Dự án build hoàn chỉnh không có cảnh báo nghiêm trọng nào từ bundler.

---
Next Phase: None (End of Plan)
