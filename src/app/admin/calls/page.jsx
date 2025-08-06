'use client'

import { useEffect, useState } from 'react'
import Sidebar from "@/app/dashboard/components/sidebar/page"
import axios from 'axios'
import { FiEdit2, FiTrash2, FiEye, FiClock, FiPhoneOff, FiPhoneCall } from 'react-icons/fi'
import Link from 'next/link'
import moment from 'moment'

const CallsList = () => {
    const [calls, setCalls] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [callsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all') // 'all', 'completed', 'missed'

    useEffect(() => {
        fetchCalls()
    }, [])

    const fetchCalls = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get('https://api.doubtsclear.com/api/admin/calls', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCalls(res.data.calls || [])
        } catch (err) {
            setError('Failed to fetch calls')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const filteredCalls = calls.filter(call => {
        // Filter by search term (expert name or user name)
        const matchesSearch = 
            call.caller.id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            call.receiver.id?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        
        // Filter by status
        const matchesStatus = 
            filterStatus === 'all' || 
            (filterStatus === 'completed' && call.status === 'ended') ||
            (filterStatus === 'missed' && call.status === 'missed')
        
        return matchesSearch && matchesStatus
    })

    // Pagination logic
    const indexOfLastCall = currentPage * callsPerPage
    const indexOfFirstCall = indexOfLastCall - callsPerPage
    const currentCalls = filteredCalls.slice(indexOfFirstCall, indexOfLastCall)
    const totalPages = Math.ceil(filteredCalls.length / callsPerPage)

    const formatDuration = (seconds) => {
        if (!seconds) return '0s'
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins > 0 ? mins + 'm ' : ''}${secs}s`
    }

    const getCallTypeIcon = (callType) => {
        switch(callType) {
            case 'audio': return <FiPhoneCall className="text-blue-500" />
            case 'video': return <FiVideo className="text-purple-500" />
            default: return <FiPhoneCall />
        }
    }

    const getStatusBadge = (status) => {
        switch(status) {
            case 'ended':
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
            case 'missed':
                return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Missed</span>
            case 'ongoing':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Ongoing</span>
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>
        }
    }

    return (
        <div className="flex min-h-screen bg-black">
            <Sidebar />

            <main className="flex-1 p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Call History</h1>
                    <div className="flex space-x-4">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded"
                        >
                            <option value="all">All Calls</option>
                            <option value="completed">Completed</option>
                            <option value="missed">Missed</option>
                        </select>
                    </div>
                </div>
                
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-[#E53935]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p>Loading calls...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Caller</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receiver</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCalls.map(call => (
                                    <tr key={call._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {call._id.substring(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {call.caller.id?.name || 'Unknown'} ({call.caller.type})
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {call.receiver.id?.name || 'Unknown'} ({call.receiver.type})
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {getCallTypeIcon(call.callType)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {moment(call.startedAt).format('MMM D, h:mm A')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDuration(call.duration)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {getStatusBadge(call.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => window.open(`/admin/calls/${call._id}`, '_blank')}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FiEye />
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
            </main>
        </div>
    )
}

export default CallsList