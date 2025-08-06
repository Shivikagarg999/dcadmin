'use client'

import { useEffect, useState } from 'react'
import Sidebar from "@/app/dashboard/components/sidebar/page"
import axios from 'axios'
import { 
  FiUsers, 
  FiBarChart2, 
  FiDollarSign, 
  FiTrendingUp,
  FiPieChart
} from 'react-icons/fi'
import { Bar, Pie, Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    experts: 0,
    reviews: 0,
    wallets: 0,
    loading: true,
    error: null
  })
  const [userGrowthData, setUserGrowthData] = useState([])
  const [expertGrowthData, setExpertGrowthData] = useState([])
  const [reviewStats, setReviewStats] = useState([])
  const [walletStats, setWalletStats] = useState([])

  useEffect(() => {
    fetchAllStats()
  }, [])

  const fetchAllStats = async () => {
    try {
      const token = localStorage.getItem("token")
      
      // Fetch all data in parallel
      const [
        usersRes, 
        expertsRes, 
        reviewsRes,
        walletsRes
      ] = await Promise.all([
        axios.get('https://api.doubtsclear.com/api/admin/getAllUsers', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://api.doubtsclear.com/api/admin/getAllExperts', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://api.doubtsclear.com/api/reviews/all', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://api.doubtsclear.com/api/wallet', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      // Process data
      const users = usersRes.data.users || []
      const experts = expertsRes.data.experts || []
      const reviews = reviewsRes.data.reviews || []
      const wallets = walletsRes.data.wallets || []

      setStats({
        users: users.length,
        experts: experts.length,
        reviews: reviews.length,
        wallets: wallets.length,
        loading: false,
        error: null
      })

      // Prepare growth data (last 6 months)
      prepareGrowthData(users, experts)
      prepareReviewStats(reviews)
      prepareWalletStats(wallets)

    } catch (err) {
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch dashboard data'
      }))
      console.error('Dashboard error:', err)
    }
  }

  const prepareGrowthData = (users, experts) => {
    // Mock growth data - replace with actual date-based grouping from your data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    
    setUserGrowthData(months.map((month, i) => ({
      month,
      count: Math.floor(users.length * (i+1)/6) // Mock growth
    })))

    setExpertGrowthData(months.map((month, i) => ({
      month,
      count: Math.floor(experts.length * (i+1)/6) // Mock growth
    })))
  }

  const prepareReviewStats = (reviews) => {
    const ratingCounts = [0, 0, 0, 0, 0] // 1-5 stars
    
    reviews.forEach(review => {
      if (review.rating && review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++
      }
    })

    setReviewStats(ratingCounts)
  }

  const prepareWalletStats = (wallets) => {
    // Group by offer percentage ranges
    const offerRanges = [
      { min: 0, max: 10, count: 0 },
      { min: 11, max: 20, count: 0 },
      { min: 21, max: 30, count: 0 },
      { min: 31, max: 100, count: 0 }
    ]

    wallets.forEach(wallet => {
      const offer = parseInt(wallet.offer) || 0
      for (const range of offerRanges) {
        if (offer >= range.min && offer <= range.max) {
          range.count++
          break
        }
      }
    })

    setWalletStats(offerRanges)
  }

  // Chart data configurations
  const userGrowthChart = {
    labels: userGrowthData.map(d => d.month),
    datasets: [{
      label: 'User Growth',
      data: userGrowthData.map(d => d.count),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  }

  const expertGrowthChart = {
    labels: expertGrowthData.map(d => d.month),
    datasets: [{
      label: 'Expert Growth',
      data: expertGrowthData.map(d => d.count),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  }

  const reviewDistributionChart = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      data: reviewStats,
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(255, 205, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(54, 162, 235, 0.7)'
      ],
      borderWidth: 1
    }]
  }

  const walletOfferChart = {
    labels: walletStats.map(r => `${r.min}-${r.max}%`),
    datasets: [{
      data: walletStats.map(r => r.count),
      backgroundColor: [
        'rgba(153, 102, 255, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 159, 64, 0.7)'
      ],
      borderWidth: 1
    }]
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

        {stats.loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E53935]"></div>
          </div>
        ) : stats.error ? (
          <p className="text-red-500">{stats.error}</p>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FiUsers size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.users}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <FiBarChart2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Experts</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.experts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FiTrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.reviews}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                    <FiDollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Wallet Entries</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.wallets}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">User Growth</h2>
                <div className="h-64">
                  <Line 
                    data={userGrowthChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top'
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Expert Growth</h2>
                <div className="h-64">
                  <Bar 
                    data={expertGrowthChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Review Ratings Distribution</h2>
                <div className="h-64">
                  <Pie 
                    data={reviewDistributionChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Wallet Offer Ranges</h2>
                <div className="h-64">
                  <Pie 
                    data={walletOfferChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard