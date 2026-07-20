import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  FolderKanban, 
  Users, 
  Building2, 
  Bug, 
  TrendingUp, 
  ChevronRight
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
  email: string;
  phone: string;
  skills: string[];
  avatar: string;
}

interface OutletContextType {
  projects: Project[];
  customers: Customer[];
  employees: Employee[];
}

const PROJECT_PROGRESS_DATA: Record<string, { progress: number; status: string; bugs: number }> = {
  'cic-ptpm': { progress: 68, status: 'Đang triển khai', bugs: 3 },
  'cic-erp': { progress: 45, status: 'Đang triển khai', bugs: 12 },
  'cic-ibst': { progress: 82, status: 'Đang triển khai', bugs: 1 },
  'cic-web': { progress: 95, status: 'Nghiệm thu', bugs: 0 },
  'cic-cde': { progress: 30, status: 'Đang triển khai', bugs: 8 },
  'cic-ai-chatbox': { progress: 60, status: 'Đang triển khai', bugs: 2 },
  'cic-nova': { progress: 50, status: 'Đang triển khai', bugs: 5 },
  'cic-vicem': { progress: 75, status: 'Đang triển khai', bugs: 4 },
  'qlda-ddht-ht-selfhost': { progress: 40, status: 'Đang triển khai', bugs: 7 },
  'cic-ai': { progress: 55, status: 'Đang triển khai', bugs: 6 }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Hoàn thành': return 'bg-success-500/10 text-success-400 border-success-500/20';
    case 'Nghiệm thu': return 'bg-info-500/10 text-info-400 border-info-500/20';
    case 'Lập kế hoạch': return 'bg-bd text-txt-muted border-bd-subtle';
    default: return 'bg-warning-500/10 text-warning-400 border-warning-500/20';
  }
};

export default function GlobalOverview() {
  const { projects, customers, employees } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  // Aggregate global statistics
  const totalProjects = projects.length;
  const totalEmployees = employees.length;
  const totalCustomers = customers.length;
  
  const totalBugs = Object.values(PROJECT_PROGRESS_DATA).reduce((acc, curr) => acc + curr.bugs, 0);

  // Formulate data for the Chart
  const chartData = projects.map(p => {
    const data = PROJECT_PROGRESS_DATA[p.repo] || { progress: 35, status: 'Lập kế hoạch', bugs: 0 };
    return {
      id: p.id,
      name: p.name.replace('Hệ thống ', '').replace('Nền tảng ', ''),
      'Tiến độ (%)': data.progress,
      status: data.status
    };
  });

  const kpiItems = [
    { name: 'Tổng số dự án', value: totalProjects, icon: FolderKanban, color: 'text-primary-500 bg-primary-500/10 border-primary-500/20' },
    { name: 'Cán bộ trung tâm', value: totalEmployees, icon: Users, color: 'text-info-500 bg-info-500/10 border-info-500/20' },
    { name: 'Đối tác & Khách hàng', value: totalCustomers, icon: Building2, color: 'text-success-500 bg-success-500/10 border-success-500/20' },
    { name: 'Tổng số lỗi (GitHub Issues)', value: totalBugs, icon: Bug, color: 'text-danger-500 bg-danger-500/10 border-danger-500/20' }
  ];

  return (
    <div className="space-y-6">
      
      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiItems.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="card p-5 flex items-center justify-between hover:border-bd-subtle transition-all duration-300">
              <div>
                <span className="eyebrow block mb-1">{kpi.name}</span>
                <span className="text-[22px] font-black text-txt-primary tracking-tight font-mono">{kpi.value}</span>
              </div>
              <div className={`rounded-xl p-3 border ${kpi.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between border-b border-bd pb-4 mb-6">
          <div>
            <h3 className="text-[15px] font-bold text-txt-primary">So sánh tiến độ các dự án</h3>
            <p className="text-[12px] text-txt-muted">Tỉ lệ hoàn thành công việc của từng dự án đang triển khai</p>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-primary-500 bg-primary-500/10 px-2.5 py-1 rounded-lg border border-primary-500/20 font-semibold">
            <TrendingUp size={14} />
            <span>Biểu đồ tổng quan</span>
          </div>
        </div>

        <div className="h-72 w-full text-[11px] font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#263148" vertical={false} />
              <XAxis dataKey="name" stroke="#8896a9" tickLine={false} axisLine={false} />
              <YAxis stroke="#8896a9" tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1b2333', 
                  borderColor: '#263148',
                  borderRadius: '12px',
                }}
                itemStyle={{ color: '#f3f6fb' }}
                labelStyle={{ color: '#8896a9', fontWeight: 'bold' }}
                cursor={{ fill: 'rgba(38, 49, 72, 0.2)' }}
              />
              <Bar 
                dataKey="Tiến độ (%)" 
                radius={[6, 6, 0, 0]}
                onClick={(data) => {
                  if (data && data.id) {
                    navigate(`/projects/${data.id}`);
                  }
                }}
                className="cursor-pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.status === 'Nghiệm thu' ? 'rgb(var(--info-500))' : 'rgb(var(--primary-500))'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects List Summary */}
      <div className="space-y-4">
        <div>
          <h3 className="text-[16px] font-black tracking-tight text-txt-primary">Dự án đang theo dõi</h3>
          <p className="text-[12px] text-txt-muted">Danh sách nhanh các dự án, tiến độ tổng thể và đối tác.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((proj) => {
            const extra = PROJECT_PROGRESS_DATA[proj.repo] || { progress: 35, status: 'Lập kế hoạch', bugs: 0 };
            const customer = customers.find(c => c.id === proj.customerId);
            
            return (
              <div 
                key={proj.id} 
                onClick={() => navigate(`/projects/${proj.id}`)}
                className="card p-5 space-y-4 hover:border-bd-subtle transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-[14px] font-black text-txt-primary group-hover:text-primary-500 transition-colors leading-snug">
                      {proj.name}
                    </h4>
                    <span className="text-[11px] font-mono text-txt-muted mt-1 block">
                      Repo: {proj.githubRepo}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold shrink-0 ${getStatusBadgeColor(extra.status)}`}>
                    {extra.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[12px]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Khách hàng</span>
                    <span className="font-semibold text-txt-secondary truncate block">{customer ? customer.name : 'Chưa liên kết'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">GitHub Issues</span>
                    <span className="font-mono font-semibold text-danger-400">{extra.bugs} Lỗi mở</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-bd/40">
                  <div className="flex justify-between items-center text-[11px] font-bold text-txt-secondary">
                    <span>Tiến độ hoàn thành</span>
                    <span className="text-primary-500 font-mono">{extra.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-bd/40 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${extra.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <span className="text-[12px] font-bold text-primary-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Vào trang chi tiết</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
