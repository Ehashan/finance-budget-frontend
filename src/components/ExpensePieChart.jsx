import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR' }).format(n)

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 shadow-xl text-sm">
      <p className="font-medium text-white mb-0.5">{d.name}</p>
      <p className="text-zinc-300 font-mono">{fmt(d.value)}</p>
      <p className="text-zinc-500 text-xs">{d.payload.percent}%</p>
    </div>
  )
}

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
    {payload.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5 text-xs text-zinc-400">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
        {entry.value}
      </div>
    ))}
  </div>
)

const ExpensePieChart = ({ data = [] }) => {
  if (!data.length) return (
    <div className="flex flex-col items-center justify-center h-52 text-zinc-600">
      <p className="text-3xl mb-2">🥧</p>
      <p className="text-sm">No expense data this month</p>
    </div>
  )

  const total = data.reduce((s, d) => s + d.total, 0)
  const enriched = data.map((d) => ({
    ...d, name: d.name, value: d.total,
    percent: total > 0 ? ((d.total / total) * 100).toFixed(1) : 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={enriched} cx="50%" cy="45%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" strokeWidth={0}>
          {enriched.map((entry, i) => <Cell key={i} fill={entry.color || '#6366f1'} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
export default ExpensePieChart
