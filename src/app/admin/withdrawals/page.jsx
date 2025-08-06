'use client'

import { useEffect, useState } from 'react'
import Sidebar from "@/app/dashboard/components/sidebar/page"
import axios from 'axios'

const WithdrawalsList = () => {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [withdrawalsPerPage] = useState(6)
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Approval modal state
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null)
  const [transactionId, setTransactionId] = useState('')
  const [approveLoading, setApproveLoading] = useState(false)

  useEffect(() => {
    fetchWithdrawals()
  }, [filterStatus])

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get('https://api.doubtsclear.com/api/admin/withdraw/all', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: filterStatus === 'all' ? undefined : filterStatus
        }
      })
      setWithdrawals(res.data.withdrawals)
    } catch (err) {
      setError('Failed to fetch withdrawals')
    } finally {
      setLoading(false)
    }
  }

  // Pagination logic
  const indexOfLastWithdrawal = currentPage * withdrawalsPerPage
  const indexOfFirstWithdrawal = indexOfLastWithdrawal - withdrawalsPerPage
  const currentWithdrawals = withdrawals.slice(indexOfFirstWithdrawal, indexOfLastWithdrawal)
  const totalPages = Math.ceil(withdrawals.length / withdrawalsPerPage)

  const handleApprove = async () => {
    if (!transactionId) {
      alert('Please enter transaction ID')
      return
    }

    setApproveLoading(true)
    try {
      const token = localStorage.getItem("token")
      await axios.post(`https://api.doubtsclear.com/api/admin/withdraw/approve/${selectedWithdrawal._id}`, {
        transactionId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowApproveModal(false)
      setTransactionId('')
      fetchWithdrawals() // Refresh the list
    } catch (err) {
      alert('Failed to approve withdrawal')
    } finally {
      setApproveLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Withdrawals Management</h1>
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 text-black border-b-2 border-gray-300 focus:border-[#E53935]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        {loading ? (
          <p>Loading withdrawals...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expert</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentWithdrawals.map(withdrawal => (
                  <tr key={withdrawal._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {withdrawal.expertId?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {withdrawal.expertId?.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{withdrawal.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {withdrawal.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        withdrawal.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(withdrawal.requestedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {withdrawal.status === 'pending' && (
                        <button 
                          onClick={() => {
                            setSelectedWithdrawal(withdrawal)
                            setShowApproveModal(true)
                          }} 
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
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
          <span className='text-black'>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-black border-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Approval Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-black">Approve Withdrawal</h2>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-1">Expert: {selectedWithdrawal?.expertId?.name}</p>
                <p className="text-gray-700 mb-1">Amount: ₹{selectedWithdrawal?.amount}</p>
                <p className="text-gray-700 mb-1">Method: {selectedWithdrawal?.method}</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Transaction ID</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={approveLoading}
                >
                  {approveLoading ? 'Approving...' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default WithdrawalsList