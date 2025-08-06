'use client'

import { FiX, FiEdit2 } from 'react-icons/fi'

const ViewQualificationModal = ({ qualification, onClose, onEditClick }) => {
  if (!qualification) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Qualification Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">ID</h3>
            <p className="mt-1 text-sm text-gray-900">{qualification._id}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 text-sm text-gray-900">{qualification.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(qualification.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(qualification.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={() => {
              onEditClick()
              onClose()
            }}
            className="flex items-center px-4 py-2 bg-[#E53935] text-white rounded hover:bg-black"
          >
            <FiEdit2 className="mr-2" />
            Edit Qualification
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewQualificationModal