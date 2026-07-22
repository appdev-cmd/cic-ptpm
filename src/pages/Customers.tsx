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
  Edit2,
  Search,
  Loader2,
  CheckCircle2,
  Building2,
  Sparkles,
  FileText,
  Table as TableIcon,
  LayoutGrid,
  Globe,
  UserCheck,
  Tag,
  ShieldCheck,
  Info
} from 'lucide-react';
import { TaxLookupService } from '../utils/taxLookupService';

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
  taxCode?: string;
  website?: string;
  representative?: string;
  contactPerson?: string;
  industry?: string;
  rating?: string;
  businessStatus?: string;
  type?: string;
  notes?: string;
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

  // View Mode: default to 'table'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Slide Panel States
  const [panelMode, setPanelMode] = useState<'add' | 'view' | 'edit' | null>(null);
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [website, setWebsite] = useState('');
  const [representative, setRepresentative] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [industry, setIndustry] = useState('');
  const [rating, setRating] = useState('Standard');
  const [businessStatus, setBusinessStatus] = useState('Đang hoạt động');
  const [type, setType] = useState('Chủ đầu tư');
  const [notes, setNotes] = useState('');

  const [isSearchingTax, setIsSearchingTax] = useState(false);
  const [taxSearchSuccess, setTaxSearchSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const resetForm = () => {
    setName('');
    setCode('');
    setEmail('');
    setPhone('');
    setAddress('');
    setTaxCode('');
    setWebsite('');
    setRepresentative('');
    setContactPerson('');
    setIndustry('');
    setRating('Standard');
    setBusinessStatus('Đang hoạt động');
    setType('Chủ đầu tư');
    setNotes('');
    setTaxSearchSuccess('');
    setErrorMsg('');
  };

  const handleOpenAdd = () => {
    resetForm();
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
    setTaxCode(activeCustomer.taxCode || '');
    setWebsite(activeCustomer.website || '');
    setRepresentative(activeCustomer.representative || '');
    setContactPerson(activeCustomer.contactPerson || '');
    setIndustry(activeCustomer.industry || '');
    setRating(activeCustomer.rating || 'Standard');
    setBusinessStatus(activeCustomer.businessStatus || 'Đang hoạt động');
    setType(activeCustomer.type || 'Chủ đầu tư');
    setNotes(activeCustomer.notes || '');
    setTaxSearchSuccess('');
    setErrorMsg('');
    setPanelMode('edit');
  };

  const handleLookupTax = async () => {
    if (!taxCode.trim()) {
      setErrorMsg('Vui lòng nhập Mã số thuế trước khi tra cứu.');
      return;
    }
    setIsSearchingTax(true);
    setErrorMsg('');
    setTaxSearchSuccess('');
    try {
      const res = await TaxLookupService.lookup(taxCode);
      if (res) {
        setName(res.name);
        setAddress(res.address);
        if (!code) {
          const autoCode = TaxLookupService.generateShortCode(res.name, res.shortName);
          setCode(autoCode);
        }
        setTaxSearchSuccess(`Đã tự động lấy thông tin doanh nghiệp: ${res.name}`);
      } else {
        setErrorMsg('Không tìm thấy doanh nghiệp nào với Mã số thuế này.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi tra cứu mã số thuế.');
    } finally {
      setIsSearchingTax(false);
    }
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      setErrorMsg('Vui lòng điền đầy đủ Tên và Mã khách hàng.');
      return;
    }

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
      address,
      taxCode,
      website,
      representative,
      contactPerson,
      industry,
      rating,
      businessStatus,
      type,
      notes
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
      address,
      taxCode,
      website,
      representative,
      contactPerson,
      industry,
      rating,
      businessStatus,
      type,
      notes
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

  // Filter customers
  const filteredCustomers = (customers || []).filter(c => {
    if (!c) return false;
    const term = (searchTerm || '').toLowerCase();
    const nameStr = (c.name || '').toLowerCase();
    const codeStr = (c.code || '').toLowerCase();
    const emailStr = (c.email || '').toLowerCase();
    const phoneStr = (c.phone || '').toLowerCase();
    const taxStr = (c.taxCode || '').toLowerCase();
    const addrStr = (c.address || '').toLowerCase();
    const repStr = (c.representative || '').toLowerCase();
    const contactStr = (c.contactPerson || '').toLowerCase();

    const matchesSearch = (
      nameStr.includes(term) ||
      codeStr.includes(term) ||
      emailStr.includes(term) ||
      phoneStr.includes(term) ||
      taxStr.includes(term) ||
      addrStr.includes(term) ||
      repStr.includes(term) ||
      contactStr.includes(term)
    );

    const matchesType = selectedType === 'all' || (c.type || 'Chủ đầu tư') === selectedType;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getRatingBadge = (rating?: string) => {
    switch (rating) {
      case 'VIP':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-warning-500/20 text-warning-400 border border-warning-500/30">VIP</span>;
      case 'Gold':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-500/20 text-primary-400 border border-primary-500/30">GOLD</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-subtle text-txt-muted border border-bd">STANDARD</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-black tracking-tight text-txt-primary flex items-center gap-2">
            <span>Quản lý Đối tác & Khách hàng</span>
            <span className="text-[11px] font-extrabold font-mono text-primary-400 bg-primary-500/10 px-2.5 py-0.5 rounded-full border border-primary-500/20">
              {customers.length} Chủ đầu tư & QLDA
            </span>
          </h2>
          <p className="text-[12px] text-txt-muted mt-0.5">Danh sách các Chủ đầu tư, Ban QLDA, Bộ / Sở / Viện và Tập đoàn phát triển.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Toggle */}
          <div className="flex items-center bg-surface border border-bd rounded-xl p-1 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-primary-500 text-white shadow-card'
                  : 'text-txt-muted hover:text-txt-primary'
              }`}
              title="Hiển thị dạng Bảng"
            >
              <TableIcon size={14} />
              <span>Dạng Bảng</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white shadow-card'
                  : 'text-txt-muted hover:text-txt-primary'
              }`}
              title="Hiển thị dạng Thẻ"
            >
              <LayoutGrid size={14} />
              <span>Dạng Thẻ</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2.5 text-[13px] font-bold text-white transition-all active:scale-95 shadow-card shrink-0"
          >
            <Plus size={16} />
            <span>Thêm khách hàng</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-bd shadow-card">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm theo tên, mã code, MST, email, đại diện..."
            className="w-full rounded-xl border border-bd bg-app pl-10 pr-4 py-2 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* Type filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-[12px]">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'Ban QLDA', label: 'Ban QLDA' },
            { id: 'Chủ đầu tư', label: 'Chủ đầu tư' },
            { id: 'Cơ quan nhà nước & Viện', label: 'Bộ / Sở / Viện' },
            { id: 'Tập đoàn & Tổng công ty', label: 'Tập đoàn' }
          ].map(typeItem => (
            <button
              key={typeItem.id}
              onClick={() => {
                setSelectedType(typeItem.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedType === typeItem.id
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40 shadow-sm'
                  : 'bg-app border border-bd text-txt-muted hover:text-txt-primary hover:border-bd-subtle'
              }`}
            >
              {typeItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="card overflow-hidden border border-bd">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-bd bg-subtle/40 text-[11px] uppercase tracking-wider text-txt-muted font-bold">
                  <th className="py-3 px-4 w-12 text-center">STT</th>
                  <th className="py-3 px-4 min-w-[280px]">Tên Khách hàng / Chủ đầu tư</th>
                  <th className="py-3 px-4 min-w-[140px]">Mã & MST</th>
                  <th className="py-3 px-4 min-w-[180px]">Đại diện & Liên hệ</th>
                  <th className="py-3 px-4 min-w-[180px]">Thông tin liên hệ</th>
                  <th className="py-3 px-4 min-w-[240px]">Địa chỉ trụ sở</th>
                  <th className="py-3 px-4 w-28 text-center">Dự án</th>
                  <th className="py-3 px-4 w-24 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bd/40 text-[13px]">
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((cust, idx) => {
                    const linkedProjects = projects.filter(p => p.customerId === cust.id);
                    const stt = (currentPage - 1) * pageSize + idx + 1;

                    return (
                      <tr 
                        key={cust.id}
                        onClick={() => handleOpenView(cust)}
                        className="hover:bg-subtle/20 transition-colors cursor-pointer group"
                      >
                        {/* STT */}
                        <td className="py-3.5 px-4 text-center font-mono text-[11px] text-txt-muted font-bold">
                          {stt}
                        </td>

                        {/* Name & Badges */}
                        <td className="py-3.5 px-4 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-txt-primary group-hover:text-primary-400 transition-colors leading-snug">
                              {cust.name}
                            </span>
                            {getRatingBadge(cust.rating)}
                          </div>
                          {cust.type && (
                            <span className="text-[10px] text-txt-muted block italic">
                              {cust.type}
                            </span>
                          )}
                        </td>

                        {/* Code & MST */}
                        <td className="py-3.5 px-4 font-mono text-[12px] space-y-1">
                          <span className="text-primary-400 font-extrabold bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/20 inline-block">
                            {cust.code}
                          </span>
                          {cust.taxCode && (
                            <span className="text-txt-muted text-[11px] block">
                              MST: {cust.taxCode}
                            </span>
                          )}
                        </td>

                        {/* Representative / Contact */}
                        <td className="py-3.5 px-4 text-[12px] text-txt-secondary space-y-1">
                          {cust.representative && (
                            <div className="flex items-center gap-1.5 font-semibold text-txt-primary">
                              <ShieldCheck size={13} className="text-primary-500 shrink-0" />
                              <span className="truncate">{cust.representative}</span>
                            </div>
                          )}
                          {cust.contactPerson && (
                            <div className="flex items-center gap-1.5 text-txt-muted">
                              <UserCheck size={13} className="shrink-0" />
                              <span className="truncate">{cust.contactPerson}</span>
                            </div>
                          )}
                          {!cust.representative && !cust.contactPerson && (
                            <span className="text-txt-muted italic text-[11px]">Chưa cập nhật</span>
                          )}
                        </td>

                        {/* Email & Phone */}
                        <td className="py-3.5 px-4 text-[12px] text-txt-secondary space-y-1">
                          {cust.email && (
                            <div className="flex items-center gap-1.5">
                              <Mail size={12} className="text-txt-muted shrink-0" />
                              <span className="truncate">{cust.email}</span>
                            </div>
                          )}
                          {cust.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone size={12} className="text-txt-muted shrink-0" />
                              <span>{cust.phone}</span>
                            </div>
                          )}
                          {!cust.email && !cust.phone && (
                            <span className="text-txt-muted italic text-[11px]">Chưa cập nhật</span>
                          )}
                        </td>

                        {/* Address */}
                        <td className="py-3.5 px-4 text-[12px] text-txt-secondary max-w-xs">
                          {cust.address ? (
                            <span className="line-clamp-2 leading-relaxed">{cust.address}</span>
                          ) : (
                            <span className="text-txt-muted italic text-[11px]">Chưa cập nhật</span>
                          )}
                        </td>

                        {/* Linked Projects count */}
                        <td className="py-3.5 px-4 text-center">
                          {linkedProjects.length > 0 ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-info-500/10 text-info-400 border border-info-500/20">
                              {linkedProjects.length} dự án
                            </span>
                          ) : (
                            <span className="text-[11px] text-txt-muted font-mono">0</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                handleOpenView(cust);
                                setTimeout(() => handleOpenEdit(), 50);
                              }}
                              className="text-txt-muted hover:text-primary-400 p-1.5 rounded-lg hover:bg-primary-500/10 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(cust.id)}
                              className="text-txt-muted hover:text-danger-400 p-1.5 rounded-lg hover:bg-danger-500/10 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-txt-muted text-[13px] italic">
                      Không tìm thấy đối tác / khách hàng nào khớp với tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedCustomers.map((cust) => {
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
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-extrabold font-mono tracking-widest text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-md border border-primary-500/20 uppercase">
                          {cust.code}
                        </span>
                        {cust.taxCode && (
                          <span className="text-[10px] font-bold font-mono text-txt-muted bg-subtle px-2 py-0.5 rounded-md border border-bd">
                            MST: {cust.taxCode}
                          </span>
                        )}
                        {getRatingBadge(cust.rating)}
                      </div>
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
                    {cust.representative && (
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={13} className="text-primary-500 shrink-0" />
                        <span className="truncate font-semibold">{cust.representative}</span>
                      </div>
                    )}
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
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-bd/40 pt-4 text-[13px]">
          <div className="text-[12px] font-mono text-txt-muted">
            Trang <span className="font-bold text-txt-primary">{currentPage}</span> / {totalPages} ({filteredCustomers.length} đối tác)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-xl border border-bd bg-surface px-3 py-1.5 font-bold text-txt-secondary hover:bg-subtle disabled:opacity-40 transition-colors"
            >
              <span>Trang trước</span>
            </button>

            <div className="flex items-center gap-1 font-mono text-[12px]">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 7) {
                  if (currentPage > 4 && currentPage < totalPages - 3) {
                    pageNum = currentPage - 3 + i;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  }
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-all ${
                      currentPage === pageNum
                        ? 'bg-primary-500 text-white shadow-card'
                        : 'border border-bd hover:bg-subtle text-txt-secondary'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-xl border border-bd bg-surface px-3 py-1.5 font-bold text-txt-secondary hover:bg-subtle disabled:opacity-40 transition-colors"
            >
              <span>Trang sau</span>
            </button>
          </div>
        </div>
      )}

      {/* Slide Panel Drawer */}
      {panelMode && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setPanelMode(null)}
          />

          {/* Slide Drawer Content */}
          <div className="relative w-full max-w-xl bg-surface border-l border-bd shadow-2xl flex flex-col h-full z-10 animate-slideIn">
            
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
                  <div className="space-y-2 border-b border-bd/40 pb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold font-mono tracking-widest text-primary-500 bg-primary-500/10 px-2.5 py-1 rounded-lg border border-primary-500/20 uppercase inline-block">
                        {activeCustomer.code}
                      </span>
                      {getRatingBadge(activeCustomer.rating)}
                      {activeCustomer.type && (
                        <span className="text-[10px] font-bold text-txt-muted bg-subtle px-2 py-0.5 rounded border border-bd">
                          {activeCustomer.type}
                        </span>
                      )}
                    </div>
                    <h2 className="text-[16px] font-black text-txt-primary leading-snug">
                      {activeCustomer.name}
                    </h2>
                  </div>

                  {/* Details Card */}
                  <div className="card p-5 space-y-3.5 bg-subtle/10 border-bd/30">
                    {activeCustomer.taxCode && (
                      <div className="flex items-start gap-3 text-[13px]">
                        <FileText size={15} className="text-primary-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Mã số thuế (MST)</span>
                          <span className="text-primary-400 font-mono font-bold">{activeCustomer.taxCode}</span>
                        </div>
                      </div>
                    )}

                    {activeCustomer.representative && (
                      <div className="flex items-start gap-3 text-[13px]">
                        <ShieldCheck size={15} className="text-primary-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Người đại diện pháp luật</span>
                          <span className="text-txt-primary font-bold">{activeCustomer.representative}</span>
                        </div>
                      </div>
                    )}

                    {activeCustomer.contactPerson && (
                      <div className="flex items-start gap-3 text-[13px]">
                        <UserCheck size={15} className="text-txt-muted mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Người liên hệ chính</span>
                          <span className="text-txt-secondary font-semibold">{activeCustomer.contactPerson}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3 text-[13px]">
                      <Mail size={15} className="text-txt-muted mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Email liên hệ</span>
                        <span className="text-txt-secondary font-semibold">{activeCustomer.email || 'Chưa cập nhật'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-[13px]">
                      <Phone size={15} className="text-txt-muted mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Số điện thoại</span>
                        <span className="text-txt-secondary font-semibold">{activeCustomer.phone || 'Chưa cập nhật'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-[13px]">
                      <MapPin size={15} className="text-txt-muted mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Địa chỉ trụ sở</span>
                        <span className="text-txt-secondary font-semibold leading-relaxed">{activeCustomer.address || 'Chưa cập nhật'}</span>
                      </div>
                    </div>

                    {activeCustomer.website && (
                      <div className="flex items-start gap-3 text-[13px]">
                        <Globe size={15} className="text-txt-muted mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Website</span>
                          <a href={activeCustomer.website.startsWith('http') ? activeCustomer.website : `https://${activeCustomer.website}`} target="_blank" rel="noreferrer" className="text-primary-400 font-semibold hover:underline flex items-center gap-1">
                            <span>{activeCustomer.website}</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    )}

                    {activeCustomer.notes && (
                      <div className="flex items-start gap-3 text-[13px] border-t border-bd/40 pt-3">
                        <Info size={15} className="text-txt-muted mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-txt-muted block uppercase tracking-wider">Ghi chú</span>
                          <p className="text-txt-secondary leading-relaxed italic">{activeCustomer.notes}</p>
                        </div>
                      </div>
                    )}
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
                  {/* Mã số thuế & VietQR API Lookup */}
                  <div className="rounded-xl border border-primary-500/30 bg-primary-500/5 p-3.5 space-y-2">
                    <label className="text-[11px] font-bold text-primary-400 flex items-center justify-between uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={13} className="text-primary-400" />
                        <span>Tra cứu thông tin theo Mã số thuế (MST)</span>
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
                        <input
                          type="text"
                          value={taxCode}
                          onChange={e => {
                            setTaxCode(e.target.value);
                            if (taxSearchSuccess) setTaxSearchSuccess('');
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleLookupTax();
                            }
                          }}
                          placeholder="Nhập mã số thuế (VD: 0100109106)..."
                          className="w-full rounded-xl border border-bd bg-app pl-9 pr-3 py-2 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleLookupTax}
                        disabled={isSearchingTax || !taxCode.trim()}
                        className="flex items-center gap-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-50 px-3.5 py-2 text-[12px] font-bold text-white transition-all shadow-sm shrink-0"
                      >
                        {isSearchingTax ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Đang tra...</span>
                          </>
                        ) : (
                          <>
                            <Search size={13} />
                            <span>Tra cứu</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-txt-muted">
                      Tự động tìm kiếm Tên công ty, Địa chỉ trụ sở và Tạo mã code từ API VietQR.
                    </p>
                  </div>

                  {taxSearchSuccess && (
                    <div className="rounded-lg bg-success-500/10 border border-success-500/20 p-3 text-[12px] text-success-400 flex items-center gap-2">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>{taxSearchSuccess}</span>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="rounded-lg bg-danger-500/10 border border-danger-500/20 p-3 text-[12px] text-danger-400 flex items-center gap-2">
                      <AlertTriangle size={14} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Tên Khách hàng / Chủ đầu tư *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ví dụ: Ban Quản lý Dự án ĐTXD Công trình Giao thông"
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
                        placeholder="Ví dụ: BQL-GT"
                        className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Loại hình tổ chức</label>
                      <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                      >
                        <option value="Chủ đầu tư">Chủ đầu tư</option>
                        <option value="Ban QLDA">Ban QLDA</option>
                        <option value="Cơ quan nhà nước & Viện">Cơ quan nhà nước & Viện</option>
                        <option value="Tập đoàn & Tổng công ty">Tập đoàn & Tổng công ty</option>
                        <option value="Doanh nghiệp">Doanh nghiệp</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Đại diện pháp luật</label>
                      <input
                        type="text"
                        value={representative}
                        onChange={e => setRepresentative(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Người liên hệ chính</label>
                      <input
                        type="text"
                        value={contactPerson}
                        onChange={e => setContactPerson(e.target.value)}
                        placeholder="Ví dụ: Trần Thị B"
                        className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Website</label>
                      <input
                        type="text"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                        placeholder="Ví dụ: company.com.vn"
                        className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Phân hạng</label>
                      <select
                        value={rating}
                        onChange={e => setRating(e.target.value)}
                        className="w-full rounded-xl border border-bd bg-app px-3 py-2.5 text-[13px] text-txt-primary focus:border-primary-500 focus:outline-none"
                      >
                        <option value="Standard">Standard</option>
                        <option value="Gold">Gold</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-txt-secondary block uppercase tracking-wider">Ghi chú bổ sung</label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Nhập ghi chú thêm về dự án hoặc yêu cầu hợp tác..."
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
