'use client'

import { useState } from 'react'
import axios from 'axios'
import { FiX } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

const CreateExpertiseModal = ({ onClose, onExpertiseCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: []
  })
  const [currentCategory, setCurrentCategory] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddCategory = () => {
    const trimmed = currentCategory.trim()
    if (trimmed && !formData.category.includes(trimmed)) {
      setFormData({
        ...formData,
        category: [...formData.category, trimmed]
      })
      setCurrentCategory('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCategory()
    }
  }

  const handleRemoveCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      category: formData.category.filter(cat => cat !== categoryToRemove)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        'https://api.doubtsclear.com/api/admin/expertise',
        {
          name: formData.name,
          category: formData.category
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.success) {
        toast.success('Expertise created successfully')
        onExpertiseCreated()
        onClose()
      } else {
        throw new Error(response.data.message || 'Failed to create expertise')
      }
    } catch (err) {
      console.error('Error creating expertise:', err)
      toast.error(err.response?.data?.message || err.message || 'Failed to create expertise')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Create New Expertise</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Categories
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentCategory}
                  onChange={(e) => setCurrentCategory(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                  placeholder="Add new category"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                  disabled={loading || !currentCategory.trim()}
                >
                  Add
                </button>
              </div>
              
              {formData.category.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded">
                  {formData.category.map((category, index) => (
                    <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded">
                      <span className="text-sm">{category}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                        disabled={loading}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No categories added yet</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#E53935] text-white rounded hover:bg-black disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : 'Create Expertise'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateExpertiseModal