import { useState, useEffect } from 'react'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const BudgetForm = ({ initial = {}, categories, onSubmit, onCancel, loading }) => {
  const now = new Date()

  const [form,  setForm]  = useState({
    category: initial.category?._id || initial.category || '',
    amount:   initial.amount   || '',
    period:   initial.period   || 'monthly',
    month:    initial.month    || now.getMonth() + 1,
    year:     initial.year     || now.getFullYear(),
  })
  const [error, setError] = useState('')

  // Only show expense categories (budgets are for spending limits)
  const expenseCategories = categories.filter((c) => c.type === 'expense')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.category)                           return setError('Please select a category')
    if (!form.amount || Number(form.amount) <= 0) return setError('Enter a valid budget amount')

    onSubmit({
      category: form.category,
      amount:   parseFloat(form.amount),
      period:   form.period,
      month:    parseInt(form.month),
      year:     parseInt(form.year),
    })
  }

  // Find selected category for preview
  const selectedCat = expenseCategories.find((c) => c._id === form.category)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input"
          disabled={!!initial._id} // can't change category on edit
        >
          <option value="">Select expense category...</option>
          {expenseCategories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        {initial._id && (
          <p className="text-xs text-zinc-600 mt-1">Category cannot be changed after creation</p>
        )}
      </div>

      {/* Category preview */}
      {selectedCat && (
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: `${selectedCat.color}12`, border: `1px solid ${selectedCat.color}25` }}
        >
          <div className="w-7 h-7 rounded-lg" style={{ background: selectedCat.color }} />
          <div>
            <p className="text-sm font-medium text-white">{selectedCat.name}</p>
            <p className="text-xs text-zinc-500">Expense category</p>
          </div>
        </div>
      )}

      {/* Amount */}
      <div>
        <label className="label">Budget limit</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono">R </span>
          <input
            name="amount"
            type="number"
            min="1"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="input pl-7"
          />
        </div>
      </div>

      {/* Month + Year row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Month</label>
          <select name="month" value={form.month} onChange={handleChange} className="input">
            {MONTHS.map((m, i) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Year</label>
          <select name="year" value={form.year} onChange={handleChange} className="input">
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1 justify-center">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : initial._id ? 'Save changes' : 'Create budget'
          }
        </button>
      </div>
    </form>
  )
}

export default BudgetForm