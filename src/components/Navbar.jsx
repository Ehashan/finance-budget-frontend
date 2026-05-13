import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⬡' },
  { to: '/transactions', label: 'Transactions', icon: '↕' },
  { to: '/budgets', label: 'Budgets', icon: '◎' },
  { to: '/categories', label: 'Categories', icon: '⊞' },
]

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 z-50 flex items-center justify-between px-4">
        <div>
          <h1 className="font-display text-lg font-bold text-white">
            Finance<span className="text-brand-400">Track</span>
          </h1>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white text-2xl"
        >
          ☰
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col z-50
          transition-transform duration-300

          w-72
          lg:w-56

          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-zinc-800 mt-16 lg:mt-0">
          <h1 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight">
            Finance<span className="text-brand-400">Track</span>
          </h1>

          <p className="text-xs text-zinc-500 mt-1 font-mono">
            personal budget
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-3 rounded-xl
                text-sm lg:text-base font-medium
                transition-all duration-150

                ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                }
              `
              }
            >
              <span className="text-lg w-6 text-center">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-zinc-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-zinc-100 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-sm font-medium
              text-zinc-400 hover:text-red-400 hover:bg-red-500/10
              transition-all duration-150
            "
          >
            <span className="text-lg w-6 text-center">→</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Navbar