import { useState, useEffect } from 'react'

const EMPTY = { title: '', amount: '', type: 'expense', category: '', date: '', note: '' }

const TransactionForm = ({ initial = {}, categories, onSubmit, onCancel, loading }) => {
  const [form,  setForm]  = useState({ ...EMPTY, ...initial })
  const [error, setError] = useState('')

  // Filter categories by selected type
  const filteredCats = categories.filter((c) => c.type === form.type)

  // Reset category when type changes
  useEffect(() => {
    if (form.category) {
      const stillValid = categories.find(
        (c) => c._id === form.category && c.type === form.type
      )
      if (!stillValid) setForm((f) => ({ ...f, category: '' }))
    }
  }, [form.type])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim())  return setError('Title is required')
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      return setError('Enter a valid amount')
    if (!form.category)      return setError('Select a category')
    if (!form.date)          return setError('Date is required')

    onSubmit({
      title:    form.title.trim(),
      amount:   parseFloat(form.amount),
      type:     form.type,
      category: form.category,
      date:     form.date,
      note:     form.note.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Type toggle */}
      <div>
        <label className="label">Type</label>
        <div className="flex rounded-xl overflow-hidden border border-zinc-700">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, type: t })}
              className={`flex-1 py-2.5 text-sm font-medium capitalize transition-all duration-150
                ${form.type === t
                  ? t === 'income'
                    ? 'bg-brand-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
            >
              {t === 'income' ? '↑ Income' : '↓ Expense'}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="label">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Monthly Salary"
          className="input"
        />
      </div>

      {/* Amount + Category row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Amount</label>
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="input"
          />
        </div>
        <div>
          <label className="label">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input">
            <option value="">Select...</option>
            {filteredCats.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="label">Date</label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* Note */}
      <div>
        <label className="label">Note <span className="text-zinc-600 normal-case">(optional)</span></label>
        <input
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Add a note..."
          className="input"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1 justify-center">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : initial._id ? 'Save changes' : 'Add transaction'
          }
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
