'use client'

import { FiEdit2 } from 'react-icons/fi'

const ViewExpertiseModal = ({ expertise, onClose, onEditClick }) => {
  if (!expertise) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Expertise Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">ID</h3>
            <p className="mt-1 text-sm text-gray-900">{expertise._id}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 text-sm text-gray-900">{expertise.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            {expertise.category?.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-2">
                {expertise.category.map((cat, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                    {cat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-gray-500">No categories</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(expertise.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(expertise.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              onEditClick()
              onClose()
            }}
            className="flex items-center px-4 py-2 bg-[#E53935] text-white rounded hover:bg-black"
          >
            <FiEdit2 className="mr-2" />
            Edit Expertise
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewExpertiseModal