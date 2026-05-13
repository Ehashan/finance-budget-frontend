import { Link } from 'react-router-dom'

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const RecentTransactions = ({ transactions = [] }) => {
  if (!transactions.length) return (
    <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
      <p className="text-3xl mb-2">📭</p>
      <p className="text-sm">No transactions yet</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-0">
      {transactions.map((tx, i) => (
        <div
          key={tx._id}
          className="flex items-center gap-3 py-3 border-b border-zinc-800 last:border-0
                     hover:bg-zinc-800/30 px-1 rounded-lg transition-colors"
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
            style={{
              background: `${tx.category?.color || '#888'}22`,
              color: tx.category?.color || '#888',
            }}
          >
            {tx.title?.[0]?.toUpperCase() || '?'}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">{tx.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {tx.category && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: `${tx.category.color}22`, color: tx.category.color }}
                >
                  {tx.category.name}
                </span>
              )}
              <span className="text-xs text-zinc-600">{fmtDate(tx.date)}</span>
            </div>
          </div>

          {/* Amount */}
          <p className={`text-sm font-semibold font-mono flex-shrink-0 ${
            tx.type === 'income' ? 'text-brand-400' : 'text-red-400'
          }`}>
            {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
          </p>
        </div>
      ))}

      <Link
        to="/transactions"
        className="text-xs text-brand-400 hover:text-brand-300 text-center pt-4 transition-colors font-medium"
      >
        View all transactions →
      </Link>
    </div>
  )
}
export default RecentTransactions
