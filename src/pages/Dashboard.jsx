import { useEffect, useState } from 'react'
import { useDashboard }       from '../hooks/useDashboard'
import SummaryCard            from '../components/SummaryCard'
import ExpensePieChart        from '../components/ExpensePieChart'
import MonthlyBarChart        from '../components/MonthlyBarChart'
import RecentTransactions     from '../components/RecentTransactions'
import BudgetProgressList     from '../components/BudgetProgressList'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
const Skeleton = ({ className = '' }) => <div className={`animate-pulse bg-zinc-800 rounded-xl ${className}`} />

const Dashboard = () => {
  const now = new Date()
  const { data, loading, error, fetchDashboard } = useDashboard()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year,  setYear]  = useState(now.getFullYear())

  useEffect(() => { fetchDashboard(month, year) }, [month, year])

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y-1) } else setMonth(m => m-1) }
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y+1) } else setMonth(m => m+1) }
  const isCurrentMonth = month === now.getMonth()+1 && year === now.getFullYear()

  if (loading && !data) return (
    <div className="fade-up max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div><Skeleton className="h-8 w-40 mb-2" /><Skeleton className="h-4 w-28" /></div>
        <Skeleton className="h-10 w-44" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_,i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <Skeleton className="h-80 rounded-2xl" /><Skeleton className="h-80 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Skeleton className="h-64 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-4xl mb-4">⚠</p>
      <p className="text-zinc-300 font-medium mb-2">Failed to load dashboard</p>
      <p className="text-zinc-600 text-sm mb-6">{error}</p>
      <button onClick={() => fetchDashboard(month, year)} className="btn-primary">Try again</button>
    </div>
  )

  const summary            = data?.summary            || {}
  const monthlyData        = data?.monthlyData        || []
  const categoryBreakdown  = data?.categoryBreakdown  || []
  const budgetProgress     = data?.budgetProgress     || []
  const recentTransactions = data?.recentTransactions || []
  const overBudgetCount    = budgetProgress.filter(b => b.isOverBudget).length

  return (
    <div className="fade-up max-w-6xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-zinc-500 text-sm mt-0.5">{MONTHS[month-1]} {year} overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">‹</button>
            <span className="px-3 text-sm font-medium text-white min-w-[130px] text-center">{MONTHS[month-1]} {year}</span>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">›</button>
          </div>
          {!isCurrentMonth && (
            <button onClick={() => { setMonth(now.getMonth()+1); setYear(now.getFullYear()) }} className="btn-secondary py-2 text-xs">Today</button>
          )}
        </div>
      </div>

      {/* Over-budget alert */}
      {overBudgetCount > 0 && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 fade-up fade-up-1">
          <span className="text-red-400 text-lg">⚠</span>
          <p className="text-sm text-red-400">
            <span className="font-semibold">{overBudgetCount} budget{overBudgetCount > 1 ? 's' : ''} exceeded</span> this month — review your spending below.
          </p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 fade-up fade-up-1">
        <SummaryCard label="Total Income"    value={fmt(summary.totalIncome   || 0)} sub={`${summary.incomeCount  || 0} transactions`} color="brand" />
        <SummaryCard label="Total Expenses"  value={fmt(summary.totalExpense  || 0)} sub={`${summary.expenseCount || 0} transactions`} color="red" />
        <SummaryCard label="Net Balance"     value={fmt(summary.balance       || 0)} sub="This month"      color={summary.balance >= 0 ? 'white' : 'red'} />
        <SummaryCard label="All-time Balance" value={fmt(summary.allTimeBalance || 0)} sub="Across all time" color="amber" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 fade-up fade-up-2">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">Expenses by Category</h3>
            <span className="text-xs text-zinc-600">{MONTHS[month-1]}</span>
          </div>
          <ExpensePieChart data={categoryBreakdown} />
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">Income vs Expenses</h3>
            <span className="text-xs text-zinc-600">{year}</span>
          </div>
          <MonthlyBarChart data={monthlyData} currentMonth={month} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 fade-up fade-up-3">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">Budget Progress</h3>
            <span className="text-xs text-zinc-600">{MONTHS[month-1]}</span>
          </div>
          <BudgetProgressList budgets={budgetProgress} />
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">Recent Transactions</h3>
            <span className="text-xs text-zinc-600">Last 5</span>
          </div>
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>

    </div>
  )
}
export default Dashboard