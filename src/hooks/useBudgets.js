import { useState, useCallback } from 'react'
import api from '../api/axios'

export const useBudgets = () => {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetchBudgets = useCallback(async (month, year) => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.get(`/budgets?month=${month}&year=${year}`)
      setBudgets(data.budgets)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch budgets')
    } finally {
      setLoading(false)
    }
  }, [])

  const createBudget = useCallback(async (payload) => {
    try {
      const { data } = await api.post('/budgets', payload)
      return { success: true, budget: data.budget }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create budget' }
    }
  }, [])

  const updateBudget = useCallback(async (id, payload) => {
    try {
      const { data } = await api.put(`/budgets/${id}`, payload)
      return { success: true, budget: data.budget }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update budget' }
    }
  }, [])

  const deleteBudget = useCallback(async (id) => {
    try {
      await api.delete(`/budgets/${id}`)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete budget' }
    }
  }, [])

  return {
    budgets, loading, error,
    fetchBudgets, createBudget, updateBudget, deleteBudget,
  }
}
