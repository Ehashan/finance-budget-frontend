import { useEffect, useState } from 'react'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR' }).format(n)

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { category, amount, spent, remaining, percentage, isOverBudget } = budget

  // Animate progress bar on mount
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(percentage), 100)
    return () => clearTimeout(t)
  }, [percentage])

  // Color logic based on usage
  const barColor = isOverBudget
    ? '#ef4444'                                          // red  > 100%
    : percentage >= 80
    ? '#f97316'                                          // orange 80–99%
    : percentage >= 50
    ? '#f59e0b'                                          // amber 50–79%
    : category?.color || '#25a36d'                       // brand < 50%

  const statusLabel = isOverBudget
    ? 'Over budget'
    : percentage >= 80
    ? 'Almost full'
    : percentage >= 50
    ? 'On track'
    : 'Good'

  return (
    <div className={`card group relative transition-all duration-200 hover:border-zinc-700
      ${isOverBudget ? 'border-red-500/30 bg-red-500/5' : ''}`}
    >
      {/* Over-budget alert banner */}
      {isOverBudget && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl
                        px-3 py-2 mb-4 text-xs text-red-400 font-medium">
          <span>⚠</span>
          Over budget by {fmt(Math.abs(remaining))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: `${category?.color}22`, color: category?.color }}
          >
            {category?.name?.[0] || '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{category?.name}</p>
            <p className="text-xs text-zinc-500 capitalize">{budget.period} budget</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(budget)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400
                       hover:text-zinc-100 hover:bg-zinc-700 transition-colors text-xs"
            title="Edit budget"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(budget)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400
                       hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
            title="Delete budget"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium" style={{ color: barColor }}>{statusLabel}</span>
          <span className="text-xs font-mono text-zinc-400">{percentage}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${width}%`, background: barColor }}
          />
        </div>
      </div>

      {/* Amount breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800">
        <div>
          <p className="text-xs text-zinc-600 mb-0.5">Spent</p>
          <p className="text-sm font-semibold font-mono text-red-400">{fmt(spent)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-600 mb-0.5">Remaining</p>
          <p className={`text-sm font-semibold font-mono ${remaining < 0 ? 'text-red-400' : 'text-brand-400'}`}>
            {fmt(remaining)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-600 mb-0.5">Limit</p>
          <p className="text-sm font-semibold font-mono text-zinc-200">{fmt(amount)}</p>
        </div>
      </div>
    </div>
  )
}

export default BudgetCard