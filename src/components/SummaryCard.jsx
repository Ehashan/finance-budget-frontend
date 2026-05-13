const SummaryCard = ({ label, value, sub, color = 'brand' }) => {
  const colorMap = {
    brand: { ring: 'bg-brand-500/10', text: 'text-brand-400',  icon: '↑' },
    red:   { ring: 'bg-red-500/10',   text: 'text-red-400',    icon: '↓' },
    white: { ring: 'bg-zinc-800',     text: 'text-white',      icon: '=' },
    amber: { ring: 'bg-amber-500/10', text: 'text-amber-400',  icon: '◎' },
  }
  const c = colorMap[color] || colorMap.white
  return (
    <div className="card hover:border-zinc-700 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">{label}</p>
        <div className={`w-8 h-8 rounded-xl ${c.ring} flex items-center justify-center ${c.text} text-sm`}>
          {c.icon}
        </div>
      </div>
      <p className={`text-2xl font-display font-bold ${c.text} mb-1`}>{value}</p>
      {sub && <p className="text-xs text-zinc-600">{sub}</p>}
    </div>
  )
}
export default SummaryCard
