import { useState } from 'react';
import { 
  CheckSquare, 
  UserCheck, 
  Layers, 
  ClipboardList,
  User,
  Clock,
  Code,
  Eye
} from 'lucide-react';

interface Step {
  id: string;
  title: string;
  role: string;
  duration: string;
  tasks: string[];
}

interface Process {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  duration: string;
  steps: Step[];
  rawMarkdown: string;
}

export default function Processes() {
  const [selectedProcessId, setSelectedProcessId] = useState('p1');
  const [activeTab, setActiveTab] = useState<'visual' | 'markdown'>('visual');
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  const processesData: Process[] = [
    {
      id: 'p1',
      title: 'Quy trình phát triển Web App',
      description: 'Quy trình chuẩn hóa từ khảo sát yêu cầu, thiết kế Figma, lập trình Front/Back cho tới vận hành.',
      category: 'Phát triển sản phẩm',
      icon: Layers,
      duration: '4 - 12 tuần',
      steps: [
        {
          id: 'step-1',
          title: 'Khảo sát & Phân tích yêu cầu (Discovery)',
          role: 'Product Owner (PO) / PM',
          duration: '1 - 2 tuần',
          tasks: [
            'Họp khởi động dự án (Kick-off Meeting)',
            'Khảo sát các yêu cầu nghiệp vụ thực tế',
            'Lập tài liệu đặc tả yêu cầu chức năng (SRS)',
            'Thống nhất phạm vi dự án và thời hạn bàn giao'
          ]
        },
        {
          id: 'step-2',
          title: 'Thiết lập dự án & Repo GitHub',
          role: 'PM / Lead Developer',
          duration: '1 - 2 ngày',
          tasks: [
            'Khởi tạo Repository chính thức của dự án trên GitHub',
            'Cấu hình Kanban Project Board cho tác vụ Sprint',
            'Cài đặt Protection Rules cho các nhánh main và develop',
            'Phân quyền cộng tác cho các thành viên phát triển'
          ]
        },
        {
          id: 'step-3',
          title: 'Thiết kế Trải nghiệm người dùng (UI/UX)',
          role: 'UI/UX Designer / PM',
          duration: '1 - 3 tuần',
          tasks: [
            'Phác thảo Wireframe & vẽ sơ đồ luồng User Flow',
            'Thiết kế giao diện chi tiết High-Fidelity trên Google Stich',
            'Xây dựng Prototype tương tác thử nghiệm trên Google Stich',
            'Bàn giao link dự án thiết kế cho nhóm lập trình'
          ]
        },
        {
          id: 'step-4',
          title: 'Lập trình Frontend (AI Generation)',
          role: 'Frontend Developer',
          duration: '1 - 3 tuần',
          tasks: [
            'Sinh mã giao diện tự động bằng Google AI Studio từ thiết kế Google Stich',
            'Xây dựng giao diện Responsive Client-side (React/Vite)',
            'Cấu hình định tuyến (routing) và state management tĩnh',
            'Kiểm tra hoạt động giao diện trên localhost và đưa lên Git'
          ]
        },
        {
          id: 'step-5',
          title: 'Thiết kế Database & Backend',
          role: 'Backend Developer / AI Agent',
          duration: '2 - 4 tuần',
          tasks: [
            'Thiết kế sơ đồ quan hệ thực thể (ERD) bằng Antigravity/Claude',
            'Cấu hình Row Level Security (RLS) bảo mật dữ liệu trên Supabase',
            'Lập trình API Endpoints & Deno Edge Functions',
            'Ghép nối dữ liệu động hoàn chỉnh với Frontend của bước trước'
          ]
        },
        {
          id: 'step-6',
          title: 'Kiểm thử chất lượng sản phẩm (QA/QC)',
          role: 'Tester / QA Engineer',
          duration: '1 - 2 tuần',
          tasks: [
            'Viết Automated Unit Tests cho logic lõi',
            'Chạy thử nghiệm thủ công trên nhiều trình duyệt và kích thước màn hình',
            'Ghi nhận lỗi (Bugs) lên GitHub Issues kèm hình ảnh và cách tái hiện',
            'Sửa lỗi và kiểm thử lại (Regression Testing)'
          ]
        },
        {
          id: 'step-7',
          title: 'Triển khai & Deploy (CI/CD)',
          role: 'DevOps / Lead Developer',
          duration: '2 - 3 ngày',
          tasks: [
            'Deploy tự động sản phẩm lên Vercel / Cloudflare Pages',
            'Cấu hình tên miền chính thức và kích hoạt SSL (HTTPS)',
            'Thiết lập GitHub Actions tự động kiểm tra cú pháp và build thử khi PR'
          ]
        },
        {
          id: 'step-8',
          title: 'Nghiệm thu, Bàn giao & Bảo trì',
          role: 'PM / PO / Khách hàng',
          duration: '1 tuần',
          tasks: [
            'Tiến hành chạy nghiệm thu người dùng (UAT)',
            'Bàn giao tài liệu hướng dẫn sử dụng và vận hành hệ thống',
            'Cài đặt hệ thống theo dõi logs tự động (Sentry)'
          ]
        }
      ],
      rawMarkdown: `# QUY TRÌNH PHÁT TRIỂN SẢN PHẨM & VẬN HÀNH DỰ ÁN CHUẨN (CIC SOFTWARE HUB)
*Tài liệu quy trình chuẩn hóa tích hợp các công cụ số hóa, tự động hóa từ GitHub, Supabase và hệ thống quản trị dự án Trung tâm PTPM*

---

## 📅 SƠ ĐỒ TIẾN TRÌNH 7 GIAI ĐOẠN (PROJECT LIFECYCLE)

Quy trình phát triển sản phẩm của Trung tâm PTPM được quản lý tập trung qua **8 Giai đoạn nghiệp vụ**. Tiến độ của từng bước được PM điều chỉnh trực tiếp và hệ thống tự động tính toán **Tiến độ tổng thể** dựa trên trung bình cộng của cả 8 bước.
\`\`\`mermaid
graph TD
    A["1. Khảo sát & Phân tích (PO/PM)"] --> B["2. Thiết lập dự án & Repo GitHub (PM/Lead)"]
    B --> C["3. Thiết kế UI/UX (Designer/PM)"]
    C --> D["4. Lập trình Frontend (Google AI Studio)"]
    D --> E["5. Thiết kế DB & Backend (Antigravity/Claude/Supabase)"]
    E --> F["6. Kiểm thử chất lượng (QA/Tester)"]
    F --> G["7. Triển khai & Deploy (DevOps/Lead)"]
    G --> H["8. Nghiệm thu & Bàn giao (PM/Client)"]
    
    style A fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#f8fafc
    style B fill:#1e293b,stroke:#06b6d4,stroke-width:2px,color:#f8fafc
    style C fill:#1e293b,stroke:#a855f7,stroke-width:2px,color:#f8fafc
    style D fill:#1e293b,stroke:#eab308,stroke-width:2px,color:#f8fafc
    style E fill:#1e293b,stroke:#10b981,stroke-width:2px,color:#f8fafc
    style F fill:#1e293b,stroke:#f43f5e,stroke-width:2px,color:#f8fafc
    style G fill:#1e293b,stroke:#06b6d4,stroke-width:2px,color:#f8fafc
    style H fill:#1e293b,stroke:#64748b,stroke-width:2px,color:#f8fafc
\`\`\`

---

## 🛠️ CHI TIẾT CÔNG VIỆC, CÔNG CỤ VÀ KẾT QUẢ ĐẦU RA CHO TỪNG BƯỚC

| Giai đoạn | Vai trò chủ trì | Phần mềm & Công cụ sử dụng | Chi tiết Công việc | Kết quả đầu ra (Deliverables) |
| :--- | :--- | :--- | :--- | :--- |
| **Bước 1: Khảo sát & Phân tích** | Product Owner (PO), Project Manager (PM) | - Google Docs/Word<br>- Google Sheets/Excel<br>- Google AI Studio (Lên ý tưởng đặc tả)<br>- Slack, Zoom | - Họp khởi động (Kick-off) để thống nhất tầm nhìn sản phẩm, tập người dùng và giá trị cốt lõi.<br>- Khảo sát nghiệp vụ chi tiết: phỏng vấn người dùng cuối làm rõ các luồng tính năng thực tế.<br>- Lập tài liệu đặc tả yêu cầu phần mềm (SRS).<br>- Thống nhất phạm vi dự án, lập bảng phân rã công việc (WBS) và thời hạn hoàn thành. | - Tài liệu đặc tả yêu cầu phần mềm ('SRS.md' hoặc Word).<br>- Kế hoạch tổng thể dự án ('Master_Plan.xlsx') chứa timeline và các mốc Sprint dự kiến.<br>- Danh sách tính năng ban đầu (Product Backlog). |
| **Bước 2: Thiết lập dự án & Repo GitHub** | Project Manager (PM), Lead Developer | - **GitHub**<br>- Git, GitHub Projects | - Khởi tạo Repository chứa mã nguồn chính thức của dự án trên GitHub.<br>- Tạo và cấu hình Kanban Project Board phục vụ quản lý các Sprint tác vụ.<br>- Thiết lập các quy tắc phân nhánh (Branching Protection Rules) bảo vệ nhánh 'main' và 'develop'.<br>- Phân quyền cộng tác cho các thành viên phát triển trong đội ngũ. | - Repository GitHub dự án hoạt động trực tuyến.<br>- Kanban Project Board được cấu hình các cột (To Do, In Progress, QA, Done). |
| **Bước 3: Thiết kế UI/UX** | UI/UX Designer, PM | - **Google Stich** | - Vẽ Wireframe (khung xương giao diện) phác thảo thô cấu trúc sắp xếp các màn hình.<br>- Thiết kế chi tiết High-Fidelity (Mockup) thể hiện chính xác giao diện, màu sắc, font chữ và trạng thái hoạt động trên **Google Stich**.<br>- Tạo Prototype tương tác luồng click-through trên Google Stich để khách hàng chạy thử nghiệm trực quan. | - Link dự án thiết kế và Prototype tương tác trên **Google Stich**. |
| **Bước 4: Lập trình Frontend** | Frontend Developer, AI Agent | - **Google AI Studio**<br>- VS Code, Git/GitHub | - Setup Boilerplate mã nguồn dự án, cấu hình ESLint, Prettier, phân chia các nhánh Git.<br>- **Sinh mã giao diện**: Sử dụng **Google AI Studio** để sinh mã nguồn giao diện Responsive (React, Vite, Tailwind CSS) trực tiếp từ file thiết kế Google Stich.<br>- Cấu hình routing, states và giao diện tĩnh chạy thử được trên localhost. | - Bản chạy thử nghiệm local (localhost) hoạt động tốt toàn bộ giao diện và các tương tác tĩnh.<br>- Mã nguồn Frontend được tổ chức sạch sẽ trên GitHub. |
| **Bước 5: Thiết kế DB & Lập trình Backend** | Backend Developer, AI Agent | - **Antigravity / Claude**<br>- Supabase Studio | - Dựa vào cấu trúc giao diện Frontend đã chạy ở bước 4, sử dụng **Antigravity** hoặc **Claude** để thiết kế sơ đồ quan hệ thực thể ERD.<br>- Cấu hình Row Level Security (RLS) bảo mật dữ liệu.<br>- Viết các script khởi tạo cơ sở dữ liệu (SQL Migrations).<br>- Lập trình Backend: viết API Endpoints, Deno Edge Functions xử lý logic nghiệp vụ và kết nối với Frontend.<br>- Cấu hình GitHub Webhooks trỏ về Edge Function để đồng bộ commits & PRs. | - Sơ đồ thực thể liên kết ERD (mã Mermaid hoặc ảnh).<br>- Thư mục chứa script SQL di cư cơ sở dữ liệu ('/supabase/migrations/') quản lý bằng Git.<br>- Các chính sách bảo mật RLS và API backend hoạt động tốt trên Supabase Cloud Staging. |
| **Bước 6: Kiểm thử chất lượng (QA/QC)** | Tester, QA Engineer | - Vitest / Jest (Automated Unit Test)<br>- Postman (Test APIs)<br>- GitHub Issues | - Viết Automated Unit Tests kiểm tra tự động các hàm logic nghiệp vụ lõi (hàm tính %, phân quyền...) bằng Vitest.<br>- Kiểm thử thủ công (Manual Testing) toàn bộ luồng phần mềm, kiểm tra layout responsive đa nền tảng và kiểm thử lỗi biên.<br>- Ghi nhận lỗi phát sinh (Bugs) lên mục GitHub Issues kèm hình ảnh, mô tả chi tiết các bước tái hiện.<br>- Kiểm thử lại (Regression Testing) sau khi Developers hoặc AI khắc phục xong. | - Kịch bản kiểm thử (Test Cases document).<br>- Bảng lỗi GitHub Issues với các lỗi nghiêm trọng đã được sửa đổi và đóng lại ('closed'). |
| **Bước 7: Triển khai & Deploy** | DevOps Engineer, Lead Developer | - Vercel / Cloudflare Pages (Frontend)<br>- Supabase Cloud (Backend/Database)<br>- GitHub Actions (CI/CD) | - Cấu hình deploy tự động Frontend lên Vercel / Cloudflare Pages từ nhánh Git 'main' mỗi khi gộp mã nguồn.<br>- Đồng bộ toàn bộ SQL Migrations cấu trúc dữ liệu từ local lên Supabase Cloud Production.<br>- Thiết lập các workflow CI/CD trên GitHub Actions tự động kiểm tra cú pháp (lint) và chạy test khi có Pull Request. | - Đường dẫn tên miền chạy chính thức hoạt động ổn định (Ví dụ: 'https://cic-erp.vercel.app/').<br>- File cấu hình luồng CI/CD tự động ('.github/workflows/main.yml'). |
| **Bước 8: Nghiệm thu & Bàn giao** | Project Manager (PM), Product Owner (PO), Khách hàng | - Google Drive / Docs<br>- Sentry (Giám sát lỗi)<br>- GitHub | - Cấp tài khoản chạy thử trên Production để khách hàng chạy nghiệm thu thực tế (UAT).<br>- Soạn thảo tài liệu hướng dẫn sử dụng phần mềm (User Manual) và tài liệu vận hành kỹ thuật (Technical Handover).<br>- Chuyển giao toàn quyền sở hữu các tài khoản quản lý hệ thống (Github, Supabase, Vercel) cho khách hàng và ký biên bản. | - Biên bản bàn giao & Nghiệm thu UAT có chữ ký của các bên (UAT Sign-off).<br>- Tài liệu Hướng dẫn sử dụng chi tiết (User Manual) định dạng Markdown/PDF. |

---

## 💻 PHÂN BỔ VAI TRÒ FRONTEND & BACKEND TRONG QUY TRÌNH

Để Developers (Frontend & Backend) dễ dàng nắm bắt vị trí công việc của mình trong vòng đời dự án, dưới đây là bảng phân rã vai trò:

| Giai đoạn | Nhiệm vụ của Frontend Developer (Kết hợp Google AI Studio) | Nhiệm vụ của Backend Developer (Kết hợp Antigravity / Claude) |
| :--- | :--- | :--- |
| **Bước 1: Khảo sát & Phân tích** | - Tham gia họp Kick-off.<br>- Đánh giá tính khả thi kỹ thuật (technical feasibility) của các yêu cầu chức năng. | - Tham gia họp Kick-off.<br>- Tham vấn giải pháp công nghệ backend, đánh giá khả năng tích hợp bên thứ ba. |
| **Bước 2: Thiết lập dự án & Repo GitHub** | - Nhận thông tin phân quyền cộng tác trên repo GitHub.<br>- Clone repo về máy cá nhân chuẩn bị môi trường code. | - Khởi tạo repository Git, thiết lập cấu trúc folder chính.<br>- Phối hợp với PM thiết lập Branching Protection Rules. |
| **Bước 3: Thiết kế UI/UX** | - Phối hợp với Designer kiểm tra tính khả thi của giao diện (ví dụ: các hiệu ứng chuyển động, cấu trúc lưới css).<br>- Thực hiện thiết kế UI/UX và phác thảo các tương tác màn hình trực tiếp trên **Google Stich**. | - Chưa cần tham gia sâu (tập trung chuẩn bị kiến trúc dữ liệu lý thuyết). |
| **Bước 4: Lập trình Frontend** | - **Chủ trì**: Sử dụng **Google AI Studio** để sinh mã Frontend (React/Vite) từ file thiết kế Google Stich.<br>- Cấu hình routing, states và giao diện tĩnh chạy thử được trên localhost. | - Phối hợp thảo luận để thống nhất cấu trúc API contract (các trường dữ liệu cần thiết cho giao diện). |
| **Bước 5: Thiết kế DB & Backend** | - Kết nối các API được cung cấp từ phía Backend vào giao diện Frontend tĩnh đã tạo ở Bước 4. | - **Chủ trì**: Thiết kế sơ đồ ERD, tạo database migrations trên Supabase.<br>- Cấu hình RLS bảo mật dữ liệu.<br>- Viết API Endpoints và Deno Edge Functions xử lý logic.<br>- Cấu hình GitHub Webhooks. |
| **Bước 6: Kiểm thử chất lượng** | - Khắc phục các lỗi giao diện (CSS, responsive, vỡ khung).<br>- Sử dụng Google AI Studio để tái cấu trúc mã nguồn Client-side bị phát hiện lỗi bởi QA/Tester. | - Sửa đổi các lỗi nghiệp vụ dữ liệu, lỗi logic API ở Server-side.<br>- Tối ưu câu lệnh SQL/Edge Functions thông qua Antigravity/Claude. |
| **Bước 7: Triển khai & Deploy** | - Triển khai Frontend lên môi trường Vercel/Cloudflare Pages.<br>- Cấu hình DNS trỏ domain cho Client. | - Đồng bộ cấu trúc database SQL Migrations lên Supabase Cloud Production.<br>- Setup CI/CD workflow trên GitHub Actions. |
| **Bước 8: Nghiệm thu & Bàn giao** | - Bàn giao mã nguồn Frontend.<br>- Hướng dẫn sử dụng giao diện người dùng cuối. | - Bàn giao tài khoản quản trị Supabase, Edge Functions.<br>- Viết tài liệu bàn giao kỹ thuật vận hành hệ thống. |

---

## ⚡ CƠ CHẾ VẬN HÀNH & TỰ ĐỘNG HÓA SỐ HÓA

### 1. Quản lý Tiến độ bằng Slider
PM cập nhật tiến độ của từng bước qua thanh trượt (%) hoặc nút tăng giảm nhanh (-10 / +10). Tiến độ tổng thể của dự án được tính tự động từ trung bình cộng của 8 bước và lưu realtime lên Supabase Cloud.

### 2. Tự động hóa qua GitHub Webhooks
Khi lập trình viên push code hoặc mở PR, webhook sẽ được gửi về Edge Function trên Supabase, xác thực mã băm HMAC-SHA256 và tự động cập nhật tiến độ nhiệm vụ tương ứng.

### 3. Phân bổ Nhân sự & Workload
PM gán động nhân sự (Anh, Nam, Thuận) vào dự án bằng Slide Panel. Biểu đồ Workload hiển thị trực quan tỷ lệ việc đã xong trên tổng số việc được giao của từng người. Lịch sử code (Commits & PRs) được theo dõi realtime theo dạng tab ở sidebar.`
    },
    {
      id: 'p2',
      title: 'Quy trình kiểm thử QA/QC',
      description: 'Quy trình kiểm tra chất lượng từ xây dựng kịch bản, chạy test thủ công đến tự động hóa và nghiệm thu.',
      category: 'Đảm bảo chất lượng',
      icon: CheckSquare,
      duration: '1 - 2 tuần',
      steps: [
        {
          id: 'qa-1',
          title: 'Lập kế hoạch kiểm thử (Test Plan)',
          role: 'QA Lead',
          duration: '2 - 3 ngày',
          tasks: [
            'Phân tích tài liệu SRS để xác định danh mục cần test',
            'Xây dựng tài liệu chiến lược kiểm thử (Test Strategy)',
            'Ước lượng thời gian và phân công nhân lực Tester'
          ]
        },
        {
          id: 'qa-2',
          title: 'Viết kịch bản kiểm thử (Test Cases)',
          role: 'QA Engineer',
          duration: '3 - 5 ngày',
          tasks: [
            'Viết kịch bản kiểm thử chức năng (Functional Test Cases)',
            'Viết kịch bản kiểm thử biên và kiểm thử lỗi (Negative Test Cases)',
            'Thiết kế dữ liệu đầu vào phục vụ kiểm thử (Test Data)'
          ]
        },
        {
          id: 'qa-3',
          title: 'Thực thi kiểm thử (Test Execution)',
          role: 'Tester',
          duration: '3 - 7 ngày',
          tasks: [
            'Thực hiện test thủ công từng tính năng theo kịch bản',
            'Báo cáo các lỗi phát sinh (Bugs) lên hệ thống quản lý lỗi',
            'Kiểm tra lại (Re-test) các lỗi đã được lập trình viên sửa đổi'
          ]
        }
      ],
      rawMarkdown: `# QUY TRÌNH KIỂM THỬ QA/QC SẢN PHẨM
1. Lập Test Plan -> 2. Viết Test Cases -> 3. Chạy Test & Fix lỗi -> 4. Nghiệm thu chất lượng.`
    },
    {
      id: 'p3',
      title: 'Quy trình bàn giao & Triển khai',
      description: 'Các bước chuẩn bị môi trường, đóng gói mã nguồn, nghiệm thu với khách hàng và bàn giao tài liệu kỹ thuật.',
      category: 'Vận hành & Hỗ trợ',
      icon: UserCheck,
      duration: '1 tuần',
      steps: [
        {
          id: 'deploy-1',
          title: 'Kiểm tra trước bàn giao (Pre-delivery Check)',
          role: 'Lead Dev / QC',
          duration: '1 - 2 ngày',
          tasks: [
            'Đảm bảo 100% bugs nghiêm trọng đã được khắc phục',
            'Kiểm tra hiệu năng tải trang và bảo mật cơ bản',
            'Đóng gói mã nguồn bản phát hành chính thức (Release Tag)'
          ]
        },
        {
          id: 'deploy-2',
          title: 'Họp nghiệm thu UAT với đối tác',
          role: 'PM / PO / Client',
          duration: '1 ngày',
          tasks: [
            'Trình diễn demo toàn bộ các tính năng theo hợp đồng',
            'Khách hàng kiểm thử thực tế trên thiết bị của họ',
            'Ký biên bản xác nhận nghiệm thu phần mềm'
          ]
        },
        {
          id: 'deploy-3',
          title: 'Bàn giao tài liệu & Chuyển giao',
          role: 'PM / Dev Team',
          duration: '2 - 3 ngày',
          tasks: [
            'Gửi tài liệu Hướng dẫn sử dụng phần mềm',
            'Chuyển giao tài khoản quản trị (Hosting, Supabase, Domain)',
            'Kích hoạt điều khoản hỗ trợ & bảo hành sau bàn giao'
          ]
        }
      ],
      rawMarkdown: `# QUY TRÌNH BÀN GIAO & TRIỂN KHAI SẢN PHẨM
1. Kiểm tra chất lượng cuối -> 2. Chạy thử nghiệm thu UAT -> 3. Ký biên bản bàn giao -> 4. Chuyển giao hạ tầng.`
    }
  ];

  const selectedProcess = processesData.find(p => p.id === selectedProcessId) || processesData[0];

  const toggleTask = (taskId: string) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex justify-between items-center bg-surface border border-bd rounded-2xl p-5">
        <div>
          <h2 className="text-[18px] font-black text-txt-primary uppercase tracking-tight flex items-center gap-2">
            <ClipboardList className="text-primary-500" />
            <span>Quy trình vận hành chuẩn</span>
          </h2>
          <p className="text-[12px] text-txt-muted mt-1">Các quy trình khung định hướng phát triển, vận hành và quản lý chất lượng dự án tại Trung tâm PTPM.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Process List */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-surface border border-bd rounded-2xl p-4 space-y-3">
            <h3 className="text-[13px] font-bold text-txt-muted uppercase tracking-wider">Danh mục quy trình</h3>
            <div className="space-y-2">
              {processesData.map((p) => {
                const isSelected = p.id === selectedProcessId;
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProcessId(p.id);
                      setActiveTab('visual');
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected 
                        ? 'bg-subtle/80 border-primary-500/40 text-txt-primary shadow-sm' 
                        : 'bg-app/40 border-bd/40 text-txt-secondary hover:border-bd/80 hover:bg-subtle/30'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-primary-500/10 text-primary-500' : 'bg-bd/55 text-txt-muted'}`}>
                      <Icon size={18} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-primary-400 tracking-wider block">{p.category}</span>
                      <h4 className="text-[13px] font-bold leading-snug">{p.title}</h4>
                      <p className="text-[11px] text-txt-muted line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Process Detail Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface border border-bd rounded-2xl overflow-hidden flex flex-col h-full">
            {/* Header detail */}
            <div className="p-5 border-b border-bd bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-[16px] font-black text-txt-primary">{selectedProcess.title}</h3>
                <div className="flex items-center gap-4 text-[12px] text-txt-muted mt-1 font-semibold">
                  <span className="flex items-center gap-1.5 text-primary-400">
                    <Layers size={13} />
                    <span>{selectedProcess.category}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>Thời gian đề xuất: {selectedProcess.duration}</span>
                  </span>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex rounded-xl bg-app p-1 border border-bd shrink-0">
                <button
                  onClick={() => setActiveTab('visual')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${
                    activeTab === 'visual'
                      ? 'bg-surface text-txt-primary shadow-sm'
                      : 'text-txt-muted hover:text-txt-primary'
                  }`}
                >
                  <Eye size={14} />
                  <span>Trực quan hóa</span>
                </button>
                <button
                  onClick={() => setActiveTab('markdown')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${
                    activeTab === 'markdown'
                      ? 'bg-surface text-txt-primary shadow-sm'
                      : 'text-txt-muted hover:text-txt-primary'
                  }`}
                >
                  <Code size={14} />
                  <span>Mã Markdown</span>
                </button>
              </div>
            </div>

            {/* Content view */}
            <div className="p-6 flex-1 bg-surface">
              {activeTab === 'visual' ? (
                /* Interactive timeline UI */
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-[2px] before:bg-bd/50">
                  {selectedProcess.steps.map((step, idx) => (
                    <div key={step.id} className="relative pl-10 flex flex-col gap-3 group">
                      {/* Step Circle Pin */}
                      <div className="absolute left-0 top-0.5 w-[36px] h-[36px] rounded-xl bg-app border border-bd flex items-center justify-center font-bold text-[13px] text-primary-500 group-hover:border-primary-500/50 transition-colors">
                        {idx + 1}
                      </div>

                      {/* Step Title & Meta */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-bd/30 pb-2">
                        <div>
                          <h4 className="text-[14px] font-black text-txt-primary">{step.title}</h4>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary-400 mt-0.5">
                            <User size={10} />
                            <span>Chủ trì: {step.role}</span>
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-txt-muted flex items-center gap-1 shrink-0">
                          <Clock size={11} />
                          <span>{step.duration}</span>
                        </span>
                      </div>

                      {/* Step Subtasks Checkbox list */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        {step.tasks.map((task, tIdx) => {
                          const taskId = `${step.id}-${tIdx}`;
                          const isChecked = !!checkedTasks[taskId];
                          return (
                            <button
                              key={taskId}
                              onClick={() => toggleTask(taskId)}
                              className={`flex items-start text-left gap-2.5 p-2.5 rounded-xl border transition-all ${
                                isChecked 
                                  ? 'bg-success-500/5 border-success-500/20 text-txt-secondary' 
                                  : 'bg-app/20 border-bd/20 text-txt-secondary hover:border-bd/60 hover:bg-app/40'
                              }`}
                            >
                              <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                isChecked 
                                  ? 'bg-success-500 border-success-500 text-white' 
                                  : 'border-bd bg-surface'
                              }`}>
                                {isChecked && <svg className="w-2.5 h-2.5 stroke-2 fill-none stroke-current" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>}
                              </div>
                              <span className={`text-[12px] font-semibold leading-relaxed ${isChecked ? 'line-through text-txt-muted' : ''}`}>
                                {task}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Raw Markdown View */
                <div className="space-y-4">
                  <p className="text-[12px] text-txt-muted font-medium">Bạn có thể copy mã nguồn Markdown này để lưu trữ hoặc đưa vào các tài liệu liên quan.</p>
                  <pre className="w-full bg-app border border-bd rounded-2xl p-4 overflow-x-auto text-[12px] text-txt-secondary font-mono leading-relaxed max-h-[500px]">
                    <code>{selectedProcess.rawMarkdown}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
