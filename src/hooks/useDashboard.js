import { useState, useCallback } from 'react'
import api from '../api/axios'

export const useDashboard = () => {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetchDashboard = useCallback(async (month, year) => {
    setLoading(true); setError(null)
    try {
      const { data: res } = await api.get(`/dashboard?month=${month}&year=${year}`)
      setData(res)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchDashboard }
}
