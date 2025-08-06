'use client'

import { useEffect, useState } from 'react'
import Sidebar from "@/app/dashboard/components/sidebar/page"
import axios from 'axios'
import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi'

const ReviewList = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewsPerPage] = useState(6)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get('https://api.doubtsclear.com/api/reviews/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Access the reviews array from the response data
      setReviews(res.data.reviews || [])
    } catch (err) {
      setError('Failed to fetch reviews')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reviewId) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`https://api.doubtsclear.com/api/review/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        fetchReviews()
      } catch (err) {
        setError('Failed to delete review')
      }
    }
  }

  // Filter reviews based on search term
  const filteredReviews = reviews.filter(review => {
    if (!review) return false
    const searchLower = searchTerm.toLowerCase()
    return (
      (review._id && review._id.toLowerCase().includes(searchLower)) ||
      (review.comment && review.comment.toLowerCase().includes(searchLower)) ||
      (review.expertId?.name && review.expertId.name.toLowerCase().includes(searchLower)) ||
      (review.userId?.name && review.userId.name.toLowerCase().includes(searchLower)) ||
      (review.rating && review.rating.toString().includes(searchLower))
    )
  })

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview)
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Review Management</h1>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full px-4 py-2 text-black border-b-2 border-gray-300 focus:border-[#E53935]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expert</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.length > 0 ? (
                  currentReviews.map(review => (
                    <tr key={review._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={review.expertId?.image || '/default-expert.jpg'} 
                            alt={review.expertId?.name}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{review.expertId?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{review.expertId?._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={review.userId?.image || '/default-user.jpg'} 
                            alt={review.userId?.name}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{review.userId?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{review.userId?._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        {review.comment || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {review.rating ? (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            review.rating >= 4 ? 'bg-green-100 text-green-800' : 
                            review.rating >= 2 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {review.rating}/5
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(review.createdAt || review.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleDelete(review._id)} 
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete review"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronLeft className="mr-1" /> Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next <FiChevronRight className="ml-1" />
          </button>
        </div>
      </main>
    </div>
  )
}

export default ReviewList