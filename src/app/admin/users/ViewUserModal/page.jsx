'use client'

import { FiX, FiEdit } from 'react-icons/fi'

const ViewExpertModal = ({ expert, onClose, onEditClick }) => {
    if (!expert) return null
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
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={onEditClick}
              className="flex items-center px-3 py-1 bg-[#E53935] text-white text-sm rounded"
            >
              <FiEdit className="mr-1" /> Edit Expert
            </button>
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