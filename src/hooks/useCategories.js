import { useState, useCallback } from 'react'
import api from '../api/axios'

export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)

  const fetchCategories = useCallback(async (type = '') => {
    setLoading(true); setError(null)
    try {
      const params = type ? `?type=${type}` : ''
      const { data } = await api.get(`/categories${params}`)
      setCategories(data.categories)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }, [])

  const createCategory = useCallback(async (payload) => {
    try {
      const { data } = await api.post('/categories', payload)
      return { success: true, category: data.category }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create' }
    }
  }, [])

  const updateCategory = useCallback(async (id, payload) => {
    try {
      const { data } = await api.put(`/categories/${id}`, payload)
      return { success: true, category: data.category }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update' }
    }
  }, [])

  const deleteCategory = useCallback(async (id) => {
    try {
      await api.delete(`/categories/${id}`)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete' }
    }
  }, [])

  return {
    categories, loading, error,
    fetchCategories, createCategory, updateCategory, deleteCategory,
  }
}
