import { useEffect, useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useCategories }   from '../hooks/useCategories'
import Modal               from '../components/Modal'
import TransactionForm     from '../components/TransactionForm'

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const todayStr = () => new Date().toISOString().split('T')[0]

// ── component ─────────────────────────────────────────────────────────────────
const Transactions = () => {
  const {
    transactions, summary, loading,
    fetchTransactions, createTransaction, updateTransaction, deleteTransaction,
  } = useTransactions()
  const { categories, fetchCategories } = useCategories()

  // Filters
  const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '' })

  // Modal state
  const [modal,   setModal]   = useState(null)   // null | 'add' | 'edit' | 'delete'
  const [active,  setActive]  = useState(null)   // current transaction being edited/deleted
  const [saving,  setSaving]  = useState(false)
  const [formErr, setFormErr] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchTransactions()
  }, [])

  const applyFilters = () => fetchTransactions(filters)

  const resetFilters = () => {
    const empty = { type: '', category: '', startDate: '', endDate: '' }
    setFilters(empty)
    fetchTransactions(empty)
  }

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleAdd = async (payload) => {
    setSaving(true); setFormErr('')
    const res = await createTransaction(payload)
    setSaving(false)
    if (res.success) { setModal(null); fetchTransactions(filters) }
    else setFormErr(res.message)
  }

  const handleEdit = async (payload) => {
    setSaving(true); setFormErr('')
    const res = await updateTransaction(active._id, payload)
    setSaving(false)
    if (res.success) { setModal(null); setActive(null); fetchTransactions(filters) }
    else setFormErr(res.message)
  }

  const handleDelete = async () => {
    setSaving(true)
    await deleteTransaction(active._id)
    setSaving(false)
    setModal(null); setActive(null)
    fetchTransactions(filters)
  }

  const openEdit = (tx) => {
    setActive(tx)
    setModal('edit')
  }

  const openDelete = (tx) => {
    setActive(tx)
    setModal('delete')
  }

  // Convert transaction for form initial values
  const txToForm = (tx) => ({
    _id:      tx._id,
    title:    tx.title,
    amount:   tx.amount,
    type:     tx.type,
    category: tx.category?._id || '',
    date:     tx.date ? tx.date.split('T')[0] : '',
    note:     tx.note || '',
  })

  return (
    <div className="fade-up max-w-5xl">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Transactions</h2>
          <p className="text-zinc-500 text-sm mt-0.5">{transactions.length} records</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary">
          + Add transaction
        </button>
      </div>

      {/* ── Summary strip ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6 fade-up fade-up-1">
        <div className="card-sm">
          <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Total Income</p>
          <p className="text-xl font-display font-bold text-brand-400">{fmt(summary.totalIncome)}</p>
        </div>
        <div className="card-sm">
          <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Total Expenses</p>
          <p className="text-xl font-display font-bold text-red-400">{fmt(summary.totalExpense)}</p>
        </div>
        <div className="card-sm">
          <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Balance</p>
          <p className={`text-xl font-display font-bold ${summary.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
            {fmt(summary.balance)}
          </p>
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div className="card mb-6 fade-up fade-up-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {/* Type */}
          <div>
            <label className="label">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input"
            >
              <option value="">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Start date */}
          <div>
            <label className="label">From</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="input"
            />
          </div>

          {/* End date */}
          <div>
            <label className="label">To</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={applyFilters} className="btn-primary">Apply filters</button>
          <button onClick={resetFilters} className="btn-secondary">Reset</button>
        </div>
      </div>

      {/* ── Transaction list ─────────────────────────────────────────────── */}
      <div className="card fade-up fade-up-3">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="w-8 h-8 border-2 border-zinc-700 border-t-brand-400 rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-zinc-400 font-medium">No transactions found</p>
            <p className="text-zinc-600 text-sm mt-1">Add one or adjust your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {transactions.map((tx, i) => (
              <div
                key={tx._id}
                className="flex items-center gap-4 py-3.5 px-1 hover:bg-zinc-800/40 rounded-xl transition-colors group"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                {/* Color dot */}
                <div
                  className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{
                    background: `${tx.category?.color || '#888'}22`,
                    color: tx.category?.color || '#888',
                  }}
                >
                  {tx.title[0].toUpperCase()}
                </div>

                {/* Title + category */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{tx.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {tx.category && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: `${tx.category.color}22`,
                          color: tx.category.color,
                        }}
                      >
                        {tx.category.name}
                      </span>
                    )}
                    <span className="text-xs text-zinc-600">{fmtDate(tx.date)}</span>
                    {tx.note && <span className="text-xs text-zinc-600 truncate">· {tx.note}</span>}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold font-mono ${
                    tx.type === 'income' ? 'text-brand-400' : 'text-red-400'
                  }`}>
                    {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
                  </p>
                  <span className={`text-xs ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                    {tx.type}
                  </span>
                </div>

                {/* Actions (show on hover) */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => openEdit(tx)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400
                               hover:text-zinc-100 hover:bg-zinc-700 transition-colors text-sm"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => openDelete(tx)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400
                               hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add modal ────────────────────────────────────────────────────── */}
      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Transaction" size="md">
        {formErr && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {formErr}
          </div>
        )}
        <TransactionForm
          initial={{ date: todayStr() }}
          categories={categories}
          onSubmit={handleAdd}
          onCancel={() => setModal(null)}
          loading={saving}
        />
      </Modal>

      {/* ── Edit modal ───────────────────────────────────────────────────── */}
      <Modal isOpen={modal === 'edit'} onClose={() => { setModal(null); setActive(null) }} title="Edit Transaction" size="md">
        {formErr && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {formErr}
          </div>
        )}
        {active && (
          <TransactionForm
            initial={txToForm(active)}
            categories={categories}
            onSubmit={handleEdit}
            onCancel={() => { setModal(null); setActive(null) }}
            loading={saving}
          />
        )}
      </Modal>

      {/* ── Delete confirm modal ─────────────────────────────────────────── */}
      <Modal isOpen={modal === 'delete'} onClose={() => { setModal(null); setActive(null) }} title="Delete Transaction" size="sm">
        <p className="text-zinc-400 text-sm mb-6">
          Are you sure you want to delete{' '}
          <span className="text-white font-medium">"{active?.title}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => { setModal(null); setActive(null) }} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={saving} className="btn-danger flex-1 justify-center">
            {saving
              ? <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              : 'Delete'
            }
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Transactions