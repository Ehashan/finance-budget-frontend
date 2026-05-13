import { useEffect, useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import Modal             from '../components/Modal'
import CategoryForm      from '../components/CategoryForm'

const Categories = () => {
  const {
    categories, loading,
    fetchCategories, createCategory, updateCategory, deleteCategory,
  } = useCategories()

  const [tab,     setTab]     = useState('expense') // 'expense' | 'income'
  const [modal,   setModal]   = useState(null)       // null | 'add' | 'edit' | 'delete'
  const [active,  setActive]  = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [formErr, setFormErr] = useState('')

  useEffect(() => { fetchCategories() }, [])

  const filtered = categories.filter((c) => c.type === tab)
  const incomeCount  = categories.filter((c) => c.type === 'income').length
  const expenseCount = categories.filter((c) => c.type === 'expense').length

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleAdd = async (payload) => {
    setSaving(true); setFormErr('')
    const res = await createCategory(payload)
    setSaving(false)
    if (res.success) { setModal(null); fetchCategories() }
    else setFormErr(res.message)
  }

  const handleEdit = async (payload) => {
    setSaving(true); setFormErr('')
    const res = await updateCategory(active._id, payload)
    setSaving(false)
    if (res.success) { setModal(null); setActive(null); fetchCategories() }
    else setFormErr(res.message)
  }

  const handleDelete = async () => {
    setSaving(true)
    await deleteCategory(active._id)
    setSaving(false)
    setModal(null); setActive(null)
    fetchCategories()
  }

  const openEdit = (cat) => { setActive(cat); setModal('edit') }
  const openDelete = (cat) => { setActive(cat); setModal('delete') }

  return (
    <div className="fade-up max-w-3xl">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Categories</h2>
          <p className="text-zinc-500 text-sm mt-0.5">{categories.length} total categories</p>
        </div>
        <button onClick={() => { setFormErr(''); setModal('add') }} className="btn-primary">
          + Add category
        </button>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 mb-6 fade-up fade-up-1">
        <div className="card-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 text-lg">↑</div>
          <div>
            <p className="text-2xl font-display font-bold text-white">{incomeCount}</p>
            <p className="text-xs text-zinc-500">Income categories</p>
          </div>
        </div>
        <div className="card-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 text-lg">↓</div>
          <div>
            <p className="text-2xl font-display font-bold text-white">{expenseCount}</p>
            <p className="text-xs text-zinc-500">Expense categories</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 mb-5 fade-up fade-up-2 w-fit">
        {['expense', 'income'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-150
              ${tab === t ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            {t === 'income' ? '↑ Income' : '↓ Expense'} ({t === 'income' ? incomeCount : expenseCount})
          </button>
        ))}
      </div>

      {/* ── Category grid ────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="w-8 h-8 border-2 border-zinc-700 border-t-brand-400 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">🗂</p>
          <p className="text-zinc-400 font-medium">No {tab} categories yet</p>
          <p className="text-zinc-600 text-sm mt-1">Click "Add category" to create one</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 fade-up fade-up-3">
          {filtered.map((cat) => (
            <div
              key={cat._id}
              className="card-sm group relative hover:border-zinc-700 transition-colors"
            >
              {/* Color bar on left */}
              <div
                className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                style={{ background: cat.color }}
              />

              <div className="pl-3">
                {/* Badge preview */}
                <div className="mb-3">
                  <span
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background: `${cat.color}22`, color: cat.color }}
                  >
                    {cat.name}
                  </span>
                </div>

                <p className="text-sm font-medium text-zinc-100">{cat.name}</p>
                <p className="text-xs text-zinc-600 capitalize mt-0.5">{cat.type}</p>
              </div>

              {/* Action buttons (show on hover) */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(cat)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400
                             hover:text-zinc-100 hover:bg-zinc-700 transition-colors text-xs"
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  onClick={() => openDelete(cat)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400
                             hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add modal ────────────────────────────────────────────────────── */}
      <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add Category" size="sm">
        {formErr && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {formErr}
          </div>
        )}
        <CategoryForm
          initial={{ type: tab }}
          onSubmit={handleAdd}
          onCancel={() => setModal(null)}
          loading={saving}
        />
      </Modal>

      {/* ── Edit modal ───────────────────────────────────────────────────── */}
      <Modal isOpen={modal === 'edit'} onClose={() => { setModal(null); setActive(null) }} title="Edit Category" size="sm">
        {formErr && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {formErr}
          </div>
        )}
        {active && (
          <CategoryForm
            initial={active}
            onSubmit={handleEdit}
            onCancel={() => { setModal(null); setActive(null) }}
            loading={saving}
          />
        )}
      </Modal>

      {/* ── Delete confirm ───────────────────────────────────────────────── */}
      <Modal isOpen={modal === 'delete'} onClose={() => { setModal(null); setActive(null) }} title="Delete Category" size="sm">
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-5"
          style={{ background: `${active?.color}15`, border: `1px solid ${active?.color}30` }}
        >
          <div
            className="w-8 h-8 rounded-lg flex-shrink-0"
            style={{ background: active?.color }}
          />
          <div>
            <p className="text-sm font-medium text-white">{active?.name}</p>
            <p className="text-xs text-zinc-500 capitalize">{active?.type}</p>
          </div>
        </div>

        <p className="text-zinc-400 text-sm mb-6">
          Deleting this category will not delete existing transactions, but they will lose their category reference.
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

export default Categories