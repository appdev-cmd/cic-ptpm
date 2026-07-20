-- Drop existing tables (if any) in correct order
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS sprints CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- 1. Create Customers Table
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Projects Table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  repo TEXT UNIQUE NOT NULL,
  github_repo TEXT,
  github_branch TEXT DEFAULT 'main',
  github_webhook_secret TEXT,
  vercel_url TEXT,
  supabase_url TEXT,
  supabase_anon_key TEXT,
  customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
  goal TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Employees Table
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  skills TEXT[],
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Sprints Table
CREATE TABLE sprints (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'planning', -- 'active', 'planning', 'completed'
  start_date TEXT,
  end_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Tasks Table
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  sprint_id TEXT REFERENCES sprints(id) ON DELETE SET NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'task', -- 'story', 'task', 'bug'
  priority TEXT DEFAULT 'medium', -- 'high', 'medium', 'low'
  story_points INTEGER DEFAULT 1,
  status TEXT DEFAULT 'todo', -- 'todo', 'inprogress', 'review', 'done'
  assignee_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- SEED DATA (Dữ liệu mẫu ban đầu)
-- =========================================================================

-- Insert Customers
INSERT INTO customers (id, name, code, email, phone, address) VALUES
('c1', 'Viện Khoa học Công nghệ Xây dựng (IBST)', 'IBST', 'contact@ibst.vn', '024-38361103', '81 Trần Cung, Nghĩa Tân, Cầu Giấy, Hà Nội'),
('c2', 'Tập đoàn Xây dựng CIC', 'CIC-GROUP', 'info@cic.com.vn', '024-39746789', '37 Lê Đại Hành, Hai Bà Trưng, Hà Nội'),
('c3', 'Tổng công ty Đầu tư Phát triển Nhà và Đô thị (HUD)', 'HUD', 'office@hud.com.vn', '024-37833666', 'Tòa nhà HUDTower, 37 Lê Văn Lương, Nhân Chính, Thanh Xuân, Hà Nội'),
('c4', 'Công ty Cổ phần Đồ họa Đô thị SoDoBo', 'SODOBO', 'contact@sodobo.vn', '024-66889900', 'Tầng 12, Tòa nhà Sông Đà, Phạm Hùng, Mỹ Đình, Nam Từ Liêm, Hà Nội'),
('c5', 'Sở Tài nguyên và Môi trường', 'DONRE', 'so_tnmt@hanoi.gov.vn', '024-37345678', '18 Huỳnh Thúc Kháng, Đống Đa, Hà Nội'),
('c6', 'Tổng công ty Xi măng Việt Nam (VICEM)', 'VICEM', 'contact@vicem.vn', '024-38512423', '228 ngõ 323 Lương Thế Vinh, Thanh Xuân Bắc, Thanh Xuân, Hà Nội'),
('c7', 'Công ty Cổ phần Đầu tư Địa ốc No Va', 'NOVALAND', 'info@novaland.com.vn', '1900 636666', '65 Nguyễn Du, Bến Nghé, Quận 1, TP. Hồ Chí Minh');

-- Insert Projects
INSERT INTO projects (id, name, repo, github_repo, github_branch, github_webhook_secret, vercel_url, supabase_url, supabase_anon_key, customer_id, goal) VALUES
('1', 'Hệ thống Quản lý Dự án (PTPM)', 'cic-ptpm', 'appdev-cmd/cic-ptpm', 'main', 'secret_ptpm', 'https://cic-ptpm.vercel.app', 'https://bpmatlkrotoftowpsbcz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbWF0bGtyb3RvZnRvd3BzYmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODkyNDMsImV4cCI6MjA5OTk2NTI0M30.4oVzni6kQdjG7XitQLNA2qjPRTkjVTs1s9PqhNeiqw8', 'c2', 'Công cụ Scrum Board tích hợp Git Webhook giúp tự động cập nhật trạng thái công việc từ commits/PRs.'),
('2', 'Hệ thống Quản trị Doanh nghiệp (ERP)', 'cic-erp', 'appdev-cmd/cic-erp', 'main', 'secret_erp', 'https://cic-erp.vercel.app', '', '', 'c2', 'Quản lý nhân sự, chấm công, tính lương, và quản lý tài chính doanh nghiệp tập trung.'),
('3', 'Hệ thống Giám sát & Quản lý (IBST)', 'cic-ibst', 'appdev-cmd/cic-ibst', 'main', 'secret_ibst', '', '', '', 'c1', 'Giám sát tiến độ thí nghiệm vật liệu xây dựng và tự động xuất báo cáo kiểm định chất lượng.'),
('4', 'Cổng thông tin & Website (WEB)', 'cic-web', 'appdev-cmd/cic-web', 'main', 'secret_web', 'https://cic-web.vercel.app', '', '', 'c2', 'Xây dựng cổng thông tin chính thức của công ty giới thiệu các sản phẩm và dịch vụ công nghệ.'),
('5', 'Môi trường dữ liệu chung (CDE)', 'cic-cde', 'appdev-cmd/cic-cde', 'main', 'secret_cde', 'https://cic-cde.vercel.app', 'https://cic-cde.supabase.co', 'anon_key_cde_123', 'c5', 'Hệ thống lưu trữ, chia sẻ và phê duyệt bản vẽ kỹ thuật trực tuyến (Common Data Environment).'),
('6', 'Trợ lý ảo AI Chatbox', 'cic-ai-chatbox', 'appdev-cmd/cic-ai-chatbox', 'main', 'secret_chatbox', '', '', '', 'c2', 'Hỗ trợ khách hàng tự động, trả lời câu hỏi thường gặp về sản phẩm và thủ tục dịch vụ.'),
('7', 'Nền tảng Nova Land (NOVA)', 'cic-nova', 'appdev-cmd/cic-nova', 'main', 'secret_nova', '', '', '', 'c2', 'Quản lý giỏ hàng bất động sản, phân lô đất và theo dõi tiến độ thanh toán của khách hàng.'),
('8', 'Hệ thống Quản lý Xi măng (VICEM)', 'cic-vicem', 'appdev-cmd/cic-vicem', 'main', 'secret_vicem', 'https://cic-vicem.vercel.app', '', '', 'c6', 'Quản lý chuỗi cung ứng, theo dõi lộ trình xe vận chuyển và quản lý kho bãi xi măng.'),
('9', 'Quản lý Đất đai & Hạ tầng (GIS)', 'qlda-ddht-ht-selfhost', 'appdev-cmd/qlda-ddht-ht-selfhost', 'main', 'secret_gis', '', '', '', 'c5', 'Bản đồ số hóa quản lý hạ tầng kỹ thuật, đất đai, quy hoạch đô thị.'),
('10', 'Nền tảng Trí tuệ Nhân tạo (AI)', 'cic-ai', 'appdev-cmd/cic-ai', 'main', 'secret_ai', '', '', '', 'c2', 'Xây dựng các mô hình AI nhận diện vết nứt bê tông, phân tích hình ảnh công trình và dự báo độ sụt.');

-- Insert Employees
INSERT INTO employees (id, name, role, email, phone, skills, avatar) VALUES
('e1', 'Nguyễn Quốc Anh', 'Scrum Master / PM', 'anh.nq@cic.com.vn', '098-1122334', ARRAY['Scrum', 'Agile', 'Jira', 'Management'], 'QA'),
('e2', 'Trần Minh Đức', 'Lead Developer', 'duc.tm@cic.com.vn', '097-4455667', ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL'], 'MĐ'),
('e3', 'Lê Thanh Hải', 'Frontend Developer', 'hai.lt@cic.com.vn', '096-8899001', ARRAY['React', 'Tailwind CSS', 'JavaScript', 'CSS'], 'TH'),
('e4', 'Phạm Hồng Nhung', 'UI/UX Designer', 'nhung.ph@cic.com.vn', '095-2233445', ARRAY['Figma', 'Prototyping', 'Design System'], 'HN'),
('e5', 'Đỗ Hoàng Long', 'Backend Developer', 'long.dh@cic.com.vn', '094-6677889', ARRAY['Python', 'FastAPI', 'Supabase', 'Docker'], 'HL'),
('e6', 'Nguyễn Thị Hương', 'Tester / QA', 'huong.nt@cic.com.vn', '093-1122445', ARRAY['Manual Testing', 'API Testing', 'Automation'], 'TH');

-- Insert Sprints
INSERT INTO sprints (id, project_id, name, status, start_date, end_date) VALUES
('sprint-1', '1', 'Sprint 1 - Kiến trúc cốt lõi', 'active', '2026-07-10', '2026-07-24');

-- Insert Tasks
INSERT INTO tasks (id, sprint_id, project_id, title, type, priority, story_points, status, assignee_id) VALUES
('TASK-1', 'sprint-1', '1', 'Thiết kế cơ cấu dữ liệu và RLS của Supabase', 'story', 'high', 5, 'todo', 'e2'),
('TASK-2', 'sprint-1', '1', 'Viết Supabase Edge Function đón nhận Webhook', 'task', 'high', 8, 'inprogress', 'e5'),
('TASK-3', 'sprint-1', '1', 'Tích hợp kéo thả dnd-kit trên bảng Kanban', 'story', 'medium', 5, 'todo', 'e3'),
('TASK-4', 'sprint-1', '1', 'Xây dựng trang Dashboard và biểu đồ Burndown Chart', 'task', 'medium', 3, 'done', 'e3'),
('BUG-1', 'sprint-1', '1', 'Lỗi parse webhook đối với PR merge không đúng task ID', 'bug', 'high', 3, 'review', 'e1');
