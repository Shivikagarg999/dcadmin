'use client'

import { useState } from 'react'
import axios from 'axios'
import { FiX } from 'react-icons/fi'

const CreateExpertModal = ({ onClose, onExpertCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'expert',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      await axios.post('https://api.doubtsclear.com/api/admin/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onExpertCreated()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create expert')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Create New Expert</h2>
          <button onClick={onClose} className="text-gray-500">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border-b border-gray-300 focus:border-[#E53935]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border-b border-gray-300 focus:border-[#E53935]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border-b border-gray-300 focus:border-[#E53935]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border-b border-gray-300 focus:border-[#E53935]"
              >
                <option value="expert">Expert</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border-b border-gray-300 focus:border-[#E53935]"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#E53935] text-white rounded disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Expert'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateExpertModal