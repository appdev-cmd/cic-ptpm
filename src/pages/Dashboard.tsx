import { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers,
  Building2,
  Target,
  Code2,
  CalendarRange,
  RefreshCw,
  GitBranch,
  Edit2,
  Save,
  X,
  ExternalLink,
  Workflow,
  UserPlus,
  UserMinus
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  repo: string;
  githubRepo: string;
  githubBranch: string;
  githubWebhookSecret: string;
  vercelUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  customerId: string;
  goal?: string; // custom goal/description
  currentStep?: number;
  stepProgress?: Record<string, number>;
  memberIds?: string[];
}

interface Customer {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  code: string;
  email: string;
  phone: string;
  status: string;
}

interface ProjectExtraData {
  client: string;
  goal: string;
  progress: number;
  status: 'Đang triển khai' | 'Nghiệm thu' | 'Hoàn thành' | 'Lập kế hoạch';
  defaultTechStack: string[];
  kpis: {
    sprint: string;
    sprintDetail: string;
    spCompleted: string;
    spDetail: string;
    tasksRemaining: string;
    tasksDetail: string;
    bugsRemaining: string;
    bugsDetail: string;
  };
  burndownData: { day: string; Ideal: number; Actual: number | null }[];
}

const PROJECT_EXTRA_DATA: Record<string, ProjectExtraData> = {
  'cic-ptpm': {
    client: 'Nội bộ (CIC)',
    goal: 'Công cụ Scrum Board tích hợp Git Webhook giúp tự động cập nhật trạng thái công việc từ commits/PRs.',
    progress: 68,
    status: 'Đang triển khai',
    defaultTechStack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'dnd-kit', 'Supabase'],
    kpis: {
      sprint: 'Sprint 1',
      sprintDetail: 'Còn lại 3 ngày',
      spCompleted: '33 / 48 SP',
      spDetail: 'Tỉ lệ đạt: 68.7%',
      tasksRemaining: '8 Nhiệm vụ',
      tasksDetail: '5 việc đang thực hiện',
      bugsRemaining: '3 Lỗi',
      bugsDetail: '2 lỗi nghiêm trọng'
    },
    burndownData: [
      { day: 'Ngày 1', Ideal: 48, Actual: 48 },
      { day: 'Ngày 2', Ideal: 42, Actual: 48 },
      { day: 'Ngày 3', Ideal: 36, Actual: 40 },
      { day: 'Ngày 4', Ideal: 30, Actual: 38 },
      { day: 'Ngày 5', Ideal: 24, Actual: 28 },
      { day: 'Ngày 6', Ideal: 18, Actual: 25 },
      { day: 'Ngày 7', Ideal: 12, Actual: 15 },
      { day: 'Ngày 8', Ideal: 6, Actual: null },
      { day: 'Ngày 9', Ideal: 0, Actual: null },
    ]
  },
  'cic-erp': {
    client: 'Tập đoàn Xây dựng CIC',
    goal: 'Quản lý nhân sự, chấm công, tính lương, và quản lý tài chính doanh nghiệp tập trung.',
    progress: 45,
    status: 'Đang triển khai',
    defaultTechStack: ['React', 'Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Docker'],
    kpis: {
      sprint: 'Sprint 2',
      sprintDetail: 'Còn lại 8 ngày',
      spCompleted: '20 / 65 SP',
      spDetail: 'Tỉ lệ đạt: 30.7%',
      tasksRemaining: '18 Nhiệm vụ',
      tasksDetail: '10 việc đang thực hiện',
      bugsRemaining: '12 Lỗi',
      bugsDetail: '4 lỗi nghiêm trọng'
    },
    burndownData: [
      { day: 'Ngày 1', Ideal: 65, Actual: 65 },
      { day: 'Ngày 2', Ideal: 58, Actual: 65 },
      { day: 'Ngày 3', Ideal: 52, Actual: 60 },
      { day: 'Ngày 4', Ideal: 45, Actual: 55 },
      { day: 'Ngày 5', Ideal: 39, Actual: 48 },
      { day: 'Ngày 6', Ideal: 32, Actual: 45 },
      { day: 'Ngày 7', Ideal: 26, Actual: null },
      { day: 'Ngày 8', Ideal: 19, Actual: null },
      { day: 'Ngày 9', Ideal: 13, Actual: null },
      { day: 'Ngày 10', Ideal: 0, Actual: null },
    ]
  },
  'cic-ibst': {
    client: 'Viện Khoa học Công nghệ Xây dựng (IBST)',
    goal: 'Giám sát tiến độ thí nghiệm vật liệu xây dựng và tự động xuất báo cáo kiểm định chất lượng.',
    progress: 82,
    status: 'Đang triển khai',
    defaultTechStack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
    kpis: {
      sprint: 'Sprint 3',
      sprintDetail: 'Còn lại 2 ngày',
      spCompleted: '40 / 45 SP',
      spDetail: 'Tỉ lệ đạt: 88.8%',
      tasksRemaining: '4 Nhiệm vụ',
      tasksDetail: '2 việc đang thực hiện',
      bugsRemaining: '1 Lỗi',
      bugsDetail: '0 lỗi nghiêm trọng'
    },
    burndownData: [
      { day: 'Ngày 1', Ideal: 45, Actual: 45 },
      { day: 'Ngày 2', Ideal: 38, Actual: 45 },
      { day: 'Ngày 3', Ideal: 31, Actual: 35 },
      { day: 'Ngày 4', Ideal: 24, Actual: 28 },
      { day: 'Ngày 5', Ideal: 17, Actual: 20 },
      { day: 'Ngày 6', Ideal: 10, Actual: 12 },
      { day: 'Ngày 7', Ideal: 3, Actual: 5 },
      { day: 'Ngày 8', Ideal: 0, Actual: null },
    ]
  },
  'cic-web': {
    client: 'Công ty Cổ phần CIC',
    goal: 'Xây dựng cổng thông tin chính thức của công ty giới thiệu các sản phẩm và dịch vụ công nghệ.',
    progress: 95,
    status: 'Nghiệm thu',
    defaultTechStack: ['React', 'Next.js', 'Tailwind CSS', 'Strapi CMS', 'Vercel'],
    kpis: {
      sprint: 'Sprint 2',
      sprintDetail: 'Đã đóng Sprint',
      spCompleted: '28 / 28 SP',
      spDetail: 'Tỉ lệ đạt: 100%',
      tasksRemaining: '0 Nhiệm vụ',
      tasksDetail: 'Tất cả đã hoàn thành',
      bugsRemaining: '0 Lỗi',
      bugsDetail: 'Không có lỗi'
    },
    burndownData: [
      { day: 'Ngày 1', Ideal: 28, Actual: 28 },
      { day: 'Ngày 2', Ideal: 21, Actual: 20 },
      { day: 'Ngày 3', Ideal: 14, Actual: 10 },
      { day: 'Ngày 4', Ideal: 7, Actual: 5 },
      { day: 'Ngày 5', Ideal: 0, Actual: 0 },
    ]
  },
  'cic-cde': {
    client: 'Ban Quản lý Dự án Đầu tư Xây dựng',
    goal: 'Hệ thống lưu trữ, chia sẻ và phê duyệt bản vẽ kỹ thuật trực tuyến (Common Data Environment).',
    progress: 30,
    status: 'Đang triển khai',
    defaultTechStack: ['React', 'TypeScript', 'Node.js', 'Amazon S3', 'WebViewer'],
    kpis: {
      sprint: 'Sprint 1',
      sprintDetail: 'Còn lại 12 ngày',
      spCompleted: '12 / 80 SP',
      spDetail: 'Tỉ lệ đạt: 15%',
      tasksRemaining: '32 Nhiệm vụ',
      tasksDetail: '8 việc đang thực hiện',
      bugsRemaining: '8 Lỗi',
      bugsDetail: '3 lỗi nghiêm trọng'
    },
    burndownData: [
      { day: 'Ngày 1', Ideal: 80, Actual: 80 },
      { day: 'Ngày 2', Ideal: 72, Actual: 80 },
      { day: 'Ngày 3', Ideal: 64, Actual: 78 },
      { day: 'Ngày 4', Ideal: 56, Actual: 75 },
      { day: 'Ngày 5', Ideal: 48, Actual: 70 },
      { day: 'Ngày 6', Ideal: 40, Actual: null },
    ]
  },
  'cic-ai-chatbox': {
    client: 'Bộ phận Chăm sóc khách hàng CIC',
    goal: 'Hỗ trợ khách hàng tự động, trả lời câu hỏi thường gặp về sản phẩm và thủ tục dịch vụ.',
    progress: 60,
    status: 'Đang triển khai',
    defaultTechStack: ['React', 'JavaScript', 'Node.js', 'OpenAI API', 'Supabase'],
    kpis: {
      sprint: 'Sprint 2',
      sprintDetail: 'Còn lại 4 ngày',
      spCompleted: '18 / 30 SP',
      spDetail: 'Tỉ lệ đạt: 60%',
      tasksRemaining: '6 Nhiệm vụ',
      tasksDetail: '3 việc đang thực hiện',
      bugsRemaining: '2 Lỗi',
      bugsDetail: '1 lỗi nghiêm trọng'
    },
    burndownData: [
      { day: 'Ngày 1', Ideal: 30, Actual: 30 },
      { day: 'Ngày 2', Ideal: 25, Actual: 30 },
      { day: 'Ngày 3', Ideal: 20, Actual: 22 },
      { day: 'Ngày 4', Ideal: 15, Actual: 18 },
      { day: 'Ngày 5', Ideal: 10, Actual: 12 },
      { day: 'Ngày 6', Ideal: 5, Actual: null },
      { day: 'Ngày 7', Ideal: 0, Actual: null },
    ]
  },
  'cic-nova': {
    client: 'Công ty Nova Land',
    goal: 'Quản lý giỏ hàng bất động sản, phân lô đất và theo dõi tiến độ thanh toán của khách hàng.',
    progress: 50,
    status: 'Đang triển khai',
    defaultTechStack: ['React', 'JavaScript', 'Python', 'FastAPI', 'PostgreSQL'],
    kpis: {
      sprint: 'Sprint 2',
      sprintDetail: 'Còn lại 6 ngày',
      spCompleted: '15 / 40 SP',
      spDetail: 'Tỉ lệ đạt: 37.5%',
      tasksRemaining: '14 Nhiệm vụ',
      tasksDetail: '6 việc đang thực hiện',
      bugsRemaining: '5 Lỗi',
      bugsDetail: '2 lỗi nghiêm trọng'
    },
    burndownData: [
      { day: 'Ngày 1', Ideal: 40, Actual: 40 },
      { day: 'Ngày 2', Ideal: 35, Actual: 40 },
      { day: 'Ngày 3', Ideal: 30, Actual: 35 },
      { day: 'Ngày 4', Ideal: 25, Actual: 30 },
      { day: 'Ngày 5', Ideal: 20, Actual: 25 },
      { day: 'Ngày 6', Ideal: 15, Actual: null },
    ]
  },
  'cic-vicem': {
    client: 'Tổng công ty Xi măng Việt Nam (VICEM)',
    goal: 'Quản lý chuỗi cung ứng, theo dõi lộ trình xe vận chuyển và quản lý kho bãi xi măng.',
    progress: 75,
    status: 'Đang triển khai',
    defaultTechStack: ['React', 'Python', 'Django', 'Tailwind CSS', 'PostgreSQL'],
    kpis: {
      sprint: 'Sprint 3',
      sprintDetail: 'Còn lại 5 ngày',
      spCompleted: '30 / 50 SP',
      spDetail: 'Tỉ lệ đạt: 60%',
      tasksRemaining: '10 Nhiệm vụ',
      tasksDetail: '4 việc đang thực hiện',
      bugsRemaining: '4 Lỗi',
      bugsDetail: '1 lỗi nghiêm trọng'
    },
    burndownData: [
      { day: 'Ngày 1', Ideal: 50, Actual: 50 },
      { day: 'Ngày 2', Ideal: 43, Actual: 50 },
      { day: 'Ngày 3', Ideal: 36, Actual: 42 },
      { day: 'Ngày 4', Ideal: 29, Actual: 35 },
      { day: 'Ngày 5', Ideal: 22, Actual: 28 },
      { day: 'Ngày 6', Ideal: 15, Actual: 20 },
      { day: 'Ngày 7', Ideal: 8, Actual: null },
    ]
  },
  'qlda-ddht-ht-selfhost': {
    client: 'Sở Tài nguyên và Môi trường',
    goal: 'Bản đồ số hóa quản lý hạ tầng kỹ thuật, đất đai, quy hoạch đô thị.',
    progress: 40,
    status: 'Đang triển khai',
    defaultTechStack: ['React', 'OpenLayers', 'GIS', 'Node.js', 'PostgreSQL', 'PostGIS'],
    kpis: {
      sprint: 'Sprint 2',
      sprintDetail: 'Còn lại 10 ngày',
      spCompleted: '15 / 60 SP',
      spDetail: 'Tỉ lệ đạt: 25%',
      tasksRemaining: '22 Nhiệm vụ',
      tasksDetail: '8 việc đang thực hiện',
      bugsRemaining: '7 Lỗi',
      bugsDetail: '3 lỗi nghiêm trọng'
    },
    burndownData: [
      { day: 'Ngày 1', Ideal: 60, Actual: 60 },
      { day: 'Ngày 2', Ideal: 54, Actual: 60 },
      { day: 'Ngày 3', Ideal: 48, Actual: 55 },
      { day: 'Ngày 4', Ideal: 42, Actual: 50 },
      { day: 'Ngày 5', Ideal: 36, Actual: 45 },
      { day: 'Ngày 6', Ideal: 30, Actual: null },
    ]
  },
  'cic-ai': {
    client: 'Phòng R&D CIC',
    goal: 'Xây dựng các mô hình AI nhận diện vết nứt bê tông, phân tích hình ảnh công trình và dự báo độ sụt.',
    progress: 55,
    status: 'Đang triển khai',
    defaultTechStack: ['React', 'Python', 'PyTorch', 'FastAPI', 'TypeScript'],
    kpis: {
      sprint: 'Sprint 2',
      sprintDetail: 'Còn lại 7 ngày',
      spCompleted: '25 / 55 SP',
      spDetail: 'Tỉ lệ đạt: 45.4%',
      tasksRemaining: '12 Nhiệm vụ',
      tasksDetail: '5 việc đang thực hiện',
      bugsRemaining: '6 Lỗi',
      bugsDetail: '2 lỗi nghiêm trọng'
    },
    burndownData: [
      { day: 'Ngày 1', Ideal: 55, Actual: 55 },
      { day: 'Ngày 2', Ideal: 49, Actual: 55 },
      { day: 'Ngày 3', Ideal: 43, Actual: 48 },
      { day: 'Ngày 4', Ideal: 37, Actual: 42 },
      { day: 'Ngày 5', Ideal: 31, Actual: 35 },
      { day: 'Ngày 6', Ideal: 25, Actual: 30 },
      { day: 'Ngày 7', Ideal: 19, Actual: null },
    ]
  }
};

interface GitHubRepoData {
  description: string | null;
  language: string | null;
  topics: string[];
  open_issues_count: number;
  created_at: string;
  updated_at: string;
}

interface CommitData {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

interface PullRequestData {
  number: number;
  title: string;
  state: string;
  author: string;
  date: string;
  url: string;
  merged: boolean;
}

const getTechTagColor = (tech: string) => {
  const t = tech.toLowerCase();
  if (t === 'react') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  if (t === 'typescript') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  if (t === 'javascript') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  if (t === 'supabase') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (t === 'postgresql') return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  if (t === 'tailwind css' || t === 'tailwindcss') return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
  if (t === 'python') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  if (t === 'pytorch') return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  if (t === 'fastapi') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (t === 'django') return 'bg-emerald-700/10 text-emerald-400 border-emerald-700/20';
  if (t === 'three.js' || t === 'threejs') return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  if (t === 'node.js' || t === 'nodejs') return 'bg-green-500/10 text-green-400 border-green-500/20';
  if (t === 'next.js' || t === 'nextjs') return 'bg-slate-300/10 text-slate-100 border-slate-300/20';
  return 'bg-bd/50 text-txt-secondary border border-bd/80';
};

const getStatusBadgeColor = (status: ProjectExtraData['status']) => {
  switch (status) {
    case 'Hoàn thành': return 'bg-success-500/10 text-success-400 border-success-500/20';
    case 'Nghiệm thu': return 'bg-info-500/10 text-info-400 border-info-500/20';
    case 'Lập kế hoạch': return 'bg-bd text-txt-muted border-bd-subtle';
    default: return 'bg-warning-500/10 text-warning-400 border-warning-500/20';
  }
};

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const fallbackCreateDates: Record<string, string> = {
  'cic-ptpm': '2026-05-15T08:30:00Z',
  'cic-erp': '2026-04-10T08:30:00Z',
  'cic-ibst': '2026-06-01T08:30:00Z',
  'cic-web': '2026-06-20T08:30:00Z',
  'cic-cde': '2026-05-28T08:30:00Z',
  'cic-ai-chatbox': '2026-06-12T08:30:00Z',
  'cic-nova': '2026-05-02T08:30:00Z',
  'cic-vicem': '2026-05-20T08:30:00Z',
  'qlda-ddht-ht-selfhost': '2026-04-18T08:30:00Z',
  'cic-ai': '2026-05-10T08:30:00Z'
};

const calculateDaysSince = (dateStr: string) => {
  const createdDate = new Date(dateStr);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const PROCESS_STEPS = [
  { step: 1, name: 'Khảo sát', role: 'PO / PM', tasks: ['Họp kick-off', 'Khảo sát nghiệp vụ', 'Lập đặc tả SRS', 'Thống nhất phạm vi'] },
  { step: 2, name: 'Thiết kế UI', role: 'UI/UX Designer', tasks: ['Vẽ Wireframe', 'Mockup Figma', 'Prototype tương tác', 'Design System'] },
  { step: 3, name: 'Database', role: 'Lead Dev', tasks: ['Vẽ sơ đồ ERD', 'Cấu hình RLS', 'SQL Migrations'] },
  { step: 4, name: 'Lập trình', role: 'Developers', tasks: ['Boilerplate Git', 'Frontend UI', 'Backend APIs', 'GitHub Webhooks'] },
  { step: 5, name: 'Kiểm thử', role: 'Tester / QA', tasks: ['Unit Tests', 'Manual Testing', 'Ghi nhận Bugs', 'Fix & Re-test'] },
  { step: 6, name: 'Deploy', role: 'DevOps / Lead', tasks: ['Hosting Deploy', 'Domain & SSL', 'CI/CD pipeline'] },
  { step: 7, name: 'Nghiệm thu', role: 'PM / Client', tasks: ['Nghiệm thu UAT', 'Tài liệu hướng dẫn', 'Bàn giao hạ tầng'] }
];

export default function Dashboard() {
  const { 
    projects, 
    setProjects, 
    customers,
    employees
  } = useOutletContext<{ 
    projects: Project[]; 
    setProjects: (projects: Project[]) => void; 
    customers: Customer[];
    employees: Employee[];
  }>();
  
  const { projectId } = useParams<{ projectId: string }>();
  const selectedProject = projects.find((p: Project) => p.id === projectId) || projects[0];
  
  const [gitHubData, setGitHubData] = useState<GitHubRepoData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequestData[]>([]);
  const [githubActiveTab, setGithubActiveTab] = useState<'commits' | 'prs'>('commits');

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editGoal, setEditGoal] = useState('');
  const [editVercelUrl, setEditVercelUrl] = useState('');
  const [editCustomerId, setEditCustomerId] = useState('');
  
  useEffect(() => {
    if (!selectedProject?.repo) return;
    
    setIsLoading(true);
    setGitHubData(null);
    
    fetch(`https://api.github.com/repos/${selectedProject.githubRepo || `appdev-cmd/${selectedProject.repo}`}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status}`);
        }
        return res.json();
      })
      .then((data: any) => {
        setGitHubData({
          description: data.description,
          language: data.language,
          topics: data.topics || [],
          open_issues_count: data.open_issues_count,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.warn("Using offline/fallback project metadata:", err.message);
        setIsLoading(false);
      });

    // Fetch recent commits
    fetch(`https://api.github.com/repos/${selectedProject.githubRepo || `appdev-cmd/${selectedProject.repo}`}/commits?per_page=5`)
      .then(res => {
        if (!res.ok) throw new Error("Rate limited or not found");
        return res.json();
      })
      .then((data: any) => {
        const mappedCommits = data.map((c: any) => ({
          sha: c.sha.substring(0, 7),
          message: c.commit.message,
          author: c.commit.author.name,
          date: new Date(c.commit.author.date).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
          url: c.html_url
        }));
        setCommits(mappedCommits);
      })
      .catch(() => {
        // Fallback mock commits with actual names
        setCommits([
          { sha: '8c9a301', message: 'fix: TASK-1 sửa cấu trúc bảng và RLS của Supabase', author: 'Phan Thanh Nam', date: '10:15 20/07/2026', url: '#' },
          { sha: 'a36acb7', message: 'feat: TASK-2 thêm Edge Function đón nhận Webhook', author: 'Trần Đình Thuận', date: '08:45 20/07/2026', url: '#' },
          { sha: 'fLSBSXC', message: 'docs: cập nhật quy trình phát triển dự án web app', author: 'Nguyễn Quốc Anh', date: '16:30 19/07/2026', url: '#' }
        ]);
      });

    // Fetch recent pull requests
    fetch(`https://api.github.com/repos/${selectedProject.githubRepo || `appdev-cmd/${selectedProject.repo}`}/pulls?state=all&per_page=5`)
      .then(res => {
        if (!res.ok) throw new Error("Rate limited or not found");
        return res.json();
      })
      .then((data: any) => {
        const mappedPRs = data.map((pr: any) => ({
          number: pr.number,
          title: pr.title,
          state: pr.state,
          author: pr.user.login,
          date: new Date(pr.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
          url: pr.html_url,
          merged: !!pr.merged_at
        }));
        setPullRequests(mappedPRs);
      })
      .catch(() => {
        // Fallback mock PRs
        setPullRequests([
          { number: 12, title: 'feat: TASK-2 hoàn thành tích hợp webhook đồng bộ bảng kanban', state: 'closed', author: 'ThuanTrD', date: '09:00 20/07/2026', url: '#', merged: true },
          { number: 11, title: 'fix: TASK-1 sửa lỗi tương phản màu tooltip trong dashboard', state: 'closed', author: 'ptnam', date: '11:20 19/07/2026', url: '#', merged: true },
          { number: 13, title: 'WIP: TASK-3 bổ sung nút thêm bớt thành viên dự án', state: 'open', author: 'ptnam', date: '14:30 20/07/2026', url: '#', merged: false }
        ]);
      });

    // Reset Edit states when selectedProject changes
    setEditName(selectedProject.name);
    setEditGoal(selectedProject.goal || PROJECT_EXTRA_DATA[selectedProject.repo]?.goal || '');
    setEditVercelUrl(selectedProject.vercelUrl || '');
    setEditCustomerId(selectedProject.customerId || '');
    setIsEditing(false);
  }, [selectedProject]);

  const extra = PROJECT_EXTRA_DATA[selectedProject.repo] || PROJECT_EXTRA_DATA['cic-ptpm'];
  
  const currentProjectObj = projects.find(p => p.id === selectedProject.id) || selectedProject;
  const projectGoal = currentProjectObj.goal || gitHubData?.description || extra.goal;
  const vercelUrl = currentProjectObj.vercelUrl || '';
  const currentStep = currentProjectObj.currentStep || 4;

  const progressMap = currentProjectObj.stepProgress || { "1": 100, "2": 100, "3": 100, "4": 0, "5": 0, "6": 0, "7": 0 };
  const overallProgress = Math.round(
    Object.values(progressMap).reduce((sum, val) => sum + val, 0) / 7
  );

  const linkedCustomer = customers.find(c => c.id === currentProjectObj.customerId);
  const customerName = linkedCustomer ? linkedCustomer.name : 'Chưa liên kết đối tác';

  const repoCreatedDate = gitHubData?.created_at || fallbackCreateDates[selectedProject.repo] || '2026-05-01T00:00:00Z';
  const activeDays = calculateDaysSince(repoCreatedDate);

  // Combine Programming Language, GitHub Topics & fallback Tech Stacks
  const techStack = Array.from(
    new Set([
      ...(gitHubData?.language ? [gitHubData.language] : []),
      ...(gitHubData?.topics || []),
      ...extra.defaultTechStack
    ])
  );

  const kpis = [
    { 
      name: 'Sprint hiện tại', 
      value: extra.kpis.sprint, 
      detail: extra.kpis.sprintDetail, 
      icon: Clock, 
      color: 'text-info-500 bg-info-500/10' 
    },
    { 
      name: 'Hoàn thành Sprint', 
      value: extra.kpis.spCompleted, 
      detail: extra.kpis.spDetail, 
      icon: CheckCircle2, 
      color: 'text-success-500 bg-success-500/10' 
    },
    { 
      name: 'Nhiệm vụ còn lại', 
      value: extra.kpis.tasksRemaining, 
      detail: extra.kpis.tasksDetail, 
      icon: Layers, 
      color: 'text-warning-500 bg-warning-500/10' 
    },
    { 
      name: 'Lỗi (Bugs) hiện có', 
      value: gitHubData ? `${gitHubData.open_issues_count} Lỗi` : extra.kpis.bugsRemaining, 
      detail: gitHubData ? 'Đồng bộ realtime từ GitHub Issues' : extra.kpis.bugsDetail, 
      icon: AlertCircle, 
      color: 'text-danger-500 bg-danger-500/10' 
    }
  ];

  const handleSaveDetails = () => {
    const updated = projects.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          name: editName,
          goal: editGoal,
          vercelUrl: editVercelUrl,
          customerId: editCustomerId
        };
      }
      return p;
    });
    setProjects(updated);
    setIsEditing(false);
  };

  const handleStepClick = (stepNum: number) => {
    const updated = projects.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          currentStep: stepNum
        };
      }
      return p;
    });
    setProjects(updated);
  };

  const handleProgressChange = (stepNum: number, value: number) => {
    const updated = projects.map(p => {
      if (p.id === selectedProject.id) {
        const oldProgress = p.stepProgress || { "1": 100, "2": 100, "3": 100, "4": 0, "5": 0, "6": 0, "7": 0 };
        return {
          ...p,
          stepProgress: {
            ...oldProgress,
            [stepNum.toString()]: value
          }
        };
      }
      return p;
    });
    setProjects(updated);
  };

  const activeMemberIds = currentProjectObj.memberIds || ['e1', 'e2', 'e3'];
  const projectEmployees = employees.filter((emp: any) => activeMemberIds.includes(emp.id));
  const availableEmployeesToAdd = employees.filter((emp: any) => !activeMemberIds.includes(emp.id));

  const handleAddMember = (employeeId: string) => {
    const oldMemberIds = currentProjectObj.memberIds || ['e1', 'e2', 'e3'];
    if (oldMemberIds.includes(employeeId)) return;
    const updated = projects.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          memberIds: [...oldMemberIds, employeeId]
        };
      }
      return p;
    });
    setProjects(updated);
    setShowAddMember(false);
  };

  const handleRemoveMember = (employeeId: string) => {
    const oldMemberIds = currentProjectObj.memberIds || ['e1', 'e2', 'e3'];
    const updated = projects.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          memberIds: oldMemberIds.filter((id: string) => id !== employeeId)
        };
      }
      return p;
    });
    setProjects(updated);
  };

  const workloadData = projectEmployees.map((emp: any) => {
    const hashVal = emp.name.length;
    const todo = hashVal % 3;
    const inProgress = (hashVal + 1) % 3;
    const done = (hashVal + 2) % 4;
    return {
      id: emp.id,
      name: emp.name,
      role: emp.role,
      todo,
      inProgress,
      done,
      total: todo + inProgress + done
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: Metrics & Burndown Chart (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* KPI Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="card p-5 flex items-start justify-between hover:border-bd-subtle transition-all duration-300 group cursor-default">
                <div>
                  <span className="eyebrow block mb-1">{kpi.name}</span>
                  <span className="text-[20px] font-black tracking-tight text-txt-primary block mb-1 group-hover:text-primary-500 transition-colors">{kpi.value}</span>
                  <span className="text-[12px] text-txt-muted block">{kpi.detail}</span>
                </div>
                <div className={`rounded-xl p-3 ${kpi.color} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon size={20} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Lifecycle Stepper Card */}
        <div className="card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-bd pb-4 gap-2">
            <div>
              <h3 className="text-[15px] font-bold text-txt-primary flex items-center gap-2">
                <Workflow size={16} className="text-primary-500" />
                <span>Tiến trình Quy trình phát triển</span>
              </h3>
              <p className="text-[12px] text-txt-muted mt-1">Dự án đang ở bước nào trong quy trình 7 giai đoạn. Nhấp vào các bước để cập nhật trạng thái.</p>
            </div>
            <span className="text-[11px] font-bold text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded-full border border-primary-500/20 shrink-0 self-start sm:self-center">
              Bước {currentStep}/7: {PROCESS_STEPS[currentStep - 1]?.name || 'Nghiệm thu'}
            </span>
          </div>

          {/* Stepper Timeline (Horizontal Layout) */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-2 px-2 relative">
            {PROCESS_STEPS.map((s, idx) => {
              const isCompleted = s.step < currentStep;
              const isActive = s.step === currentStep;
              const stepProgressValue = progressMap[s.step.toString()] || 0;
              
              return (
                <div key={s.step} className="flex-1 flex flex-row md:flex-col items-center gap-3 relative w-full group">
                  {/* Line connector for large screens */}
                  {idx < PROCESS_STEPS.length - 1 && (
                    <div className={`hidden md:block absolute top-[18px] left-[calc(50%+18px)] right-[calc(-50%+18px)] h-[2px] z-0 transition-colors ${
                      s.step < currentStep ? 'bg-success-500/70' : 'bg-bd/40'
                    }`} />
                  )}

                  {/* Step Button Circle */}
                  <button
                    onClick={() => handleStepClick(s.step)}
                    className={`relative z-10 w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-[13px] transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20 scale-110'
                        : isCompleted
                          ? 'bg-success-500/10 border-success-500/30 text-success-400 hover:border-success-500'
                          : 'bg-app border-bd text-txt-muted hover:border-bd-subtle hover:text-txt-secondary'
                    }`}
                  >
                    {isCompleted && stepProgressValue === 100 ? (
                      <svg className="w-4 h-4 stroke-2 fill-none stroke-current" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                    ) : s.step}
                  </button>

                  {/* Step Label */}
                  <div className="text-left md:text-center shrink-0">
                    <span className={`text-[12px] font-bold block transition-colors ${
                      isActive ? 'text-primary-400' : isCompleted ? 'text-success-400/90' : 'text-txt-muted group-hover:text-txt-secondary'
                    }`}>
                      {s.name} <span className="font-mono text-[11px]">({stepProgressValue}%)</span>
                    </span>
                    <span className="text-[10px] text-txt-muted/75 block leading-none mt-0.5">{s.role}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Step Details Panel */}
          <div className="bg-app/40 border border-bd/40 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-bd/30 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block">Giai đoạn hiện tại</span>
                <h4 className="text-[14px] font-black text-txt-primary mt-0.5">
                  Bước {currentStep}: {PROCESS_STEPS[currentStep - 1]?.name || 'Nghiệm thu'} ({PROCESS_STEPS[currentStep - 1]?.role} chủ trì)
                </h4>
              </div>
            </div>

            {/* Adjustable Step Progress Slider */}
            <div className="py-2.5 px-3 bg-surface/50 border border-bd/20 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[12px] font-bold">
                <span className="text-txt-secondary uppercase tracking-wider">Cài đặt Tiến độ giai đoạn này</span>
                <span className="text-primary-500 font-mono text-[13px]">
                  {progressMap[currentStep.toString()] || 0}%
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressMap[currentStep.toString()] || 0}
                  onChange={(e) => handleProgressChange(currentStep, parseInt(e.target.value))}
                  className="flex-1 h-1.5 bg-bd/40 rounded-lg appearance-none cursor-pointer accent-primary-500 transition-all focus:outline-none"
                />
                <div className="flex gap-1 shrink-0">
                  <button 
                    onClick={() => handleProgressChange(currentStep, Math.max(0, (progressMap[currentStep.toString()] || 0) - 10))}
                    className="w-7 h-7 bg-app border border-bd hover:border-bd-subtle text-[11px] rounded-lg font-bold flex items-center justify-center text-txt-secondary"
                  >
                    -10
                  </button>
                  <button 
                    onClick={() => handleProgressChange(currentStep, Math.min(100, (progressMap[currentStep.toString()] || 0) + 10))}
                    className="w-7 h-7 bg-app border border-bd hover:border-bd-subtle text-[11px] rounded-lg font-bold flex items-center justify-center text-txt-secondary"
                  >
                    +10
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist of this stage */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Đầu việc cần thực hiện</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PROCESS_STEPS[currentStep - 1]?.tasks.map((task, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-2 p-2.5 rounded-xl border border-bd/20 bg-surface/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                    <span className="text-[12px] font-semibold text-txt-secondary">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid: Resource Workload & Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Workload Card */}
          <div className="card p-6 space-y-4 relative">
            <div className="flex justify-between items-center border-b border-bd pb-3">
              <h3 className="text-[14px] font-bold text-txt-primary flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-primary-500" />
                <span>Thành viên & Phân bổ ({workloadData.length})</span>
              </h3>
              
              <div className="relative">
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="text-[11px] font-bold text-primary-500 hover:text-primary-400 bg-primary-500/10 px-2 py-1 rounded-lg border border-primary-500/20 flex items-center gap-1 transition-all"
                >
                  <UserPlus size={12} />
                  <span>Thêm</span>
                </button>

                {/* Dropdown list of available employees */}
                {showAddMember && (
                  <div className="absolute right-0 mt-1.5 w-56 bg-surface border border-bd rounded-xl shadow-lg z-50 p-2 space-y-1">
                    <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider block px-2.5 py-1">Chọn thành viên</span>
                    {availableEmployeesToAdd.length === 0 ? (
                      <span className="text-[11px] text-txt-muted block px-2.5 py-1.5">Tất cả nhân sự đã ở trong dự án</span>
                    ) : (
                      availableEmployeesToAdd.map((emp: any) => (
                        <button
                          key={emp.id}
                          onClick={() => handleAddMember(emp.id)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-subtle text-[12px] font-semibold text-txt-secondary hover:text-txt-primary transition-colors flex items-center justify-between"
                        >
                          <span>{emp.name}</span>
                          <span className="text-[9px] text-txt-muted font-medium bg-bd/30 px-1.5 py-0.5 rounded">{emp.role}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3.5">
              {workloadData.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <p className="text-[12px] text-txt-muted">Dự án chưa có thành viên nào.</p>
                </div>
              ) : (
                workloadData.map((w: any, idx: number) => {
                  const totalTasks = w.total;
                  const completedPercent = totalTasks > 0 ? Math.round((w.done / totalTasks) * 100) : 0;
                  const inProgressPercent = totalTasks > 0 ? Math.round((w.inProgress / totalTasks) * 100) : 0;
                  
                  return (
                    <div key={idx} className="space-y-1.5 group/item">
                      <div className="flex justify-between items-center text-[12px]">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-txt-primary block">{w.name}</span>
                            {/* Remove Member Button */}
                            <button
                              onClick={() => handleRemoveMember(w.id)}
                              className="opacity-0 group-hover/item:opacity-100 text-danger-500 hover:text-danger-400 p-0.5 rounded transition-all"
                              title="Xóa khỏi dự án"
                            >
                              <UserMinus size={11} />
                            </button>
                          </div>
                          <span className="text-[10px] text-txt-muted">{w.role}</span>
                        </div>
                        <div className="text-right font-mono font-semibold">
                          <span className="text-success-400">{w.done} xong</span>
                          <span className="text-txt-muted mx-1">/</span>
                          <span className="text-txt-secondary">{totalTasks} việc</span>
                        </div>
                      </div>
                      {/* Workload Progress Bar */}
                      <div className="w-full h-1.5 bg-bd/30 rounded-full overflow-hidden flex">
                        <div className="bg-success-500 h-full transition-all" style={{ width: `${completedPercent}%` }} title="Xong" />
                        <div className="bg-primary-500 h-full transition-all" style={{ width: `${inProgressPercent}%` }} title="Đang làm" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Tech Stack Distribution Card */}
          <div className="card p-6 space-y-4">
            <h3 className="text-[14px] font-bold text-txt-primary flex items-center gap-2 border-b border-bd pb-3">
              <span className="w-2.5 h-2.5 rounded bg-primary-500" />
              <span>Tỉ trọng Công nghệ (Tech Stack)</span>
            </h3>
            <div className="space-y-3.5">
              {[
                { name: 'TypeScript', percent: 35, color: 'bg-blue-500', detail: 'Ngôn ngữ chính Front/Back' },
                { name: 'React (Vite)', percent: 25, color: 'bg-cyan-500', detail: 'Thư viện xây dựng UI' },
                { name: 'Tailwind CSS', percent: 15, color: 'bg-teal-500', detail: 'Hệ thống Styling responsive' },
                { name: 'Supabase Cloud', percent: 15, color: 'bg-emerald-500', detail: 'Cơ sở dữ liệu & Edge Functions' },
                { name: 'PostgreSQL', percent: 10, color: 'bg-indigo-500', detail: 'Hệ quản trị CSDL quan hệ' }
              ].map((tech: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[12px] font-semibold">
                    <div>
                      <span className="text-txt-primary">{tech.name}</span>
                      <span className="text-[9px] text-txt-muted block font-medium leading-none mt-0.5">{tech.detail}</span>
                    </div>
                    <span className="text-txt-secondary font-mono">{tech.percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-bd/30 rounded-full overflow-hidden">
                    <div className={`${tech.color} h-full rounded-full transition-all`} style={{ width: `${tech.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        </div>

      {/* RIGHT COLUMN: Project Details Sidebar (1/3 width) */}
      <div className="space-y-6">
        
        {/* Project Metadata Card */}
        <div className="card p-6 space-y-6 relative overflow-hidden group">
          
          {/* Header section */}
          <div className="border-b border-bd pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="eyebrow flex items-center gap-1.5">
                <GithubIcon width={12} height={12} />
                <span>Chi tiết dự án</span>
              </span>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <RefreshCw size={14} className="animate-spin text-primary-500" />
                )}
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-txt-muted hover:text-primary-500 p-1 rounded-lg hover:bg-subtle transition-colors"
                    title="Chỉnh sửa chi tiết"
                  >
                    <Edit2 size={13} />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={handleSaveDetails}
                      className="text-success-500 hover:text-success-400 p-1 rounded-lg hover:bg-success-500/10 transition-colors"
                      title="Lưu"
                    >
                      <Save size={14} />
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="text-danger-500 hover:text-danger-400 p-1 rounded-lg hover:bg-danger-500/10 transition-colors"
                      title="Hủy"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {!isEditing ? (
              <h3 className="text-[17px] font-black text-txt-primary tracking-tight mb-2 leading-snug">
                {currentProjectObj.name}
              </h3>
            ) : (
              <input 
                type="text" 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                className="w-full rounded-xl border border-bd bg-app px-2.5 py-1.5 text-[14px] font-bold text-txt-primary focus:border-primary-500 focus:outline-none mb-2"
                placeholder="Nhập tên dự án"
              />
            )}
            
            <div className="flex items-center gap-2">
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${getStatusBadgeColor(extra.status)}`}>
                {extra.status}
              </span>
              <span className="text-[11px] font-mono text-txt-muted flex items-center gap-1">
                <GitBranch size={10} />
                <span>{selectedProject.repo}</span>
              </span>
            </div>
          </div>

          {/* Details form/view */}
          <div className="space-y-4">
            
            {/* Client (Khách hàng) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-txt-muted uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={12} className="text-primary-500" />
                <span>Khách hàng</span>
              </span>
              {!isEditing ? (
                <p className="text-[13px] text-txt-secondary pl-5 font-semibold">
                  {customerName}
                </p>
              ) : (
                <div className="pl-5">
                  <select 
                    value={editCustomerId} 
                    onChange={e => setEditCustomerId(e.target.value)} 
                    className="w-full rounded-xl border border-bd bg-app px-2 py-1.5 text-[12px] text-txt-primary focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">-- Chưa liên kết khách hàng --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Active Duration (Thời gian hoạt động) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-txt-muted uppercase tracking-wider flex items-center gap-1.5">
                <CalendarRange size={12} className="text-primary-500" />
                <span>Thời gian hoạt động</span>
              </span>
              <p className="text-[13px] text-txt-secondary pl-5 font-semibold">
                {activeDays} ngày (kể từ khi tạo Repo)
              </p>
            </div>

            {/* Goal (Mục tiêu) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-txt-muted uppercase tracking-wider flex items-center gap-1.5">
                <Target size={12} className="text-primary-500" />
                <span>Mục tiêu & Mô tả</span>
              </span>
              {!isEditing ? (
                <p className="text-[13px] text-txt-secondary pl-5 leading-relaxed font-medium">
                  {projectGoal}
                </p>
              ) : (
                <div className="pl-5">
                  <textarea 
                    value={editGoal} 
                    onChange={e => setEditGoal(e.target.value)} 
                    className="w-full rounded-xl border border-bd bg-app px-2.5 py-1.5 text-[12px] text-txt-primary focus:border-primary-500 focus:outline-none"
                    placeholder="Mô tả mục tiêu dự án..."
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Deploy Link Vercel */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-txt-muted uppercase tracking-wider flex items-center gap-1.5">
                <ExternalLink size={12} className="text-primary-500" />
                <span>Deploy Vercel</span>
              </span>
              {!isEditing ? (
                vercelUrl ? (
                  <a 
                    href={vercelUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[13px] text-primary-400 hover:text-primary-500 hover:underline pl-5 font-semibold flex items-center gap-1.5"
                  >
                    <span>Đi tới Vercel Deploy</span>
                    <ExternalLink size={10} />
                  </a>
                ) : (
                  <p className="text-[13px] text-txt-muted pl-5 italic">Chưa cấu hình deploy</p>
                )
              ) : (
                <div className="pl-5">
                  <input 
                    type="text" 
                    value={editVercelUrl} 
                    onChange={e => setEditVercelUrl(e.target.value)} 
                    className="w-full rounded-xl border border-bd bg-app px-2.5 py-1.5 text-[12px] text-txt-primary focus:border-primary-500 focus:outline-none"
                    placeholder="Ví dụ: https://my-app.vercel.app"
                  />
                </div>
              )}
            </div>

            {/* Progress Bar (Tiến độ) */}
            <div className="space-y-2 pt-2 border-t border-bd/40">
              <div className="flex justify-between items-center text-[12px] font-semibold">
                <span className="text-txt-muted uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarRange size={12} className="text-primary-500" />
                  <span>Tiến độ tổng thể</span>
                </span>
                <span className="text-primary-500 font-bold font-mono text-[13px]">{overallProgress}%</span>
              </div>
              <div className="w-full h-2 bg-bd/40 rounded-full overflow-hidden">
                <div 
                  className="bg-primary-500 h-full rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            {/* Tech Stack Tags */}
            <div className="space-y-2.5 pt-4 border-t border-bd/40">
              <span className="text-[11px] font-bold text-txt-muted uppercase tracking-wider flex items-center gap-1.5">
                <Code2 size={12} className="text-primary-500" />
                <span>Công nghệ (Tech Stack)</span>
              </span>
              <div className="flex flex-wrap gap-1.5 pl-1">
                {techStack.map((tech, idx) => (
                  <span 
                    key={idx} 
                    className={`text-[11px] px-2.5 py-0.5 rounded-lg border font-semibold select-none capitalize transition-colors ${getTechTagColor(tech)}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Footer - Sync Time */}
          {gitHubData && (
            <div className="border-t border-bd/40 pt-4 flex items-center justify-between text-[11px] text-txt-muted font-mono">
              <span>Đồng bộ từ GitHub</span>
              <span>
                {new Date(gitHubData.updated_at).toLocaleDateString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}

        </div>

        {/* GitHub Activity Card (Right Column) */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-bd pb-3">
            <h3 className="text-[14px] font-bold text-txt-primary flex items-center gap-2">
              <GitBranch size={15} className="text-primary-500" />
              <span>Hoạt động GitHub</span>
            </h3>
            <span className="text-[10px] font-mono text-txt-muted bg-bd/20 px-2 py-0.5 rounded">
              {selectedProject.githubBranch || 'main'}
            </span>
          </div>

          {/* Tabs Selector */}
          <div className="flex border-b border-bd/40">
            <button
              onClick={() => setGithubActiveTab('commits')}
              className={`flex-1 pb-2.5 text-[12px] font-bold border-b-2 transition-all ${
                githubActiveTab === 'commits'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-txt-muted hover:text-txt-secondary'
              }`}
            >
              Commits ({commits.length})
            </button>
            <button
              onClick={() => setGithubActiveTab('prs')}
              className={`flex-1 pb-2.5 text-[12px] font-bold border-b-2 transition-all ${
                githubActiveTab === 'prs'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-txt-muted hover:text-txt-secondary'
              }`}
            >
              Pull Requests ({pullRequests.length})
            </button>
          </div>

          {/* Tabs Content */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {githubActiveTab === 'commits' ? (
              commits.length === 0 ? (
                <p className="text-[12px] text-txt-muted italic text-center py-4">Không có commit nào.</p>
              ) : (
                commits.map((c: any, idx: number) => (
                  <a
                    key={idx}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 rounded-xl border border-bd/20 hover:border-primary-500/40 hover:bg-subtle/10 transition-all space-y-1.5"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[11px] font-semibold text-txt-primary line-clamp-2 leading-snug">
                        {c.message}
                      </span>
                      <span className="text-[9px] font-mono text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded shrink-0">
                        {c.sha}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-txt-muted">
                      <span>Tác giả: <strong>{c.author}</strong></span>
                      <span>{c.date}</span>
                    </div>
                  </a>
                ))
              )
            ) : (
              pullRequests.length === 0 ? (
                <p className="text-[12px] text-txt-muted italic text-center py-4">Không có Pull Request nào.</p>
              ) : (
                pullRequests.map((pr: any, idx: number) => {
                  const isOpen = pr.state === 'open';
                  const isMerged = pr.merged;
                  
                  return (
                    <a
                      key={idx}
                      href={pr.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-3 rounded-xl border border-bd/20 hover:border-primary-500/40 hover:bg-subtle/10 transition-all space-y-1.5"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[11px] font-semibold text-txt-primary line-clamp-2 leading-snug">
                          #{pr.number} {pr.title}
                        </span>
                        
                        {isOpen ? (
                          <span className="text-[8px] font-bold text-success-500 bg-success-500/10 px-1.5 py-0.5 rounded border border-success-500/20 shrink-0">
                            Mở
                          </span>
                        ) : isMerged ? (
                          <span className="text-[8px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 shrink-0">
                            Gộp
                          </span>
                        ) : (
                          <span className="text-[8px] font-bold text-danger-500 bg-danger-500/10 px-1.5 py-0.5 rounded border border-danger-500/20 shrink-0">
                            Đóng
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-txt-muted">
                        <span>Đề xuất: <strong>{pr.author}</strong></span>
                        <span>{pr.date}</span>
                      </div>
                    </a>
                  );
                })
              )
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}
