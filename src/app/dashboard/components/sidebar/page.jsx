'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import Logo from '../../../../assets/images/dclogo.png'

const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [expandExperts, setExpandExperts] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Experts', isParent: true },
    { name: 'WithDrawals', path: '/admin/withdrawals' },
    { name: 'Payouts', path: '/admin/payouts' },
    { name: 'Wallets', path: '/admin/wallets' },
    // { name: 'Recharges', path: '/admin/recharges' },
    { name: 'Reviews', path: '/admin/reviews' },
    { name: 'Logout' }
  ]
  
  const expertSubItems = [
    { name: 'All Experts', path: '/admin/experts' },
    { name: 'Verified Experts', path: '/admin/experts/VerifiedExperts' },
    { name: 'Unverified Experts', path: '/admin/experts/UnverifiedExperts' },
    { name: 'Expertise', path: '/admin/experts/expertise' },
    { name: 'Qualification', path: '/admin/experts/qualification' },
    { name: 'Designation', path: '/admin/experts/designation' },
    // { name: 'Subjects', path: '/admin/experts/subjects' },
  ]

  return (
    <div className={`flex flex-col h-full bg-black text-white ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 border-r border-gray-800`}>
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <Image 
            src={Logo} 
            alt="Admin Panel Logo" 
            height={40} 
            width={160} 
            className="object-contain"
          />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            if (item.name === 'Logout') {
              return (
                <li key="logout">
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors text-gray-300 hover:bg-gray-800 hover:text-white`}
                  >
                    <span className={`${collapsed ? 'mx-auto' : 'mr-3'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                      </svg>
                    </span>
                    {!collapsed && <span>Logout</span>}
                  </button>
                </li>
              )
            }

            if (item.isParent && item.name === 'Experts') {
              return (
                <li key="Experts">
                  <button
                    onClick={() => setExpandExperts(!expandExperts)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      pathname.includes('/admin/experts')
                        ? 'bg-red-500/20 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className={`${collapsed ? 'mx-auto' : 'mr-3'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    {!collapsed && <span>Experts</span>}
                    {!collapsed && (
                      <svg
                        className={`ml-auto h-4 w-4 transform transition-transform duration-200 ${expandExperts ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>

                  {expandExperts && !collapsed && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {expertSubItems.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            href={sub.path}
                            className={`block px-4 py-2 text-sm rounded transition-colors ${
                              pathname === sub.path
                                ? 'bg-red-500/20 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            }

            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    pathname.startsWith(item.path)
                      ? 'bg-red-500/20 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className={`${collapsed ? 'mx-auto' : 'mr-3'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-400">
        {!collapsed ? (
          <>
            <p>v1.0.0</p>
            <p className="mt-1">© {new Date().getFullYear()}</p>
          </>
        ) : (
          <p>v2</p>
        )}
      </div>
    </div>
  )
}

export default Sidebar