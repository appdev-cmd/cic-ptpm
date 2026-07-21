# QUY TRÌNH PHÁT TRIỂN SẢN PHẨM & VẬN HÀNH DỰ ÁN CHUẨN (CIC SOFTWARE HUB)
*Tài liệu quy trình chuẩn hóa tích hợp các công cụ số hóa, tự động hóa từ GitHub, Supabase và hệ thống quản trị dự án Trung tâm PTPM*

---

## 📅 SƠ ĐỒ TIẾN TRÌNH 7 GIAI ĐOẠN (PROJECT LIFECYCLE)

Quy trình phát triển sản phẩm của Trung tâm PTPM được quản lý tập trung qua **7 Giai đoạn nghiệp vụ**. Tiến độ của từng bước được PM điều chỉnh trực tiếp và hệ thống tự động tính toán **Tiến độ tổng thể** dựa trên trung bình cộng của cả 7 bước.

```mermaid
graph TD
    A["1. Khảo sát & Phân tích (PO/PM)"] --> B["2. Thiết kế UI/UX (Designer/PM)"]
    B --> C["3. Lập trình Frontend (Google AI Studio)"]
    C --> D["4. Thiết kế DB & Backend (Antigravity/Claude/Supabase)"]
    D --> E["5. Kiểm thử chất lượng (QA/Tester)"]
    E --> F["6. Triển khai & Deploy (DevOps/Lead)"]
    F --> G["7. Nghiệm thu & Bàn giao (PM/Client)"]
    
    style A fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#f8fafc
    style B fill:#1e293b,stroke:#a855f7,stroke-width:2px,color:#f8fafc
    style C fill:#1e293b,stroke:#eab308,stroke-width:2px,color:#f8fafc
    style D fill:#1e293b,stroke:#10b981,stroke-width:2px,color:#f8fafc
    style E fill:#1e293b,stroke:#f43f5e,stroke-width:2px,color:#f8fafc
    style F fill:#1e293b,stroke:#06b6d4,stroke-width:2px,color:#f8fafc
    style G fill:#1e293b,stroke:#64748b,stroke-width:2px,color:#f8fafc
```

---

## 🛠️ CHI TIẾT CÔNG VIỆC, CÔNG CỤ VÀ KẾT QUẢ ĐẦU RA CHO TỪNG BƯỚC

| Giai đoạn | Vai trò chủ trì | Phần mềm & Công cụ sử dụng | Chi tiết Công việc | Kết quả đầu ra (Deliverables) |
| :--- | :--- | :--- | :--- | :--- |
| **Bước 1: Khảo sát & Phân tích** | Product Owner (PO), Project Manager (PM) | - Google Docs/Word<br>- Google Sheets/Excel<br>- Google AI Studio (Lên ý tưởng đặc tả)<br>- Slack, Zoom | - Họp khởi động (Kick-off) để thống nhất tầm nhìn sản phẩm, tập người dùng và giá trị cốt lõi.<br>- Khảo sát nghiệp vụ chi tiết: phỏng vấn người dùng cuối làm rõ các luồng tính năng thực tế.<br>- Lập tài liệu đặc tả yêu cầu phần mềm (SRS).<br>- Thống nhất phạm vi dự án, lập bảng phân rã công việc (WBS) và thời hạn hoàn thành. | - Tài liệu đặc tả yêu cầu phần mềm ('SRS.md' hoặc Word).<br>- Kế hoạch tổng thể dự án ('Master_Plan.xlsx') chứa timeline và các mốc Sprint dự kiến.<br>- Danh sách tính năng ban đầu (Product Backlog). |
| **Bước 2: Thiết kế UI/UX** | UI/UX Designer, PM | - **Google Stich** | - Vẽ Wireframe (khung xương giao diện) phác thảo thô cấu trúc sắp xếp các màn hình.<br>- Thiết kế chi tiết High-Fidelity (Mockup) thể hiện chính xác giao diện, màu sắc, font chữ và trạng thái hoạt động trên **Google Stich**.<br>- Tạo Prototype tương tác luồng click-through trên Google Stich để khách hàng chạy thử nghiệm trực quan. | - Link dự án thiết kế và Prototype tương tác trên **Google Stich**. |
| **Bước 3: Lập trình Frontend** | Frontend Developer, AI Agent | - **Google AI Studio**<br>- VS Code, Git/GitHub | - Setup Boilerplate mã nguồn dự án, cấu hình ESLint, Prettier, phân chia các nhánh Git.<br>- **Sinh mã giao diện**: Sử dụng **Google AI Studio** để sinh mã nguồn giao diện Responsive (React, Vite, Tailwind CSS) trực tiếp từ file thiết kế Google Stich.<br>- Cấu hình routing, states và giao diện tĩnh chạy thử được trên localhost. | - Bản chạy thử nghiệm local (localhost) hoạt động tốt toàn bộ giao diện và các tương tác tĩnh.<br>- Mã nguồn Frontend được tổ chức sạch sẽ trên GitHub. |
| **Bước 4: Thiết kế DB & Lập trình Backend** | Backend Developer, AI Agent | - **Antigravity / Claude**<br>- Supabase Studio | - Dựa vào cấu trúc giao diện Frontend đã chạy ở bước 3, sử dụng **Antigravity** hoặc **Claude** để thiết kế sơ đồ quan hệ thực thể ERD.<br>- Cấu hình Row Level Security (RLS) bảo mật dữ liệu.<br>- Viết các script khởi tạo cơ sở dữ liệu (SQL Migrations).<br>- Lập trình Backend: viết API Endpoints, Deno Edge Functions xử lý logic nghiệp vụ và kết nối với Frontend.<br>- Cấu hình GitHub Webhooks trỏ về Edge Function để đồng bộ commits & PRs. | - Sơ đồ thực thể liên kết ERD (mã Mermaid hoặc ảnh).<br>- Thư mục chứa script SQL di cư cơ sở dữ liệu ('/supabase/migrations/') quản lý bằng Git.<br>- Các chính sách bảo mật RLS và API backend hoạt động tốt trên Supabase Cloud Staging. |
| **Bước 5: Kiểm thử chất lượng (QA/QC)** | Tester, QA Engineer | - Vitest / Jest (Automated Unit Test)<br>- Postman (Test APIs)<br>- GitHub Issues | - Viết Automated Unit Tests kiểm tra tự động các hàm logic nghiệp vụ lõi (hàm tính %, phân quyền...) bằng Vitest.<br>- Kiểm thử thủ công (Manual Testing) toàn bộ luồng phần mềm, kiểm tra layout responsive đa nền tảng và kiểm thử lỗi biên.<br>- Ghi nhận lỗi phát sinh (Bugs) lên mục GitHub Issues kèm hình ảnh, mô tả chi tiết các bước tái hiện.<br>- Kiểm thử lại (Regression Testing) sau khi Developers hoặc AI khắc phục xong. | - Kịch bản kiểm thử (Test Cases document).<br>- Bảng lỗi GitHub Issues với các lỗi nghiêm trọng đã được sửa đổi và đóng lại ('closed'). |
| **Bước 6: Triển khai & Deploy** | DevOps Engineer, Lead Developer | - Vercel / Cloudflare Pages (Frontend)<br>- Supabase Cloud (Backend/Database)<br>- GitHub Actions (CI/CD) | - Cấu hình deploy tự động Frontend lên Vercel / Cloudflare Pages từ nhánh Git 'main' mỗi khi gộp mã nguồn.<br>- Đồng bộ toàn bộ SQL Migrations cấu trúc dữ liệu từ local lên Supabase Cloud Production.<br>- Thiết lập các workflow CI/CD trên GitHub Actions tự động kiểm tra cú pháp (lint) và chạy test khi có Pull Request. | - Đường dẫn tên miền chạy chính thức hoạt động ổn định (Ví dụ: 'https://cic-erp.vercel.app/').<br>- File cấu hình luồng CI/CD tự động ('.github/workflows/main.yml'). |
| **Bước 7: Nghiệm thu & Bàn giao** | Project Manager (PM), Product Owner (PO), Khách hàng | - Google Drive / Docs<br>- Sentry (Giám sát lỗi)<br>- GitHub | - Cấp tài khoản chạy thử trên Production để khách hàng chạy nghiệm thu thực tế (UAT).<br>- Soạn thảo tài liệu hướng dẫn sử dụng phần mềm (User Manual) và tài liệu vận hành kỹ thuật (Technical Handover).<br>- Chuyển giao toàn quyền sở hữu các tài khoản quản lý hệ thống (Github, Supabase, Vercel) cho khách hàng và ký biên bản. | - Biên bản bàn giao & Nghiệm thu UAT có chữ ký của các bên (UAT Sign-off).<br>- Tài liệu Hướng dẫn sử dụng chi tiết (User Manual) định dạng Markdown/PDF. |

---

## 💻 PHÂN BỔ VAI TRÒ FRONTEND & BACKEND TRONG QUY TRÌNH

Để Developers (Frontend & Backend) dễ dàng nắm bắt vị trí công việc của mình trong vòng đời dự án, dưới đây là bảng phân rã vai trò:

| Giai đoạn | Nhiệm vụ của Frontend Developer (Kết hợp Google AI Studio) | Nhiệm vụ của Backend Developer (Kết hợp Antigravity / Claude) |
| :--- | :--- | :--- |
| **Bước 1: Khảo sát & Phân tích** | - Tham gia họp Kick-off.<br>- Đánh giá tính khả thi kỹ thuật (technical feasibility) của các yêu cầu chức năng. | - Tham gia họp Kick-off.<br>- Tham vấn giải pháp công nghệ backend, đánh giá khả năng tích hợp bên thứ ba. |
| **Bước 2: Thiết kế UI/UX** | - **Chủ trì**: Thực hiện thiết kế UI/UX và phác thảo các tương tác màn hình trực tiếp trên **Google Stich**. | - Chưa cần tham gia sâu (tập trung chuẩn bị kiến trúc dữ liệu lý thuyết). |
| **Bước 3: Lập trình Frontend** | - **Chủ trì**: Sử dụng **Google AI Studio** để sinh mã Frontend (React/Vite) từ file thiết kế Google Stich.<br>- Cấu hình routing, states và giao diện tĩnh chạy thử được trên localhost. | - Phối hợp thảo luận để thống nhất cấu trúc API contract (các trường dữ liệu cần thiết cho giao diện). |
| **Bước 4: Thiết kế DB & Backend** | - Kết nối các API được cung cấp từ phía Backend vào giao diện Frontend tĩnh đã tạo ở Bước 3. | - **Chủ trì**: Thiết kế sơ đồ ERD, tạo database migrations trên Supabase.<br>- Cấu hình RLS bảo mật dữ liệu.<br>- Viết API Endpoints và Deno Edge Functions xử lý logic.<br>- Cấu hình GitHub Webhooks. |
| **Bước 5: Kiểm thử chất lượng** | - Khắc phục các lỗi giao diện (CSS, responsive, vỡ khung).<br>- Sử dụng Google AI Studio để tái cấu trúc mã nguồn Client-side bị phát hiện lỗi bởi QA/Tester. | - Sửa đổi các lỗi nghiệp vụ dữ liệu, lỗi logic API ở Server-side.<br>- Tối ưu câu lệnh SQL/Edge Functions thông qua Antigravity/Claude. |
| **Bước 6: Triển khai & Deploy** | - Triển khai Frontend lên môi trường Vercel/Cloudflare Pages.<br>- Cấu hình DNS trỏ domain cho Client. | - Đồng bộ cấu trúc database SQL Migrations lên Supabase Cloud Production.<br>- Setup CI/CD workflow trên GitHub Actions. |
| **Bước 7: Nghiệm thu & Bàn giao** | - Bàn giao mã nguồn Frontend.<br>- Hướng dẫn sử dụng giao diện người dùng cuối. | - Bàn giao tài khoản quản trị Supabase, Edge Functions.<br>- Viết tài liệu bàn giao kỹ thuật vận hành hệ thống. |

---

## ⚡ CƠ CHẾ VẬN HÀNH & TỰ ĐỘNG HÓA SỐ HÓA (DIGITAL MANAGEMENT)

### 1. Quản lý Tiến độ Linh hoạt bằng Slider & Tự động Tính toán
* PM có quyền cập nhật tiến độ của từng bước qua **Thanh trượt (%)** hoặc nút tăng giảm nhanh **`-10`** / **`+10`** trong bảng điều khiển.
* Hệ thống sẽ tự động lấy trung bình cộng tiến trình của 7 bước để tính toán ra **Tiến độ tổng thể** của dự án thực tế theo công thức:
  $$\text{Tiến độ tổng thể} = \text{Round}\left(\frac{\sum_{i=1}^{7} \text{Tiến độ bước } i}{7}\right)$$
* Giá trị này được đồng bộ tức thì lên Supabase Cloud giúp toàn bộ đội ngũ và lãnh đạo trung tâm nắm bắt được trạng thái thời gian thực.

### 2. Tự động hóa qua GitHub Webhooks & Deno Edge Functions
* **Tự động bắt sự kiện**: Khi lập trình viên push code hoặc mở PR trên GitHub, một webhook sẽ được gửi trực tiếp đến Supabase Edge Function.
* **Xác thực an toàn**: Sử dụng giải thuật mã hóa HMAC-SHA256 để so sánh chữ ký Hex, đảm bảo dữ liệu gửi đến là chính xác từ GitHub.
* **Liên kết Task**: Webhook phân tích thông tin commit message để tự động gán, chuyển đổi trạng thái nhiệm vụ (Ví dụ: Commit chứa `fix: TASK-3` sẽ tự động chuyển trạng thái task số 3 sang mục Kiểm thử/Đã gộp).

### 3. Quản trị Nhân sự & Phân bổ Công việc
* **Thêm bớt thành viên động**: PM có thể phân bổ nhanh các lập trình viên thực tế trong trung tâm (Nguyễn Quốc Anh, Phan Thành Nam, Trần Đình Thuận) vào dự án thông qua giao diện trượt từ phải (Slide Panel).
* **Resource Workload**: Biểu đồ thanh hiển thị trực quan khối lượng công việc được giao của từng người (số việc đã làm xong trên tổng số việc) giúp PM điều chỉnh khối lượng công việc hợp lý.
* **Theo dõi hoạt động Git ở Sidebar**: Dashboard tích hợp sẵn Widget chia 2 tab **Commits** và **Pull Requests** ở cột bên phải, giúp PM theo dõi trực tiếp dòng chảy code mà không cần rời phần mềm.
