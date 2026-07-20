import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  Plus, 
  Trash2, 
  ExternalLink,
  Briefcase,
  AlertTriangle,
  X,
  Edit2
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
  currentStep?: number;
  stepProgress?: Record<string, number>;
  memberIds?: string[];
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
  setProjects: (projects: Project[]) => void;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

const getRoleBadgeColor = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes('lead') || r.includes('manager') || r.includes('pm') || r.includes('master')) {
    return 'bg-danger-500/10 text-danger-400 border-danger-500/20';
  }
  if (r.includes('frontend') || r.includes('ui') || r.includes('ux')) {
    return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  }
  if (r.includes('backend') || r.includes('developer')) {
    return 'bg-primary-500/10 text-primary-400 border-primary-500/20';
  }
  return 'bg-success-500/10 text-success-400 border-success-500/20';
};

const getSkillTagColor = (skill: string) => {
  const s = skill.toLowerCase();
  if (['react', 'typescript', 'javascript', 'tailwind css', 'tailwind'].includes(s)) {
    return 'bg-cyan-500/5 text-cyan-400 border-cyan-500/10';
  }
  if (['python', 'fastapi', 'supabase', 'postgresql', 'database', 'sql', 'docker'].includes(s)) {
    return 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10';
  }
  if (['scrum', 'agile', 'jira', 'management', 'scrum master', 'project management'].includes(s)) {
    return 'bg-danger-500/5 text-danger-400 border-danger-500/10';
  }
  if (['figma', 'design system', 'prototyping', 'ui/ux'].includes(s)) {
    return 'bg-purple-500/5 text-purple-400 border-purple-500/10';
  }
  return 'bg-bd/40 text-txt-secondary border-bd/80';
};

export default function Employees() {
  const { projects, setProjects, employees, setEmployees } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  // Slide Panel States
  const [panelMode, setPanelMode] = useState<'add' | 'view' | 'edit' | null>(null);
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamic filter for employee projects
  const getLinkedProjects = (empId: string) => {
    return projects.filter(p => (p.memberIds || []).includes(empId));
  };

  const handleOpenAdd = () => {
    setName('');
    setRole('');
    setEmail('');
    setPhone('');
    setSkillsStr('');
    setErrorMsg('');
    setPanelMode('add');
  };

  const handleOpenView = (emp: Employee) => {
    setActiveEmployee(emp);
    setPanelMode('view');
  };

  const handleOpenEdit = () => {
    if (!activeEmployee) return;
    setName(activeEmployee.name);
    setRole(activeEmployee.role);
    setEmail(activeEmployee.email || '');
    setPhone(activeEmployee.phone || '');
    setSkillsStr((activeEmployee.skills || []).join(', '));
    setErrorMsg('');
    setPanelMode('edit');
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) {
      setErrorMsg('Vui lòng điền đầy đủ Tên nhân sự và Chức danh.');
      return;
    }

    // Generate avatar initials from name
    const words = name.trim().split(/\s+/);
    let avatar = 'NV';
    if (words.length > 0) {
      const first = words[0]?.[0] || '';
      const last = words[words.length - 1]?.[0] || '';
      avatar = `${first}${last}`.toUpperCase();
    }

    const skills = skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newEmp: Employee = {
      id: `e${Date.now()}`,
      name,
      role,
      email,
      phone,
      skills,
      avatar
    };

    setEmployees([...employees, newEmp]);
    setPanelMode(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmployee) return;
    if (!name || !role) {
      setErrorMsg('Vui lòng điền đầy đủ Tên nhân sự và Chức danh.');
      return;
    }

    // Generate avatar initials from name
    const words = name.trim().split(/\s+/);
    let avatar = 'NV';
    if (words.length > 0) {
      const first = words[0]?.[0] || '';
      const last = words[words.length - 1]?.[0] || '';
      avatar = `${first}${last}`.toUpperCase();
    }

    const skills = skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updatedEmp: Employee = {
      ...activeEmployee,
      name,
      role,
      email,
      phone,
      skills,
      avatar
    };

    const updatedList = employees.map(emp => emp.id === activeEmployee.id ? updatedEmp : emp);
    setEmployees(updatedList);
    setActiveEmployee(updatedEmp);
    setPanelMode('view');
    setErrorMsg('');
  };

  const handleDeleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân sự "${emp.name}" khỏi hệ thống?\nNhân sự này cũng sẽ được tự động gỡ khỏi các dự án liên kết.`)) {
      // 1. Remove employee from all project member lists
      const updatedProjects = projects.map(p => {
        const members = p.memberIds || [];
        if (members.includes(id)) {
          return {
            ...p,
            memberIds: members.filter(mid => mid !== id)
          };
        }
        return p;
      });
      setProjects(updatedProjects);

      // 2. Remove employee from state and Supabase
      setEmployees(employees.filter(e => e.id !== id));
      setPanelMode(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-black tracking-tight text-txt-primary">Đội ngũ Nhân sự PTPM</h2>
          <p className="text-[12px] text-txt-muted">Quản lý danh sách cán bộ, chức danh công việc, và phân bổ dự án.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2.5 text-[13px] font-bold text-white transition-all active:scale-95 shadow-card"
        >
          <Plus size={16} />
          <span>Thêm nhân sự</span>
        </button>
      </div>

      {/* Employees Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map((emp) => {
          const linkedProjects = getLinkedProjects(emp.id);
          
          return (
            <div 
              key={emp.id} 
              onClick={() => handleOpenView(emp)}
              className="card p-5 space-y-4 flex flex-col justify-between hover:border-primary-500/40 hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Header: Avatar, Name, Edit, Delete */}
                <div className="flex items-start justify-between gap-3 border-b border-bd/40 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-500 font-extrabold text-[15px]">
                      {emp.avatar}
                    </div>
                    <div>
                      <h3 className="text-[14px] font-black text-txt-primary leading-tight group-hover:text-primary-500 transition-colors">
                        {emp.name}
                      </h3>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded border font-semibold mt-1 uppercase ${getRoleBadgeColor(emp.role)}`}>
                        {emp.role}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenView(emp);
                        setTimeout(() => handleOpenEdit(), 50);
                      }}
                      className="text-txt-muted hover:text-primary-500 p-1.5 rounded-lg hover:bg-primary-500/10 transition-colors"
                      title="Sửa thông tin"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEmployee(emp.id);
                      }}
                      className="text-txt-muted hover:text-danger-500 p-1.5 rounded-lg hover:bg-danger-500/10 transition-colors"
                      title="Xóa nhân sự"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Contact details */}
                <div className="space-y-2 text-[12px] text-txt-secondary font-medium pl-1">
                  {emp.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-txt-muted shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                  )}
                  {emp.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-txt-muted shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                </div>

                {/* Skill tags */}
                {emp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1 pl-1">
                    {emp.skills.slice(0, 4).map((skill, idx) => (
                      <span 
                        key={idx} 
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${getSkillTagColor(skill)}`}
                      >
                        {skill}
                      </span>
                    ))}
                    {emp.skills.length > 4 && (
                      <span className="text-[10px] text-txt-muted font-bold pl-1 font-mono">+{emp.skills.length - 4}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Linked Projects Section */}
              <div className="border-t border-bd/40 pt-3 mt-auto space-y-2">
                <span className="eyebrow flex items-center gap-1.5">
                  <Briefcase size={10} />
                  <span>Dự án tham gia ({linkedProjects.length})</span>
                </span>
                
                {linkedProjects.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {linkedProjects.slice(0, 2).map((proj) => (
                      <div
                        key={proj.id}
                        className="flex items-center justify-between text-left rounded-lg bg-app/50 border border-bd/60 px-2.5 py-1.5 text-[12px] text-txt-secondary"
                      >
                        <span className="truncate font-semibold">{proj.name}</span>
                      </div>
                    ))}
                    {linkedProjects.length > 2 && (
                      <span className="text-[10px] text-txt-muted pl-1">Và {linkedProjects.length - 2} dự án khác...</span>
                    )}
                  </div>
                ) : (
                  <span className="text-[11px] text-txt-muted block italic pl-1">Chưa phân bổ dự án</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Panel */}
      {panelMode && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setPanelMode(null)}
          />

          {/* Slide Drawer Content */}
          <div className="relative w-full max-w-lg bg-surface border-l border-bd shadow-2xl flex flex-col h-full z-10 animate-slideIn">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-bd px-6 py-4">
              <h3 className="text-[14px] font-bold text-txt-primary flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-primary-500" />
                <span>
                  {panelMode === 'add' && 'Thêm nhân sự mới'}
                  {panelMode === 'view' && 'Chi tiết nhân sự'}
                  {panelMode === 'edit' && 'Chỉnh sửa nhân sự'}
                </span>
              </h3>
              <button 
                onClick={() => setPanelMode(null)}
                className="text-txt-muted hover:text-txt-primary p-1.5 rounded-lg hover:bg-subtle transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {panelMode === 'view' && activeEmployee && (
                <div className="space-y-6">
                  {/* Name and Role header */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-500 font-extrabold text-[22px]">
                      {activeEmployee.avatar}
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-[16px] font-black text-txt-primary leading-tight">
                        {activeEmployee.name}
                      </h2>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded border font-semibold uppercase ${getRoleBadgeColor(activeEmployee.role)}`}>
                        {activeEmployee.role}
                      </span>
                    </div>
                  </div>

                  {/* Details Card */}
                  <div className="card p-5 space-y-3.5 bg-subtle/10 border-bd/30">
                    <div className="flex items-start gap-3 text-[13px]">
                      <Mail size={15} className="text-txt-muted mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Email cơ quan</span>
                        <span className="text-txt-secondary font-semibold">{activeEmployee.email || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-[13px]">
                      <Phone size={15} className="text-txt-muted mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Số điện thoại</span>
                        <span className="text-txt-secondary font-semibold">{activeEmployee.phone || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills tags */}
                  {activeEmployee.skills.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Kỹ năng chuyên môn</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeEmployee.skills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className={`text-[11px] px-2.5 py-1 rounded-md border font-semibold ${getSkillTagColor(skill)}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Linked Projects */}
                  <div className="space-y-3">
                    <h4 className="text-[12px] font-bold text-txt-secondary flex items-center gap-1.5 border-b border-bd pb-2">
                      <Briefcase size={12} className="text-primary-500" />
                      <span>Dự án đang tham gia ({getLinkedProjects(activeEmployee.id).length})</span>
                    </h4>
                    <div className="space-y-2">
                      {getLinkedProjects(activeEmployee.id).length > 0 ? (
                        getLinkedProjects(activeEmployee.id).map(proj => (
                          <button
                            key={proj.id}
                            onClick={() => {
                              setPanelMode(null);
                              navigate(`/projects/${proj.id}`);
                            }}
                            className="w-full flex items-center justify-between text-left rounded-xl bg-app border border-bd hover:border-primary-500/30 hover:bg-subtle px-3 py-2.5 text-[12px] text-txt-secondary hover:text-txt-primary transition-all font-semibold"
                          >
                            <span>{proj.name}</span>
                            <ExternalLink size={12} className="text-txt-muted" />
                          </button>
                        ))
                      ) : (
                        <p className="text-[12px] text-txt-muted italic pl-1">Chưa tham gia dự án nào.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {(panelMode === 'add' || panelMode === 'edit') && (
                <form onSubmit={panelMode === 'add' ? handleAddEmployee : handleSaveEdit} className="space-y-4">
                  {errorMsg && (
                    <div className="rounded-lg bg-danger-500/10 border border-danger-500/20 p-3 text-[12px] text-danger-400 flex items-center gap-2">
                      <AlertTriangle size={14} />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Họ và Tên *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Chức danh công việc *</label>
                    <input
                      type="text"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      placeholder="Ví dụ: Lead Developer"
                      className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Email cơ quan</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Ví dụ: name@cic.com.vn"
                      className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Số điện thoại</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Ví dụ: 098..."
                      className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Kỹ năng chuyên môn (cách nhau bằng dấu phẩy)</label>
                    <input
                      type="text"
                      value={skillsStr}
                      onChange={e => setSkillsStr(e.target.value)}
                      placeholder="Ví dụ: React, TypeScript, Node.js, Agile"
                      className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Footer actions */}
            <div className="border-t border-bd p-4 bg-subtle/20 flex justify-between items-center">
              {panelMode === 'view' && activeEmployee ? (
                <>
                  <button
                    onClick={() => handleDeleteEmployee(activeEmployee.id)}
                    className="flex items-center gap-1 text-[12px] font-bold text-danger-500 hover:text-danger-400 px-3 py-2 rounded-lg hover:bg-danger-500/10 transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Xóa nhân sự</span>
                  </button>
                  <button
                    onClick={handleOpenEdit}
                    className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2 text-[13px] font-bold text-white transition-all shadow-card"
                  >
                    Chỉnh sửa
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (panelMode === 'edit') {
                        setPanelMode('view');
                      } else {
                        setPanelMode(null);
                      }
                    }}
                    className="rounded-xl border border-bd hover:bg-subtle px-4 py-2 text-[13px] font-bold text-txt-secondary transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={(e) => {
                      if (panelMode === 'add') {
                        handleAddEmployee(e);
                      } else {
                        handleSaveEdit(e);
                      }
                    }}
                    className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2 text-[13px] font-bold text-white transition-all shadow-card"
                  >
                    {panelMode === 'add' ? 'Lưu nhân sự' : 'Lưu thay đổi'}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
