import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingDown, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers 
} from 'lucide-react';

const MOCK_BURNDOWN_DATA = [
  { day: 'Ngày 1', Ideal: 48, Actual: 48 },
  { day: 'Ngày 2', Ideal: 42, Actual: 48 },
  { day: 'Ngày 3', Ideal: 36, Actual: 40 },
  { day: 'Ngày 4', Ideal: 30, Actual: 38 },
  { day: 'Ngày 5', Ideal: 24, Actual: 28 },
  { day: 'Ngày 6', Ideal: 18, Actual: 25 },
  { day: 'Ngày 7', Ideal: 12, Actual: 15 },
  { day: 'Ngày 8', Ideal: 6, Actual: null },
  { day: 'Ngày 9', Ideal: 0, Actual: null },
];

export default function Dashboard() {
  const kpis = [
    { name: 'Sprint hiện tại', value: 'Sprint 1', detail: 'Còn lại 3 ngày', icon: Clock, color: 'text-info-500 bg-info-500/10' },
    { name: 'Hoàn thành Sprint', value: '33 / 48 SP', detail: 'Tỉ lệ đạt: 68.7%', icon: CheckCircle2, color: 'text-success-500 bg-success-500/10' },
    { name: 'Nhiệm vụ còn lại', value: '8 Nhiệm vụ', detail: '5 việc đang thực hiện', icon: Layers, color: 'text-warning-500 bg-warning-500/10' },
    { name: 'Lỗi (Bugs) hiện có', value: '3 Lỗi', detail: '2 lỗi nghiêm trọng', icon: AlertCircle, color: 'text-danger-500 bg-danger-500/10' }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="card p-6 flex items-start justify-between">
              <div>
                <span className="eyebrow block mb-1">{kpi.name}</span>
                <span className="text-[22px] font-black tracking-tight text-txt-primary block mb-1">{kpi.value}</span>
                <span className="text-[12px] text-txt-muted block">{kpi.detail}</span>
              </div>
              <div className={`rounded-xl p-3 ${kpi.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Burndown Chart Container */}
      <div className="card p-6">
        <div className="flex items-center justify-between border-b border-bd pb-4 mb-6">
          <div>
            <h3 className="text-[16px] font-bold text-txt-primary">Biểu đồ Burndown (Sprint 1)</h3>
            <p className="text-[12px] text-txt-muted">Theo dõi tốc độ hoàn thành điểm công việc (Story Points) thực tế so với kế hoạch lý thuyết</p>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-success-500 bg-success-500/10 px-2 py-1 rounded-lg">
            <TrendingDown size={14} />
            <span>Tiến độ ổn định</span>
          </div>
        </div>

        <div className="h-96 w-full text-[12px] font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={MOCK_BURNDOWN_DATA}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#263148" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#8896a9" 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#8896a9" 
                tickLine={false} 
                axisLine={false}
                label={{ value: 'Điểm Story Points', angle: -90, position: 'insideLeft', fill: '#8896a9', offset: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1b2333', 
                  borderColor: '#263148',
                  borderRadius: '12px',
                  color: '#f3f6fb'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Ideal" 
                name="Kế hoạch lý thuyết" 
                stroke="#8896a9" 
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
              <Line 
                type="monotone" 
                dataKey="Actual" 
                name="Thực tế hoàn thành" 
                stroke="#00668c" 
                strokeWidth={3}
                dot={{ r: 4, stroke: '#0a0f1a', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
