import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }

    const result = await login(form.email, form.password)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-8 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-8 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-brand-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl fade-up">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Finance<span className="text-brand-400">Track</span>
          </h1>

          <p className="text-zinc-500 text-sm sm:text-base">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="card p-5 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
            
            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm sm:text-base text-red-400">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="label text-sm sm:text-base">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input h-12 sm:h-14 text-sm sm:text-base"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="label text-sm sm:text-base">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input h-12 sm:h-14 text-sm sm:text-base"
                autoComplete="current-password"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center h-12 sm:h-14 text-sm sm:text-base mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-500 text-sm sm:text-base mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login