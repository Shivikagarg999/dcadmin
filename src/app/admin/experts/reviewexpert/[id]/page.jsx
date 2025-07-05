'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Sidebar from "@/app/dashboard/components/sidebar/page"
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiExternalLink,
} from 'react-icons/fi'

const UPLOADS_BASE_URL = 'https://doubt.deltinroyale.club'

const ReviewExpertPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [expert, setExpert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [callStats, setCallStats] = useState(null)
  const [callLoading, setCallLoading] = useState(true)
  const [callError, setCallError] = useState('')

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`http://localhost:5000/api/admin/getExpertById/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setExpert(res.data.expert)
      } catch (err) {
        setError("Failed to fetch expert details")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchExpert()
  }, [id])

  useEffect(() => {
    const fetchCallStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/calls/by-expert/${id}`)
        setCallStats(res.data)
      } catch (err) {
        setCallError('Failed to fetch call stats')
      } finally {
        setCallLoading(false)
      }
    }

    if (id) fetchCallStats()
  }, [id])

  const getDocumentUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${UPLOADS_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  }

  const handleVerify = async (status) => {
    try {
      const token = localStorage.getItem("token")
      await axios.patch(`http://localhost:5000/api/admin/toggleVerification/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert(`Expert marked as ${status}`)
    } catch (err) {
      alert("Operation failed")
    }
  }

  if (loading) return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="animate-pulse bg-white rounded-lg shadow p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )

  if (error) return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow p-6 text-red-600">
          {error}
        </div>
      </main>
    </div>
  )

  if (!expert) return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          No expert found
        </div>
      </main>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Expert Review</h1>
            </div>
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                expert.verified === 'verified' ? 'bg-green-100 text-green-800' :
                expert.verified === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {expert.verified?.toUpperCase() || 'PENDING'}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {expert.image && (
                    <img
                      src={getDocumentUrl(expert.image)}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border border-gray-200"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{expert.name}</h2>
                    <p className="text-sm text-gray-600">{expert.email || 'No email provided'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Phone" value={expert.phone} />
                  <DetailItem label="Gender" value={expert.gender} />
                  <DetailItem label="Date of Birth" value={expert.dob ? new Date(expert.dob).toLocaleDateString() : '-'} />
                  <DetailItem label="Experience" value={`${expert.experience} years`} />
                  <DetailItem label="Per Minute Charge" value={`₹${expert.perMinuteCharge?.amount || '0'}`} />
                  <DetailItem label="Google ID" value={expert.googleId || 'Not linked'} />
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Verification Documents</h2>
                <div className="grid grid-cols-2 gap-4">
                  <DocumentItem label="Aadhar Card" value={getDocumentUrl(expert.aadharCard)} />
                  <DocumentItem label="PAN Card" value={getDocumentUrl(expert.pan)} />
                  <DetailItem label="Qualification" value={expert.qualification?.name} />
                  <DetailItem label="Designation" value={expert.designation?.name} />
                </div>

                <DetailItem label="Expertise" value={expert.expertise?.map(e => e.name).join(', ')} />

                {expert.verificationVideo && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Verification Video</p>
                    <div className="flex flex-col space-y-2">
                      <video
                        src={getDocumentUrl(expert.verificationVideo)}
                        controls
                        className="w-full max-w-md rounded border border-gray-200"
                      />
                      <a
                        href={getDocumentUrl(expert.verificationVideo)}
                        download
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <FiDownload className="mr-1" /> Download Video
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Call Stats */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Call Stats</h2>

              {callLoading ? (
                <p>Loading call stats...</p>
              ) : callError ? (
                <p className="text-red-600">{callError}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-4 bg-gray-50 rounded shadow">
                    <p className="text-sm text-gray-500">Total Calls</p>
                    <p className="text-xl font-bold">{callStats.totalCalls}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded shadow">
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-xl font-bold">{callStats.completedCallsCount}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded shadow">
                    <p className="text-sm text-gray-500">Missed</p>
                    <p className="text-xl font-bold">{callStats.missedCallsCount}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded shadow">
                    <p className="text-sm text-gray-500">Total Duration (mins)</p>
                    <p className="text-xl font-bold">{Math.round(callStats.totalDuration / 60)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Address" value={expert.address} />
              <DetailItem label="Wallet Balance" value={`₹${expert.walletBalance || '0'}`} />
              <DetailItem label="Created At" value={new Date(expert.createdAt).toLocaleString()} />
              <DetailItem label="Updated At" value={new Date(expert.updatedAt).toLocaleString()} />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => handleVerify('rejected')}
                className="flex items-center px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
              >
                <FiXCircle className="mr-2" /> Reject
              </button>
              <button
                onClick={() => handleVerify('verified')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <FiCheckCircle className="mr-2" /> Approve
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-sm text-gray-900">{value || '-'}</p>
  </div>
)

const DocumentItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    {value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-center text-sm text-blue-600 hover:underline"
      >
        View Document <FiExternalLink className="ml-1" size={14} />
      </a>
    ) : (
      <p className="mt-1 text-sm text-gray-500">Not provided</p>
    )}
  </div>
)

export default ReviewExpertPage