'use client'

import { useEffect, useState } from 'react'
import Sidebar from "@/app/dashboard/components/sidebar/page"
import axios from 'axios'
import { FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi'
import CreateExpertiseModal from './create/page'
import EditExpertiseModal from './edit/page'
import ViewExpertiseModal from './view/page'

const ExpertiseList = () => {
  const [expertises, setExpertises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedExpertise, setSelectedExpertise] = useState(null)

  useEffect(() => {
    fetchExpertises()
  }, [])

  const fetchExpertises = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get('https://api.doubtsclear.com/api/admin/expertise', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Updated to match the actual API response structure
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setExpertises(res.data.data)
      } else {
        throw new Error('Invalid data structure received from API')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch expertises')
      setExpertises([])
    } finally {
      setLoading(false)
    }
  }

  const filteredExpertises = expertises.filter(expertise => 
    expertise?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    (expertise?.category?.some(cat => 
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredExpertises.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.max(1, Math.ceil(filteredExpertises.length / itemsPerPage))

  const handleDelete = async (expertiseId) => {
    if (confirm('Are you sure you want to delete this expertise?')) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`https://api.doubtsclear.com/api/admin/expertise/${expertiseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchExpertises()
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete expertise')
      }
    }
  }

  const openEditModal = (expertise) => {
    setSelectedExpertise(expertise)
    setShowEditModal(true)
  }

  const openViewModal = (expertise) => {
    setSelectedExpertise(expertise)
    setShowViewModal(true)
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Expertise Management</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-[#E53935] text-white hover:bg-black"
          >
            <FiPlus className="mr-2" /> Create Expertise
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search expertises..."
            className="w-full px-4 py-2 text-black border-b-2 border-gray-300 focus:border-[#E53935]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading expertises...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">_Id</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categories</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map(expertise => (
                    <tr key={expertise._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expertise._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">{expertise.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                        {expertise.category?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {expertise.category.slice(0, 3).map((cat, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                {cat}
                              </span>
                            ))}
                            {expertise.category.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                +{expertise.category.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : 'No categories'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(expertise.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => openViewModal(expertise)} className="text-blue-600 hover:text-blue-900">
                            <FiEye />
                          </button>
                          <button onClick={() => openEditModal(expertise)} className="text-yellow-600 hover:text-yellow-900">
                            <FiEdit2 />
                          </button>
                          <button onClick={() => handleDelete(expertise._id)} className="text-red-600 hover:text-red-900">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No expertises found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - Only show if there are items */}
        {filteredExpertises.length > 0 && (
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
          <CreateExpertiseModal 
            onClose={() => setShowCreateModal(false)}
            onExpertiseCreated={fetchExpertises}
          />
        )}

        {showEditModal && (
          <EditExpertiseModal 
            expertise={selectedExpertise}
            onClose={() => setShowEditModal(false)}
            onExpertiseUpdated={fetchExpertises}
          />
        )}

        {showViewModal && (
          <ViewExpertiseModal 
            expertise={selectedExpertise}
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

export default ExpertiseList