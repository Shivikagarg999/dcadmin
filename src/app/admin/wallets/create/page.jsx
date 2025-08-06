'use client'

import { useState } from 'react'
import axios from 'axios'
import { FiX, FiDollarSign, FiPercent } from 'react-icons/fi'
import { toast } from 'react-toastify'

const CreateWalletModal = ({ onClose, onWalletCreated }) => {
  const [formData, setFormData] = useState({
    money: '',
    offer: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (name, value) => {
    let error = ''
    if (name === 'money') {
      if (!value) error = 'Amount is required'
      else if (isNaN(value) || parseFloat(value) <= 0) error = 'Must be a positive amount'
      else if (parseFloat(value) > 10000000) error = 'Amount too large (max ₹1 crore)'
    } else if (name === 'offer') {
      if (!value) error = 'Offer percentage is required'
      else if (isNaN(value) || parseFloat(value) <= 0) error = 'Must be positive'
      else if (parseFloat(value) > 100) error = 'Cannot exceed 100%'
    }
    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const token = localStorage.getItem("token")
      await axios.post('https://api.doubtsclear.com/api/wallet/', {
        money: parseFloat(formData.money),
        offer: formData.offer
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Wallet created successfully!')
      onWalletCreated()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create wallet')
      console.error('Create error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Create New Wallet</h2>
          <button onClick={onClose} className="text-gray-500">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Amount (₹)</label>
              <input
                type="number"
                name="money"
                value={formData.money}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.money ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter amount in ₹"
                required
                min="0"
                step="0.01"
              />
              {errors.money && <p className="text-red-500 text-sm mt-1">{errors.money}</p>}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Offer (%)</label>
              <input
                type="number"
                name="offer"
                value={formData.offer}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.offer ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0-100%"
                required
                min="0"
                max="100"
              />
              {errors.offer && <p className="text-red-500 text-sm mt-1">{errors.offer}</p>}
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
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#E53935] text-white rounded disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Wallet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateWalletModal