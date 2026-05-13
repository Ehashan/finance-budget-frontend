import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

const BudgetProgressItem = ({ budget }) => {
  const { category, amount, spent, percentage, isOverBudget } = budget
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(percentage), 150)
    return () => clearTimeout(t)
  }, [percentage])

  const barColor = isOverBudget ? '#ef4444'
    : percentage >= 80 ? '#f97316'
    : percentage >= 50 ? '#f59e0b'
    : category?.color || '#25a36d'

  return (
    <div className="py-3 border-b border-zinc-800 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: category?.color || '#888' }}
          />
          <span className="text-sm text-zinc-200 font-medium">{category?.name}</span>
          {isOverBudget && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
              Over
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-zinc-400">{fmt(spent)} / {fmt(amount)}</span>
        </div>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, background: barColor }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: barColor }}>{percentage}%</span>
        <span className="text-xs text-zinc-600">
          {isOverBudget ? `${fmt(Math.abs(amount - spent))} over` : `${fmt(amount - spent)} left`}
        </span>
      </div>
    </div>
  )
}

const BudgetProgressList = ({ budgets = [] }) => {
  if (!budgets.length) return (
    <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
      <p className="text-3xl mb-2">◎</p>
      <p className="text-sm">No budgets set this month</p>
      <Link to="/budgets" className="text-xs text-brand-400 hover:text-brand-300 mt-2 transition-colors font-medium">
        Create a budget →
      </Link>
    </div>
  )

  const sorted = [...budgets].sort((a, b) => {
    if (a.isOverBudget !== b.isOverBudget) return a.isOverBudget ? -1 : 1
    return b.percentage - a.percentage
  })

  return (
    <div>
      {sorted.map((b) => <BudgetProgressItem key={b._id} budget={b} />)}
      <Link
        to="/budgets"
        className="text-xs text-brand-400 hover:text-brand-300 text-center block pt-4 transition-colors font-medium"
      >
        Manage budgets →
      </Link>
    </div>
  )
}
export default BudgetProgressList
