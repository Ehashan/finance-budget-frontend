import { useEffect, useState } from 'react'
import { useBudgets }     from '../hooks/useBudgets'
import { useCategories }  from '../hooks/useCategories'
import Modal              from '../components/Modal'
import BudgetForm         from '../components/BudgetForm'
import BudgetCard         from '../components/BudgetCard'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR' }).format(n)

const Budgets = () => {
  const now = new Date()
  const {
    budgets, loading,
    fetchBudgets, createBudget, updateBudget, deleteBudget,
  } = useBudgets()
  const { categories, fetchCategories } = useCategories()

  // Month/year selector
  const [month,  setMonth]  = useState(now.getMonth() + 1)
  const [year,   setYear]   = useState(now.getFullYear())

  // Modal state
  const [modal,   setModal]   = useState(null)
  const [active,  setActive]  = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [formErr, setFormErr] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchBudgets(month, year)
  }, [month, year])

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalBudgeted   = budgets.reduce((s, b) => s + b.amount, 0)
  const totalSpent      = budgets.reduce((s, b) => s + b.spent,  0)
  const overBudgetCount = budgets.filter((b) => b.isOverBudget).length
  const overallPct      = totalBudgeted > 0
    ? Math.min((totalSpent / totalBudgeted) * 100, 100).toFixed(1)
    : 0

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleAdd = async (payload) => {
    setSaving(true); setFormErr('')
    const res = await createBudget(payload)
    setSaving(false)
    if (res.success) {
      setModal(null)
      fetchBudgets(month, year)
    } else {
      setFormErr(res.message)
    }
  }

  const handleEdit = async (payload) => {
    setSaving(true); setFormErr('')
    const res = await updateBudget(active._id, payload)
    setSaving(false)
    if (res.success) {
      setModal(null); setActive(null)
      fetchBudgets(month, year)
    } else {
      setFormErr(res.message)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    await deleteBudget(active._id)
    setSaving(false)
    setModal(null); setActive(null)
    fetchBudgets(month, year)
  }

  const openEdit   = (b) => { setFormErr(''); setActive(b); setModal('edit') }
  const openDelete = (b) => { setActive(b); setModal('delete') }

  // ── Years for selector ─────────────────────────────────────────────────────
  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]

  return (
    <div className="fade-up max-w-5xl">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Budgets</h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            {MONTHS[month - 1]} {year} · {budgets.length} budget{budgets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => { setFormErr(''); setActive(null); setModal('add') }} className="btn-primary">
          + New budget
        </button>
      </div>

      {/* ── Month / Year selector ────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6 fade-up fade-up-1">
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => {
              if (month === 1) { setMonth(12); setYear(y => y - 1) }
              else setMonth(m => m - 1)
            }}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white
                       hover:bg-zinc-800 rounded-lg transition-colors text-sm"
          >
            ‹
          </button>
          <span className="px-3 text-sm font-medium text-white min-w-[120px] text-center">
            {MONTHS[month - 1]} {year}
          </span>
          <button
            onClick={() => {
              if (month === 12) { setMonth(1); setYear(y => y + 1) }
              else setMonth(m => m + 1)
            }}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white
                       hover:bg-zinc-800 rounded-lg transition-colors text-sm"
          >
            ›
          </button>
        </div>

        {/* Quick jump to current month */}
        {(month !== now.getMonth() + 1 || year !== now.getFullYear()) && (
          <button
            onClick={() => { setMonth(now.getMonth() + 1); setYear(now.getFullYear()) }}
            className="btn-secondary py-2 text-xs"
          >
            Today
          </button>
        )}
      </div>

      {/* ── Summary cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 fade-up fade-up-2">
        <div className="card-sm">
          <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Budgeted</p>
          <p className="text-xl font-display font-bold text-white">{fmt(totalBudgeted)}</p>
        </div>
        <div className="card-sm">
          <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Spent</p>
          <p className="text-xl font-display font-bold text-red-400">{fmt(totalSpent)}</p>
        </div>
        <div className="card-sm">
          <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Remaining</p>
          <p className={`text-xl font-display font-bold ${totalBudgeted - totalSpent >= 0 ? 'text-brand-400' : 'text-red-400'}`}>
            {fmt(totalBudgeted - totalSpent)}
          </p>
        </div>
        <div className="card-sm">
          <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Over Budget</p>
          <p className={`text-xl font-display font-bold ${overBudgetCount > 0 ? 'text-red-400' : 'text-brand-400'}`}>
            {overBudgetCount} {overBudgetCount === 1 ? 'category' : 'categories'}
          </p>
        </div>
      </div>

      {/* ── Overall progress bar ─────────────────────────────────────────── */}
      {budgets.length > 0 && (
        <div className="card mb-6 fade-up fade-up-3">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-zinc-300">Overall spending</p>
            <span className="text-xs font-mono text-zinc-400">{fmt(totalSpent)} / {fmt(totalBudgeted)}</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${overallPct}%`,
                background: parseFloat(overallPct) >= 100
                  ? '#ef4444'
                  : parseFloat(overallPct) >= 80
                  ? '#f97316'
                  : '#25a36d',
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-zinc-600">{overallPct}% of total budget used</span>
            <span className="text-xs text-zinc-600">{fmt(totalBudgeted - totalSpent)} left</span>
          </div>
        </div>
      )}

      {/* ── Over-budget alert banner ─────────────────────────────────────── */}
      {overBudgetCount > 0 && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl
                        px-4 py-3 mb-6 fade-up fade-up-3">
          <span className="text-red-400 text-lg flex-shrink-0 mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-medium text-red-400">
              {overBudgetCount} budget{overBudgetCount > 1 ? 's' : ''} exceeded this month
            </p>
            <p className="text-xs text-red-400/70 mt-0.5">
              Review your spending in the categories below and consider adjusting your limits.
            </p>
          </div>
        </div>
      )}

      {/* ── Budget cards grid ────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-2 border-zinc-700 border-t-brand-400 rounded-full animate-spin" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">◎</p>
          <p className="text-zinc-300 font-medium font-display text-lg">No budgets for {MONTHS[month - 1]}</p>
          <p className="text-zinc-600 text-sm mt-2 mb-6">
            Set spending limits to track your expenses and stay on target.
          </p>
          <button
            onClick={() => { setFormErr(''); setActive(null); setModal('add') }}
            className="btn-primary mx-auto"
          >
            + Create your first budget
          </button>
        </div>
      ) : (
        <>
          {/* Over-budget first, then sorted by percentage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-up fade-up-4">
            {[...budgets]
              .sort((a, b) => {
                if (a.isOverBudget !== b.isOverBudget) return a.isOverBudget ? -1 : 1
                return b.percentage - a.percentage
              })
              .map((budget) => (
                <BudgetCard
                  key={budget._id}
                  budget={budget}
                  onEdit={openEdit}
                  onDelete={openDelete}
                />
              ))}
          </div>
        </>
      )}

      {/* ── Add modal ────────────────────────────────────────────────────── */}
      <Modal
        isOpen={modal === 'add'}
        onClose={() => setModal(null)}
        title="New Budget"
        size="md"
      >
        {formErr && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {formErr}
          </div>
        )}
        <BudgetForm
          initial={{ month, year }}
          categories={categories}
          onSubmit={handleAdd}
          onCancel={() => setModal(null)}
          loading={saving}
        />
      </Modal>

      {/* ── Edit modal ───────────────────────────────────────────────────── */}
      <Modal
        isOpen={modal === 'edit'}
        onClose={() => { setModal(null); setActive(null) }}
        title="Edit Budget"
        size="md"
      >
        {formErr && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {formErr}
          </div>
        )}
        {active && (
          <BudgetForm
            initial={active}
            categories={categories}
            onSubmit={handleEdit}
            onCancel={() => { setModal(null); setActive(null) }}
            loading={saving}
          />
        )}
      </Modal>

      {/* ── Delete confirm ───────────────────────────────────────────────── */}
      <Modal
        isOpen={modal === 'delete'}
        onClose={() => { setModal(null); setActive(null) }}
        title="Delete Budget"
        size="sm"
      >
        {active && (
          <>
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-5"
              style={{
                background: `${active.category?.color}12`,
                border: `1px solid ${active.category?.color}25`,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold"
                style={{ background: active.category?.color, color: '#fff' }}
              >
                {active.category?.name?.[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{active.category?.name}</p>
                <p className="text-xs text-zinc-500">
                  {MONTHS[active.month - 1]} {active.year} · limit{' '}
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(active.amount)}
                </p>
              </div>
            </div>

            <p className="text-zinc-400 text-sm mb-6">
              This will remove the budget limit for this category. Your transactions will not be affected.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => { setModal(null); setActive(null) }}
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="btn-danger flex-1 justify-center"
              >
                {saving
                  ? <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                  : 'Delete budget'
                }
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

export default Budgets