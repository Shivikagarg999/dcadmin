'use client';

import Sidebar from './components/sidebar/page'; 
import Header from './components/header/page';
import { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [orderStats, setOrderStats] = useState({
    ongoing: 0,
    delivered: 0,
    cancelled: 0,
    total: 0,
  });

  // Fetch stats from backend
  useEffect(() => {
    // Replace with actual API call
    async function fetchStats() {
      // Simulated data
      const res = {
        ongoing: 2,
        delivered: 5,
        cancelled: 1,
        total: 8,
      };
      setOrderStats(res);
    }

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 pt-3">
        <Header/>
        {/* <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome Admin👋</h1> */}
{/* 
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card title="Ongoing Orders" count={orderStats.ongoing} color="bg-blue-500" />
          <Card title="Delivered" count={orderStats.delivered} color="bg-green-500" />
          <Card title="Cancelled" count={orderStats.cancelled} color="bg-red-500" />
          <Card title="Total Orders" count={orderStats.total} color="bg-gray-700" />
        </div> */}
      </main>
    </div>
  );
};

export default DashboardPage;

// Card Component
const Card = ({ title, count, color }) => (
  <div className={`p-6 rounded-xl text-white shadow-md ${color}`}>
    <p className="text-sm uppercase">{title}</p>
    <h2 className="text-3xl font-bold mt-2">{count}</h2>
  </div>
);