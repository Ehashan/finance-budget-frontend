import { useState, useCallback } from 'react'
import api from '../api/axios'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [summary,      setSummary]      = useState({ totalIncome: 0, totalExpense: 0, balance: 0 })
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState(null)

  const fetchTransactions = useCallback(async (filters = {}) => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams()
      if (filters.type)      params.append('type',      filters.type)
      if (filters.category)  params.append('category',  filters.category)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate)   params.append('endDate',   filters.endDate)

      const { data } = await api.get(`/transactions?${params}`)
      setTransactions(data.transactions)
      setSummary({
        totalIncome:  data.totalIncome,
        totalExpense: data.totalExpense,
        balance:      data.balance,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTransaction = useCallback(async (payload) => {
    try {
      const { data } = await api.post('/transactions', payload)
      return { success: true, transaction: data.transaction }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create' }
    }
  }, [])

  const updateTransaction = useCallback(async (id, payload) => {
    try {
      const { data } = await api.put(`/transactions/${id}`, payload)
      return { success: true, transaction: data.transaction }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update' }
    }
  }, [])

  const deleteTransaction = useCallback(async (id) => {
    try {
      await api.delete(`/transactions/${id}`)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete' }
    }
  }, [])

  return {
    transactions, summary, loading, error,
    fetchTransactions, createTransaction, updateTransaction, deleteTransaction,
  }
}
