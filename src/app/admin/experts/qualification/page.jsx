'use client'

import { useEffect, useState } from 'react'
import Sidebar from "@/app/dashboard/components/sidebar/page"
import axios from 'axios'
import { FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi'
import CreateQualificationModal from './create/page'
import EditQualificationModal from './edit/page'
import ViewQualificationModal from './view/page'

const QualificationList = () => {
  const [qualifications, setQualifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedQualification, setSelectedQualification] = useState(null)

  useEffect(() => {
    fetchQualifications()
  }, [])

  const fetchQualifications = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get('https://api.doubtsclear.com/api/admin/qualification', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Updated to match the actual API response structure
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setQualifications(res.data.data)
      } else {
        throw new Error('Invalid data structure received from API')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch qualifications')
      setQualifications([])
    } finally {
      setLoading(false)
    }
  }

  const filteredQualifications = qualifications.filter(qualification => 
    qualification?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredQualifications.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.max(1, Math.ceil(filteredQualifications.length / itemsPerPage))

  const handleDelete = async (qualificationId) => {
    if (confirm('Are you sure you want to delete this qualification?')) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`https://api.doubtsclear.com/api/admin/qualification/${qualificationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchQualifications()
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete qualification')
      }
    }
  }

  const openEditModal = (qualification) => {
    setSelectedQualification(qualification)
    setShowEditModal(true)
  }

  const openViewModal = (qualification) => {
    setSelectedQualification(qualification)
    setShowViewModal(true)
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Qualification Management</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-[#E53935] text-white hover:bg-black"
          >
            <FiPlus className="mr-2" /> Create Qualification
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search qualifications..."
            className="w-full px-4 py-2 text-black border-b-2 border-gray-300 focus:border-[#E53935]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading qualifications...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">_Id</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map(qualification => (
                    <tr key={qualification._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{qualification._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">{qualification.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(qualification.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => openViewModal(qualification)} className="text-blue-600 hover:text-blue-900">
                            <FiEye />
                          </button>
                          <button onClick={() => openEditModal(qualification)} className="text-yellow-600 hover:text-yellow-900">
                            <FiEdit2 />
                          </button>
                          <button onClick={() => handleDelete(qualification._id)} className="text-red-600 hover:text-red-900">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No qualifications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - Only show if there are items */}
        {filteredQualifications.length > 0 && (
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
        )}

        {/* Modals */}
        {showCreateModal && (
          <CreateQualificationModal 
            onClose={() => setShowCreateModal(false)}
            onQualificationCreated={fetchQualifications}
          />
        )}

        {showEditModal && (
          <EditQualificationModal 
            qualification={selectedQualification}
            onClose={() => setShowEditModal(false)}
            onQualificationUpdated={fetchQualifications}
          />
        )}

        {showViewModal && (
          <ViewQualificationModal 
            qualification={selectedQualification}
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

export default QualificationList