'use client'

import { useEffect, useState } from 'react'
import Sidebar from "@/app/dashboard/components/sidebar/page"
import axios from 'axios'
import { FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi'
import CreateExpertModal from '../CreateExpertModal/page'
import EditExpertModal from '../EditExpertModal/page'
import ViewExpertModal from '../ViewExpertModal/page'
import Link from 'next/link'

const ExpertsList = () => {
  const [experts, setExperts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [expertsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedExpert, setSelectedExpert] = useState(null)

  useEffect(() => {
    fetchExperts()
  }, [])

  const fetchExperts = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get('http://localhost:5000/api/admin/getVerifiedExperts', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExperts(res.data.experts || [])
    } catch (err) {
      setError('Failed to fetch experts')
    } finally {
      setLoading(false)
    }
  }

  const filteredExperts = experts.filter(expert => 
    expert.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const indexOfLastExpert = currentPage * expertsPerPage
  const indexOfFirstExpert = indexOfLastExpert - expertsPerPage
  const currentExperts = filteredExperts.slice(indexOfFirstExpert, indexOfLastExpert)
  const totalPages = Math.ceil(filteredExperts.length / expertsPerPage)

  const handleDelete = async (expertId) => {
    if (confirm('Are you sure you want to delete this expert?')) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`http://localhost:3000/api/admin/experts/${expertId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchExperts()
      } catch (err) {
        setError('Failed to delete expert')
      }
    }
  }

  const openEditModal = (expert) => {
    setSelectedExpert(expert)
    setShowEditModal(true)
  }

  const openViewModal = (expert) => {
    setSelectedExpert(expert)
    setShowViewModal(true)
  }

  return (
     <div className="flex min-h-screen bg-black">
               <Sidebar />
   
               <main className="flex-1 p-6 bg-white">
                   <div className="flex justify-between items-center mb-6">
                       <h1 className="text-2xl font-bold text-gray-800">Verified Experts</h1>
                       <button
                           onClick={() => setShowCreateModal(true)}
                           className="flex items-center px-4 py-2 bg-[#E53935] text-white hover:bg-black"
                       >
                           <FiPlus className="mr-2" /> Create Expert
                       </button>
                   </div>
                   
                   <div className="mb-6">
                       <input
                           type="text"
                           placeholder="Search experts..."
                           className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-[#E53935]"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                       />
                   </div>
   
                   {loading ? (
                       <p>Loading experts...</p>
                   ) : error ? (
                       <p className="text-red-500">{error}</p>
                   ) : (
                       <div className="overflow-x-auto">
                           <table className="min-w-full bg-white">
                               <thead className="bg-gray-100">
                                   <tr>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">_ID</th>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   {currentExperts.map(expert => (
                                       <tr key={expert._id} className="border-b border-gray-200 hover:bg-gray-50">
                                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expert._id}</td>
                                           <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-900">{expert.name}</td>
                                           <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">{expert.email || 'N/A'}</td>
                                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expert.phone || 'N/A'}</td>
                                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                               <div className="flex space-x-2">
                                                   <Link
                                                       href={`/admin/experts/reviewexpert/${expert._id}`}
                                                       className="text-blue-600 hover:text-blue-900"
                                                   >  
                                                    Review
                                                   </Link>
                                                   <button onClick={() => openEditModal(expert)} className="text-yellow-600 hover:text-yellow-900">
                                                       <FiEdit2 />
                                                   </button>
                                                   <button onClick={() => handleDelete(expert._id)} className="text-red-600 hover:text-red-900">
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
   
                   {/* Pagination */}
                   <div className="mt-4 flex justify-between items-center">
                       <button
                           onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                           disabled={currentPage === 1}
                           className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
                       >
                           Previous
                       </button>
                       <span>Page {currentPage} of {totalPages}</span>
                       <button
                           onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                           disabled={currentPage === totalPages}
                           className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
                       >
                           Next
                       </button>
                   </div>
   
                   {/* Modals */}
                   {showCreateModal && (
                       <CreateExpertModal
                           onClose={() => setShowCreateModal(false)}
                           onExpertCreated={fetchExperts}
                       />
                   )}
   
                   {showEditModal && (
                       <EditExpertModal
                           expert={selectedExpert}
                           onClose={() => setShowEditModal(false)}
                           onExpertUpdated={fetchExperts}
                       />
                   )}
   
                   {showViewModal && (
                       <ViewExpertModal
                           expert={selectedExpert}
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

export default ExpertsList