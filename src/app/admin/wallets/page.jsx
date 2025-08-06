'use client'

import { useEffect, useState } from 'react'
import Sidebar from "@/app/dashboard/components/sidebar/page"
import axios from 'axios'
import { FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi'
import CreateWalletModal from './create/page'
import EditWalletModal from './edit/page'
import ViewWalletModal from './view/page'

const WalletList = () => {
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [walletsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState(null)

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get('https://api.doubtsclear.com/api/wallet/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setWallets(res.data)
    } catch (err) {
      setError('Failed to fetch wallets')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredWallets = wallets.filter(wallet => 
    wallet._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.offer.toString().includes(searchTerm.toLowerCase())
  )

  const indexOfLastWallet = currentPage * walletsPerPage
  const indexOfFirstWallet = indexOfLastWallet - walletsPerPage
  const currentWallets = filteredWallets.slice(indexOfFirstWallet, indexOfLastWallet)
  const totalPages = Math.ceil(filteredWallets.length / walletsPerPage)

  const handleDelete = async (walletId) => {
    if (confirm('Are you sure you want to delete this wallet?')) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`https://api.doubtsclear.com/api/wallet/${walletId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchWallets()
      } catch (err) {
        setError('Failed to delete wallet')
      }
    }
  }

  const openEditModal = (wallet) => {
    setSelectedWallet(wallet)
    setShowEditModal(true)
  }

  const openViewModal = (wallet) => {
    setSelectedWallet(wallet)
    setShowViewModal(true)
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Wallet Management</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-[#E53935] text-white hover:bg-black"
          >
            <FiPlus className="mr-2" /> Create Wallet
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search wallets..."
            className="w-full px-4 py-2 text-black border-b-2 border-gray-300 focus:border-[#E53935]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading wallets...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentWallets.map(wallet => (
                  <tr key={wallet._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{wallet._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">
                      ₹{wallet.money.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">{wallet.offer}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(wallet.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => openViewModal(wallet)} className="text-blue-600 hover:text-blue-900">
                          <FiEye />
                        </button>
                        <button onClick={() => openEditModal(wallet)} className="text-yellow-600 hover:text-yellow-900">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(wallet._id)} className="text-red-600 hover:text-red-900">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

        {showCreateModal && (
          <CreateWalletModal 
            onClose={() => setShowCreateModal(false)}
            onWalletCreated={fetchWallets}
          />
        )}

        {showEditModal && (
          <EditWalletModal 
            wallet={selectedWallet}
            onClose={() => setShowEditModal(false)}
            onWalletUpdated={fetchWallets}
          />
        )}

        {showViewModal && (
          <ViewWalletModal 
            wallet={selectedWallet}
            onClose={() => setShowViewModal(false)}
            onEditClick={() => {
              setShowViewModal(false)
              setShowEditModal(true)
            }}
          />
        )}
      </main>
    </div>
  )
}

export default WalletList