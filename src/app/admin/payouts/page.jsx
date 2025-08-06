'use client'

import { useEffect, useState } from 'react'
import Sidebar from "@/app/dashboard/components/sidebar/page"
import axios from 'axios'
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiDownload } from 'react-icons/fi'

const PayoutList = () => {
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Form states
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    expertId: '',
    withdrawalId: '',
    amount: '',
    method: 'UPI',
    transactionId: '',
    upiId: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      holderName: ''
    }
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchPayouts()
  }, [])

  const fetchPayouts = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get('https://api.doubtsclear.com/api/admin/withdraw/payouts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPayouts(res.data.data || [])
    } catch (err) {
      setError('Failed to fetch payouts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayouts = payouts.filter(payout => 
    payout._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payout.transactionId && payout.transactionId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (payout.expertId?._id && payout.expertId._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (payout.expertId?.name && payout.expertId.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPayouts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage)

  const handleDelete = async (payoutId) => {
    if (confirm('Are you sure you want to delete this payout?')) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`https://api.doubtsclear.com/api/admin/payouts/${payoutId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchPayouts()
      } catch (err) {
        setError('Failed to delete payout')
      }
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Expert Name', 'Expert ID', 'Amount', 'Method', 'Transaction ID', 'Paid At']
    const csvContent = [
      headers.join(','),
      ...filteredPayouts.map(payout => [
        payout._id,
        payout.expertId?.name || 'N/A',
        payout.expertId?._id || 'N/A',
        payout.amount,
        payout.method,
        payout.transactionId,
        payout.paidAt ? new Date(payout.paidAt).toLocaleString() : 'N/A'
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'payouts.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('bankDetails.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const payload = {
        expertId: formData.expertId,
        withdrawalId: formData.withdrawalId,
        amount: formData.amount,
        method: formData.method,
        transactionId: formData.transactionId,
        ...(formData.method === 'UPI' ? { upiId: formData.upiId } : {}),
        ...(formData.method === 'Bank Transfer' ? { 
          bankDetails: formData.bankDetails 
        } : {})
      }

      if (editingId) {
        await axios.put(`https://api.doubtsclear.com/api/admin/payouts/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post('http://localhost:5000/api/admin/withdraw/create-payout', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      
      fetchPayouts()
      setShowForm(false)
      setFormData({
        expertId: '',
        withdrawalId: '',
        amount: '',
        method: 'UPI',
        transactionId: '',
        upiId: '',
        bankDetails: {
          accountNumber: '',
          ifscCode: '',
          holderName: ''
        }
      })
      setEditingId(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save payout')
    }
  }

  const startEdit = (payout) => {
    setFormData({
      expertId: payout.expertId?._id || '',
      withdrawalId: payout.withdrawalId?._id || '',
      amount: payout.amount,
      method: payout.method,
      transactionId: payout.transactionId,
      upiId: payout.upiId || '',
      bankDetails: payout.bankDetails || {
        accountNumber: '',
        ifscCode: '',
        holderName: ''
      }
    })
    setEditingId(payout._id)
    setShowForm(true)
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payouts</h1>
          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              <FiDownload className="mr-2" /> Export Data
            </button>
            <button
              onClick={() => {
                setEditingId(null)
                setShowForm(true)
              }}
              className="flex items-center px-4 py-2 bg-[#E53935] text-white hover:bg-black"
            >
              <FiPlus className="mr-2" /> Add Data
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Payout' : 'Add New Payout'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expert ID</label>
                  <input
                    type="text"
                    name="expertId"
                    value={formData.expertId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal ID</label>
                  <input
                    type="text"
                    name="withdrawalId"
                    value={formData.withdrawalId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {formData.method === 'UPI' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required={formData.method === 'UPI'}
                    />
                  </div>
                )}
                {formData.method === 'Bank Transfer' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        name="bankDetails.accountNumber"
                        value={formData.bankDetails.accountNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={formData.method === 'Bank Transfer'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        name="bankDetails.ifscCode"
                        value={formData.bankDetails.ifscCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={formData.method === 'Bank Transfer'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                      <input
                        type="text"
                        name="bankDetails.holderName"
                        value={formData.bankDetails.holderName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={formData.method === 'Bank Transfer'}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E53935] text-white rounded-md"
                >
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search payouts..."
            className="w-full px-4 py-2 text-black border-b-2 border-gray-300 focus:border-[#E53935]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading payouts...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expert Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expert ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map(payout => (
                    <tr key={payout._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payout.expertId?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payout.expertId?._id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.transactionId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payout.paidAt ? new Date(payout.paidAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => startEdit(payout)} className="text-yellow-600 hover:text-yellow-900">
                            <FiEdit2 />
                          </button>
                          <button onClick={() => handleDelete(payout._id)} className="text-red-600 hover:text-red-900">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      No payouts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border text-black border-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className='text-black'>
            {filteredPayouts.length} items • Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 text-black border-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  )
}

export default PayoutList