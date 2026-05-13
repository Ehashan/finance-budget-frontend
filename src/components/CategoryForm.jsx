import { useState } from 'react'

const COLORS = [
  '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#ec4899', '#f97316', '#f59e0b', '#ef4444', '#84cc16',
  '#14b8a6', '#6366f1', '#94a3b8', '#e11d48', '#0ea5e9',
]

const EMPTY = { name: '', type: 'expense', color: '#f97316', icon: 'tag' }

const CategoryForm = ({ initial = {}, onSubmit, onCancel, loading }) => {
  const [form,  setForm]  = useState({ ...EMPTY, ...initial })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Category name is required')
    onSubmit({ name: form.name.trim(), type: form.type, color: form.color })
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
                  ? t === 'income' ? 'bg-brand-500 text-white' : 'bg-red-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
            >
              {t === 'income' ? '↑ Income' : '↓ Expense'}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="label">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Groceries"
          className="input"
        />
      </div>

      {/* Color picker */}
      <div>
        <label className="label">Color</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm({ ...form, color: c })}
              className="w-8 h-8 rounded-lg transition-transform hover:scale-110 flex items-center justify-center"
              style={{ background: c }}
            >
              {form.color === c && (
                <span className="text-white text-sm font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
        {/* Preview */}
        <div className="mt-3 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg"
            style={{ background: form.color }}
          />
          <span
            className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: `${form.color}22`, color: form.color }}
          >
            {form.name || 'Preview'}
          </span>
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
            : initial._id ? 'Save changes' : 'Create category'
          }
        </button>
      </div>
    </form>
  )
}

export default CategoryForm
