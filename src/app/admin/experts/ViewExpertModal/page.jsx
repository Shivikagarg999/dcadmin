'use client'

import { FiX, FiEdit } from 'react-icons/fi'
import { useState } from 'react'
import { toast } from 'react-toastify'

const ViewExpertModal = ({ expert, onClose, onEditClick, refreshExperts }) => {
  const [isBlocking, setIsBlocking] = useState(false)

  const handleBlockExpert = async (blockStatus) => {
    setIsBlocking(true)
    try {
      const response = await fetch(`https://api.doubtsclear.com/api/admin/expert/block/${expert._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ block: blockStatus })
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success(`Expert ${blockStatus ? 'blocked' : 'unblocked'} successfully`)
        refreshExperts() // Refresh the expert list
        onClose() // Close the modal
      } else {
        throw new Error(data.message || 'Failed to update block status')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsBlocking(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Expert Details</h2>
          <button onClick={onClose} className="text-gray-500">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{expert.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{expert.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{expert.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  expert.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {expert.role}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  expert.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {expert.blocked ? 'Blocked' : 'Active'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex space-x-2">
              <button
                onClick={onEditClick}
                className="flex items-center px-3 py-1 bg-[#E53935] text-white text-sm rounded"
              >
                <FiEdit className="mr-1" /> Edit Expert
              </button>
              <button
                onClick={() => handleBlockExpert(!expert.blocked)}
                disabled={isBlocking}
                className={`flex items-center px-3 py-1 text-sm rounded ${
                  expert.blocked 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-500 text-white'
                } ${isBlocking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isBlocking ? 'Processing...' : expert.blocked ? 'Unblock Expert' : 'Block Expert'}
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1 border border-gray-300 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewExpertModal