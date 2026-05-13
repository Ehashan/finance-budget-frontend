import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/',             label: 'Dashboard',    icon: '⬡' },
  { to: '/transactions', label: 'Transactions', icon: '↕' },
  { to: '/budgets',      label: 'Budgets',      icon: '◎' },
  { to: '/categories',   label: 'Categories',   icon: '⊞' },
]

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-zinc-800">
        <h1 className="font-display text-lg font-bold text-white tracking-tight">
          Finance<span className="text-brand-400">Track</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5 font-mono">personal budget</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
               ${isActive
                 ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                 : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
               }`
            }
          >
            <span className="text-base w-5 text-center">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-zinc-800">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-medium text-zinc-100 truncate">{user?.name}</p>
          <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <span className="text-base w-5 text-center">→</span>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Navbar
