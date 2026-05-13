import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(n)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 shadow-xl text-sm min-w-[140px]">
      <p className="font-medium text-zinc-300 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-zinc-400 capitalize text-xs">{p.name}</span>
          </div>
          <span className="font-mono text-white text-xs">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

const MonthlyBarChart = ({ data = [], currentMonth }) => {
  const chartData = data.map((d) => ({
    name:    MONTH_LABELS[d.month - 1],
    Income:  d.income,
    Expense: d.expense,
    isCurrent: d.month === currentMonth,
  }))

  // Check if there's any data at all
  const hasData = data.some((d) => d.income > 0 || d.expense > 0)

  if (!hasData) return (
    <div className="flex flex-col items-center justify-center h-52 text-zinc-600">
      <p className="text-3xl mb-2">📊</p>
      <p className="text-sm">No transaction data this year</p>
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
        <CartesianGrid vertical={false} stroke="#27272a" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#71717a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#71717a', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08', radius: 6 }} />
        <Legend
          formatter={(val) => <span style={{ color: '#a1a1aa', fontSize: 12 }}>{val}</span>}
        />
        <Bar dataKey="Income"  fill="#25a36d" radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  )
}
export default MonthlyBarChart
