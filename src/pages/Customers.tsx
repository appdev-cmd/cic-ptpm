import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
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

interface Customer {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
}

interface OutletContextType {
  setSelectedProjectId: (id: string) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
}

export default function Customers() {
  const { setSelectedProjectId, projects, customers, setCustomers } = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  // Slide Panel States
  const [panelMode, setPanelMode] = useState<'add' | 'view' | 'edit' | null>(null);
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenAdd = () => {
    setName('');
    setCode('');
    setEmail('');
    setPhone('');
    setAddress('');
    setErrorMsg('');
    setPanelMode('add');
  };

  const handleOpenView = (cust: Customer) => {
    setActiveCustomer(cust);
    setPanelMode('view');
  };

  const handleOpenEdit = () => {
    if (!activeCustomer) return;
    setName(activeCustomer.name);
    setCode(activeCustomer.code);
    setEmail(activeCustomer.email || '');
    setPhone(activeCustomer.phone || '');
    setAddress(activeCustomer.address || '');
    setErrorMsg('');
    setPanelMode('edit');
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      setErrorMsg('Vui lòng điền đầy đủ Tên và Mã khách hàng.');
      return;
    }

    // Check if code already exists
    if (customers.some(c => c.code.toUpperCase() === code.toUpperCase())) {
      setErrorMsg('Mã khách hàng đã tồn tại trên hệ thống.');
      return;
    }

    const newCust: Customer = {
      id: `c${Date.now()}`,
      name,
      code: code.toUpperCase(),
      email,
      phone,
      address
    };

    setCustomers([...customers, newCust]);
    setPanelMode(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer) return;
    if (!name || !code) {
      setErrorMsg('Vui lòng điền đầy đủ Tên và Mã khách hàng.');
      return;
    }

    // Check if code already exists on another customer
    if (customers.some(c => c.id !== activeCustomer.id && c.code.toUpperCase() === code.toUpperCase())) {
      setErrorMsg('Mã khách hàng đã tồn tại trên hệ thống.');
      return;
    }

    const updatedCust: Customer = {
      ...activeCustomer,
      name,
      code: code.toUpperCase(),
      email,
      phone,
      address
    };

    const updatedList = customers.map(c => c.id === activeCustomer.id ? updatedCust : c);
    setCustomers(updatedList);
    setActiveCustomer(updatedCust);
    setPanelMode('view');
    setErrorMsg('');
  };

  const handleDeleteCustomer = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;

    // Check if any projects are linked to this customer
    const linkedProjects = projects.filter(p => p.customerId === id);
    if (linkedProjects.length > 0) {
      alert(`Không thể xóa khách hàng này vì đang liên kết với các dự án:\n${linkedProjects.map(p => `- ${p.name}`).join('\n')}\n\nVui lòng thay đổi khách hàng liên kết của các dự án này trước.`);
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customer.name}"?`)) {
      setCustomers(customers.filter(c => c.id !== id));
      setPanelMode(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-black tracking-tight text-txt-primary">Quản lý Đối tác & Khách hàng</h2>
          <p className="text-[12px] text-txt-muted">Xem thông tin liên hệ và các dự án liên kết của khách hàng.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2.5 text-[13px] font-bold text-white transition-all active:scale-95 shadow-card"
        >
          <Plus size={16} />
          <span>Thêm khách hàng</span>
        </button>
      </div>

      {/* Customers List Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {customers.map((cust) => {
          const linkedProjects = projects.filter(p => p.customerId === cust.id);
          
          return (
            <div 
              key={cust.id} 
              onClick={() => handleOpenView(cust)}
              className="card p-5 space-y-4 flex flex-col justify-between hover:border-primary-500/40 hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-bd/40 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold font-mono tracking-widest text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-md border border-primary-500/20 uppercase">
                      {cust.code}
                    </span>
                    <h3 className="text-[14px] font-black text-txt-primary mt-1.5 leading-snug group-hover:text-primary-500 transition-colors">
                      {cust.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenView(cust);
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
                        handleDeleteCustomer(cust.id);
                      }}
                      className="text-txt-muted hover:text-danger-500 p-1.5 rounded-lg hover:bg-danger-500/10 transition-colors"
                      title="Xóa khách hàng"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Contact details */}
                <div className="space-y-2 text-[12px] text-txt-secondary font-medium">
                  {cust.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-txt-muted shrink-0" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                  )}
                  {cust.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-txt-muted shrink-0" />
                      <span>{cust.phone}</span>
                    </div>
                  )}
                  {cust.address && (
                    <div className="flex items-start gap-2">
                      <MapPin size={13} className="text-txt-muted shrink-0 mt-0.5" />
                      <span className="leading-relaxed line-clamp-2">{cust.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Linked Projects Section */}
              <div className="border-t border-bd/40 pt-3 mt-auto space-y-2">
                <span className="eyebrow flex items-center gap-1.5">
                  <Briefcase size={10} />
                  <span>Dự án liên kết ({linkedProjects.length})</span>
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
                  <span className="text-[11px] text-txt-muted block italic pl-1">Chưa liên kết dự án nào</span>
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
                  {panelMode === 'add' && 'Thêm đối tác mới'}
                  {panelMode === 'view' && 'Chi tiết đối tác'}
                  {panelMode === 'edit' && 'Chỉnh sửa đối tác'}
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
              {panelMode === 'view' && activeCustomer && (
                <div className="space-y-6">
                  {/* Code & Name header */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold font-mono tracking-widest text-primary-500 bg-primary-500/10 px-2.5 py-1 rounded-lg border border-primary-500/20 uppercase inline-block">
                      {activeCustomer.code}
                    </span>
                    <h2 className="text-[16px] font-black text-txt-primary leading-snug">
                      {activeCustomer.name}
                    </h2>
                  </div>

                  {/* Details Card */}
                  <div className="card p-5 space-y-3.5 bg-subtle/10 border-bd/30">
                    <div className="flex items-start gap-3 text-[13px]">
                      <Mail size={15} className="text-txt-muted mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Email liên hệ</span>
                        <span className="text-txt-secondary font-semibold">{activeCustomer.email || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-[13px]">
                      <Phone size={15} className="text-txt-muted mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Số điện thoại</span>
                        <span className="text-txt-secondary font-semibold">{activeCustomer.phone || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-[13px]">
                      <MapPin size={15} className="text-txt-muted mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Địa chỉ trụ sở</span>
                        <span className="text-txt-secondary font-semibold leading-relaxed">{activeCustomer.address || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Linked Projects */}
                  <div className="space-y-3">
                    <h4 className="text-[12px] font-bold text-txt-secondary flex items-center gap-1.5 border-b border-bd pb-2">
                      <Briefcase size={12} className="text-primary-500" />
                      <span>Các dự án đang liên kết ({projects.filter(p => p.customerId === activeCustomer.id).length})</span>
                    </h4>
                    <div className="space-y-2">
                      {projects.filter(p => p.customerId === activeCustomer.id).length > 0 ? (
                        projects.filter(p => p.customerId === activeCustomer.id).map(proj => (
                          <button
                            key={proj.id}
                            onClick={() => {
                              setSelectedProjectId(proj.id);
                              setPanelMode(null);
                              navigate('/');
                            }}
                            className="w-full flex items-center justify-between text-left rounded-xl bg-app border border-bd hover:border-primary-500/30 hover:bg-subtle px-3 py-2.5 text-[12px] text-txt-secondary hover:text-txt-primary transition-all font-semibold"
                          >
                            <span>{proj.name}</span>
                            <ExternalLink size={12} className="text-txt-muted" />
                          </button>
                        ))
                      ) : (
                        <p className="text-[12px] text-txt-muted italic pl-1">Chưa liên kết dự án nào.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {(panelMode === 'add' || panelMode === 'edit') && (
                <form onSubmit={panelMode === 'add' ? handleAddCustomer : handleSaveEdit} className="space-y-4">
                  {errorMsg && (
                    <div className="rounded-lg bg-danger-500/10 border border-danger-500/20 p-3 text-[12px] text-danger-400 flex items-center gap-2">
                      <AlertTriangle size={14} />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Tên Khách hàng / Đối tác *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ví dụ: Tổng công ty Đầu tư Phát triển Nhà"
                      className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Mã Code *</label>
                    <input
                      type="text"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      placeholder="Ví dụ: HUD"
                      className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Email liên hệ</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Ví dụ: contact@company.vn"
                      className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Số điện thoại</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Ví dụ: 024-378..."
                      className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Địa chỉ trụ sở</label>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Ví dụ: Số 37 Lê Văn Lương, Hà Nội"
                      className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Footer actions */}
            <div className="border-t border-bd p-4 bg-subtle/20 flex justify-between items-center">
              {panelMode === 'view' && activeCustomer ? (
                <>
                  <button
                    onClick={() => handleDeleteCustomer(activeCustomer.id)}
                    className="flex items-center gap-1 text-[12px] font-bold text-danger-500 hover:text-danger-400 px-3 py-2 rounded-lg hover:bg-danger-500/10 transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Xóa đối tác</span>
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
                        handleAddCustomer(e);
                      } else {
                        handleSaveEdit(e);
                      }
                    }}
                    className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2 text-[13px] font-bold text-white transition-all shadow-card"
                  >
                    {panelMode === 'add' ? 'Lưu Khách hàng' : 'Lưu thay đổi'}
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
