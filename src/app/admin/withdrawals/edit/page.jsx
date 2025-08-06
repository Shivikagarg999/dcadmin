'use client'

import { useState } from 'react'
import axios from 'axios'

const EditWithdrawalModal = ({ withdrawal, onClose, onEditd }) => {
  const [transactionId, setTransactionId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEdit = async () => {
    if (!transactionId) {
      setError('Please enter transaction ID')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      await axios.post(`https://doubtsclear.com/api/admin/withdraw/Edit/${withdrawal._id}`, {
        transactionId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onEditd()
      onClose()
    } catch (err) {
      setError('Failed to Edit withdrawal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black">Edit Withdrawal</h2>
        
        {/* Modal content */}
      </div>
    </div>
  )
}

export default EditWithdrawalModal