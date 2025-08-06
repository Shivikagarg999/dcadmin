'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiX, FiDollarSign, FiPercent } from 'react-icons/fi'
import { toast } from 'react-toastify'

const EditWalletModal = ({ wallet, onClose, onWalletUpdated }) => {
  const [formData, setFormData] = useState({
    money: '',
    offer: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState({})

  // Initialize form with wallet data
  useEffect(() => {
    if (wallet) {
      setFormData({
        money: wallet.money.toString(),
        offer: wallet.offer.toString()
      })
    }
  }, [wallet])

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'money':
        if (!value) error = 'Amount is required'
        else if (isNaN(value) || parseFloat(value) <= 0) error = 'Must be a positive number'
        else if (parseFloat(value) > 1000000) error = 'Amount too large'
        break
      case 'offer':
        if (!value) error = 'Offer percentage is required'
        else if (isNaN(value) || parseFloat(value) <= 0) error = 'Must be positive'
        else if (parseFloat(value) > 100) error = 'Cannot exceed 100%'
        break
      default:
        break
    }
    return error
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key])
    })
    setErrors(newErrors)
    return Object.values(newErrors).every(error => !error)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ money: true, offer: true })
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)
    
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `https://doubt.deltinroyale.club/api/wallet/${wallet._id}`,
        {
          money: parseFloat(formData.money),
          offer: formData.offer
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      toast.success('Wallet updated successfully!')
      onWalletUpdated()
      onClose()
    } catch (err) {
      console.error('Update wallet error:', err)
      toast.error(err.response?.data?.message || 'Failed to update wallet')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg w-full max-w-md animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Edit Wallet</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            <FiX className="text-gray-500" size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="edit-money-input" className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  id="edit-money-input"
                  type="number"
                  name="money"
                  value={formData.money}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-8 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.money ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#E53935] focus:border-[#E53935]'
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={isSubmitting}
                />
              </div>
              {errors.money && touched.money && (
                <p className="mt-1 text-sm text-red-600">{errors.money}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-offer-input" className="block text-sm font-medium text-gray-700 mb-1">
                Offer (%)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPercent className="text-gray-400" />
                </div>
                <input
                  id="edit-offer-input"
                  type="number"
                  name="offer"
                  value={formData.offer}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`pl-8 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.offer ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#E53935] focus:border-[#E53935]'
                  }`}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  disabled={isSubmitting}
                />
              </div>
              {errors.offer && touched.offer && (
                <p className="mt-1 text-sm text-red-600">{errors.offer}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#E53935] text-white rounded-md hover:bg-[#C62828] transition-colors disabled:opacity-50 disabled:hover:bg-[#E53935] flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating
                  </>
                ) : 'Update Wallet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditWalletModal