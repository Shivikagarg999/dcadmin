'use client'

import { FiX, FiDollarSign, FiPercent, FiCalendar, FiClock, FiInfo } from 'react-icons/fi'

const ViewWalletModal = ({ wallet, onClose, onEditClick }) => {
  if (!wallet) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Wallet Details</h2>
          <button onClick={onClose} className="text-gray-500">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FiDollarSign className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{wallet.money.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FiPercent className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Offer</h3>
                <p className="text-xl font-semibold text-gray-900">
                  {wallet.offer}%
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FiCalendar className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                <p className="text-md font-medium text-gray-900">
                  {formatDate(wallet.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <FiClock className="text-yellow-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="text-md font-medium text-gray-900">
                  {formatDate(wallet.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <FiInfo className="text-gray-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Wallet ID</h3>
                <p className="text-sm font-mono text-gray-900 break-all">
                  {wallet._id}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose()
                onEditClick()
              }}
              className="px-4 py-2 bg-[#E53935] text-white rounded-md hover:bg-[#C62828]"
            >
              Edit Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewWalletModal